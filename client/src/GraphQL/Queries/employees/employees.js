import { gql } from "@apollo/client"

export const GET_COMPANY_EMPLOYEES = gql`
 query CompanyById($id: ID!) {
  companyById(_id: $id) {
    employees {
      company {
        vergi {
          vergiNumarasi
        }
      }
      processTime
      person {
        name
        surname
        identityId
      }
    }
  }
}
`
export const GET_EMPLOYEE_FILE = gql`
query Query($type: String!, $fileName: String!) {
  getEmployeeFile(type: $type, fileName: $fileName)
}
`