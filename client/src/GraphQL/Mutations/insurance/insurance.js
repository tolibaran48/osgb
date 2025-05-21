import { gql } from "@apollo/client"

export const ADD_INSURANCE = gql`
mutation CreateInsurance($data: createInsuranceInput!) {
    createInsurance(data: $data) {
        _id
        company
        companyObjName
        tehlikeSinifi
        employeeCount
        workingStatus
        descriptiveName
        insuranceNumber
        insuranceControlNumber
        isgKatipName   
        adress{
          detail
          il{
            id
            name
          }
          ilce{
            id
            name
          }
        }
        
        assignmentStatus{
          uzmanStatus{
            assignmentTotal
            approvalAssignments{
              approvalStatus
              assignmentId
              identityId
              nameSurname
              category
              assignmentTime
              startDate
              endDate
            }
          }
          hekimStatus{
            assignmentTotal
            approvalAssignments{
              approvalStatus
              assignmentId
              identityId
              nameSurname
              category
              assignmentTime
              startDate
              endDate
            }
          }
          dspStatus{
            assignmentTotal
            approvalAssignments{
              approvalStatus
              assignmentId
              identityId
              nameSurname
              category
              assignmentTime
              startDate
              endDate
            }
          }
        }
    }
  }
`
export const UPDATE_MANY_INSURANCES = gql`
mutation UpdateManyInsurance($data: updateManyInsuranceInput!) {
  updateManyInsurance(data: $data) {
    company
    companyName
    _id
    insuranceNumber
    workingStatus
    descriptiveName
    isgKatipName
    tehlikeSinifi
    employeeCount
    adress {
      detail
      il {
        name
      }
      ilce {
        name
      }
    }
    assignmentStatus {
      uzmanStatus {
        assignmentTotal
        approvalAssignments {
          approvalStatus
          assignmentId
          identityId
          nameSurname
          category
          assignmentTime
          startDate
          endDate
        }
      }
      hekimStatus {
        assignmentTotal
        approvalAssignments {
          approvalStatus
          assignmentId
          identityId
          nameSurname
          category
          assignmentTime
          startDate
          endDate
        }
      }
      dspStatus {
        assignmentTotal
        approvalAssignments {
          approvalStatus
          assignmentId
          identityId
          nameSurname
          category
          assignmentTime
          startDate
          endDate
        }
      }
    }
  }
}

`
export const UPDATE_INSURANCE = gql`
mutation UpdateInsurance($data: updateInsuranceInput!) {
    updateInsurance(data: $data) {
        _id
        company
        companyObjName      
        descriptiveName
        insuranceNumber
        insuranceControlNumber
        tehlikeSinifi
        employeeCount
        workingStatus
        isgKatipName   
        adress{
          detail
          il{
            id
            name
          }
          ilce{
            id
            name
          }
        }
        assignmentStatus{
          uzmanStatus{
            assignmentTotal
            approvalAssignments{
              approvalStatus
              assignmentId
              identityId
              nameSurname
              category
              assignmentTime
              startDate
              endDate
            }
          }
          hekimStatus{
            assignmentTotal
            approvalAssignments{
              approvalStatus
              assignmentId
              identityId
              nameSurname
              category
              assignmentTime
              startDate
              endDate
            }
          }
          dspStatus{
            assignmentTotal
            approvalAssignments{
              approvalStatus
              assignmentId
              identityId
              nameSurname
              category
              assignmentTime
              startDate
              endDate
            }
          }
        }
    }
  }
`
