"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshToken = exports.generateAccessToken = void 0;
const common_1 = require("@beach_bar/common");
const jsonwebtoken_1 = require("jsonwebtoken");
const uuid_1 = require("uuid");
exports.generateAccessToken = (user, scope) => {
    const token = jsonwebtoken_1.sign({
        scope,
    }, process.env.ACCESS_TOKEN_SECRET, {
        audience: process.env.TOKEN_AUDIENCE.toString(),
        issuer: process.env.TOKEN_ISSUER.toString(),
        subject: user.id.toString(),
        expiresIn: process.env.ACCESS_TOKEN_EXPIRATION.toString(),
        jwtid: uuid_1.v4(),
    });
    const tokenPayload = jsonwebtoken_1.decode(token);
    if (tokenPayload === null) {
        throw new Error(common_1.errors.SOMETHING_WENT_WRONG);
    }
    return {
        token,
        exp: tokenPayload.exp * 1000,
        iat: tokenPayload.iat * 1000,
        jti: tokenPayload.jti,
        aud: tokenPayload.aud,
        iss: tokenPayload.iss,
    };
};
exports.generateRefreshToken = (user) => {
    const token = jsonwebtoken_1.sign({
        tokenVersion: user.tokenVersion,
    }, process.env.REFRESH_TOKEN_SECRET, {
        audience: process.env.TOKEN_AUDIENCE.toString(),
        issuer: process.env.TOKEN_ISSUER.toString(),
        subject: user.id.toString(),
        expiresIn: process.env.REFRESH_TOKEN_EXPIRATION.toString(),
        jwtid: uuid_1.v4(),
    });
    const tokenPayload = jsonwebtoken_1.decode(token);
    if (tokenPayload === null) {
        throw new Error(common_1.errors.SOMETHING_WENT_WRONG);
    }
    return {
        token,
        exp: tokenPayload.exp * 1000,
        iat: tokenPayload.iat * 1000,
        jti: tokenPayload.jti,
        aud: tokenPayload.aud,
        iss: tokenPayload.iss,
    };
};
//# sourceMappingURL=generateAuthTokens.js.map