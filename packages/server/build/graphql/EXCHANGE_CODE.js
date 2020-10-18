"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const query = apollo_server_express_1.gql `
  mutation exchangeCode($clientId: String!, $clientSecret: String!, $code: String!) {
    exchangeCode(clientId: $clientId, clientSecret: $clientSecret, code: $code) {
      ... on ExchangeCode {
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
exports.default = query;
//# sourceMappingURL=EXCHANGE_CODE.js.map