import { v4 as uuidv4 } from "uuid";
import { sign, decode } from "jsonwebtoken";

import { User } from "./../../entity/User";

export const generateAccessToken = (
  user: User,
): {
  accessToken: string;
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
  console.log(payload);
  return {
    accessToken,
    exp: payload.exp,
    iat: payload.iat,
    jti: payload.jti,
    aud: payload.aud,
    iss: payload.iss,
  };
};
