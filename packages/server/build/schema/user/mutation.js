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
const apollo_server_express_1 = require("apollo-server-express");
const crypto_1 = require("crypto");
const LoginDetails_1 = require("entity/LoginDetails");
const lib_1 = require("lib");
const nexus_1 = require("nexus");
const signUpUser_1 = require("utils/auth/signUpUser");
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
const sendCookieToken_1 = require("../../utils/auth/sendCookieToken");
const userCommon_1 = require("../../utils/auth/userCommon");
const removeUserSessions_1 = require("../../utils/removeUserSessions");
const types_1 = require("../types");
const types_2 = require("./types");
exports.UserSignUpAndLoginMutation = nexus_1.extendType({
    type: "Mutation",
    definition(t) {
        t.field("signUp", {
            type: types_2.UserType,
            description: "Sign up a user",
            args: {
                userCredentials: nexus_1.arg({
                    type: types_2.UserCredentials,
                    description: "Credential for signing up a user",
                }),
                isPrimaryOwner: nexus_1.nullable(nexus_1.booleanArg({
                    default: false,
                    description: "Set to true if you want to sign up an owner for a #beach_bar",
                })),
            },
            resolve: (_, { userCredentials, isPrimaryOwner }, { redis }) => __awaiter(this, void 0, void 0, function* () {
                const { email, password } = userCredentials;
                if (!email || email.trim().length === 0)
                    throw new apollo_server_express_1.UserInputError("Please provide a valid email address", { code: common_1.errors.INVALID_ARGUMENTS });
                if (!password || password.trim().length === 0)
                    throw new apollo_server_express_1.UserInputError("Please provide a valid password", { code: common_1.errors.INVALID_ARGUMENTS });
                try {
                    const { signUpUser } = yield lib_1.graphqlClient.request(SIGN_UP_USER_1.default, {
                        clientId: process.env.HASHTAG_CLIENT_ID.toString(),
                        clientSecret: process.env.HASHTAG_CLIENT_SECRET.toString(),
                        email,
                        password,
                    });
                    if (signUpUser.error) {
                        const { message, code } = signUpUser.error;
                        if (message || code)
                            throw new apollo_server_express_1.ApolloError(message, code);
                    }
                    const { user: hashtagUser } = signUpUser;
                    if (!hashtagUser || email !== hashtagUser.email || String(hashtagUser.id).trim().length === 0)
                        throw new apollo_server_express_1.ApolloError(common_1.errors.SOMETHING_WENT_WRONG, common_1.errors.INTERNAL_SERVER_ERROR);
                    let country, city;
                    if (hashtagUser.country && hashtagUser.country.id)
                        country = yield Country_1.Country.findOne(hashtagUser.country.id);
                    if (hashtagUser.city && hashtagUser.city.id)
                        city = yield City_1.City.findOne(hashtagUser.city.id);
                    const response = yield signUpUser_1.signUpUser({
                        email: hashtagUser.email,
                        redis,
                        isPrimaryOwner,
                        hashtagId: hashtagUser.id,
                        countryId: country ? country.id : undefined,
                        city: city ? city : undefined,
                        birthday: hashtagUser.birthday,
                    });
                    if (response.error && !response.user)
                        throw new apollo_server_express_1.ApolloError(response.error.message, response.error.code);
                    return response.user;
                }
                catch (err) {
                    return err;
                }
            }),
        });
        t.field("login", {
            type: types_2.UserLoginType,
            description: "Login a user",
            args: {
                userCredentials: nexus_1.arg({
                    type: types_2.UserCredentials,
                    description: "Credential for signing up a user",
                }),
                loginDetails: nexus_1.nullable(nexus_1.arg({
                    type: types_2.UserLoginDetails,
                    description: "User details in login",
                })),
            },
            resolve: (_, { userCredentials, loginDetails }, { res, redis, uaParser, ipAddr }) => __awaiter(this, void 0, void 0, function* () {
                const { email, password } = userCredentials;
                if (!email || email.length === 0)
                    throw new apollo_server_express_1.UserInputError("Please provide a valid email address", { code: common_1.errors.INVALID_ARGUMENTS });
                if (!password || password.length === 0)
                    throw new apollo_server_express_1.UserInputError("Please provide a valid password", { code: common_1.errors.INVALID_PASSWORD_CODE });
                const { osId, browserId, countryId, city } = userCommon_1.findLoginDetails({ details: loginDetails, uaParser });
                const user = yield User_1.User.findOne({ where: { email }, relations: ["account"] });
                if (!user)
                    throw new apollo_server_express_1.ApolloError(common_1.errors.USER_NOT_FOUND_MESSAGE, common_1.errors.NOT_FOUND);
                if (user.googleId && !user.hashtagId)
                    throw new apollo_server_express_1.ApolloError("You have authenticated with Google", common_1.errors.GOOGLE_AUTHENTICATED_CODE);
                else if (user.facebookId && !user.hashtagId)
                    throw new apollo_server_express_1.ApolloError("You have authenticated with Facebook", common_1.errors.FACEBOOK_AUTHENTICATED_CODE);
                else if (user.instagramId && !user.hashtagId)
                    throw new apollo_server_express_1.ApolloError("You have authenticated with Instagram", common_1.errors.INSTAGRAM_AUTHENTICATED_CODE);
                const state = crypto_1.createHash("sha256").update(crypto_1.randomBytes(1024)).digest("hex");
                const scope = yield redis.smembers(`${redisKeys_1.default.USER}:${user.id}:${redisKeys_1.default.USER_SCOPE}`);
                let code, hashtagAccessToken, hashtagRefreshToken;
                try {
                    const { authorizeWithHashtag } = yield lib_1.graphqlClient.request(AUTHORIZE_WITH_HASHTAG_1.default, {
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
                        city,
                        ipAddr,
                    });
                    if (authorizeWithHashtag.error) {
                        const { message, code } = authorizeWithHashtag.error;
                        if (message === common_1.errors.INVALID_PASSWORD_MESSAGE || code === common_1.errors.INVALID_PASSWORD_CODE) {
                            yield userCommon_1.createUserLoginDetails(LoginDetails_1.LoginDetailStatus.invalidPassword, platformNames_1.default.BEACH_BAR, user.account, osId, browserId, countryId, city, ipAddr);
                        }
                        else {
                            yield userCommon_1.createUserLoginDetails(LoginDetails_1.LoginDetailStatus.failed, platformNames_1.default.BEACH_BAR, user.account, osId, browserId, countryId, city, ipAddr);
                        }
                        if (code === common_1.errors.SCOPE_MISMATCH)
                            throw new apollo_server_express_1.ApolloError(common_1.errors.SOMETHING_WENT_WRONG, common_1.errors.INTERNAL_SERVER_ERROR);
                        else
                            throw new apollo_server_express_1.ApolloError(message, code);
                    }
                    const { state: hashtagState, scope: hashtagScope, user: hashtagUser, prompt, code: hashtagCode } = authorizeWithHashtag;
                    code = hashtagCode;
                    if (state !== hashtagState ||
                        !code ||
                        code.trim().length === 0 ||
                        prompt.none !== true ||
                        JSON.stringify(scope) !== JSON.stringify(hashtagScope))
                        throw new apollo_server_express_1.ApolloError(common_1.errors.SOMETHING_WENT_WRONG, common_1.errors.SOMETHING_WENT_WRONG);
                    if (String(hashtagUser.id) !== String(user.hashtagId) || email !== hashtagUser.email)
                        throw new apollo_server_express_1.ApolloError(common_1.errors.SOMETHING_WENT_WRONG, common_1.errors.SOMETHING_WENT_WRONG);
                }
                catch (err) {
                    return err;
                }
                try {
                    const { exchangeCode } = yield lib_1.graphqlClient.request(EXCHANGE_CODE_1.default, {
                        clientId: process.env.HASHTAG_CLIENT_ID.toString(),
                        clientSecret: process.env.HASHTAG_CLIENT_SECRET.toString(),
                        code,
                    });
                    if (exchangeCode.error) {
                        const { message, code } = exchangeCode.error;
                        if (code || message) {
                            yield userCommon_1.createUserLoginDetails(LoginDetails_1.LoginDetailStatus.failed, platformNames_1.default.BEACH_BAR, user.account, osId, browserId, countryId, city, ipAddr);
                            throw new apollo_server_express_1.ApolloError(message, code);
                        }
                    }
                    const { tokens } = exchangeCode;
                    hashtagAccessToken = tokens[0];
                    hashtagRefreshToken = tokens[1];
                    const hashtagIdToken = tokens[2];
                    if (!hashtagAccessToken || !hashtagRefreshToken || !hashtagIdToken)
                        throw new apollo_server_express_1.ApolloError(common_1.errors.SOMETHING_WENT_WRONG, common_1.errors.INTERNAL_SERVER_ERROR);
                    const { tokenInfo } = yield lib_1.graphqlClient.request(TOKEN_INFO_1.default, {
                        token: hashtagIdToken.token,
                    });
                    if (tokenInfo.error) {
                        const { message, code } = exchangeCode.error;
                        if (code || message) {
                            yield userCommon_1.createUserLoginDetails(LoginDetails_1.LoginDetailStatus.failed, platformNames_1.default.BEACH_BAR, user.account, osId, browserId, countryId, city, ipAddr);
                            throw new apollo_server_express_1.ApolloError(message, code);
                        }
                    }
                    if (!tokenInfo ||
                        tokenInfo.email !== user.email ||
                        tokenInfo.sub !== user.hashtagId ||
                        tokenInfo.iss !== process.env.HASHTAG_TOKEN_ISSUER.toString() ||
                        tokenInfo.aud !== process.env.HASHTAG_CLIENT_ID.toString())
                        throw new apollo_server_express_1.ApolloError(common_1.errors.SOMETHING_WENT_WRONG, common_1.errors.INTERNAL_SERVER_ERROR);
                    if (tokenInfo.firstName || tokenInfo.lastName || tokenInfo.pictureUrl || tokenInfo.locale) {
                        if (tokenInfo.firstName && !user.firstName)
                            user.firstName = tokenInfo.firstName;
                        if (tokenInfo.lastName && !user.lastName)
                            user.lastName = tokenInfo.lastName;
                        if (tokenInfo.pictureUrl && !user.account.imgUrl)
                            user.account.imgUrl = tokenInfo.pictureUrl;
                        if (tokenInfo.locale && !user.account.country) {
                            const country = yield Country_1.Country.findOne({ where: { languageIdentifier: tokenInfo.locale } });
                            if (country)
                                user.account.country = country;
                        }
                    }
                }
                catch (err) {
                    return err;
                }
                yield userCommon_1.createUserLoginDetails(LoginDetails_1.LoginDetailStatus.loggedIn, platformNames_1.default.BEACH_BAR, user.account, osId, browserId, countryId, city, ipAddr);
                const refreshToken = generateAuthTokens_1.generateRefreshToken(user, "#beach_bar");
                const accessToken = generateAuthTokens_1.generateAccessToken(user, scope);
                sendCookieToken_1.sendCookieToken(res, refreshToken.token, "refresh");
                sendCookieToken_1.sendCookieToken(res, accessToken.token, "access");
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
                    throw new apollo_server_express_1.ApolloError(err, common_1.errors.SOMETHING_WENT_WRONG);
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
            type: types_1.SuccessGraphQLType,
            description: "Logout a user",
            resolve: (_, __, { res, payload, redis }) => __awaiter(this, void 0, void 0, function* () {
                if (!payload)
                    throw new apollo_server_express_1.AuthenticationError(common_1.errors.NOT_AUTHENTICATED_MESSAGE);
                const redisUser = yield redis.hgetall(`${redisKeys_1.default.USER}:${payload.sub.toString()}`);
                if (!redisUser)
                    throw new apollo_server_express_1.ApolloError(common_1.errors.SOMETHING_WENT_WRONG, common_1.errors.SOMETHING_WENT_WRONG);
                try {
                    if (redisUser.hashtag_access_token && redisUser.hashtag_access_token !== "" && redisUser.hashtag_access_token !== " ") {
                        const hashtagAccessToken = redisUser.hashtag_access_token;
                        const { logoutUser } = yield lib_1.graphqlClient.request(LOGOUT_USER_1.default, {
                            clientId: process.env.HASHTAG_CLIENT_ID.toString(),
                            clientSecret: process.env.HASHTAG_CLIENT_SECRET.toString(),
                        }, {
                            authorization: `Bearer ${hashtagAccessToken}`,
                        });
                        const success = logoutUser.success;
                        if (logoutUser.error) {
                            const { message, code } = logoutUser.error;
                            if ((message || code) && !success)
                                throw new apollo_server_express_1.ApolloError(message, code);
                        }
                        if (!success)
                            throw new apollo_server_express_1.ApolloError(common_1.errors.SOMETHING_WENT_WRONG, common_1.errors.SOMETHING_WENT_WRONG);
                    }
                    yield removeUserSessions_1.removeUserSessions(payload.sub, redis);
                }
                catch (err) {
                    return err;
                }
                res.clearCookie(process.env.REFRESH_TOKEN_COOKIE_NAME.toString(), { httpOnly: true });
                res.clearCookie(process.env.ACCESS_TOKEN_COOKIE_NAME.toString(), { httpOnly: true });
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
            type: types_1.SuccessGraphQLType,
            description: "Sends a link to the user's email address to change its password",
            args: {
                email: nexus_1.arg({
                    type: graphql_1.EmailScalar,
                    description: "The email address of user",
                }),
            },
            resolve: (_, { email }, { res, redis }) => __awaiter(this, void 0, void 0, function* () {
                if (!email || email.trim().length === 0)
                    throw new apollo_server_express_1.UserInputError("Please provide a valid email address", { code: common_1.errors.INVALID_ARGUMENTS });
                const user = yield User_1.User.findOne({
                    where: { email },
                    relations: ["account"],
                });
                if (!user)
                    throw new apollo_server_express_1.ApolloError(common_1.errors.USER_NOT_FOUND_MESSAGE, common_1.errors.NOT_FOUND);
                if (!user.hashtagId)
                    throw new apollo_server_express_1.ApolloError("You have not authenticated with #hashtag", common_1.errors.HASHTAG_NOT_AUTHENTICATED_CODE);
                try {
                    const { sendForgotPasswordLink } = yield lib_1.graphqlClient.request(SEND_FORGOT_PASSWORD_LINK_1.default, {
                        email,
                    });
                    if (sendForgotPasswordLink.error) {
                        const { message, code } = sendForgotPasswordLink.error;
                        if (message || code)
                            throw new apollo_server_express_1.ApolloError(message, code);
                    }
                    const success = sendForgotPasswordLink.success;
                    if (!success)
                        throw new apollo_server_express_1.ApolloError(common_1.errors.SOMETHING_WENT_WRONG, common_1.errors.SOMETHING_WENT_WRONG);
                    yield removeUserSessions_1.removeUserSessions(user.id, redis);
                }
                catch (err) {
                    return err;
                }
                res.clearCookie(process.env.REFRESH_TOKEN_COOKIE_NAME.toString(), { httpOnly: true });
                res.clearCookie(process.env.ACCESS_TOKEN_COOKIE_NAME.toString(), { httpOnly: true });
                return {
                    success: true,
                };
            }),
        });
        t.field("changeUserPassword", {
            type: types_1.SuccessGraphQLType,
            description: "Change a user's password",
            args: {
                email: nexus_1.arg({
                    type: graphql_1.EmailScalar,
                    description: "Email of user to retrieve OAuth Client applications",
                }),
                token: nexus_1.stringArg({
                    description: "The token in the URL to identify and verify user. Each key lasts 20 minutes",
                }),
                newPassword: nexus_1.stringArg({
                    description: "User's new password",
                }),
            },
            resolve: (_, { email, token, newPassword }) => __awaiter(this, void 0, void 0, function* () {
                if (!email || email.trim().length === 0)
                    throw new apollo_server_express_1.UserInputError("Please provide a valid email address", { code: common_1.errors.INVALID_ARGUMENTS });
                if (!newPassword || newPassword.trim().length === 0)
                    throw new apollo_server_express_1.UserInputError("Please provide a valid new password", { code: common_1.errors.INVALID_ARGUMENTS });
                if (!token || token.trim().length === 0)
                    throw new apollo_server_express_1.UserInputError("Please provide a valid token", { code: common_1.errors.INVALID_ARGUMENTS });
                const user = yield User_1.User.findOne({
                    where: { email },
                    relations: ["account"],
                });
                if (!user)
                    throw new apollo_server_express_1.ApolloError(common_1.errors.USER_NOT_FOUND_MESSAGE, common_1.errors.NOT_FOUND);
                if (!user.hashtagId)
                    throw new apollo_server_express_1.ApolloError("You have not authenticated with #hashtag", common_1.errors.HASHTAG_NOT_AUTHENTICATED_CODE);
                try {
                    const { changeUserPassword } = yield lib_1.graphqlClient.request(CHANGE_USER_PASSWORD_1.default, {
                        email,
                        token,
                        newPassword,
                    });
                    if (changeUserPassword.error) {
                        const { message, code } = changeUserPassword.error;
                        if (message || code)
                            throw new apollo_server_express_1.ApolloError(message, code);
                    }
                    const success = changeUserPassword.success;
                    if (!success)
                        throw new apollo_server_express_1.ApolloError(common_1.errors.SOMETHING_WENT_WRONG, common_1.errors.SOMETHING_WENT_WRONG);
                }
                catch (err) {
                    return err;
                }
                return {
                    success: true,
                };
            }),
        });
    },
});
exports.UserCrudMutation = nexus_1.extendType({
    type: "Mutation",
    definition(t) {
        t.field("updateUser", {
            type: types_2.UserUpdateType,
            description: "Update a user's info",
            args: {
                email: nexus_1.nullable(nexus_1.arg({ type: graphql_1.EmailScalar })),
                firstName: nexus_1.nullable(nexus_1.stringArg()),
                lastName: nexus_1.nullable(nexus_1.stringArg()),
                imgUrl: nexus_1.nullable(nexus_1.arg({ type: graphql_1.UrlScalar })),
                honorificTitle: nexus_1.nullable(nexus_1.stringArg({ description: "The honorific title of the user" })),
                birthday: nexus_1.nullable(nexus_1.stringArg({ description: "User's birthday in the date format" })),
                countryId: nexus_1.nullable(nexus_1.idArg({ description: "The country of user" })),
                city: nexus_1.nullable(nexus_1.stringArg({ description: "The city or hometown of user" })),
                phoneNumber: nexus_1.nullable(nexus_1.stringArg({ description: "The phone number of user" })),
                telCountryId: nexus_1.nullable(nexus_1.idArg({ description: "The country of user's phone number" })),
                address: nexus_1.nullable(nexus_1.stringArg({ description: "User's house or office street address" })),
                zipCode: nexus_1.nullable(nexus_1.stringArg({ description: "User's house or office zip code" })),
                trackHistory: nexus_1.nullable(nexus_1.booleanArg({ description: "Indicates if to track user's history" })),
            },
            resolve: (_, { email, firstName, lastName, imgUrl, honorificTitle, birthday, countryId, city, phoneNumber, telCountryId, address, zipCode, trackHistory, }, { payload, redis, stripe }) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                if (!payload)
                    throw new apollo_server_express_1.AuthenticationError(common_1.errors.NOT_AUTHENTICATED_MESSAGE);
                if (!payload.scope.some(scope => ["beach_bar@crud:user"].includes(scope)))
                    throw new apollo_server_express_1.AuthenticationError("You are not allowed, do not have permission, to update this user's information");
                if (email && email.trim().length === 0)
                    throw new apollo_server_express_1.UserInputError("Please provide a valid email address");
                const user = yield User_1.User.findOne({
                    where: { id: payload.sub },
                    relations: ["account", "account.country"],
                });
                if (!user) {
                    throw new apollo_server_express_1.ApolloError(common_1.errors.USER_NOT_FOUND_MESSAGE);
                }
                let isNew = false;
                try {
                    const response = yield user.update({
                        email,
                        firstName,
                        lastName,
                        imgUrl,
                        honorificTitle,
                        birthday,
                        address,
                        zipCode,
                        countryId,
                        city,
                        phoneNumber,
                        telCountryId,
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
                                city: uAccount.city || undefined,
                                postal_code: uAccount.zipCode || undefined,
                            },
                            phone: uAccount.phoneNumber,
                        });
                    }
                }
                catch (err) {
                    throw new apollo_server_express_1.ApolloError(`Something went wrong: ${err.message}`, common_1.errors.SOMETHING_WENT_WRONG);
                }
                const redisUser = yield redis.hgetall(user.getRedisKey());
                if (!redisUser)
                    throw new apollo_server_express_1.ApolloError(common_1.errors.SOMETHING_WENT_WRONG, common_1.errors.SOMETHING_WENT_WRONG);
                if (redisUser.hashtag_access_token && redisUser.hashtag_access_token.trim().length !== 0 && isNew) {
                    try {
                        const hashtagAccessToken = redisUser.hashtag_access_token;
                        const { updateUser } = yield lib_1.graphqlClient.request(UPDATE_USER_1.default, {
                            email: user.email,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            pictureUrl: user.account.imgUrl,
                            countryId: user.account.countryId,
                            birthday: user.account.birthday,
                        }, {
                            authorization: `Bearer ${hashtagAccessToken}`,
                        });
                        if (updateUser.error) {
                            const { message, code } = updateUser.error;
                            if (message || code)
                                throw new apollo_server_express_1.ApolloError(message, code);
                        }
                        if (!updateUser || String(updateUser.user.id) !== String(user.hashtagId) || !updateUser.updated)
                            throw new apollo_server_express_1.ApolloError(common_1.errors.SOMETHING_WENT_WRONG);
                    }
                    catch (err) {
                        if (!err.message.includes("jwt expired"))
                            return err;
                    }
                }
                return {
                    user,
                    updated: true,
                };
            }),
        });
    },
});
