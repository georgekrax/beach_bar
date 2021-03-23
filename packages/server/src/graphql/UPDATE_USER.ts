import { gql } from "apollo-server-express";

const query = gql`
  mutation updateUser(
    $email: Email
    $firstName: String
    $lastName: String
    $pictureUrl: URL
    $countryId: Int
    $cityId: Int
    $birthday: Date
  ) {
    updateUser(
      email: $email
      firstName: $firstName
      lastName: $lastName
      pictureUrl: $pictureUrl
      countryId: $countryId
      cityId: $cityId
      birthday: $birthday
    ) {
      ... on UserUpdate {
        user {
          id
        }
        updated
      }

      ... on Error {
        error {
          code
          message
        }
      }
    }
  }
`;

export default query;
