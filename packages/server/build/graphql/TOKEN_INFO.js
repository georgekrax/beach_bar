"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const query = apollo_server_express_1.gql `
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
exports.default = query;
