import { MyContext, UrlScalar } from "@beach_bar/common";
import { extendType } from "@nexus/schema";
import { createHash, randomBytes } from "crypto";
import { CodeChallengeMethod } from "google-auth-library";
import { User } from "../../entity/User";

export const OAuthQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("getStripeConnectOAuthUrl", {
      type: UrlScalar,
      nullable: true,
      description:
        "Returns the URL where the #beach_bar (owner) will be redirected to authorize and register with Stripe, for its connect account",
      resolve: async (_, __, { payload, res, stripe }: MyContext): Promise<string | null> => {
        if (!payload) {
          return null;
        }
        const state = createHash("sha256").update(randomBytes(1024)).digest("hex");
        res.cookie("scstate", state, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 300000,
        });
        const user = await User.findOne({
          where: { id: payload.sub },
          relations: ["owner", "account", "account.country", "account.city", "account.contactDetails"],
        });
        if (!user || !user.owner || !user.account || !user.account.country || !user.account.city || !user.account.contactDetails) {
          return null;
        }
        const url = await stripe.oauth.authorizeUrl({
          client_id: process.env.STRIPE_OAUTH_CLIENT_ID!.toString(),
          redirect_uri: process.env.STRIPE_CONNECT_OAUTH_REDIRECT_URI!.toString(),
          response_type: "code",
          state,
          stripe_user: {
            email: user.email,
            first_name: user.firstName,
            last_name: user.lastName,
            business_type: "company",
            phone_number: user.account.contactDetails[0].phoneNumber,
            country: user.account.country.isoCode,
            city: user.account.city.name,
          },
          suggested_capabilities: ["transfers", "card_payments"],
        });
        return url;
      },
    });
    t.field("getGoogleOAuthUrl", {
      type: UrlScalar,
      nullable: false,
      description: "Returns the URL where the user will be redirected to login with Google",
      resolve: async (_, __, { res, googleOAuth2Client }: MyContext): Promise<string> => {
        const state = createHash("sha256").update(randomBytes(1024)).digest("hex");
        const codes = await googleOAuth2Client.generateCodeVerifierAsync();
        res
          .cookie("gstate", state, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 300000,
          })
          .cookie("gcode_verifier", codes.codeVerifier, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 300000,
          });
        const url: string = googleOAuth2Client.generateAuthUrl({
          access_type: "online",
          scope: ["profile", "email"],
          state,
          code_challenge_method: CodeChallengeMethod.S256,
          code_challenge: codes.codeChallenge,
        });
        return url;
      },
    });
    t.field("getFacebookOAuthUrl", {
      type: UrlScalar,
      nullable: false,
      description: "Returns the URL where the user will be redirected to login with Facebook",
      resolve: async (_, __, { res }: MyContext): Promise<string> => {
        const state = createHash("sha256").update(randomBytes(1024)).digest("hex");
        res.cookie("fbstate", state, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 300000,
        });
        const url = `https://www.facebook.com/v7.0/dialog/oauth?client_id=${process.env.FACEBOOK_APP_ID!.toString()}&redirect_uri=${process.env.FACEBOOK_REDIRECT_URI!.toString()}&state=${state}&scope=email,user_location,user_birthday,user_hometown`;
        return url;
      },
    });
    t.field("getInstagramOAuthUrl", {
      type: UrlScalar,
      nullable: false,
      description: "Returns the URL where the user will be redirected to login with Instagram",
      resolve: async (_, __, { res }: MyContext): Promise<string> => {
        const state = createHash("sha256").update(randomBytes(1024)).digest("hex");
        res.cookie("instastate", state, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 300000,
        });
        const url = `https://api.instagram.com/oauth/authorize?client_id=${process.env.INSTAGRAM_APP_ID!.toString()}&redirect_uri=${process.env.INSTAGRAM_REDIRECT_URI!.toString()}&response_type=code&scope=user_profile&state=${state}`;
        return url;
      },
    });
  },
});
