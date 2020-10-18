import { gql } from "apollo-server-express";

const query = gql`
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

export default query;
