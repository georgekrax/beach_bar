"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const query = apollo_server_express_1.gql `
  mutation sendForgotPasswordLink($email: EmailAddress!) {
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
exports.default = query;
//# sourceMappingURL=SEND_FORGOT_PASSWORD_LINK.js.map