import { Redis } from "ioredis";
import { UAParser } from "ua-parser-js";
import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";

export interface MyContext {
  req: Request;
  res: Response;
  payload?: { userId: bigint; isOwner: boolean };
  redis: Redis;
  uaParser: UAParser;
  googleOAuth2Client: OAuth2Client;
}
