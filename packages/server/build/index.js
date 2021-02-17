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
exports.stripe = exports.redis = void 0;
const common_1 = require("@beach_bar/common");
const client_1 = __importDefault(require("@sendgrid/client"));
const mail_1 = __importDefault(require("@sendgrid/mail"));
const apollo_link_1 = require("apollo-link");
const apollo_server_express_1 = require("apollo-server-express");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
const ioredis_1 = __importDefault(require("ioredis"));
const jsonwebtoken_1 = require("jsonwebtoken");
require("reflect-metadata");
const stripe_1 = require("stripe");
const ua_parser_js_1 = require("ua-parser-js");
const createDBConnection_1 = require("utils/createDBConnection");
const apolloLink_1 = require("./config/apolloLink");
const googleOAuth_1 = require("./config/googleOAuth");
const redisKeys_1 = __importDefault(require("./constants/redisKeys"));
const User_1 = require("./entity/User");
const VERIFY_ACCESS_TOKEN_1 = __importDefault(require("./graphql/VERIFY_ACCESS_TOKEN"));
const authRoutes_1 = require("./routes/authRoutes");
const stripeWebhooks_1 = require("./routes/stripeWebhooks");
const schema_1 = require("./schema");
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        exports.redis = new ioredis_1.default({
            password: "george2016",
            db: 2,
            connectTimeout: 10000,
            reconnectOnError: () => true,
        });
        exports.redis.on("error", (err) => {
            throw new Error(err.message);
        });
        yield createDBConnection_1.createDBConnection();
    }
    catch (err) {
        console.error(err);
        process.exit(0);
    }
    const app = express_1.default();
    exports.stripe = new stripe_1.Stripe(process.env.NODE_ENV === "production" ? process.env.STRIPE_SECRET_LIVE_KEY.toString() : process.env.STRIPE_SECRET_KEY.toString(), { apiVersion: "2020-08-27", typescript: true });
    app.use((req, res, next) => {
        if (req.originalUrl.includes(process.env.STRIPE_WEBHOOK_ORIGIN_URL.toString())) {
            express_1.default.raw({ type: "application/json" })(req, res, next);
        }
        else {
            express_1.default.json()(req, res, next);
        }
    });
    app.use(cookie_parser_1.default());
    app.use("/stripe", stripeWebhooks_1.router);
    app.use("/oauth", authRoutes_1.router);
    client_1.default.setApiKey(process.env.SENDGRID_API_KEY.toString());
    mail_1.default.setApiKey(process.env.SENDGRID_API_KEY.toString());
    const notIsProd = !(process.env.NODE_ENV === "production");
    const server = new apollo_server_express_1.ApolloServer({
        playground: notIsProd,
        schema: schema_1.schema,
        uploads: true,
        formatError: (err) => {
            if (err.message == "Context creation failed: jwt expired" ||
                err.message == "Context creation failed: Something went wrong. jwt expired") {
                return new Error(common_1.errors.JWT_EXPIRED);
            }
            else if (err.message.startsWith("Context creation failed: ")) {
                return new Error(err.message.replace("Context creation failed: ", ""));
            }
            else if (err.message.startsWith("Something went wrong. ")) {
                return new Error(err.message.replace("Something went wrong. ", ""));
            }
            return err;
        },
        context: ({ req, res }) => __awaiter(void 0, void 0, void 0, function* () {
            const authHeader = req.headers.authorization || "";
            const accessToken = authHeader.split(" ")[1];
            let payload = null;
            if (accessToken) {
                try {
                    payload = jsonwebtoken_1.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, { issuer: process.env.TOKEN_ISSUER.toString() });
                    if (payload && payload.sub && payload.sub.trim().length !== 0) {
                        const redisUser = yield exports.redis.hgetall(`${redisKeys_1.default.USER}:${payload.sub.toString()}`);
                        if (!redisUser) {
                            payload = null;
                        }
                    }
                    else if (payload.sub.trim().length >= 0) {
                        payload = null;
                    }
                }
                catch (err) {
                    if (err.message.toString() === "jwt expired") {
                        throw new Error(common_1.errors.JWT_EXPIRED);
                    }
                    if (err.message.toString() === "invalid signature") {
                        const verifyAccessTokenOperation = {
                            query: VERIFY_ACCESS_TOKEN_1.default,
                            variables: {
                                token: accessToken,
                            },
                        };
                        let hashtagSub, hashtagAud, hashtagIss, hashtagScope, hashtagIat, hashtagExp, hashtagJti, errorCode, errorMessage;
                        yield apollo_link_1.makePromise(apollo_link_1.execute(apolloLink_1.link, verifyAccessTokenOperation))
                            .then(res => { var _a; return (_a = res.data) === null || _a === void 0 ? void 0 : _a.verifyAccessToken; })
                            .then(data => {
                            if (data.error) {
                                errorCode = data.error.code;
                                errorMessage = data.error.message;
                            }
                            hashtagSub = data.sub;
                            hashtagAud = data.aud;
                            hashtagIss = data.iss;
                            hashtagScope = data.scope;
                            hashtagIat = data.iat;
                            hashtagExp = data.exp;
                            hashtagJti = data.jti;
                        })
                            .catch(err => {
                            throw new Error(`Something went wrong. ${err}`);
                        });
                        if (errorCode ||
                            errorMessage ||
                            hashtagAud !== process.env.HASHTAG_CLIENT_ID.toString() ||
                            hashtagIss !== process.env.HASHTAG_TOKEN_ISSUER.toString()) {
                            throw new Error(errorMessage.toString());
                        }
                        else if (hashtagSub && (hashtagSub !== "" || " ")) {
                            const user = yield User_1.User.findOne({ where: { hashtagId: hashtagSub } });
                            if (!user) {
                                payload = null;
                            }
                            else {
                                payload = {
                                    scope: hashtagScope,
                                    sub: user === null || user === void 0 ? void 0 : user.id.toString(),
                                    iat: hashtagIat,
                                    exp: hashtagExp,
                                    aud: hashtagAud,
                                    iss: hashtagIss,
                                    jti: hashtagJti,
                                };
                            }
                        }
                    }
                    else {
                        payload = null;
                    }
                }
            }
            if (payload && payload.sub) {
                payload.sub = parseInt(payload.sub);
            }
            const uaParser = new ua_parser_js_1.UAParser(req.headers["user-agent"]);
            const ipAddr = req.ipAddr;
            return { req, res, payload, redis: exports.redis, sgMail: mail_1.default, sgClient: client_1.default, stripe: exports.stripe, uaParser, googleOAuth2Client: googleOAuth_1.googleOAuth2Client, ipAddr };
        }),
    });
    server.applyMiddleware({ app, cors: true });
    app.listen({ port: parseInt(process.env.PORT) || 4000 }, () => console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`));
}))();
