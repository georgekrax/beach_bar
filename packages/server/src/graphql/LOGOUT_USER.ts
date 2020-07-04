import { gql } from "apollo-server-express";

const query = gql`
  mutation logoutUser($clientId: String!, $clientSecret: String!) {
    logoutUser(clientId: $clientId, clientSecret: $clientSecret) {
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
