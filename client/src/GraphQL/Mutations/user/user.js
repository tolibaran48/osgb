import { gql } from "@apollo/client"

export const SIGN_IN = gql`
    mutation SignIn($email:String! $password:String!) {
        signIn(data: {
            email:$email
            password:$password
        }) {
            token
            user {
                _id
                name
                surname
                auth {
                  type
                  status
                  auths {
                    companyAuths {
                      company{
                        name
                      }
                      roles
                    }
                    insuranceAuths {
                      insurance{
                        descriptiveName
                      }
                      roles
                    }
                  }
                }      
              }
        }
    }
`

export const CREATE_COMPANY_USER = gql`
  mutation Mutation($data: createUserInput!) {
    createUser(data: $data) {
      name
      surname
      phoneNumber
      employment
      email
      auth {
        type
        status
        auths {
          companyAuths {
            company{
              name
            }
            roles
          }
          insuranceAuths {
            insurance{
              descriptiveName
            }
            roles
          }
        }
      } 
    }
  }
`