import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { Redis } from "ioredis";
import { UAParser } from "ua-parser-js";

export interface MyContext {
  req: Request;
  res: Response;
  payload?: { scope: string[]; iat: number; exp: number; aud: string; iss: string; sub: string; jti: string };
  redis: Redis;
  uaParser: UAParser;
  googleOAuth2Client: OAuth2Client;
}
