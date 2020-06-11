import { gql } from "apollo-server-express";

const query = gql`
  mutation deleteUserAccount($clientId: String!, $clientSecret: String!) {
    changeUserPassword(clientId: $clientId, clientSecret: $clientSecret) {
      ... on Delete {
        deleted
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
