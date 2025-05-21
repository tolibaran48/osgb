import { gql } from "@apollo/client"

export const GET_USERS = gql`
query Users {
  users {
    _id
    name
    surname
    email
    phoneNumber
    auth {
      type
      status
      auths {
        companyAuths {
          company {
            _id
            name
          }
          roles
        }
        insuranceAuths {
          insurance {
            descriptiveName
            insuranceNumber
            _id
          }
          roles
        }
      }
    }
  }
}
`

export const GET_USER = gql`
 query User($phoneNumber: String!) {
  user(phoneNumber: $phoneNumber) {
      _id
      name
      surname
      employment
      phoneNumber
      email
      auth {
        type
        status
        auths {
          companyAuths {
            company {
              _id
              name
            }
            roles
          }
          insuranceAuths {
            insurance {
              descriptiveName
              insuranceNumber
              _id
            }
            roles
          }
        }
      }  
  }
}
`

export const GET_ACTIVE_USER = gql`
query  ActiveUser {
    activeUser {
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
              company {
                _id
                name
              }
              roles
            }
            insuranceAuths {
              insurance {
                descriptiveName
                insuranceNumber
                _id
              }
              roles
            }
          }
        }      
      }
    }
  }   
`