import * as passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

passport.use(
  new GoogleStrategy(
    {
      // options for this Google strategy
      clientID: process.env.GOOGLE_OAUTH_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_OAUTH_REDIRECT_URI!,
    },
    (accessToken, refreshToken, profile, done) => {
      // Passport.js callback function
      console.log(accessToken);
      console.log(refreshToken);
      console.log(profile);
      console.log("callback function fired");
      done();
    },
  ),
);
