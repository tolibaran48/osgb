import { gql } from "@apollo/client"

export const GET_Insurances = gql`
query Insurances {
  insurances {
    company
    companyName
    _id
    insuranceNumber
    insuranceControlNumber
    workingStatus
    descriptiveName
    isgKatipName
    tehlikeSinifi
    employeeCount
    adress {
      detail
      il {
        id
        name
      }
      ilce {
        id
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
          certificateNumber
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
          certificateNumber
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
          certificateNumber
        }
      }
    }
  }
}
`