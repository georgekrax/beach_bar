import { Platform } from "./../../entity/Platform";
import { extendType, arg } from "@nexus/schema";
import { execute, makePromise } from "apollo-link";

import { User } from "../../entity/User";
import { gql } from "apollo-server-express";
import { Account } from "../../entity/Account";
import { link } from "../../config/apolloLink";
import { loginDetailStatus } from "../../entity/LoginDetails";
import { generateAccessToken } from "../../utils/auth/generateAuthTokens";
import { UserSignUpType, UserLoginType, UserSignUpCredentialsInput } from "./type";
import { createUserLoginDetails, findOs, findBrowser, findCountry, findCity } from "../../utils/auth/userCommon";

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
      resolve: async (
        _,
        { userCredentials },
      ): Promise<{
        id: bigint | null;
        email: string;
        signedUp: boolean;
        accountId: bigint | null;
        error: string | null;
      }> => {
        const { email, password } = userCredentials;

        const operation = {
          query: gql`
            mutation SIGN_UP_USER($email: String!, $password: String!) {
              signUp(userCredentials: { email: $email, password: $password }) {
                id
                email
                signedUp
                error
              }
            }
          `,
          variables: {
            email,
            password,
          },
        };

        let hashtagId, hashtagEmail, signedUp, error;

        await makePromise(execute(link, operation))
          .then(res => {
            hashtagId = res.data?.signUp.id;
            hashtagEmail = res.data?.signUp.email;
            signedUp = res.data?.signUp.signedUp;
            error = res.data?.signUp.error;
            console.log(hashtagEmail, hashtagId, signedUp, error);
          })
          .catch(err => {
            throw new Error(err);
          });

        if (error !== "User already exists" && error !== null) {
          throw new Error(error);
        }

        if (email !== hashtagEmail) {
          throw new Error("Something went wrong");
        }

        const newUser = User.create({
          email: hashtagEmail,
          hashtagId: BigInt(hashtagId),
        });

        const newUserAccount = await Account.create();

        try {
          await newUser.save();
          newUserAccount.user = newUser;
          await newUserAccount.save();

          console.log(newUserAccount);
          console.log(typeof newUser.id);
          console.log(newUser);
        } catch (err) {
          return {
            id: null,
            email: email,
            signedUp: false,
            accountId: null,
            error: "User already exists",
          };
        }

        return {
          id: BigInt(newUser.id),
          email: newUser.email,
          signedUp: true,
          accountId: BigInt(newUserAccount.id),
          error: null,
        };
      },
    });
  },
});

export const UserLoginMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("login", {
      type: UserLoginType,
      nullable: false,
      args: {
        userCredentials: arg({ type: UserSignUpCredentialsInput, required: true, description: "Credential for signing up a user" }),
      },
      resolve: async (
        _,
        { userCredentials },
        { req },
      ): Promise<{
        id: bigint | null;
        email: string;
        logined: boolean;
        accountId: bigint | null;
        accessToken: string | null;
        error: string | null;
      }> => {
        const { email, password } = userCredentials;

        const unformattedIpAddr: string = req.ip;
        const ipAddr: string = unformattedIpAddr.replace(/::ffff:/, "");

        let os: any = null,
          browser: any = null,
          country: any = null,
          city: any = null;

        try {
          os = await findOs("Windows");
          browser = await findBrowser("Chrome");
          country = await findCountry("Greece");
          city = await findCity("Thessaloniki");
        } catch (err) {
          throw new Error(err);
        }
        console.log(password);
        const operation = {
          query: gql`
            mutation LOGIN_USER($email: String!, $password: String!) {
              login(userCredentials: { email: $email, password: $password }) {
                id
                email
                logined
                error
              }
            }
          `,
          variables: {
            email,
            password,
          },
        };

        // login user
        const user = await User.findOne({ where: { email }, select: ["id", "email", "hashtagId", "tokenVersion", "isOwner"] });
        if (!user) {
          return {
            id: null,
            email: email,
            accountId: null,
            logined: false,
            accessToken: null,
            error: "User does not exist",
          };
        }

        // find user's account
        console.log(user);
        console.log(user.id);
        const userAccount = await Account.findOne({
          where: { user: user, userId: user.id },
          select: ["id", "userId", "user", "isActive"],
        });
        console.log(userAccount);
        if (!userAccount) {
          throw new Error("Something went wrong");
        }

        let hashtagEmail: string | null = null,
          logined: boolean | null = null,
          error: string | null = null;

        await makePromise(execute(link, operation))
          .then(res => {
            hashtagEmail = res.data?.login.email;
            logined = res.data?.login.logined;
            error = res.data?.login.error;
            console.log(hashtagEmail, logined, error);
          })
          .catch(err => {
            throw new Error(err);
          });

        // pass beach_bar platform to user login details
        const platform = await Platform.findOne({ where: { name: "beach_bar" }, select: ["id", "name", "urlHostname"] });
        if (!platform) {
          throw new Error("Something went wrong");
        }

        if (error !== null) {
          if (error === "Invalid password") {
            await createUserLoginDetails(loginDetailStatus.invalidPassword, platform, userAccount, os, browser, country, city, ipAddr);
          }
          return {
            id: null,
            email: email,
            accountId: null,
            logined: false,
            accessToken: null,
            error,
          };
        }

        if (email !== hashtagEmail) {
          throw new Error("Something went wrong");
        }

        // logined successfully
        // create user login details
        await createUserLoginDetails(loginDetailStatus.loggedIn, platform, userAccount, os, browser, country, city, ipAddr);

        // const refreshToken = await generateRefreshToken(user, req.hostname);
        // sendRefreshToken(res, refreshToken);

        // const payload: any = decode(refreshToken);

        // if (payload === null) {
        //   throw new Error("Something went wrong");
        // }

        // const tokenId = `${payload.iat}-${payload.jti}`;
        // await redis.set(tokenId, refreshToken, "ex", 15552000);

        return {
          id: BigInt(user.id),
          email: user.email,
          logined: true,
          accountId: BigInt(userAccount.id),
          accessToken: generateAccessToken(user).accessToken,
          error: null,
        };
      },
    });
  },
});
