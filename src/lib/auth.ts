import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';

const secretString = process.env.JWT_SECRET || 'makisync_jwt_secret_key_2026_video_creator_portfolio';
const JWT_SECRET = new TextEncoder().encode(secretString);
const COOKIE_NAME = 'ms_session';

export const hashPassword = (password: string) => bcrypt.hash(password, 12);
export const verifyPassword = (password: string, hash: string) => bcrypt.compare(password, hash);

export type UserRole = 'admin' | 'client';

export interface TokenPayload {
  id: number;
  username: string;
  role: UserRole;
}

export async function signToken(payload: TokenPayload) {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as TokenPayload;
  } catch {
    return null;
  }
}

export { COOKIE_NAME };