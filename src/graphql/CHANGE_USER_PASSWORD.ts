import { gql } from "apollo-server-express";

const query = gql`
  mutation changeUserPassword($email: EmailAddress!, $key: String!, $newPassword: String!) {
    changeUserPassword(email: $email, key: $key, newPassword: $newPassword) {
      ... on Success {
        success
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
