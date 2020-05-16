import * as express from "express";
import * as passport from "passport";

export const router = express.Router();

router.get("/google", passport.authenticate("google", { scope: ["profile"], session: false }), res => {
  // handle with passport
  console.log(res.url);
});

router.get("/google/callback", passport.authenticate("google", { session: false }), (_, res) => {
  res.send("you reached the redirect URI");
});
