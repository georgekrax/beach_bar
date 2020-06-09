import { Response } from "express";

export const sendRefreshToken = (res: Response, token: string): any => {
  res.cookie(process.env.REFRESH_TOKEN_COOKIE_NAME!.toString(), token, {
    httpOnly: true,
    maxAge: 15552000000,
  });
};
