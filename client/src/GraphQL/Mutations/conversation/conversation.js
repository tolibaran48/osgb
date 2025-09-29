import { gql } from "@apollo/client"

export const CREATE_CONVERSATION = gql`
mutation CreateConversation($data: createConversationInput) {
  createConversation(data: $data) {
    e_mail
    message
    name
    phone
    type
    otp
    {
    hash
    }
  }
}
`