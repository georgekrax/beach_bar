import { Redis } from "ioredis";
import { UAParser } from "ua-parser-js";
import { Request, Response } from "express";

export interface MyContext {
  req: Request;
  res: Response;
  payload?: { userId: bigint; isOwner: boolean };
  redis: Redis;
  uaParser: UAParser;
}
