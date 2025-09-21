import { gql } from "@apollo/client"

export const GET_COMPANY_EMPLOYEES = gql`
query Company($vergiNumarasi: String!) {
  company(vergiNumarasi: $vergiNumarasi) {
    employees {
      company {
        vergi {
          vergiNumarasi
        }
      }
      processTime
      fileLink
      person {
        name
        surname
        identityId
      }
    }
  }
}
`
