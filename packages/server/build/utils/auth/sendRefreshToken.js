"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendRefreshToken = void 0;
const sendRefreshToken = (res, token) => {
    res.cookie(process.env.REFRESH_TOKEN_COOKIE_NAME.toString(), token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 15552000000,
    });
};
exports.sendRefreshToken = sendRefreshToken;
