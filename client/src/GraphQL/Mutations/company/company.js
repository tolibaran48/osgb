import { gql } from "@apollo/client"



export const ADD_COMPANY = gql`
mutation CreateCompany($data:createCompanyInput!) {
    createCompany(data:$data) 
        {
        _id
        name
        adress
        workingStatus
        vergi {
            vergiDairesi
            vergiNumarasi
        }
    }
}
`

export const UPDATE_COMPANY = gql`
mutation UpdateCompany($data:updateCompanyInput!) {
    updateCompany(data:$data) 
        {
        _id
        name
        adress
        workingStatus
        vergi {
            vergiDairesi
            vergiNumarasi
        }
    }
}
`