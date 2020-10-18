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
const common_2 = require("@georgekrax-hashtag/common");
const schema_1 = require("@nexus/schema");
const platformNames_1 = __importDefault(require("config/platformNames"));
const dayjs_1 = __importDefault(require("dayjs"));
const LoginDetails_1 = require("entity/LoginDetails");
const User_1 = require("entity/User");
const node_fetch_1 = __importDefault(require("node-fetch"));
const generateAuthTokens_1 = require("utils/auth/generateAuthTokens");
const sendRefreshToken_1 = require("utils/auth/sendRefreshToken");
const signUpUser_1 = require("utils/auth/signUpUser");
const userCommon_1 = require("utils/auth/userCommon");
const types_1 = require("../user/types");
const types_2 = require("./types");
exports.AuthorizeWithOAuthProviders = schema_1.extendType({
    type: "Mutation",
    definition(t) {
        t.field("authorizeWithGoogle", {
            type: types_2.OAuthAuthorizationResult,
            description: "Authorize a user with Google",
            nullable: false,
            args: {
                code: schema_1.stringArg({ required: true, description: "The response code from Google's OAuth callback" }),
                state: schema_1.stringArg({ required: true, description: "The response state, to check if everything went correct" }),
                loginDetails: schema_1.arg({
                    type: types_1.UserLoginDetailsInput,
                    required: false,
                    description: "User details in login",
                }),
                isPrimaryOwner: schema_1.booleanArg({
                    required: false,
                    default: false,
                    description: "Set to true if you want to sign up an owner for a #beach_bar",
                }),
            },
            resolve: (_, { code, state, loginDetails, isPrimaryOwner }, { req, res, googleOAuth2Client, uaParser, redis, ipAddr }) => __awaiter(this, void 0, void 0, function* () {
                if (!code || code.trim().length === 0) {
                    return { error: { code: common_1.errors.INTERNAL_SERVER_ERROR, message: common_1.errors.SOMETHING_WENT_WRONG } };
                }
                if (!state || state.trim().length === 0) {
                    return { error: { code: common_1.errors.INTERNAL_SERVER_ERROR, message: common_1.errors.SOMETHING_WENT_WRONG } };
                }
                if (state !== req.cookies.gstate) {
                    return {
                        error: {
                            code: common_1.errors.INTERNAL_SERVER_ERROR,
                            message: `${common_1.errors.SOMETHING_WENT_WRONG}. Please try again`,
                        },
                    };
                }
                const codeVerifier = req.cookies.gcode_verifier;
                const tokens = yield googleOAuth2Client.getToken({ code, codeVerifier });
                if (!tokens) {
                    return {
                        error: {
                            code: common_1.errors.INTERNAL_SERVER_ERROR,
                            message: common_1.errors.SOMETHING_WENT_WRONG,
                        },
                    };
                }
                let response = null;
                try {
                    googleOAuth2Client.setCredentials(tokens.tokens);
                    const url = "https://www.googleapis.com/oauth2/v3/userinfo?alt=json";
                    response = yield googleOAuth2Client.request({ url });
                    if (!response.data) {
                        return {
                            error: {
                                code: common_1.errors.INTERNAL_SERVER_ERROR,
                                message: "Something went wrong",
                            },
                        };
                    }
                }
                catch (err) {
                    return { error: { message: `${common_1.errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
                }
                const { sub: googleId, given_name: firstName, family_name: lastName, email } = response.data;
                if (!googleId || googleId === ("" || " ") || !email || email === ("" || " ")) {
                    return {
                        error: {
                            code: common_1.errors.INTERNAL_SERVER_ERROR,
                            message: "Something went wrong",
                        },
                    };
                }
                const { osId, browserId, countryId, cityId } = userCommon_1.findLoginDetails({ details: loginDetails, uaParser });
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
                        cityId,
                    });
                    if (response.error && !response.user) {
                        return { error: { code: response.error.code, message: response.error.message } };
                    }
                    user = yield User_1.User.findOne({ where: { email }, relations: ["account"] });
                }
                if (!user) {
                    return {
                        error: { code: common_1.errors.INTERNAL_SERVER_ERROR, message: common_1.errors.SOMETHING_WENT_WRONG },
                    };
                }
                if (!user.account) {
                    return { error: { code: common_1.errors.INTERNAL_SERVER_ERROR, message: "Something went wrong" } };
                }
                try {
                    yield userCommon_1.createUserLoginDetails(LoginDetails_1.LoginDetailStatus.loggedIn, platformNames_1.default.GOOGLE, user.account, osId, browserId, countryId, cityId, ipAddr);
                }
                catch (err) {
                    return { error: { message: `${common_1.errors.SOMETHING_WENT_WRONG}${err.message && err.message !== "" ? err.message : ""}` } };
                }
                const scope = yield redis.smembers(user.getRedisKey(true));
                const refreshToken = generateAuthTokens_1.generateRefreshToken(user);
                const accessToken = generateAuthTokens_1.generateAccessToken(user, scope);
                sendRefreshToken_1.sendRefreshToken(res, refreshToken.token);
                try {
                    yield redis.hset(user.getRedisKey(), "access_token", accessToken.token);
                    yield redis.hset(user.getRedisKey(), "refresh_token", refreshToken.token);
                    user.googleId = googleId;
                    user.account.isActive = true;
                    yield user.save();
                    yield user.account.save();
                    if (googleId !== String(user.googleId)) {
                        return { error: { code: common_1.errors.INTERNAL_SERVER_ERROR, message: "Something went wrong" } };
                    }
                }
                catch (err) {
                    return { error: { message: `Something went wrong: ${err.message}` } };
                }
                res.clearCookie("gstate", { httpOnly: true, maxAge: 310000 });
                res.clearCookie("gcode_verifier", { httpOnly: true, maxAge: 310000 });
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
            type: types_2.OAuthAuthorizationResult,
            description: "Authorize a user with Facebook",
            nullable: false,
            args: {
                code: schema_1.stringArg({ required: true, description: "The response code from Google's OAuth callback" }),
                state: schema_1.stringArg({ required: true, description: "The response state, to check if everything went correct" }),
                loginDetails: schema_1.arg({
                    type: types_1.UserLoginDetailsInput,
                    required: false,
                    description: "User details in login",
                }),
                isPrimaryOwner: schema_1.booleanArg({
                    required: false,
                    default: false,
                    description: "Set to true if you want to sign up an owner for a #beach_bar",
                }),
            },
            resolve: (_, { code, state, loginDetails, isPrimaryOwner }, { req, res, uaParser, redis, ipAddr }) => __awaiter(this, void 0, void 0, function* () {
                if (!code || code.trim().length === 0) {
                    return { error: { code: common_1.errors.INTERNAL_SERVER_ERROR, message: common_1.errors.SOMETHING_WENT_WRONG } };
                }
                if (!state || state.trim().length === 0) {
                    return { error: { code: common_1.errors.INTERNAL_SERVER_ERROR, message: common_1.errors.SOMETHING_WENT_WRONG } };
                }
                if (state !== req.cookies.fbstate) {
                    return {
                        error: {
                            code: common_1.errors.INTERNAL_SERVER_ERROR,
                            message: `${common_1.errors.SOMETHING_WENT_WRONG}. Please try again`,
                        },
                    };
                }
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
                    else {
                        success = false;
                    }
                })
                    .catch(err => {
                    return { error: { message: `${common_1.errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
                });
                if (!success || !facebookAccessToken) {
                    return { error: { code: common_1.errors.INTERNAL_SERVER_ERROR, message: common_1.errors.SOMETHING_WENT_WRONG } };
                }
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
                        !data.is_valid) {
                        success = false;
                    }
                    else {
                        success = true;
                    }
                })
                    .catch(err => {
                    return { error: { message: `Something went wrong: ${err.message}` } };
                });
                if (!success) {
                    return { error: { code: common_1.errors.INTERNAL_SERVER_ERROR, message: common_1.errors.SOMETHING_WENT_WRONG } };
                }
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
                    if (!data || !data.id || data.id === ("" || " ") || data.email === ("" || " ")) {
                        success = false;
                    }
                    else {
                        success = true;
                        facebookId = data.id;
                        facebookEmail = data.email;
                        firstName = data.first_name;
                        lastName = data.last_name;
                        if (data.birthday) {
                            birthday = dayjs_1.default(data.birthday).toDate();
                        }
                        if (data.picture && !data.picture.is_silhouette) {
                            pictureUrl = data.picture.data.url;
                        }
                    }
                })
                    .catch(err => {
                    return { error: { message: `Something went wrong: ${err.message}` } };
                });
                if (!success || !facebookEmail || !facebookId) {
                    return { error: { code: common_1.errors.INTERNAL_SERVER_ERROR, message: common_1.errors.SOMETHING_WENT_WRONG } };
                }
                const { osId, browserId, countryId, cityId } = userCommon_1.findLoginDetails({ details: loginDetails, uaParser });
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
                        cityId,
                        birthday,
                    });
                    if (response.error && !response.user) {
                        return { error: { code: response.error.code, message: response.error.message } };
                    }
                    user = yield User_1.User.findOne({ where: { email: facebookEmail }, relations: ["account"] });
                }
                if (!user) {
                    return {
                        error: { code: common_1.errors.INTERNAL_SERVER_ERROR, message: common_1.errors.SOMETHING_WENT_WRONG },
                    };
                }
                if (!user.account) {
                    return { error: { code: common_1.errors.INTERNAL_SERVER_ERROR, message: "Something went wrong" } };
                }
                yield userCommon_1.createUserLoginDetails(LoginDetails_1.LoginDetailStatus.loggedIn, platformNames_1.default.FACEBOOK, user.account, osId, browserId, countryId, cityId, ipAddr);
                const scope = yield redis.smembers(user.getRedisKey(true));
                const refreshToken = generateAuthTokens_1.generateRefreshToken(user);
                const accessToken = generateAuthTokens_1.generateAccessToken(user, scope);
                sendRefreshToken_1.sendRefreshToken(res, refreshToken.token);
                try {
                    yield redis.hset(user.getRedisKey(), "access_token", accessToken.token);
                    yield redis.hset(user.getRedisKey(), "refresh_token", refreshToken.token);
                    user.facebookId = facebookId;
                    user.account.isActive = true;
                    if (birthday && !user.account.birthday) {
                        user.account.birthday = birthday;
                    }
                    if (pictureUrl && !user.account.imgUrl) {
                        user.account.imgUrl = pictureUrl;
                    }
                    yield user.save();
                    yield user.account.save();
                    if (facebookId !== String(user.facebookId)) {
                        return { error: { code: common_1.errors.INTERNAL_SERVER_ERROR, message: "Something went wrong" } };
                    }
                }
                catch (err) {
                    yield userCommon_1.createUserLoginDetails(LoginDetails_1.LoginDetailStatus.failed, platformNames_1.default.BEACH_BAR, user.account, osId, browserId, countryId, cityId, ipAddr);
                    return { error: { message: `${common_1.errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
                }
                res.clearCookie("fbstate", { httpOnly: true, maxAge: 310000 });
                return {
                    user,
                    accessToken: accessToken.token,
                    signedUp,
                    logined: true,
                };
            }),
        });
        t.field("authorizeWithInstagram", {
            type: types_2.OAuthAuthorizationResult,
            description: "Authorize a user with Instagram",
            nullable: false,
            args: {
                email: schema_1.arg({ type: common_2.EmailScalar, required: true, description: "Email address of user to authorize with Instagram" }),
                code: schema_1.stringArg({ required: true, description: "The response code from Google's OAuth callback" }),
                state: schema_1.stringArg({ required: true, description: "The response state, to check if everything went correct" }),
                loginDetails: schema_1.arg({
                    type: types_1.UserLoginDetailsInput,
                    required: false,
                    description: "User details in login",
                }),
                isPrimaryOwner: schema_1.booleanArg({
                    required: false,
                    default: false,
                    description: "Set to true if you want to sign up an owner for a #beach_bar",
                }),
            },
            resolve: (_, { email, code, state, loginDetails, isPrimaryOwner }, { req, res, uaParser, redis, ipAddr }) => __awaiter(this, void 0, void 0, function* () {
                if (!email || email.trim().length === 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid email address" } };
                }
                if (!code || code.trim().length === 0) {
                    return { error: { code: common_1.errors.INTERNAL_SERVER_ERROR, message: common_1.errors.SOMETHING_WENT_WRONG } };
                }
                if (!state || state.trim().length === 0) {
                    return { error: { code: common_1.errors.INTERNAL_SERVER_ERROR, message: common_1.errors.SOMETHING_WENT_WRONG } };
                }
                if (state !== req.cookies.instastate) {
                    return {
                        error: {
                            code: common_1.errors.INTERNAL_SERVER_ERROR,
                            message: `${common_1.errors.SOMETHING_WENT_WRONG}. Please try again`,
                        },
                    };
                }
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
                    else {
                        success = false;
                    }
                })
                    .catch(err => {
                    return { error: { message: `Something went wrong: ${err.message}` } };
                });
                if (!success || !instagramAccessToken || !instagramUserId) {
                    return { error: { code: common_1.errors.INTERNAL_SERVER_ERROR, message: common_1.errors.SOMETHING_WENT_WRONG } };
                }
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
                    if (!data || !data.id || data.id === ("" || " ")) {
                        success = false;
                    }
                    else {
                        success = true;
                        instagramId = data.id;
                        instagramUsername = data.username;
                    }
                })
                    .catch(err => {
                    return { error: { message: `Something went wrong: ${err.message}` } };
                });
                if (!success || !instagramId || String(instagramId) !== String(instagramUserId)) {
                    return { error: { code: common_1.errors.INTERNAL_SERVER_ERROR, message: common_1.errors.SOMETHING_WENT_WRONG } };
                }
                const { osId, browserId, countryId, cityId } = userCommon_1.findLoginDetails({ details: loginDetails, uaParser });
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
                        cityId,
                    });
                    if (response.error && !response.user) {
                        return { error: { code: response.error.code, message: response.error.message } };
                    }
                    user = yield User_1.User.findOne({ where: { email, instagramUsername }, relations: ["account"] });
                }
                if (!user || !user.account) {
                    return {
                        error: { code: common_1.errors.INTERNAL_SERVER_ERROR, message: common_1.errors.SOMETHING_WENT_WRONG },
                    };
                }
                yield userCommon_1.createUserLoginDetails(LoginDetails_1.LoginDetailStatus.loggedIn, platformNames_1.default.INSTAGRAM, user.account, osId, browserId, countryId, cityId, ipAddr);
                const scope = yield redis.smembers(user.getRedisKey());
                const refreshToken = generateAuthTokens_1.generateRefreshToken(user);
                const accessToken = generateAuthTokens_1.generateAccessToken(user, scope);
                sendRefreshToken_1.sendRefreshToken(res, refreshToken.token);
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
                    if (instagramId !== String(user.instagramId)) {
                        return { error: { code: common_1.errors.INTERNAL_SERVER_ERROR, message: "Something went wrong" } };
                    }
                }
                catch (err) {
                    yield userCommon_1.createUserLoginDetails(LoginDetails_1.LoginDetailStatus.failed, platformNames_1.default.BEACH_BAR, user.account, osId, browserId, countryId, cityId, ipAddr);
                    return { error: { message: `${common_1.errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
                }
                res.clearCookie("instastate", { httpOnly: true, maxAge: 310000 });
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
//# sourceMappingURL=mutation.js.map