import { gql } from "@apollo/client"

export const GET_COMPANIES_CONCUBINE = gql`
query CompanyConcubines {
  companyConcubines {
    _id
    cariler{
      _id
      process
      debt
      receive
      processDate
      collectType
    }
    companyName {
      name
      isgKatipName
    }
    sonFatura{
      processDate
      debt
    }
    sonOdeme{
      processDate
      receive
    }
    vergiDairesi
    vergiNumarasi
    toplam
    workingStatus
  }
}
`

export const GET_CONCUBINE = gql`
query Concubine($processNumber: String!){
  concubine(processNumber: $processNumber) {
    processNumber
    processDate
    process
    debt
    company {
      vergi {
        vergiNumarasi
      }
      name
    }
  }
}
`
export const GET_CONCUBINES = gql`
query Concubines {
  concubines {
    processNumber
    processDate
    process
    debt
    company {
      vergi {
        vergiNumarasi
      }
      name
    }
  }
}
`
