"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const query = apollo_server_express_1.gql `
  mutation updateUser(
    $email: EmailAddress
    $firstName: String
    $lastName: String
    $pictureUrl: URL
    $countryId: Int
    $cityId: Int
    $birthday: Date
  ) {
    updateUser(
      email: $email
      firstName: $firstName
      lastName: $lastName
      pictureUrl: $pictureUrl
      countryId: $countryId
      cityId: $cityId
      birthday: $birthday
    ) {
      ... on UserUpdate {
        user {
          id
        }
        updated
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
