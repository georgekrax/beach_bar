import { gql } from "apollo-server-express";

const query = gql`
  query tokenInfo($token: String!) {
    tokenInfo(token: $token) {
      ... on TokenInfo {
        aud
        iss
        sub
        firstName
        lastName
        pictureUrl
        locale
        email
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
