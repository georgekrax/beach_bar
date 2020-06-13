/* eslint-disable @typescript-eslint/camelcase */
import { extendType } from "@nexus/schema";
import { createHash, randomBytes } from "crypto";
import { CodeChallengeMethod } from "google-auth-library";

export const OAuthQuery = extendType({
  type: "Query",
  definition(t) {
    // @ts-ignore
    t.url("googleOAuthUrl", {
      nullable: false,
      description: "Returns the URL where is user is redirected for logging in with Google",
      resolve: async (_, __, { res, googleOAuth2Client }): Promise<string> => {
        const state = createHash("sha256").update(randomBytes(1024)).digest("hex");
        const codes = await googleOAuth2Client.generateCodeVerifierAsync();
        res.cookie("gstate", state, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 150000,
        });
        res.cookie("gcode_verifier", codes.codeVerifier, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 150000,
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
  },
});
