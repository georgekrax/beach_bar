"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const query = apollo_server_express_1.gql `
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
exports.default = query;
