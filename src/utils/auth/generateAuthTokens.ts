import { decode, sign } from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
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
  const accessToken = sign({}, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "17m",
    audience: process.env.TOKEN_AUDIENCE!.toString(),
    issuer: process.env.TOKEN_ISSUER!.toString(),
    subject: user.id.toString(),
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
  const refreshToken = sign({ tokenVersion: user.tokenVersion }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: "100 minutes",
    audience: process.env.TOKEN_AUDIENCE!.toString(),
    issuer: process.env.TOKEN_ISSUER!.toString(),
    subject: user.id.toString(),
    jwtid: uuidv4(),
  });
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
