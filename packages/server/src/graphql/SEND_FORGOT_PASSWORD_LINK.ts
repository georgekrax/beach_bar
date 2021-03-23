import { gql } from "apollo-server-express";

const query = gql`
  mutation sendForgotPasswordLink($email: Email!) {
    sendForgotPasswordLink(email: $email) {
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
