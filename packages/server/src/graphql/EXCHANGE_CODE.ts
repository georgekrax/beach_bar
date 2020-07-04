import { gql } from "apollo-server-express";

const query = gql`
  mutation exchangeCode($clientId: String!, $clientSecret: String!, $code: String!) {
    exchangeCode(clientId: $clientId, clientSecret: $clientSecret, code: $code) {
      ... on ExchangeCode {
        oauthClient {
          clientId
          clientSecret
        }
        tokens {
          name
          token
          type
          scope
        }
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
