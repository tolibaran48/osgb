import { gql } from "@apollo/client"

export const UPLOAD_WHATSAPP_EMPLOYEE_DOCUMENT = gql`
mutation Mutation($data: uploadWhatsAppDocumentInput!) {
  uploadWhatsAppDocument(data: $data)

}
`