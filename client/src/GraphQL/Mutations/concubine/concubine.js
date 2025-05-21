import { gql } from "@apollo/client"



export const ADD_COLLECT = gql`
mutation CreateCollect($data:createCollectInput!) {
    createCollect(data:$data) 
    {
        _id
        process
        processDate
        processNumber
        collectType
        debt
        receive
        chequeDue
        company{
            _id
        }
    }
}
`
