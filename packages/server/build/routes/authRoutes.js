"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.router = void 0;
const common_1 = require("@beach_bar/common");
const redisKeys_1 = __importDefault(require("constants/redisKeys"));
const User_1 = require("entity/User");
const express = __importStar(require("express"));
const jsonwebtoken_1 = require("jsonwebtoken");
const url_1 = require("url");
const generateAuthTokens_1 = require("utils/auth/generateAuthTokens");
const refreshTokenForHashtagUser_1 = require("utils/auth/refreshTokenForHashtagUser");
const sendRefreshToken_1 = require("utils/auth/sendRefreshToken");
const index_1 = require("../index");
exports.router = express.Router();
exports.router.get("/google/callback", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const qs = new url_1.URL(req.url, process.env.HOSTNAME_WITH_HTTP).searchParams;
    const code = qs.get("code");
    const state = qs.get("state");
    return res.send(`<h2>Redirected from Google</h2><p>Code: ${code}</p><br><p>State: ${state}</p>`);
}));
exports.router.get("/facebook/callback", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const qs = new url_1.URL(req.url, process.env.HOSTNAME_WITH_HTTP).searchParams;
    const code = qs.get("code");
    const state = qs.get("state");
    res.send(`<h2>Redirected from Facebook</h2><p>Code: ${code}</p><br><p>State: ${state}</p>`);
}));
exports.router.get("/instagram/callback", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const qs = new url_1.URL(req.url, process.env.HOSTNAME_WITH_HTTP).searchParams;
    const code = qs.get("code");
    const state = qs.get("state");
    res.send(`<h2>Redirected from Instagram</h2><p>Code: ${code}</p><br><p>State: ${state}</p>`);
}));
exports.router.post("/refresh_token", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.me;
    if (!refreshToken) {
        return res.status(422).send({
            success: false,
            accessToken: null,
            error: "A refresh token should be provided in a cookie",
        });
    }
    let payload = null;
    try {
        payload = jsonwebtoken_1.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, { issuer: process.env.TOKEN_ISSUER.toString() });
    }
    catch (err) {
        if (err.name === "TokenExpiredError" || err.message === "jwt expired") {
            const decodedRefreshTokenPayload = jsonwebtoken_1.decode(refreshToken);
            if (!decodedRefreshTokenPayload) {
                return res.status(500).send({
                    success: false,
                    accessToken: null,
                    error: "Something went wrong",
                });
            }
            const user = yield User_1.User.findOne({
                where: { id: decodedRefreshTokenPayload.sub },
                select: ["id", "email", "tokenVersion"],
                relations: ["account"],
            });
            if (!user) {
                return res.status(500).send({
                    success: false,
                    accessToken: null,
                    error: "Something went wrong",
                });
            }
            if (user.tokenVersion !== payload.tokenVersion) {
                return res.status(422).send({
                    success: false,
                    accessToken: null,
                    error: "Invalid refresh token",
                });
            }
            const userAccount = user.account;
            if (!userAccount) {
                return res.status(404).send({
                    success: false,
                    accessToken: null,
                    error: common_1.errors.SOMETHING_WENT_WRONG,
                });
            }
            if (user.hashtagId) {
                try {
                    yield refreshTokenForHashtagUser_1.refreshTokenForHashtagUser(user, index_1.redis);
                }
                catch (err) {
                    return res.send({
                        success: false,
                        accessToken: null,
                        error: err.message,
                    });
                }
            }
            const newRefreshToken = generateAuthTokens_1.generateRefreshToken(user);
            yield index_1.redis.hset(user.getRedisKey(), "refresh_token", newRefreshToken.token);
            sendRefreshToken_1.sendRefreshToken(res, newRefreshToken.token);
        }
        else {
            return res.send({
                success: false,
                accessToken: null,
                error: `${common_1.errors.SOMETHING_WENT_WRONG}. ${err.message}`,
            });
        }
    }
    if (!payload || payload.jti === null || payload.sub === "") {
        return res.send({
            success: false,
            accessToken: null,
            error: "Something went wrong. It is possible that the provided refresh token is invalid",
        });
    }
    const redisUser = yield index_1.redis.hgetall(`${redisKeys_1.default.USER}:${payload.sub}`);
    if (!redisUser || !redisUser.refresh_token) {
        return res.status(422).send({
            success: false,
            accessToken: null,
            error: common_1.errors.INVALID_REFRESH_TOKEN,
        });
    }
    const user = yield User_1.User.findOne(payload.sub);
    if (!user) {
        return res.status(404).send({
            success: false,
            accessToken: null,
            error: common_1.errors.USER_DOES_NOT_EXIST,
        });
    }
    if (user.tokenVersion !== payload.tokenVersion) {
        return res.status(422).send({
            success: false,
            accessToken: null,
            error: common_1.errors.INVALID_REFRESH_TOKEN,
        });
    }
    if (user.hashtagId) {
        try {
            yield refreshTokenForHashtagUser_1.refreshTokenForHashtagUser(user, index_1.redis);
        }
        catch (err) {
            return res.send({
                success: false,
                accessToken: null,
                error: err.message,
            });
        }
    }
    const scope = yield index_1.redis.smembers(user.getRedisKey(true));
    const newAccessToken = generateAuthTokens_1.generateAccessToken(user, scope);
    yield index_1.redis.hset(user.getRedisKey(), "access_token", newAccessToken.token);
    return res.send({
        success: true,
        accessToken: {
            token: newAccessToken.token,
            expirationDate: newAccessToken.exp,
            expiresIn: newAccessToken.exp - Date.now(),
            type: "Bearer",
        },
        error: null,
    });
}));
