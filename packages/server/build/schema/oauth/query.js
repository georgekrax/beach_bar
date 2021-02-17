"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuthQuery = void 0;
const graphql_1 = require("@the_hashtag/common/dist/graphql");
const crypto_1 = require("crypto");
const User_1 = require("entity/User");
const google_auth_library_1 = require("google-auth-library");
const nexus_1 = require("nexus");
exports.OAuthQuery = nexus_1.extendType({
    type: "Query",
    definition(t) {
        t.nullable.field("getStripeConnectOAuthUrl", {
            type: graphql_1.UrlScalar,
            description: "Returns the URL where the #beach_bar (owner) will be redirected to authorize and register with Stripe, for its connect account",
            resolve: (_, __, { payload, res, stripe }) => __awaiter(this, void 0, void 0, function* () {
                if (!payload) {
                    return null;
                }
                const state = crypto_1.createHash("sha256").update(crypto_1.randomBytes(1024)).digest("hex");
                res.cookie("scstate", state, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 300000,
                });
                const user = yield User_1.User.findOne({
                    where: { id: payload.sub },
                    relations: ["owner", "account", "account.country", "account.city", "account.contactDetails"],
                });
                if (!user || !user.owner || !user.account || !user.account.country || !user.account.city || !user.account.contactDetails) {
                    return null;
                }
                const url = yield stripe.oauth.authorizeUrl({
                    client_id: process.env.STRIPE_OAUTH_CLIENT_ID.toString(),
                    redirect_uri: process.env.STRIPE_CONNECT_OAUTH_REDIRECT_URI.toString(),
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
            }),
        });
        t.field("getGoogleOAuthUrl", {
            type: graphql_1.UrlScalar,
            description: "Returns the URL where the user will be redirected to login with Google",
            resolve: (_, __, { res, googleOAuth2Client }) => __awaiter(this, void 0, void 0, function* () {
                const state = crypto_1.createHash("sha256").update(crypto_1.randomBytes(1024)).digest("hex");
                const codes = yield googleOAuth2Client.generateCodeVerifierAsync();
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
                const url = googleOAuth2Client.generateAuthUrl({
                    access_type: "online",
                    scope: ["profile", "email"],
                    state,
                    code_challenge_method: google_auth_library_1.CodeChallengeMethod.S256,
                    code_challenge: codes.codeChallenge,
                });
                return url;
            }),
        });
        t.field("getFacebookOAuthUrl", {
            type: graphql_1.UrlScalar,
            description: "Returns the URL where the user will be redirected to login with Facebook",
            resolve: (_, __, { res }) => __awaiter(this, void 0, void 0, function* () {
                const state = crypto_1.createHash("sha256").update(crypto_1.randomBytes(1024)).digest("hex");
                res.cookie("fbstate", state, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 300000,
                });
                const url = `https://www.facebook.com/v7.0/dialog/oauth?client_id=${process.env.FACEBOOK_APP_ID.toString()}&redirect_uri=${process.env.FACEBOOK_REDIRECT_URI.toString()}&state=${state}&scope=email,user_location,user_birthday,user_hometown`;
                return url;
            }),
        });
        t.field("getInstagramOAuthUrl", {
            type: graphql_1.UrlScalar,
            description: "Returns the URL where the user will be redirected to login with Instagram",
            resolve: (_, __, { res }) => __awaiter(this, void 0, void 0, function* () {
                const state = crypto_1.createHash("sha256").update(crypto_1.randomBytes(1024)).digest("hex");
                res.cookie("instastate", state, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 300000,
                });
                const url = `https://api.instagram.com/oauth/authorize?client_id=${process.env.INSTAGRAM_APP_ID.toString()}&redirect_uri=${process.env.INSTAGRAM_REDIRECT_URI.toString()}&response_type=code&scope=user_profile&state=${state}`;
                return url;
            }),
        });
    },
});
