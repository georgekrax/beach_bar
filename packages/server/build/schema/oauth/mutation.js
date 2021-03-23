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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizeWithOAuthProviders = void 0;
const common_1 = require("@beach_bar/common");
const graphql_1 = require("@the_hashtag/common/dist/graphql");
const apollo_server_express_1 = require("apollo-server-express");
const platformNames_1 = __importDefault(require("config/platformNames"));
const dayjs_1 = __importDefault(require("dayjs"));
const LoginDetails_1 = require("entity/LoginDetails");
const User_1 = require("entity/User");
const nexus_1 = require("nexus");
const node_fetch_1 = __importDefault(require("node-fetch"));
const generateAuthTokens_1 = require("utils/auth/generateAuthTokens");
const sendCookieToken_1 = require("utils/auth/sendCookieToken");
const signUpUser_1 = require("utils/auth/signUpUser");
const userCommon_1 = require("utils/auth/userCommon");
const types_1 = require("../user/types");
const types_2 = require("./types");
exports.AuthorizeWithOAuthProviders = nexus_1.extendType({
    type: "Mutation",
    definition(t) {
        t.field("authorizeWithGoogle", {
            type: types_2.OAuthAuthorizationType,
            description: "Authorize a user with Google",
            args: {
                code: nexus_1.stringArg({ description: "The response code from Google's OAuth callback" }),
                state: nexus_1.stringArg({ description: "The response state, to check if everything went correct" }),
                loginDetails: nexus_1.nullable(nexus_1.arg({
                    type: types_1.UserLoginDetails,
                    description: "User details in login",
                })),
                isPrimaryOwner: nexus_1.nullable(nexus_1.booleanArg({
                    default: false,
                    description: "Set to true if you want to sign up an owner for a #beach_bar",
                })),
            },
            resolve: (_, { code, state, loginDetails, isPrimaryOwner }, { req, res, googleOAuth2Client, uaParser, redis, ipAddr }) => __awaiter(this, void 0, void 0, function* () {
                if (!code || code.trim().length === 0 || !state || state.trim().length === 0)
                    throw new apollo_server_express_1.ApolloError(common_1.errors.SOMETHING_WENT_WRONG, common_1.errors.INTERNAL_SERVER_ERROR);
                if (state !== req.cookies.gstate)
                    throw new apollo_server_express_1.ApolloError(common_1.errors.SOMETHING_WENT_WRONG + ". Please try again.", common_1.errors.INTERNAL_SERVER_ERROR);
                const codeVerifier = req.cookies.gcode_verifier;
                const tokens = yield googleOAuth2Client.getToken({ code, codeVerifier });
                if (!tokens)
                    throw new apollo_server_express_1.ApolloError(common_1.errors.SOMETHING_WENT_WRONG, common_1.errors.INTERNAL_SERVER_ERROR);
                let response = null;
                try {
                    googleOAuth2Client.setCredentials(tokens.tokens);
                    const url = "https://www.googleapis.com/oauth2/v3/userinfo?alt=json";
                    response = yield googleOAuth2Client.request({ url });
                    if (!response.data)
                        throw new apollo_server_express_1.ApolloError(common_1.errors.SOMETHING_WENT_WRONG, common_1.errors.INTERNAL_SERVER_ERROR);
                }
                catch (err) {
                    throw new apollo_server_express_1.ApolloError(common_1.errors.SOMETHING_WENT_WRONG + `: ${err.message}`, common_1.errors.SOMETHING_WENT_WRONG);
                }
                const { sub: googleId, given_name: firstName, family_name: lastName, email } = response.data;
                if (!googleId || googleId.trim().length === 0 || !email || email.trim().length === 0)
                    throw new apollo_server_express_1.ApolloError(common_1.errors.SOMETHING_WENT_WRONG + ". Please try again.", common_1.errors.INTERNAL_SERVER_ERROR);
                const { osId, browserId, countryId, city } = userCommon_1.findLoginDetails({ details: loginDetails, uaParser });
                let user = yield User_1.User.findOne({ where: { email }, relations: ["account"] });
                let signedUp = false;
                if (!user) {
                    signedUp = true;
                    const response = yield signUpUser_1.signUpUser({
                        email,
                        redis,
                        isPrimaryOwner,
                        googleId,
                        firstName,
                        lastName,
                        countryId,
                        city,
                    });
                    if (response.error && !response.user)
                        throw new apollo_server_express_1.ApolloError(response.error.message, response.error.code);
                    user = yield User_1.User.findOne({ where: { email }, relations: ["account"] });
                }
                if (!user || !user.account)
                    throw new apollo_server_express_1.ApolloError(common_1.errors.SOMETHING_WENT_WRONG, common_1.errors.INTERNAL_SERVER_ERROR);
                try {
                    yield userCommon_1.createUserLoginDetails(LoginDetails_1.LoginDetailStatus.loggedIn, platformNames_1.default.GOOGLE, user.account, osId, browserId, countryId, city, ipAddr);
                }
                catch (err) {
                    throw new apollo_server_express_1.ApolloError(common_1.errors.SOMETHING_WENT_WRONG, common_1.errors.SOMETHING_WENT_WRONG);
                }
                const scope = yield redis.smembers(user.getRedisKey(true));
                const refreshToken = generateAuthTokens_1.generateRefreshToken(user, "Google");
                const accessToken = generateAuthTokens_1.generateAccessToken(user, scope);
                sendCookieToken_1.sendCookieToken(res, refreshToken.token, "refresh");
                sendCookieToken_1.sendCookieToken(res, accessToken.token, "access");
                try {
                    yield redis.hset(user.getRedisKey(), "access_token", accessToken.token);
                    yield redis.hset(user.getRedisKey(), "refresh_token", refreshToken.token);
                    user.googleId = googleId;
                    user.account.isActive = true;
                    yield user.save();
                    yield user.account.save();
                    if (googleId !== String(user.googleId))
                        throw new apollo_server_express_1.ApolloError(common_1.errors.SOMETHING_WENT_WRONG, common_1.errors.SOMETHING_WENT_WRONG);
                }
                catch (err) {
                    throw new apollo_server_express_1.ApolloError(common_1.errors.SOMETHING_WENT_WRONG + `: ${err.message}`, common_1.errors.SOMETHING_WENT_WRONG);
                }
                res.clearCookie("gstate", { httpOnly: true });
                res.clearCookie("gcode_verifier", { httpOnly: true });
                googleOAuth2Client.revokeCredentials();
                return {
                    user,
                    accessToken: accessToken.token,
                    signedUp,
                    logined: true,
                };
            }),
        });
        t.field("authorizeWithFacebook", {
            type: types_2.OAuthAuthorizationType,
            description: "Authorize a user with Facebook",
            args: {
                code: nexus_1.stringArg({ description: "The response code from Google's OAuth callback" }),
                state: nexus_1.stringArg({ description: "The response state, to check if everything went correct" }),
                loginDetails: nexus_1.nullable(nexus_1.arg({
                    type: types_1.UserLoginDetails,
                    description: "User details in login",
                })),
                isPrimaryOwner: nexus_1.nullable(nexus_1.booleanArg({
                    default: false,
                    description: "Set to true if you want to sign up an owner for a #beach_bar",
                })),
            },
            resolve: (_, { code, state, loginDetails, isPrimaryOwner }, { req, res, uaParser, redis, ipAddr }) => __awaiter(this, void 0, void 0, function* () {
                if (!code || code.trim().length === 0 || !state || state.trim().length === 0)
                    throw new apollo_server_express_1.ApolloError(common_1.errors.SOMETHING_WENT_WRONG, common_1.errors.SOMETHING_WENT_WRONG);
                if (state !== req.cookies.fbstate)
                    throw new apollo_server_express_1.ApolloError(common_1.errors.SOMETHING_WENT_WRONG + ". Please try again.", common_1.errors.INTERNAL_SERVER_ERROR);
                let requestStatus = undefined, success = false, facebookAccessToken = undefined;
                yield node_fetch_1.default(`${process.env.FACEBOOK_GRAPH_API_HOSTNAME.toString()}/v7.0/oauth/access_token?client_id=${process.env.FACEBOOK_APP_ID.toString()}&redirect_uri=${process.env.FACEBOOK_REDIRECT_URI.toString()}&client_secret=${process.env.FACEBOOK_APP_SECRET.toString()}&code=${code}`, {
                    method: "GET",
                })
                    .then(res => {
                    requestStatus = res.status;
                    return res.json();
                })
                    .then(data => {
                    if (data.access_token && data.token_type == "bearer" && requestStatus === 200) {
                        success = true;
                        facebookAccessToken = data.access_token;
                    }
                    else
                        success = false;
                })
                    .catch(err => {
                    throw new apollo_server_express_1.ApolloError(`${common_1.errors.SOMETHING_WENT_WRONG}: ${err.message}`, common_1.errors.SOMETHING_WENT_WRONG);
                });
                if (!success || !facebookAccessToken)
                    throw new apollo_server_express_1.ApolloError(common_1.errors.SOMETHING_WENT_WRONG, common_1.errors.INTERNAL_SERVER_ERROR);
                requestStatus = undefined;
                success = false;
                yield node_fetch_1.default(`${process.env.FACEBOOK_GRAPH_API_HOSTNAME.toString()}/debug_token?input_token=${facebookAccessToken}&access_token=${process.env.FACEBOOK_APP_ACCESS_TOKEN.toString()}`, {
                    method: "GET",
                })
                    .then(res => {
                    requestStatus = res.status;
                    return res.json().then(json => json.data);
                })
                    .then(data => {
                    if (!data ||
                        data.app_id !== process.env.FACEBOOK_APP_ID.toString() ||
                        data.type !== "USER" ||
                        data.application !== process.env.FACEBOOK_APP_NAME.toString() ||
                        !data.is_valid)
                        success = false;
                    else
                        success = true;
                })
                    .catch(err => {
                    throw new apollo_server_express_1.ApolloError(common_1.errors.SOMETHING_WENT_WRONG + `: ${err.message}`, common_1.errors.SOMETHING_WENT_WRONG);
                });
                if (!success)
                    throw new apollo_server_express_1.ApolloError(common_1.errors.SOMETHING_WENT_WRONG, common_1.errors.INTERNAL_SERVER_ERROR);
                let facebookId = undefined, facebookEmail = undefined, firstName = undefined, lastName = undefined, birthday = undefined, pictureUrl = undefined;
                requestStatus = undefined;
                success = false;
                yield node_fetch_1.default(`${process.env.FACEBOOK_GRAPH_API_HOSTNAME.toString()}/me?fields=id,email,first_name,last_name,birthday,hometown,location,picture{is_silhouette,url}&access_token=${facebookAccessToken}`, {
                    method: "GET",
                })
                    .then(res => {
                    requestStatus = res.status;
                    return res.json();
                })
                    .then(data => {
                    if (!data || !data.id || data.id.trim().length === 0 || data.email.trim().length === 0)
                        success = false;
                    else {
                        success = true;
                        facebookId = data.id;
                        facebookEmail = data.email;
                        firstName = data.first_name;
                        lastName = data.last_name;
                        if (data.birthday)
                            birthday = dayjs_1.default(data.birthday).toDate();
                        if (data.picture && !data.picture.is_silhouette)
                            pictureUrl = data.picture.data.url;
                    }
                })
                    .catch(err => {
                    throw new apollo_server_express_1.ApolloError(common_1.errors.SOMETHING_WENT_WRONG + `: ${err.message}`, common_1.errors.SOMETHING_WENT_WRONG);
                });
                if (!success || !facebookEmail || !facebookId)
                    throw new apollo_server_express_1.ApolloError(common_1.errors.INTERNAL_SERVER_ERROR, common_1.errors.INTERNAL_SERVER_ERROR);
                const { osId, browserId, countryId, city } = userCommon_1.findLoginDetails({ details: loginDetails, uaParser });
                let user = yield User_1.User.findOne({ where: { email: facebookEmail }, relations: ["account"] });
                let signedUp = false;
                if (!user) {
                    signedUp = true;
                    const response = yield signUpUser_1.signUpUser({
                        email: facebookEmail,
                        redis,
                        isPrimaryOwner,
                        facebookId,
                        firstName,
                        lastName,
                        countryId,
                        city,
                        birthday,
                    });
                    if (response.error && !response.user)
                        throw new apollo_server_express_1.ApolloError(response.error.message, response.error.code);
                    user = yield User_1.User.findOne({ where: { email: facebookEmail }, relations: ["account"] });
                }
                if (!user || !user.account)
                    throw new apollo_server_express_1.ApolloError(common_1.errors.SOMETHING_WENT_WRONG, common_1.errors.INTERNAL_SERVER_ERROR);
                yield userCommon_1.createUserLoginDetails(LoginDetails_1.LoginDetailStatus.loggedIn, platformNames_1.default.FACEBOOK, user.account, osId, browserId, countryId, city, ipAddr);
                const scope = yield redis.smembers(user.getRedisKey(true));
                const refreshToken = generateAuthTokens_1.generateRefreshToken(user, "Facebook");
                const accessToken = generateAuthTokens_1.generateAccessToken(user, scope);
                sendCookieToken_1.sendCookieToken(res, refreshToken.token, "refresh");
                sendCookieToken_1.sendCookieToken(res, accessToken.token, "access");
                try {
                    yield redis.hset(user.getRedisKey(), "access_token", accessToken.token);
                    yield redis.hset(user.getRedisKey(), "refresh_token", refreshToken.token);
                    user.facebookId = facebookId;
                    user.account.isActive = true;
                    if (birthday && !user.account.birthday)
                        user.account.birthday = birthday;
                    if (pictureUrl && !user.account.imgUrl)
                        user.account.imgUrl = pictureUrl;
                    yield user.save();
                    yield user.account.save();
                    if (facebookId !== String(user.facebookId))
                        throw new apollo_server_express_1.ApolloError(common_1.errors.SOMETHING_WENT_WRONG, common_1.errors.INTERNAL_SERVER_ERROR);
                }
                catch (err) {
                    yield userCommon_1.createUserLoginDetails(LoginDetails_1.LoginDetailStatus.failed, platformNames_1.default.BEACH_BAR, user.account, osId, browserId, countryId, city, ipAddr);
                    throw new apollo_server_express_1.ApolloError(common_1.errors.SOMETHING_WENT_WRONG + `: ${err.message}`);
                }
                res.clearCookie("fbstate", { httpOnly: true });
                return {
                    user,
                    accessToken: accessToken.token,
                    signedUp,
                    logined: true,
                };
            }),
        });
        t.field("authorizeWithInstagram", {
            type: types_2.OAuthAuthorizationType,
            description: "Authorize a user with Instagram",
            args: {
                email: nexus_1.arg({ type: graphql_1.EmailScalar, description: "Email address of user to authorize with Instagram" }),
                code: nexus_1.stringArg({ description: "The response code from Google's OAuth callback" }),
                state: nexus_1.stringArg({ description: "The response state, to check if everything went correct" }),
                loginDetails: nexus_1.nullable(nexus_1.arg({
                    type: types_1.UserLoginDetails,
                    description: "User details in login",
                })),
                isPrimaryOwner: nexus_1.nullable(nexus_1.booleanArg({
                    default: false,
                    description: "Set to true if you want to sign up an owner for a #beach_bar",
                })),
            },
            resolve: (_, { email, code, state, loginDetails, isPrimaryOwner }, { req, res, uaParser, redis, ipAddr }) => __awaiter(this, void 0, void 0, function* () {
                if (!email || email.trim().length === 0)
                    throw new apollo_server_express_1.ApolloError("Please provide a valid email address", common_1.errors.INVALID_ARGUMENTS);
                if (!code || code.trim().length === 0 || !state || state.trim().length === 0)
                    throw new apollo_server_express_1.ApolloError(common_1.errors.SOMETHING_WENT_WRONG, common_1.errors.INTERNAL_SERVER_ERROR);
                if (state !== req.cookies.instastate)
                    throw new apollo_server_express_1.ApolloError(common_1.errors.SOMETHING_WENT_WRONG + ". Please try again.", common_1.errors.INTERNAL_SERVER_ERROR);
                const requestBody = new URLSearchParams();
                requestBody.append("client_id", process.env.INSTAGRAM_APP_ID.toString());
                requestBody.append("client_secret", process.env.INSTAGRAM_APP_SECRET.toString());
                requestBody.append("code", code);
                requestBody.append("grant_type", "authorization_code");
                requestBody.append("redirect_uri", process.env.INSTAGRAM_REDIRECT_URI.toString());
                let requestStatus = undefined, success = false, instagramAccessToken = undefined, instagramUserId = undefined;
                yield node_fetch_1.default(`${process.env.INSTAGRAM_API_HOSTNAME.toString()}/oauth/access_token`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: requestBody,
                })
                    .then(res => {
                    requestStatus = res.status;
                    return res.json();
                })
                    .then(data => {
                    if (data.access_token && data.user_id && data.user_id !== ("" || " ") && requestStatus === 200) {
                        success = true;
                        instagramAccessToken = data.access_token;
                        instagramUserId = data.user_id;
                    }
                    else
                        success = false;
                })
                    .catch(err => {
                    throw new apollo_server_express_1.ApolloError(common_1.errors.SOMETHING_WENT_WRONG + `: ${err.message}`, common_1.errors.SOMETHING_WENT_WRONG);
                });
                if (!success || !instagramAccessToken || !instagramUserId)
                    throw new apollo_server_express_1.ApolloError(common_1.errors.INTERNAL_SERVER_ERROR, common_1.errors.INTERNAL_SERVER_ERROR);
                let instagramId = undefined, instagramUsername = undefined;
                requestStatus = undefined;
                success = false;
                yield node_fetch_1.default(`${process.env.INSTAGRAM_GRAPH_API_HOSTNAME.toString()}/${instagramUserId}?fields=id,username&access_token=${instagramAccessToken}`, {
                    method: "GET",
                })
                    .then(res => {
                    requestStatus = res.status;
                    return res.json();
                })
                    .then(data => {
                    if (!data || !data.id || data.id.trim().length === 0)
                        success = false;
                    else {
                        success = true;
                        instagramId = data.id;
                        instagramUsername = data.username;
                    }
                })
                    .catch(err => {
                    throw new apollo_server_express_1.ApolloError(common_1.errors.SOMETHING_WENT_WRONG + `: ${err.message}`, common_1.errors.SOMETHING_WENT_WRONG);
                });
                if (!success || !instagramId || String(instagramId) !== String(instagramUserId))
                    throw new apollo_server_express_1.ApolloError(common_1.errors.SOMETHING_WENT_WRONG, common_1.errors.INTERNAL_SERVER_ERROR);
                const { osId, browserId, countryId, city } = userCommon_1.findLoginDetails({ details: loginDetails, uaParser });
                let user = yield User_1.User.findOne({
                    where: { email },
                    relations: ["account"],
                });
                let signedUp = false;
                if (!user) {
                    signedUp = true;
                    const response = yield signUpUser_1.signUpUser({
                        email,
                        redis,
                        isPrimaryOwner,
                        instagramId,
                        instagramUsername,
                        countryId,
                        city,
                    });
                    if (response.error && !response.user)
                        throw new apollo_server_express_1.ApolloError(response.error.message, response.error.code);
                    user = yield User_1.User.findOne({ where: { email, instagramUsername }, relations: ["account"] });
                }
                if (!user || !user.account)
                    throw new apollo_server_express_1.ApolloError(common_1.errors.INTERNAL_SERVER_ERROR, common_1.errors.SOMETHING_WENT_WRONG);
                yield userCommon_1.createUserLoginDetails(LoginDetails_1.LoginDetailStatus.loggedIn, platformNames_1.default.INSTAGRAM, user.account, osId, browserId, countryId, city, ipAddr);
                const scope = yield redis.smembers(user.getRedisKey(true));
                const refreshToken = generateAuthTokens_1.generateRefreshToken(user, "Instagram");
                const accessToken = generateAuthTokens_1.generateAccessToken(user, scope);
                sendCookieToken_1.sendCookieToken(res, refreshToken.token, "refresh");
                sendCookieToken_1.sendCookieToken(res, accessToken.token, "access");
                try {
                    yield redis.hset(user.getRedisKey(), "access_token", accessToken.token);
                    yield redis.hset(user.getRedisKey(), "refresh_token", refreshToken.token);
                    user.instagramId = instagramId;
                    user.account.isActive = true;
                    if (instagramUsername) {
                        user.instagramUsername = instagramUsername;
                    }
                    yield user.save();
                    yield user.account.save();
                    if (instagramId !== String(user.instagramId))
                        throw new apollo_server_express_1.ApolloError(common_1.errors.SOMETHING_WENT_WRONG, common_1.errors.SOMETHING_WENT_WRONG);
                }
                catch (err) {
                    yield userCommon_1.createUserLoginDetails(LoginDetails_1.LoginDetailStatus.failed, platformNames_1.default.BEACH_BAR, user.account, osId, browserId, countryId, city, ipAddr);
                    throw new apollo_server_express_1.ApolloError(common_1.errors.SOMETHING_WENT_WRONG + `: ${err.message}`, common_1.errors.SOMETHING_WENT_WRONG);
                }
                res.clearCookie("instastate", { httpOnly: true });
                return {
                    user,
                    accessToken: accessToken.token,
                    signedUp,
                    logined: true,
                };
            }),
        });
    },
});
