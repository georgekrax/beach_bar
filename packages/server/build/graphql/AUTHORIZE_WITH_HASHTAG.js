"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const query = apollo_server_express_1.gql `
  mutation authorizeWithHashtag(
    $clientId: String!
    $scope: [String!]!
    $redirectUri: URL!
    $originUri: URL!
    $state: String
    $email: Email!
    $password: String
    $osId: ID
    $browserId: ID
    $countryId: ID
    $cityId: ID
    $ipAddr: IPv4
  ) {
    authorizeWithHashtag(
      clientId: $clientId
      scope: $scope
      redirectUri: $redirectUri
      originUri: $originUri
      state: $state
      userCredentials: { email: $email, password: $password }
      loginDetails: { osId: $osId, browserId: $browserId, countryId: $countryId, cityId: $cityId, ipAddr: $ipAddr }
      getCode: true
      prompt: "none"
      accessType: "offline"
    ) {
      ... on Authorize {
        state
        code
        prompt {
          none
        }
        scope
        user {
          id
          email
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
//# sourceMappingURL=AUTHORIZE_WITH_HASHTAG.js.map