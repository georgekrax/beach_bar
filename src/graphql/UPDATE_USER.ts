import { gql } from "apollo-server-express";

const query = gql`
  mutation updateUser($email: EmailAddress, $firstName: String, $lastName: String, $pictureUrl: URL, $countryId: Int) {
    updateUser(email: $email, firstName: $firstName, lastName: $lastName, pictureUrl: $pictureUrl, countryId: $countryId) {
      ... on UserUpdate {
        user {
          id
          email
          firstName
          lastName
          pictureUrl
          country {
            id
          }
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
