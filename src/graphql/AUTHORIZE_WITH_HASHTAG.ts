import { gql } from "apollo-server-express";

const query = gql`
  mutation authorizeWithHashtag(
    $clientId: String!
    $scope: [String!]!
    $redirectUri: URL!
    $originUri: URL!
    $state: String
    $email: EmailAddress!
    $password: String
    $os: String
    $browser: String
    $country: String
    $city: String
    $ipAddr: IPv4
  ) {
    authorizeWithHashtag(
      clientId: $clientId
      scope: $scope
      redirectUri: $redirectUri
      originUri: $originUri
      state: $state
      userCredentials: { email: $email, password: $password }
      loginDetails: { os: $os, browser: $browser, country: $country, city: $city, ipAddr: $ipAddr }
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
        authorized
        oauthClient {
          clientId
          clientSecret
        }
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
