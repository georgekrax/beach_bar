import { arg, booleanArg, extendType, stringArg } from "@nexus/schema";
import { MyContext } from "../../common/myContext";
import errors from "../../constants/errors";
import { loginDetailStatus } from "../../entity/LoginDetails";
import { Platform } from "../../entity/Platform";
import { User } from "../../entity/User";
import { generateAccessToken, generateRefreshToken } from "../../utils/auth/generateAuthTokens";
import { sendRefreshToken } from "../../utils/auth/sendRefreshToken";
import { signUpUser } from "../../utils/auth/signUpUser";
import { createUserLoginDetails, findBrowser, findCity, findCountry, findOs } from "../../utils/auth/userCommon";
import { ErrorType } from "../returnTypes";
import { UserLoginDetailsInput } from "../user/types";
import { AuthorizeWithGoogleType } from "./returnTypes";
import { GoogleOAuthUserResult } from "./types";

export const AuthorizeWithOAuthProviders = extendType({
  type: "Mutation",
  definition(t) {
    t.field("authorizeWithGoogle", {
      type: GoogleOAuthUserResult,
      description: "Authorize a user with Google",
      nullable: false,
      args: {
        code: stringArg({ required: true, description: "The response code from Google's OAuth callback" }),
        state: stringArg({ required: true, description: "The response state, to check if everything went corrent" }),
        loginDetails: arg({
          type: UserLoginDetailsInput,
          required: false,
          description: "User details in login",
        }),
        isPrimaryOwner: booleanArg({
          required: false,
          default: false,
          description: "Set to true if you want to sign up an owner for a #beach_bar",
        }),
      },
      resolve: async (
        _,
        { code, state, loginDetails, isPrimaryOwner },
        { req, res, googleOAuth2Client, uaParser, redis }: MyContext,
      ): Promise<AuthorizeWithGoogleType | ErrorType> => {
        if (!code || code === "" || code === " ") {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid code" } };
        }
        if (!state || state === "" || state === " ") {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid state" } };
        }
        if (state !== req.cookies.gstate) {
          return {
            error: {
              code: errors.INTERNAL_SERVER_ERROR,
              message: "Something went wrong: Response states do not match",
            },
          };
        }

        const codeVerifier = req.cookies.gcode_verifier;
        const tokens = await googleOAuth2Client.getToken({ code, codeVerifier });

        if (!tokens) {
          return {
            error: {
              code: errors.INTERNAL_SERVER_ERROR,
              message: "Something went wrong",
            },
          };
        }

        let response: any = null;
        try {
          googleOAuth2Client.setCredentials(tokens.tokens);

          const url = "https://www.googleapis.com/oauth2/v3/userinfo?alt=json";
          response = await googleOAuth2Client.request({ url });
          if (!response.data) {
            return {
              error: {
                code: errors.INTERNAL_SERVER_ERROR,
                message: "Something went wrong",
              },
            };
          }
        } catch (err) {
          return { error: { message: `Something went wrong: ${err.message}` } };
        }

        const { sub: googleId, given_name: firstName, family_name: lastName, email, locale } = response.data;

        if (!googleId || !email) {
          return {
            error: {
              code: errors.INTERNAL_SERVER_ERROR,
              message: "Something went wrong",
            },
          };
        }

        let os: any = uaParser.getOS().name,
          browser: any = uaParser.getBrowser().name,
          country: any = null,
          city: any = null,
          ipAddr: string | null = null;

        if (loginDetails) {
          ({ city, country, ipAddr } = loginDetails);
        }

        try {
          os = await findOs(os);
          browser = await findBrowser(browser);
          country = await findCountry(country);
          city = await findCity(city);
        } catch (err) {
          return { error: { message: `Something went wrong. ${err}` } };
        }

        if (country !== null && country.languageIdentifier !== locale) {
          return {
            error: {
              code: errors.INTERNAL_SERVER_ERROR,
              message: "Something went wrong",
            },
          };
        }

        // search for user in DB
        let user: User | undefined = await User.findOne({ email });
        let signedUp = false;
        if (!user) {
          signedUp = true;
          const response = await signUpUser(
            email,
            isPrimaryOwner,
            redis,
            undefined,
            googleId,
            undefined,
            undefined,
            firstName,
            lastName,
            country,
          );
          // @ts-ignore
          if (response.error && !response.user) {
            // @ts-ignore
            return { error: { code: response.error.code, message: response.error.message } };
          }
          user = await User.findOne({ email });
        }

        if (!user) {
          return {
            error: { code: errors.INTERNAL_SERVER_ERROR, message: errors.SOMETHING_WENT_WRONG },
          };
        }

        // check user's account
        if (!user.account) {
          return { error: { code: errors.INTERNAL_SERVER_ERROR, message: "Something went wrong" } };
        }
        user.googleId = googleId;
        await user.save();

        // pass beach_bar platform to user login details
        const platform = await Platform.findOne({ where: { name: "google" }, select: ["id", "name", "urlHostname"] });
        if (!platform) {
          return { error: { code: errors.INTERNAL_SERVER_ERROR, message: "Something went wrong" } };
        }

        if (googleId !== String(user.googleId)) {
          return { error: { code: errors.INTERNAL_SERVER_ERROR, message: "Something went wrong" } };
        }

        // logined successfully
        // create user login details
        await createUserLoginDetails(loginDetailStatus.loggedIn, platform, user.account, os, browser, country, city, ipAddr);

        // get user's scopes from Redis
        const scope = await redis.smembers(`scope:${user.id}` as KeyType);
        const refreshToken = generateRefreshToken(user);
        const accessToken = generateAccessToken(user, scope);
        sendRefreshToken(res, refreshToken.token);

        try {
          await redis.hset(`${user.id.toString()}` as KeyType, "access_token", accessToken.token);
          await redis.hset(`${user.id.toString()}` as KeyType, "refresh_token", refreshToken.token);

          user.account.isActive = true;
          await user.save();
        } catch (err) {
          return { error: { message: `Something went wrong. ${err}` } };
        }

        res.clearCookie("gstate", { httpOnly: true, maxAge: 150000 });
        res.clearCookie("gcode_verifier", { httpOnly: true, maxAge: 150000 });
        googleOAuth2Client.revokeCredentials();

        return {
          user,
          accessToken: accessToken.token,
          signedUp,
          logined: true,
        };
      },
    });
  },
});
