import { MailService } from "@sendgrid/mail";
import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { Redis } from "ioredis";
import { Stripe } from "stripe";
import UAParser from "ua-parser-js";
export interface MyContext {
    req: Request;
    res: Response;
    payload?: {
        scope: string[];
        iat: number;
        exp: number;
        aud: string;
        iss: string;
        sub: number;
        jti: string;
    };
    redis: Redis;
    sgMail: MailService;
    sgClient: any;
    stripe: Stripe;
    uaParser: UAParser;
    googleOAuth2Client: OAuth2Client;
    ipAddr?: string;
}
