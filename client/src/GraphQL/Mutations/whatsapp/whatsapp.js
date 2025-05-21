import { gql } from "@apollo/client"

export const CREATE_WABA_USER = gql`
mutation Mutation($data: createWabaUserInput!) {
  createWabaUser(data: $data) {
     status
  }
}
`
