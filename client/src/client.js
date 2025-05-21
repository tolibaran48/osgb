import { ApolloClient, ApolloLink, InMemoryCache, from, concat, HttpLink } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { createUploadLink } from 'apollo-upload-client';
import { AuthContext } from './context/authContext';
import toastr from 'toastr';

const errorLink = onError(({ graphQLErrors }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach((error) => {
      if (error.extensions.status !== 401) {
        toastr.error(error.message, error.extensions.code, error.extensions.status)
      }
    });
  }
});

const afterwareLink = new ApolloLink((operation, forward) => {
  return forward(operation).map((response) => {
    const context = operation.getContext()
    const token = context.response.headers.get('authorization')
    if (token) {
      localStorage.setItem('token', token);
    }
    return response
  })
});

const authMiddleware = new ApolloLink((operation, forward) => {

  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: localStorage.getItem('token') || null,
    }
  }));
  return forward(operation);
});

const httpLink = new HttpLink({ uri: "/graphql" });
const uploadLink = createUploadLink({ uri: "/graphql" });

const link = from([errorLink, uploadLink]);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(authMiddleware, link, afterwareLink.concat(httpLink)),
  defaultOptions: {
    fetchPolicy: 'no-cache',
  }
});

export default client;
