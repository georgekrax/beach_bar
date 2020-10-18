"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const query = apollo_server_express_1.gql `
  mutation signUpUser($clientId: String!, $clientSecret: String!, $email: EmailAddress!, $password: String!) {
    signUpUser(clientId: $clientId, clientSecret: $clientSecret, userCredentials: { email: $email, password: $password }) {
      user {
        id
        email
        country {
          id
        }
        city {
          id
        }
        birthday
        age
      }
      added
      error {
        code
        message
      }
    }
  }
`;
exports.default = query;
//# sourceMappingURL=SIGN_UP_USER.js.map