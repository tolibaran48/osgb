import { gql } from "@apollo/client"


export const CREATE_OTP = gql`
  mutation Mutation($data: createOtp!) {
    createOtp(data: $data) {
        tryCount
        status
        responseStatus
        error
        otpId 
    }
  }
`

export const VALID_OTP = gql`
  mutation Mutation($data: validOtp!) {
    validOtp(data: $data) {
        tryCount
        status
        responseStatus
        error
        otpId
    }
  }
`