import { gql } from "@apollo/client"

export const UPLOAD_INVOICE = gql`
mutation UploadInvoice($data:uploadInvoicesInput!) {
  uploadInvoice(data:$data)  {
    debt
    process
    processDate
    processNumber
    vergiNumarasi
  }
}
`

export const SEND_INVOICE_WİTH_EXCEL = gql`
mutation SendInvoice($data: sendInvoiceInput!) {
  sendInvoice(data: $data) {
    status
  }
}
`
