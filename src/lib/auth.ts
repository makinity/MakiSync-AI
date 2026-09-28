import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';

const secretString = process.env.JWT_SECRET || 'makisync_jwt_secret_key_2026_video_creator_portfolio';
const JWT_SECRET = new TextEncoder().encode(secretString);
const COOKIE_NAME = 'ms_session';

export const hashPassword = (password: string) => bcrypt.hash(password, 12);
export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  if (!hash || !password) return false;
  // If hash is formatted like a bcrypt hash ($2a$, $2b$, $2y$)
  if (/^\$2[aby]\$\d{2}\$[./0-9A-Za-z]{53}$/.test(hash) || hash.startsWith('$2a$') || hash.startsWith('$2b$') || hash.startsWith('$2y$')) {
    try {
      const match = await bcrypt.compare(password, hash);
      if (match) return true;
    } catch {
      // ignore
    }
  }
  // Plain-text match fallback (e.g. unhashed seed passwords or direct string match)
  return password.trim() === hash.trim();
};

export type UserRole = 'admin' | 'client';

export interface TokenPayload {
  id: number | string;
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