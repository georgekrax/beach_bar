import { extendType, arg } from "@nexus/schema";
import { execute, makePromise } from "apollo-link";

import { gql } from "apollo-server-express";
import { link } from "../../config/apolloLink";
import { MyContext } from "../../common/myContext";
import { UserSignUpType, UserSignUpCredentialsInput } from "./type";

// --------------------------------------------------- //
// Sign up mutation
// --------------------------------------------------- //

export const UserSignUpMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("signUp", {
      type: UserSignUpType,
      nullable: false,
      args: {
        userCredentials: arg({ type: UserSignUpCredentialsInput, required: true, description: "Credential for signing up a user" }),
      },
      resolve: async (_, { userCredentials }, { req }: MyContext): Promise<any> => {
        const { email, username, password } = userCredentials;
        console.log(email, username, password);
        console.log(req.hostname);

        const operation = {
          query: gql`
            mutation {
              login(
                userCredentials: { email: "georgekraxt@gmail.com", password: "george2020" }
                loginDetails: { os: null, browser: "Chrome", country: null, city: null, ipAddr: null }
              ) {
                id
                email
                logined
              }
            }
          `,
        };

        makePromise(execute(link, operation))
          .then(data => {
            console.log(JSON.stringify(data, null, 2));
          })
          .catch(error => console.log(`received error ${error}`));

        return {
          id: BigInt(1),
          email: "georgekrax@gmail.com",
          username: "georgekrax",
          signedUp: true,
          accountId: BigInt(1),
        };
      },
    });
  },
});
