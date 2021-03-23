"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendCookieToken = void 0;
const ms_1 = __importDefault(require("ms"));
const sendCookieToken = (res, token, type) => {
    res.cookie(process.env[type === "access" ? "ACCESS_TOKEN_COOKIE_NAME" : "REFRESH_TOKEN_COOKIE_NAME"].toString(), token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: ms_1.default(process.env[type === "access" ? "ACCESS_TOKEN_EXPIRATION" : "REFRESH_TOKEN_EXPIRATION"]),
        sameSite: "strict",
    });
};
exports.sendCookieToken = sendCookieToken;
