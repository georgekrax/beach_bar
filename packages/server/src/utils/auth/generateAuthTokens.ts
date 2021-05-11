import { errors } from "@beach_bar/common";
import { User } from "entity/User";
import { decode, sign, SignOptions } from "jsonwebtoken";
import { nanoid } from "nanoid";
import { GeneratedTokenType } from "../returnTypes";

export const generateAccessToken = (user: User, scope: string[], opts?: SignOptions): GeneratedTokenType => {
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
      jwtid: nanoid(),
      ...opts,
    }
  );

  const tokenPayload: any = decode(token);
  if (tokenPayload === null) throw new Error(errors.SOMETHING_WENT_WRONG);
  const { exp, iat, jti, aud, iss } = tokenPayload;
  return {
    token,
    exp: exp * 1000,
    iat: iat * 1000,
    jti,
    aud,
    iss,
  };
};

export const generateRefreshToken = (
  user: User,
  oauthProvider: "#beach_bar" | "Google" | "Facebook" | "Instagram"
): GeneratedTokenType => {
  const token = sign(
    {
      tokenVersion: user.tokenVersion,
      oauth: oauthProvider,
    },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      audience: process.env.TOKEN_AUDIENCE!.toString(),
      issuer: process.env.TOKEN_ISSUER!.toString(),
      subject: user.id.toString(),
      expiresIn: process.env.REFRESH_TOKEN_EXPIRATION!.toString(),
      jwtid: nanoid(),
    }
  );

  const tokenPayload: any = decode(token);
  if (tokenPayload === null) throw new Error(errors.SOMETHING_WENT_WRONG);
  const { exp, iat, jti, aud, iss } = tokenPayload;
  return {
    token,
    exp: exp * 1000,
    iat: iat * 1000,
    jti,
    aud,
    iss,
  };
};
