export type GeneratedTokenType = {
  token: string;
  exp: number;
  iat: number;
  jti: string;
  aud: string | null;
  iss: string;
};
