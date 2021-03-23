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
exports.refreshTokenForHashtagUser = void 0;
const common_1 = require("@beach_bar/common");
const node_fetch_1 = __importDefault(require("node-fetch"));
const refreshTokenForHashtagUser = (user, redis) => __awaiter(void 0, void 0, void 0, function* () {
    const redisUser = yield redis.hgetall(user.getRedisKey());
    if (!redisUser || !redisUser.refresh_token)
        throw new Error(common_1.errors.INVALID_REFRESH_TOKEN);
    if (!redisUser || !redisUser.hashtag_refresh_token || redisUser.hashtag_refresh_token.trim().length === 0)
        throw new Error(common_1.errors.SOMETHING_WENT_WRONG);
    const { hashtag_refresh_token: hashtagRefreshToken } = redisUser;
    const requestBody = {
        grant_type: "refresh_token",
        client_id: process.env.HASHTAG_CLIENT_ID.toString(),
        client_secret: process.env.HASHTAG_CLIENT_SECRET.toString(),
        refresh_token: hashtagRefreshToken,
    };
    let success = false;
    yield node_fetch_1.default(`${process.env.HASHTAG_API_HOSTNAME}/oauth/refresh_token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
    })
        .then(res => {
        return res.json();
    })
        .then((data) => __awaiter(void 0, void 0, void 0, function* () {
        if (data.success && data.accessToken.token && !data.refreshToken) {
            success = true;
            yield redis.hset(user.getRedisKey(), "hashtag_access_token", data.accessToken.token);
        }
        else if (data.success && data.refreshToken && !data.accessToken) {
            yield redis.hset(user.getRedisKey(), "hashtag_refresh_token", data.refreshToken);
            const newRequestBody = Object.assign(Object.assign({}, requestBody), { refresh_token: data.refreshToken });
            node_fetch_1.default(`${process.env.HASHTAG_API_HOSTNAME}/oauth/refresh_token`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newRequestBody),
            })
                .then(res => {
                return res.json();
            })
                .then((data) => __awaiter(void 0, void 0, void 0, function* () {
                if (data && data.accessToken && !data.refreshToken) {
                    success = true;
                    yield redis.hset(user.getRedisKey(), "hashtag_access_token", data.accessToken.token);
                }
            }))
                .catch(err => {
                throw new Error(`${common_1.errors.SOMETHING_WENT_WRONG}: ${err.message}`);
            });
        }
        else {
            success = false;
        }
    }))
        .catch(err => {
        success = false;
        if (err.message ===
            `request to ${process.env.HASHTAG_API_HOSTNAME}/oauth/refresh_token failed, reason: connect ECONNREFUSED ${process.env
                .HASHTAG_API_HOSTNAME.replace("https://", "")
                .replace("http://", "")}`)
            throw new Error(common_1.errors.SOMETHING_WENT_WRONG);
        throw new Error(`${common_1.errors.SOMETHING_WENT_WRONG}: ${err.message}`);
    });
    if (!success)
        throw new Error(common_1.errors.SOMETHING_WENT_WRONG);
});
exports.refreshTokenForHashtagUser = refreshTokenForHashtagUser;
