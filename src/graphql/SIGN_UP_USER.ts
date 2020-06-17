import { gql } from "apollo-server-express";

const query = gql`
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

export default query;
