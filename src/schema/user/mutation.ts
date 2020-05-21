import fetch from "node-fetch";
import { extendType, arg, stringArg } from "@nexus/schema";
import { execute, makePromise } from "apollo-link";

import { User } from "../../entity/User";
import { gql } from "apollo-server-express";
import { Account } from "../../entity/Account";
import { link } from "../../config/apolloLink";
import { MyContext } from "../../common/myContext";
import { Platform } from "./../../entity/Platform";
import { loginDetailStatus } from "../../entity/LoginDetails";
import { sendRefreshToken } from "../../utils/auth/sendRefreshToken";
import { UserSignUpType, UserLoginType, UserSignUpCredentialsInput, UserLogoutType } from "./type";
import { generateAccessToken, generateRefreshToken } from "../../utils/auth/generateAuthTokens";
import { createUserLoginDetails, findOs, findBrowser, findCountry, findCity } from "../../utils/auth/userCommon";
import { verify } from "jsonwebtoken";
import { getConnection } from "typeorm";

// --------------------------------------------------- //
// Sign up mutation
// --------------------------------------------------- //

export const UserSignUpMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("signUp", {
      type: UserSignUpType,
      description: "Sign up a user",
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

// --------------------------------------------------- //
// Login mutation
// --------------------------------------------------- //

export const UserLoginMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("login", {
      type: UserLoginType,
      description: "Login a user",
      nullable: false,
      args: {
        userCredentials: arg({ type: UserSignUpCredentialsInput, required: true, description: "Credential for signing up a user" }),
      },
      resolve: async (
        _,
        { userCredentials },
        { res, redis, uaParser }: MyContext,
      ): Promise<{
        id: bigint | null;
        email: string;
        logined: boolean;
        accountId: bigint | null;
        accessToken: string | null;
        error: string | null;
      }> => {
        const { email, password } = userCredentials;

        let os: any = uaParser.getOS().name,
          browser: any = uaParser.getBrowser().name,
          country: any = null,
          city: any = null,
          ipAddr: string | null = null;

        await fetch("http://ip-api.com/json/")
          .then(res => res.json())
          .then(json => {
            if (json.status === "success") {
              country = json.country;
              city = json.city;
              ipAddr = json.query;
            }
          })
          .catch(err => {
            throw new Error(err);
          });

        try {
          os = await findOs(os);
          browser = await findBrowser(browser);
          country = await findCountry(country);
          city = await findCity(city);
        } catch (err) {
          throw new Error(err);
        }

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
        const userAccount = await Account.findOne({
          where: { user: user, userId: user.id },
          select: ["id", "userId", "user", "isActive"],
        });
        if (!userAccount) {
          throw new Error("Something went wrong");
        }

        const operation = {
          query: gql`
            mutation LOGIN_USER(
              $email: String!
              $password: String!
              $os: String
              $browser: String
              $country: String
              $city: String
              $ipAddr: String
            ) {
              login(
                userCredentials: { email: $email, password: $password }
                loginDetails: { os: $os, browser: $browser, country: $country, city: $city, ipAddr: $ipAddr }
              ) {
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
            os: os.name,
            browser: browser.name,
            country: country.name,
            city: city.name,
            ipAddr,
          },
        };

        let hashtagEmail: string | null = null,
          hashtagId: bigint | null = null,
          logined: boolean | null = null,
          error: string | null = null;

        await makePromise(execute(link, operation))
          .then(res => {
            hashtagEmail = res.data?.login.email;
            hashtagId = res.data?.login.id;
            logined = res.data?.login.logined;
            error = res.data?.login.error;
          })
          .catch(err => {
            throw new Error(err);
          });

        // pass beach_bar platform to user login details
        const platform = await Platform.findOne({ where: { name: "beach_bar" }, select: ["id", "name", "urlHostname"] });
        if (!platform) {
          throw new Error("Something went wrong");
        }

        if (BigInt(hashtagId) !== BigInt(user.hashtagId)) {
          throw new Error("Something went wrong");
        }

        if (error !== null && logined == false) {
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

        const refreshToken = await generateRefreshToken(user);
        sendRefreshToken(res, refreshToken.token);

        const tokenId = `${refreshToken.iat}-${refreshToken.jti}`;
        await redis.set(tokenId, refreshToken.token, "ex", 75);

        try {
          userAccount.isActive = true;
          await userAccount.save();
        } catch (err) {
          throw new Error(err);
        }

        return {
          id: BigInt(user.id),
          email: user.email,
          logined: true,
          accountId: BigInt(userAccount.id),
          accessToken: generateAccessToken(user).token,
          error: null,
        };
      },
    });
  },
});

// --------------------------------------------------- //
// Logout mutation
// --------------------------------------------------- //

export const UserLogoutMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("logout", {
      type: UserLogoutType,
      description: "Logout a user",
      args: {
        refreshToken: stringArg({ required: true }),
      },
      nullable: false,
      resolve: async (
        _,
        { refreshToken },
        { payload, redis }: MyContext,
      ): Promise<{
        loggedOut: boolean;
        error: string | null;
      }> => {
        if (!refreshToken) {
          return {
            loggedOut: false,
            error: "A refresh token should be provided",
          };
        }

        if (!payload || payload.userId === null) {
          return {
            loggedOut: false,
            error: "Not authenticated",
          };
        }

        let tokenPayload: any = null;
        try {
          tokenPayload = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!, {
            issuer: "www.beach_bar.com",
          });
        } catch (err) {
          return {
            loggedOut: false,
            error: err,
          };
        }

        if (payload.userId !== tokenPayload.userId) {
          return {
            loggedOut: false,
            error: "You are not allowed to logout this user",
          };
        }

        await getConnection().getRepository(User).increment({ id: payload.userId }, "tokenVersion", 1);

        await getConnection()
          .createQueryBuilder()
          .update(Account)
          .set({ isActive: false })
          .where("userId = :userId", { userId: payload.userId })
          .execute();

        const tokenId = `${tokenPayload.iat}-${tokenPayload.jti}`;

        try {
          await redis.del(tokenId);
        } catch (err) {
          return {
            loggedOut: false,
            error: err,
          };
        }

        return {
          loggedOut: true,
          error: null,
        };
      },
    });
  },
});
