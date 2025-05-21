import { gql } from "@apollo/client"

export const GET_COMPANIES = gql`
query Companies {
    companies {
      _id
      name
      workingStatus
      vergi {
        vergiDairesi
        vergiNumarasi
      }
      adress
    }
}
`
export const GET_COMPANY_BY_ID = gql`
 query CompanyById($id: ID!) {
  companyById(_id: $id) {
    contacts {
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
        }
      }
    }
  }
}
`
