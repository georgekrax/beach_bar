import { Response } from "express";
import ms from "ms";

export const sendCookieToken = (res: Response, token: string, type: "access" | "refresh"): any => {
  res.cookie(process.env[type === "access" ? "ACCESS_TOKEN_COOKIE_NAME" : "REFRESH_TOKEN_COOKIE_NAME"]!.toString(), token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: ms(process.env.REFRESH_TOKEN_EXPIRATION),
    sameSite: "strict",
  });
};
