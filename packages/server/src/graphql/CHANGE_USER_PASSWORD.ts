import { gql } from "apollo-server-express";

const query = gql`
  mutation changeUserPassword($email: Email!, $token: String!, $newPassword: String!) {
    changeUserPassword(email: $email, token: $token, newPassword: $newPassword) {
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
