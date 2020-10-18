"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const query = apollo_server_express_1.gql `
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
exports.default = query;
//# sourceMappingURL=VERIFY_ACCESS_TOKEN.js.map