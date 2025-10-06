import { gql } from "@apollo/client"

export const GET_LOCATIONS = gql`
query InsuranceLocations {
  insuranceLocations {
    location
    insurance {
      descriptiveName
    }
  }
}
`