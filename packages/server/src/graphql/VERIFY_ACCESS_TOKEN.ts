import { gql } from "apollo-server-express";

const query = gql`
  query verifyAccessToken($token: String!) {
    verifyAccessToken(token: $token) {
      ... on AccessToken {
        aud
        iss
        sub
        scope
        iat
        exp
        jti
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
