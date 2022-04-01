import hkdf from "@panva/hkdf";
import { compactDecrypt, CompactEncrypt, JWTPayload, jwtVerify, JWTVerifyResult, SignJWT } from "jose";
import { decode } from "jsonwebtoken";

type SecretParam = string | Buffer;

export const getDerivedEncryptionKey = async (secret: SecretParam) => {
  return await hkdf("sha256", secret, "", "#beach_bar Generated Encryption Key", 32);
};

export const signJwt = async (data: JWTPayload, secret: SecretParam, modify?: (token: SignJWT) => SignJWT) => {
  const sec = await getDerivedEncryptionKey(secret);
  const defaultJwt = new SignJWT(data).setProtectedHeader({ alg: "HS256", typ: "JWT" }).setIssuedAt();
  const jwt = await (modify ? modify(defaultJwt) : defaultJwt).sign(sec);
  const encryptedToken = await new CompactEncrypt(new TextEncoder().encode(jwt))
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .encrypt(sec);
  return { jwt: encryptedToken, signed: jwt };
};

export const decodeJwt = async (jwt: string, secret: SecretParam): Promise<JWTPayload> => {
  const sec = await getDerivedEncryptionKey(secret);
  const { plaintext } = await compactDecrypt(jwt || "", sec);
  return decode(Buffer.from(plaintext).toString()) as JWTPayload;
};

export const verifyJwt = async (jwt: string, secret: SecretParam): Promise<JWTVerifyResult> => {
  const sec = await getDerivedEncryptionKey(secret);
  const { plaintext } = await compactDecrypt(jwt, sec);
  return await jwtVerify(plaintext, sec, { clockTolerance: 15 });
};

export type { JwtPayload } from "jsonwebtoken";