import { Response } from "express";

export const sendRefreshToken = (res: Response, token: string): any => {
  res.cookie("jid", token, {
    httpOnly: true,
    maxAge: 15552000000,
  });
};
