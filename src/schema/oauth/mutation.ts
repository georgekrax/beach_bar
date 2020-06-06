import fetch from "node-fetch";
import { extendType, stringArg } from "@nexus/schema";

import { User } from "../../entity/User";
import { GoogleOAuthUserType } from "./types";
import { Account } from "../../entity/Account";
import { Platform } from "../../entity/Platform";
import { MyContext } from "../../common/myContext";
import { ContactDetails } from "../../entity/ContactDetails";
import { loginDetailStatus } from "../../entity/LoginDetails";
import { sendRefreshToken } from "../../utils/auth/sendRefreshToken";
import { generateRefreshToken, generateAccessToken } from "../../utils/auth/generateAuthTokens";
import { findCountry, findOs, findBrowser, findCity, createUserLoginDetails } from "../../utils/auth/userCommon";

// --------------------------------------------------- //
// Google authorize mutation
// --------------------------------------------------- //

export const AuthorizeWithGoogle = extendType({
  type: "Mutation",
  definition(t) {
    t.field("authorizeWithGoogle", {
      type: GoogleOAuthUserType,
      description: "Authorize a user with Google",
      nullable: false,
      args: {
        code: stringArg({ required: true, description: "The response code from Google's OAuth callback" }),
        state: stringArg({ required: true, description: "The response state, to check if everything went corrent" }),
      },
      resolve: async (
        _,
        { code, state },
        { req, res, googleOAuth2Client, uaParser, redis }: MyContext,
      ): Promise<{
        id: bigint | null;
        email: string | null;
        signedUp: boolean;
        logined: boolean;
        account: Account | null;
        accessToken: string | null;
        error: string | null;
      }> => {
        if (state !== req.cookies.gstate) {
          return {
            id: null,
            email: null,
            signedUp: false,
            logined: false,
            account: null,
            accessToken: null,
            error: "Internal Server Error: Response states do not match",
          };
        }

        const codeVerifier = req.cookies.gcode_verifier;
        const tokens = await googleOAuth2Client.getToken({ code, codeVerifier });

        if (!tokens) {
          return {
            id: null,
            email: null,
            signedUp: false,
            logined: false,
            account: null,
            accessToken: null,
            error: "Something went wrong",
          };
        }

        let response: any = null;
        try {
          googleOAuth2Client.setCredentials(tokens.tokens);

          const url = "https://www.googleapis.com/oauth2/v3/userinfo?alt=json";
          response = await googleOAuth2Client.request({ url });
          if (!response.data) {
            return {
              id: null,
              email: null,
              signedUp: false,
              logined: false,
              account: null,
              accessToken: null,
              error: "Internal Server Error: Something went wrong",
            };
          }
        } catch (err) {
          return {
            id: null,
            email: null,
            signedUp: false,
            logined: false,
            account: null,
            accessToken: null,
            error: err,
          };
        }

        const { sub: googleId, given_name: firstName, family_name: lastName, email, locale } = response.data;

        if (!googleId || !email) {
          return {
            id: null,
            email: null,
            signedUp: false,
            logined: false,
            account: null,
            accessToken: null,
            error: "Internal Server Error: Something went wrong",
          };
        }

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

        if (country !== null && country.languageIdentifier !== locale) {
          return {
            id: null,
            email: null,
            signedUp: false,
            logined: false,
            account: null,
            accessToken: null,
            error: "Internal Server Error: Something went wrong",
          };
        }

        const user: User | any = await User.findOne({
          where: { email },
          select: ["id", "email", "hashtagId", "tokenVersion", "isOwner", "googleId", "facebookId", "instagramId"],
          relations: ["account"],
        });
        let signedUp = false;
        if (!user) {
          signedUp = true;
          try {
            const newUser = User.create({
              email,
              googleId: googleId,
              firstName,
              lastName,
            });

            const newUserAccount = Account.create({});
            await newUser.save();
            newUserAccount.user = newUser;
            await newUserAccount.save();

            const newUserContactDetails = ContactDetails.create({
              account: newUserAccount,
            });
            if (country !== null) {
              newUserContactDetails.country = country;
            }
            await newUserContactDetails.save();
          } catch (err) {
            return {
              id: null,
              email: null,
              signedUp: false,
              logined: false,
              account: null,
              accessToken: null,
              error: err,
            };
          }
        }

        if (!user.account) {
          throw new Error("Something went wrong");
        }

        user.googleId = googleId;
        await user.save();

        // pass beach_bar platform to user login details
        const platform = await Platform.findOne({ where: { name: "google" }, select: ["id", "name", "urlHostname"] });
        if (!platform) {
          throw new Error("Something went wrong");
        }

        if (googleId !== String(user.googleId)) {
          throw new Error("Something went wrong");
        }

        // logined successfully
        // create user login details
        await createUserLoginDetails(loginDetailStatus.loggedIn, platform, user.account, os, browser, country, city, ipAddr);

        const refreshToken = await generateRefreshToken(user);
        sendRefreshToken(res, refreshToken.token);

        const tokenId = `${refreshToken.iat}-${refreshToken.jti}`;
        await redis.set(tokenId, refreshToken.token, "ex", 75);

        try {
          user.account.isActive = true;
          await user.account.save();
        } catch (err) {
          throw new Error(err);
        }

        res.clearCookie("gstate", { httpOnly: true, maxAge: 150000 });
        res.clearCookie("gcode_verifier", { httpOnly: true, maxAge: 150000 });

        return {
          id: BigInt(user.id),
          email: user.email,
          signedUp,
          logined: true,
          account: user.account,
          accessToken: generateAccessToken(user).token,
          error: null,
        };
      },
    });
  },
});
