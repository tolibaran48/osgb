import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ApolloProvider } from "@apollo/client";
import client from './client'
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/authContext';
import { CompaniesProvider } from './context/companiesContext';
import { InsurancesProvider } from './context/insurancesContext';
import { ConcubinesProvider } from './context/concubinesContext';
import { UsersProvider } from './context/usersContext';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <AuthProvider>
    <CompaniesProvider>
      <ConcubinesProvider>
        <InsurancesProvider>
          <UsersProvider>
            <ApolloProvider client={client}>
              <Router>
                <App />
              </Router>
            </ApolloProvider>
          </UsersProvider>
        </InsurancesProvider>
      </ConcubinesProvider>
    </CompaniesProvider>
  </AuthProvider>

);
 // <React.StrictMode>
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

