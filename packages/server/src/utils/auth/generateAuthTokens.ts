import { errors } from "@beach_bar/common";
import { User } from "@entity/User";
import { decode, sign } from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { GeneratedTokenType } from "../returnTypes";

export const generateAccessToken = (user: User, scope: string[]): GeneratedTokenType => {
  const token = sign(
    {
      scope,
    },
    process.env.ACCESS_TOKEN_SECRET!,
    {
      audience: process.env.TOKEN_AUDIENCE!.toString(),
      issuer: process.env.TOKEN_ISSUER!.toString(),
      subject: user.id.toString(),
      expiresIn: process.env.ACCESS_TOKEN_EXPIRATION!.toString(),
      jwtid: uuidv4(),
    }
  );

  const tokenPayload: any = decode(token);
  if (tokenPayload === null) {
    throw new Error(errors.SOMETHING_WENT_WRONG);
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

export const generateRefreshToken = (user: User): GeneratedTokenType => {
  const token = sign(
    {
      tokenVersion: user.tokenVersion,
    },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      audience: process.env.TOKEN_AUDIENCE!.toString(),
      issuer: process.env.TOKEN_ISSUER!.toString(),
      subject: user.id.toString(),
      expiresIn: process.env.REFRESH_TOKEN_EXPIRATION!.toString(),
      jwtid: uuidv4(),
    }
  );

  const tokenPayload: any = decode(token);
  if (tokenPayload === null) {
    throw new Error(errors.SOMETHING_WENT_WRONG);
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
