import { v4 as uuidv4 } from "uuid";
import { sign, decode } from "jsonwebtoken";

import { User } from "./../../entity/User";

export const generateAccessToken = (
  user: User,
): {
  token: string;
  exp: Date;
  iat: Date;
  jti: string;
  aud: string;
  iss: string;
} => {
  const accessToken = sign({ userId: user.id, isOwner: user.isOwner }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "17m",
    audience: "www.beach_bar.com",
    issuer: "www.beach_bar.com",
    jwtid: uuidv4(),
  });
  const payload: any = decode(accessToken);
  if (payload === null) {
    throw new Error("Something went wrong");
  }
  return {
    token: accessToken,
    exp: payload.exp,
    iat: payload.iat,
    jti: payload.jti,
    aud: payload.aud,
    iss: payload.iss,
  };
};

export const generateRefreshToken = (
  user: User,
): {
  token: string;
  exp: Date;
  iat: Date;
  jti: string;
  aud: string;
  iss: string;
} => {
  const refreshToken = sign(
    { userId: user.id, isOwner: user.isOwner, tokenVersion: user.tokenVersion },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: "100 minutes",
      audience: "www.beach_bar.com",
      issuer: "www.beach_bar.com",
      jwtid: uuidv4(),
    },
  );
  const payload: any = decode(refreshToken);
  if (payload === null) {
    throw new Error("Something went wrong");
  }
  return {
    token: refreshToken,
    exp: payload.exp,
    iat: payload.iat,
    jti: payload.jti,
    aud: payload.aud,
    iss: payload.iss,
  };
};
