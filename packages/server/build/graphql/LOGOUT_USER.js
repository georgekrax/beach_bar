"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const query = apollo_server_express_1.gql `
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
exports.default = query;
//# sourceMappingURL=LOGOUT_USER.js.map