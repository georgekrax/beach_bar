import { gql } from "apollo-server-express";

const query = gql`
  mutation signUpUser($clientId: String!, $clientSecret: String!, $email: Email!, $password: String!) {
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
      error {
        code
        message
      }
    }
  }
`;

export default query;
