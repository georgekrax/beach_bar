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
exports.UserCrudMutation = exports.UserForgotPasswordMutation = exports.UserLogoutMutation = exports.UserSignUpAndLoginMutation = void 0;
const common_1 = require("@beach_bar/common");
const graphql_1 = require("@the_hashtag/common/dist/graphql");
const apollo_link_1 = require("apollo-link");
const crypto_1 = require("crypto");
const LoginDetails_1 = require("entity/LoginDetails");
const nexus_1 = require("nexus");
const apolloLink_1 = require("../../config/apolloLink");
const platformNames_1 = __importDefault(require("../../config/platformNames"));
const redisKeys_1 = __importDefault(require("../../constants/redisKeys"));
const City_1 = require("../../entity/City");
const Country_1 = require("../../entity/Country");
const User_1 = require("../../entity/User");
const AUTHORIZE_WITH_HASHTAG_1 = __importDefault(require("../../graphql/AUTHORIZE_WITH_HASHTAG"));
const CHANGE_USER_PASSWORD_1 = __importDefault(require("../../graphql/CHANGE_USER_PASSWORD"));
const EXCHANGE_CODE_1 = __importDefault(require("../../graphql/EXCHANGE_CODE"));
const LOGOUT_USER_1 = __importDefault(require("../../graphql/LOGOUT_USER"));
const SEND_FORGOT_PASSWORD_LINK_1 = __importDefault(require("../../graphql/SEND_FORGOT_PASSWORD_LINK"));
const SIGN_UP_USER_1 = __importDefault(require("../../graphql/SIGN_UP_USER"));
const TOKEN_INFO_1 = __importDefault(require("../../graphql/TOKEN_INFO"));
const UPDATE_USER_1 = __importDefault(require("../../graphql/UPDATE_USER"));
const generateAuthTokens_1 = require("../../utils/auth/generateAuthTokens");
const sendRefreshToken_1 = require("../../utils/auth/sendRefreshToken");
const signUpUser_1 = require("../../utils/auth/signUpUser");
const userCommon_1 = require("../../utils/auth/userCommon");
const removeUserSessions_1 = require("../../utils/removeUserSessions");
const types_1 = require("../types");
const types_2 = require("./types");
exports.UserSignUpAndLoginMutation = nexus_1.extendType({
    type: "Mutation",
    definition(t) {
        t.field("signUp", {
            type: types_2.UserSignUpResult,
            description: "Sign up a user",
            args: {
                userCredentials: nexus_1.arg({
                    type: types_2.UserCredentialsInput,
                    description: "Credential for signing up a user",
                }),
                isPrimaryOwner: nexus_1.nullable(nexus_1.booleanArg({
                    default: false,
                    description: "Set to true if you want to sign up an owner for a #beach_bar",
                })),
            },
            resolve: (_, { userCredentials, isPrimaryOwner }, { redis }) => __awaiter(this, void 0, void 0, function* () {
                const { email, password } = userCredentials;
                if (!email || email.trim().length === 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid email address" } };
                }
                if (!password || password.trim().length === 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid password" } };
                }
                const operation = {
                    query: SIGN_UP_USER_1.default,
                    variables: {
                        clientId: process.env.HASHTAG_CLIENT_ID.toString(),
                        clientSecret: process.env.HASHTAG_CLIENT_SECRET.toString(),
                        email,
                        password,
                    },
                };
                let hashtagUser, added, errorCode, errorMessage;
                yield apollo_link_1.makePromise(apollo_link_1.execute(apolloLink_1.link, operation))
                    .then(res => { var _a; return (_a = res.data) === null || _a === void 0 ? void 0 : _a.signUpUser; })
                    .then(data => {
                    if (data.error) {
                        errorCode = data.error.code;
                        errorMessage = data.error.message;
                    }
                    hashtagUser = data.user;
                    added = data.added;
                })
                    .catch(err => {
                    return { error: { message: `Something went wrong: ${err.message}` } };
                });
                if ((errorCode || errorMessage) &&
                    errorCode !== common_1.errors.CONFLICT &&
                    errorMessage !== "User already exists" &&
                    !added &&
                    !hashtagUser) {
                    return { error: { code: errorCode, message: errorMessage } };
                }
                if (email !== hashtagUser.email || hashtagUser.id.trim().length === 0) {
                    return { error: { message: common_1.errors.SOMETHING_WENT_WRONG } };
                }
                let country, city;
                if (hashtagUser.country && hashtagUser.country.id) {
                    country = yield Country_1.Country.findOne(hashtagUser.country.id);
                }
                if (hashtagUser.city && hashtagUser.city.id) {
                    city = yield City_1.City.findOne(hashtagUser.city.id);
                }
                const response = yield signUpUser_1.signUpUser({
                    email: hashtagUser.email,
                    redis,
                    isPrimaryOwner,
                    hashtagId: hashtagUser.id,
                    countryId: country ? country.id : undefined,
                    cityId: city ? city.id : undefined,
                    birthday: hashtagUser.birthday,
                });
                if (response.error && !response.user) {
                    return { error: { code: response.error.code, message: response.error.message } };
                }
                return {
                    user: response.user,
                };
            }),
        });
        t.field("login", {
            type: types_2.UserLoginResult,
            description: "Login a user",
            args: {
                loginDetails: nexus_1.nullable(nexus_1.arg({
                    type: types_2.UserLoginDetailsInput,
                    description: "User details in login",
                })),
                userCredentials: nexus_1.arg({
                    type: types_2.UserCredentialsInput,
                    description: "Credential for signing up a user",
                }),
            },
            resolve: (_, { loginDetails, userCredentials }, { res, redis, uaParser, ipAddr }) => __awaiter(this, void 0, void 0, function* () {
                const { email, password } = userCredentials;
                if (!email || email.length === 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid email address" } };
                }
                if (!password || password.length === 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid password" } };
                }
                const { osId, browserId, countryId, cityId } = userCommon_1.findLoginDetails({ details: loginDetails, uaParser });
                const user = yield User_1.User.findOne({ where: { email }, relations: ["account"] });
                if (!user) {
                    return {
                        error: {
                            code: common_1.errors.NOT_FOUND,
                            message: common_1.errors.USER_NOT_FOUND_MESSAGE,
                        },
                    };
                }
                if (user.googleId && !user.hashtagId) {
                    return {
                        error: { code: common_1.errors.GOOGLE_AUTHENTICATED_CODE, message: "You have authenticated with Google" },
                    };
                }
                else if (user.facebookId && !user.hashtagId) {
                    return {
                        error: { code: common_1.errors.FACEBOOK_AUTHENTICATED_CODE, message: "You have authenticated with Facebook" },
                    };
                }
                else if (user.instagramId && !user.hashtagId) {
                    return {
                        error: { code: common_1.errors.INSTAGRAM_AUTHENTICATED_CODE, message: "You have authenticated with Instagram" },
                    };
                }
                const state = crypto_1.createHash("sha256").update(crypto_1.randomBytes(1024)).digest("hex");
                const scope = yield redis.smembers(`${redisKeys_1.default.USER}:${user.id}:${redisKeys_1.default.USER_SCOPE}`);
                const authorizeWithHashtagOperation = {
                    query: AUTHORIZE_WITH_HASHTAG_1.default,
                    variables: {
                        clientId: process.env.HASHTAG_CLIENT_ID.toString(),
                        scope,
                        redirectUri: process.env.HASHTAG_REDIRECT_URI.toString(),
                        originUri: process.env.HASHTAG_ORIGIN_URI.toString(),
                        state,
                        email,
                        password,
                        osId,
                        browserId,
                        countryId,
                        cityId,
                        ipAddr,
                    },
                };
                let hashtagEmail = undefined, hashtagId = undefined, hashtagState = undefined, hashtagScope = undefined, code = undefined, prompt = undefined, errorCode = undefined, errorMessage = undefined;
                yield apollo_link_1.makePromise(apollo_link_1.execute(apolloLink_1.link, authorizeWithHashtagOperation))
                    .then(res => { var _a; return (_a = res.data) === null || _a === void 0 ? void 0 : _a.authorizeWithHashtag; })
                    .then(data => {
                    if (data.error) {
                        errorCode = data.error.code;
                        errorMessage = data.error.message;
                    }
                    hashtagEmail = data.user.email;
                    hashtagId = data.user.id;
                    hashtagState = data.state;
                    hashtagScope = data.scope;
                    code = data.code;
                    prompt = data.prompt.none;
                })
                    .catch(err => {
                    return { error: { message: `Something went wrong: ${err.message}` } };
                });
                if (errorCode || errorMessage) {
                    if (errorMessage === common_1.errors.INVALID_PASSWORD_MESSAGE || errorCode === common_1.errors.INVALID_PASSWORD_CODE) {
                        yield userCommon_1.createUserLoginDetails(LoginDetails_1.LoginDetailStatus.invalidPassword, platformNames_1.default.BEACH_BAR, user.account, osId, browserId, countryId, cityId, ipAddr);
                    }
                    else {
                        yield userCommon_1.createUserLoginDetails(LoginDetails_1.LoginDetailStatus.failed, platformNames_1.default.BEACH_BAR, user.account, osId, browserId, countryId, cityId, ipAddr);
                    }
                    if (errorCode === common_1.errors.SCOPE_MISMATCH) {
                        return { error: { code: common_1.errors.INTERNAL_SERVER_ERROR, message: common_1.errors.SOMETHING_WENT_WRONG } };
                    }
                    return { error: { code: errorCode, message: errorMessage } };
                }
                if (state !== hashtagState ||
                    !code ||
                    code.trim().length === 0 ||
                    prompt !== true ||
                    JSON.stringify(scope) !== JSON.stringify(hashtagScope)) {
                    return { error: { message: common_1.errors.SOMETHING_WENT_WRONG } };
                }
                if (String(hashtagId) !== String(user.hashtagId) || email !== hashtagEmail) {
                    return { error: { message: common_1.errors.SOMETHING_WENT_WRONG } };
                }
                const exchangeCodeOperation = {
                    query: EXCHANGE_CODE_1.default,
                    variables: {
                        clientId: process.env.HASHTAG_CLIENT_ID.toString(),
                        clientSecret: process.env.HASHTAG_CLIENT_SECRET.toString(),
                        code,
                    },
                };
                let hashtagAccessToken = undefined, hashtagRefreshToken = undefined, idToken = undefined;
                yield apollo_link_1.makePromise(apollo_link_1.execute(apolloLink_1.link, exchangeCodeOperation))
                    .then(res => { var _a; return (_a = res.data) === null || _a === void 0 ? void 0 : _a.exchangeCode; })
                    .then(data => {
                    if (data.error) {
                        errorCode = data.error.code;
                        errorMessage = data.error.message;
                    }
                    hashtagAccessToken = data.tokens[0];
                    hashtagRefreshToken = data.tokens[1];
                    idToken = data.tokens[2];
                })
                    .catch(err => {
                    return { error: { message: `${common_1.errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
                });
                if (errorCode || errorMessage) {
                    yield userCommon_1.createUserLoginDetails(LoginDetails_1.LoginDetailStatus.failed, platformNames_1.default.BEACH_BAR, user.account, osId, browserId, countryId, cityId, ipAddr);
                    return {
                        error: { code: errorCode, message: errorMessage },
                    };
                }
                if (!hashtagAccessToken || !hashtagRefreshToken || !idToken) {
                    return { error: { code: common_1.errors.INTERNAL_SERVER_ERROR, message: common_1.errors.SOMETHING_WENT_WRONG } };
                }
                const tokenInfoOperation = {
                    query: TOKEN_INFO_1.default,
                    variables: {
                        token: idToken.token,
                    },
                };
                let tokenInfo = undefined;
                yield apollo_link_1.makePromise(apollo_link_1.execute(apolloLink_1.link, tokenInfoOperation))
                    .then(res => { var _a; return (_a = res.data) === null || _a === void 0 ? void 0 : _a.tokenInfo; })
                    .then(data => {
                    if (data.error) {
                        errorCode = data.error.code;
                        errorMessage = data.error.message;
                    }
                    tokenInfo = data;
                })
                    .catch(err => {
                    return { error: { message: `${common_1.errors.SOMETHING_WENT_WRONG}: ${err.message}` } };
                });
                if (errorCode || errorMessage) {
                    yield userCommon_1.createUserLoginDetails(LoginDetails_1.LoginDetailStatus.failed, platformNames_1.default.BEACH_BAR, user.account, osId, browserId, countryId, cityId, ipAddr);
                    return { error: { code: errorCode, message: errorMessage } };
                }
                if (!tokenInfo ||
                    tokenInfo.email !== user.email ||
                    tokenInfo.sub !== user.hashtagId ||
                    tokenInfo.iss !== process.env.HASHTAG_TOKEN_ISSUER.toString() ||
                    tokenInfo.aud !== process.env.HASHTAG_CLIENT_ID.toString()) {
                    return { error: { code: common_1.errors.INTERNAL_SERVER_ERROR, message: common_1.errors.SOMETHING_WENT_WRONG } };
                }
                if (tokenInfo.firstName || tokenInfo.lastName || tokenInfo.pictureUrl || tokenInfo.locale) {
                    if (tokenInfo.firstName && !user.firstName) {
                        user.firstName = tokenInfo.firstName;
                    }
                    if (tokenInfo.lastName && !user.lastName) {
                        user.lastName = tokenInfo.lastName;
                    }
                    if (tokenInfo.pictureUrl && !user.account.imgUrl) {
                        user.account.imgUrl = tokenInfo.pictureUrl;
                    }
                    if (tokenInfo.locale && !user.account.country) {
                        const country = yield Country_1.Country.findOne({ where: { languageIdentifier: tokenInfo.locale } });
                        if (country) {
                            user.account.country = country;
                        }
                    }
                }
                yield userCommon_1.createUserLoginDetails(LoginDetails_1.LoginDetailStatus.loggedIn, platformNames_1.default.BEACH_BAR, user.account, osId, browserId, countryId, cityId, ipAddr);
                const refreshToken = generateAuthTokens_1.generateRefreshToken(user);
                const accessToken = generateAuthTokens_1.generateAccessToken(user, scope);
                sendRefreshToken_1.sendRefreshToken(res, refreshToken.token);
                try {
                    yield redis.hset(user.getRedisKey(), "access_token", accessToken.token);
                    yield redis.hset(user.getRedisKey(), "refresh_token", refreshToken.token);
                    yield redis.hset(user.getRedisKey(), "hashtag_access_token", hashtagAccessToken.token);
                    yield redis.hset(user.getRedisKey(), "hashtag_refresh_token", hashtagRefreshToken.token);
                    user.account.isActive = true;
                    yield user.save();
                    yield user.account.save();
                }
                catch (err) {
                    return { error: { message: `Something went wrong. ${err}` } };
                }
                return {
                    user,
                    accessToken: accessToken.token,
                };
            }),
        });
    },
});
exports.UserLogoutMutation = nexus_1.extendType({
    type: "Mutation",
    definition(t) {
        t.field("logout", {
            type: types_1.SuccessResult,
            description: "Logout a user",
            resolve: (_, __, { res, payload, redis }) => __awaiter(this, void 0, void 0, function* () {
                if (!payload) {
                    return { error: { code: common_1.errors.NOT_AUTHENTICATED_CODE, message: common_1.errors.NOT_AUTHENTICATED_MESSAGE } };
                }
                const redisUser = yield redis.hgetall(`${redisKeys_1.default.USER}:${payload.sub.toString()}`);
                if (!redisUser) {
                    return { error: { message: "Something went wrong" } };
                }
                if (redisUser.hashtag_access_token && redisUser.hashtag_access_token !== "" && redisUser.hashtag_access_token !== " ") {
                    const hashtagAccessToken = redisUser.hashtag_access_token;
                    const logoutOperation = {
                        query: LOGOUT_USER_1.default,
                        variables: {
                            clientId: process.env.HASHTAG_CLIENT_ID.toString(),
                            clientSecret: process.env.HASHTAG_CLIENT_SECRET.toString(),
                        },
                        context: {
                            headers: {
                                authorization: `Bearer ${hashtagAccessToken}`,
                            },
                        },
                    };
                    let success = undefined, errorCode = undefined, errorMessage = undefined;
                    yield apollo_link_1.makePromise(apollo_link_1.execute(apolloLink_1.link, logoutOperation))
                        .then(res => { var _a; return (_a = res.data) === null || _a === void 0 ? void 0 : _a.logoutUser; })
                        .then(data => {
                        if (data.error) {
                            errorCode = data.error.code;
                            errorMessage = data.error.message;
                        }
                        success = data.success;
                    })
                        .catch(err => {
                        return { error: { message: `Something went wrong. ${err}` } };
                    });
                    if ((errorCode || errorMessage) && !success) {
                        return { error: { code: errorCode, message: errorMessage } };
                    }
                }
                try {
                    yield removeUserSessions_1.removeUserSessions(payload.sub, redis);
                }
                catch (err) {
                    return { error: { message: `Something went wrong. ${err}` } };
                }
                res.clearCookie(process.env.REFRESH_TOKEN_COOKIE_NAME.toString(), { httpOnly: true });
                return {
                    success: true,
                };
            }),
        });
    },
});
exports.UserForgotPasswordMutation = nexus_1.extendType({
    type: "Mutation",
    definition(t) {
        t.field("sendForgotPasswordLink", {
            type: types_1.SuccessResult,
            description: "Sends a link to the user's email address to change its password",
            args: {
                email: nexus_1.arg({
                    type: graphql_1.EmailScalar,
                    description: "The email address of user",
                }),
            },
            resolve: (_, { email }, { res, redis }) => __awaiter(this, void 0, void 0, function* () {
                if (!email || email.trim().length === 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid email address" } };
                }
                const user = yield User_1.User.findOne({
                    where: { email },
                    relations: ["account"],
                });
                if (!user) {
                    return {
                        error: { code: common_1.errors.NOT_FOUND, message: "User does not exist" },
                    };
                }
                if (!user.hashtagId) {
                    return {
                        error: { code: common_1.errors.HASHTAG_NOT_AUTHENTICATED_CODE, message: "You have not authenticated with #hashtag" },
                    };
                }
                const sendForgotPasswordLinkOperation = {
                    query: SEND_FORGOT_PASSWORD_LINK_1.default,
                    variables: {
                        email,
                    },
                };
                let success = undefined, errorCode = undefined, errorMessage = undefined;
                yield apollo_link_1.makePromise(apollo_link_1.execute(apolloLink_1.link, sendForgotPasswordLinkOperation))
                    .then(res => { var _a; return (_a = res.data) === null || _a === void 0 ? void 0 : _a.sendForgotPasswordLink; })
                    .then(data => {
                    if (data.error) {
                        errorCode = data.error.code;
                        errorMessage = data.error.message;
                    }
                    success = data.success;
                })
                    .catch(err => {
                    return { error: { message: `Something went wrong. ${err}` } };
                });
                if (errorCode || errorMessage) {
                    return { error: { code: errorCode, message: errorMessage } };
                }
                if (!success) {
                    return { error: { message: "Something went wrong" } };
                }
                try {
                    yield removeUserSessions_1.removeUserSessions(user.id, redis);
                }
                catch (err) {
                    return { error: { message: `Something went wrong. ${err}` } };
                }
                res.clearCookie(process.env.REFRESH_TOKEN_COOKIE_NAME.toString(), { httpOnly: true });
                return {
                    success,
                };
            }),
        });
        t.field("changeUserPassword", {
            type: types_1.SuccessResult,
            description: "Change a user's password",
            args: {
                email: nexus_1.arg({
                    type: graphql_1.EmailScalar,
                    description: "Email of user to retrieve OAuth Client applications",
                }),
                key: nexus_1.stringArg({
                    description: "The key in the URL to identify and verify user. Each key lasts 20 minutes",
                }),
                newPassword: nexus_1.stringArg({
                    description: "User's new password",
                }),
            },
            resolve: (_, { email, key, newPassword }) => __awaiter(this, void 0, void 0, function* () {
                if (!email || email.trim().length === 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid email address" } };
                }
                if (!newPassword || newPassword.trim().length === 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid newPassword" } };
                }
                if (!key || key.trim().length === 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid key" } };
                }
                const user = yield User_1.User.findOne({
                    where: { email },
                    relations: ["account"],
                });
                if (!user) {
                    return {
                        error: { code: common_1.errors.NOT_FOUND, message: "User does not exist" },
                    };
                }
                if (!user.hashtagId) {
                    return {
                        error: { code: common_1.errors.HASHTAG_NOT_AUTHENTICATED_CODE, message: "You have not authenticated with #hashtag" },
                    };
                }
                const changeUserPasswordOperation = {
                    query: CHANGE_USER_PASSWORD_1.default,
                    variables: {
                        email,
                        key,
                        newPassword,
                    },
                };
                let success = undefined, errorCode = undefined, errorMessage = undefined;
                yield apollo_link_1.makePromise(apollo_link_1.execute(apolloLink_1.link, changeUserPasswordOperation))
                    .then(res => { var _a; return (_a = res.data) === null || _a === void 0 ? void 0 : _a.changeUserPassword; })
                    .then(data => {
                    if (data.error) {
                        errorCode = data.error.code;
                        errorMessage = data.error.message;
                    }
                    success = data.success;
                })
                    .catch(err => {
                    return { error: { message: `Something went wrong. ${err}` } };
                });
                if (errorCode || errorMessage) {
                    return { error: { code: errorCode, message: errorMessage } };
                }
                if (!success) {
                    return { error: { message: "Something went wrong" } };
                }
                return {
                    success,
                };
            }),
        });
    },
});
exports.UserCrudMutation = nexus_1.extendType({
    type: "Mutation",
    definition(t) {
        t.field("updateUser", {
            type: types_2.UserUpdateResult,
            description: "Update a user's info",
            args: {
                email: nexus_1.nullable(nexus_1.arg({ type: graphql_1.EmailScalar })),
                firstName: nexus_1.nullable(nexus_1.stringArg()),
                lastName: nexus_1.nullable(nexus_1.stringArg()),
                imgUrl: nexus_1.nullable(nexus_1.arg({ type: graphql_1.UrlScalar })),
                personTitle: nexus_1.nullable(nexus_1.stringArg({ description: "The honorific title of the user" })),
                birthday: nexus_1.nullable(nexus_1.arg({
                    type: graphql_1.DateScalar,
                    description: "User's birthday in the date format",
                })),
                countryId: nexus_1.nullable(nexus_1.intArg({ description: "The country of user" })),
                cityId: nexus_1.nullable(nexus_1.intArg({ description: "The city or hometown of user" })),
                address: nexus_1.nullable(nexus_1.stringArg({ description: "User's house or office street address" })),
                zipCode: nexus_1.nullable(nexus_1.stringArg({ description: "User's house or office zip code" })),
                trackHistory: nexus_1.nullable(nexus_1.booleanArg({ description: "Indicates if to track user's history" })),
            },
            resolve: (_, { email, firstName, lastName, imgUrl, personTitle, birthday, countryId, cityId, address, zipCode, trackHistory }, { payload, redis, stripe }) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c;
                if (!payload) {
                    return { error: { code: common_1.errors.NOT_AUTHENTICATED_CODE, message: common_1.errors.NOT_AUTHENTICATED_MESSAGE } };
                }
                if (!payload.scope.some(scope => ["beach_bar@crud:user"].includes(scope))) {
                    return {
                        error: {
                            code: common_1.errors.UNAUTHORIZED_CODE,
                            message: "You are not allowed to update a user",
                        },
                    };
                }
                if (email && email.trim().length === 0) {
                    return { error: { code: common_1.errors.INVALID_ARGUMENTS, message: "Please provide a valid email address" } };
                }
                const user = yield User_1.User.findOne({
                    where: { id: payload.sub },
                    relations: ["account", "account.country", "account.city", "account.preferences", "customer", "reviews", "reviews.visitType"],
                });
                if (!user) {
                    return { error: { code: common_1.errors.NOT_FOUND, message: common_1.errors.USER_NOT_FOUND_MESSAGE } };
                }
                let isNew = false;
                try {
                    const response = yield user.update({
                        email,
                        firstName,
                        lastName,
                        imgUrl,
                        personTitle,
                        birthday,
                        address,
                        zipCode,
                        countryId,
                        cityId,
                        trackHistory,
                    });
                    const { user: updatedUser, isNew: updated } = response;
                    isNew = updated;
                    if (isNew && user.customer) {
                        let name = undefined;
                        const { email: uEmail, firstName: uFirstName, lastName: uLastName, account: uAccount } = updatedUser;
                        if (uFirstName || uLastName) {
                            name = `${uFirstName ? uFirstName : ""}${uFirstName && uLastName ? " " : ""}${uLastName ? uLastName : ""}`;
                        }
                        yield stripe.customers.update(user.customer.stripeCustomerId, {
                            email: uEmail,
                            name,
                            address: {
                                line1: uAccount.address || "",
                                country: ((_a = uAccount.country) === null || _a === void 0 ? void 0 : _a.isoCode) || undefined,
                                city: ((_b = uAccount.city) === null || _b === void 0 ? void 0 : _b.name) || undefined,
                                postal_code: uAccount.zipCode || undefined,
                            },
                            phone: uAccount.contactDetails ? (_c = uAccount.contactDetails) === null || _c === void 0 ? void 0 : _c[0].phoneNumber : undefined,
                        });
                    }
                }
                catch (err) {
                    return {
                        error: { message: `Something went wrong: ${err.message}` },
                    };
                }
                const redisUser = yield redis.hgetall(user.getRedisKey());
                if (!redisUser) {
                    return { error: { message: common_1.errors.SOMETHING_WENT_WRONG } };
                }
                if (redisUser.hashtag_access_token &&
                    redisUser.hashtag_access_token !== "" &&
                    redisUser.hashtag_access_token !== " " &&
                    isNew) {
                    const hashtagAccessToken = redisUser.hashtag_access_token;
                    const updateUserOperation = {
                        query: UPDATE_USER_1.default,
                        variables: {
                            email: user.email,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            pictureUrl: user.account.imgUrl,
                            countryId: user.account.countryId,
                            cityId: user.account.cityId,
                            birthday: user.account.birthday,
                        },
                        context: {
                            headers: {
                                authorization: `Bearer ${hashtagAccessToken}`,
                            },
                        },
                    };
                    let hashtagUser = undefined, updated = undefined, errorCode = undefined, errorMessage = undefined;
                    yield apollo_link_1.makePromise(apollo_link_1.execute(apolloLink_1.link, updateUserOperation))
                        .then(res => { var _a; return (_a = res.data) === null || _a === void 0 ? void 0 : _a.updateUser; })
                        .then(data => {
                        if (data.error) {
                            errorCode = data.error.code;
                            errorMessage = data.error.message;
                        }
                        hashtagUser = data.user;
                        updated = data.updated;
                    })
                        .catch(err => {
                        return { error: { message: `Something went wrong. ${err}` } };
                    });
                    if (errorCode || errorMessage) {
                        return { error: { code: errorCode, message: errorMessage } };
                    }
                    if (!hashtagUser || String(hashtagUser.id) !== String(user.hashtagId) || !updated) {
                        return { error: { message: common_1.errors.SOMETHING_WENT_WRONG } };
                    }
                }
                return {
                    user,
                };
            }),
        });
        t.field("deleteUser", {
            type: types_1.DeleteResult,
            description: "Delete a user & its account",
            resolve: (_, __, { payload, redis, stripe }) => __awaiter(this, void 0, void 0, function* () {
                if (!payload) {
                    return { error: { code: common_1.errors.NOT_AUTHENTICATED_CODE, message: common_1.errors.NOT_AUTHENTICATED_MESSAGE } };
                }
                if (!payload.scope.some(scope => ["hashtag@delete:user_account", "beach_bar@crud:user"].includes(scope))) {
                    return {
                        error: {
                            code: common_1.errors.UNAUTHORIZED_CODE,
                            message: "You are not allowed to delete 'this' user's account",
                        },
                    };
                }
                const user = yield User_1.User.findOne({ where: { id: payload.sub }, relations: ["account", "customer"] });
                if (!user) {
                    return { error: { code: common_1.errors.NOT_FOUND, message: common_1.errors.USER_NOT_FOUND_MESSAGE } };
                }
                try {
                    if (user.customer) {
                        yield user.customer.customSoftRemove(stripe);
                    }
                    yield user.account.softRemove();
                    yield user.softRemove();
                    yield removeUserSessions_1.removeUserSessions(user.id, redis);
                }
                catch (err) {
                    return { error: { message: `Something went wrong: ${err.message}` } };
                }
                return {
                    deleted: true,
                };
            }),
        });
    },
});
