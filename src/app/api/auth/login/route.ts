import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, signToken, COOKIE_NAME } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

// In-memory rate limiter: max 25 attempts per IP per 15 minutes
const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 25;
const WINDOW_MS = 15 * 60 * 1000;

function getIP(req: NextRequest) {
  return req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > MAX_ATTEMPTS;
}

function clearAttempts(ip: string) {
  attempts.delete(ip);
}

export async function POST(req: NextRequest) {
  try {
    const ip = getIP(req);

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many failed attempts. Try again in 15 minutes.' },
        { status: 429 }
      );
    }

    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Missing credentials.' }, { status: 400 });
    }

    const trimmedUsername = String(username).trim();
    const trimmedPassword = String(password).trim();

    // 1. If Supabase is connected, query the users table (case-insensitive)
    if (supabase) {
      try {
        const { data: users, error } = await supabase
          .from('users')
          .select('*')
          .or(`username.ilike.${trimmedUsername},email.ilike.${trimmedUsername}`)
          .limit(1);

        if (!error && users && users.length > 0) {
          const user = users[0];
          const isValid = await verifyPassword(trimmedPassword, user.password_hash);
          
          if (isValid) {
            clearAttempts(ip);
            const token = await signToken({
              id: user.id,
              username: user.username,
              role: user.role || 'admin',
            });

            const response = NextResponse.json({ success: true });
            response.cookies.set(COOKIE_NAME, token, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              maxAge: 60 * 60 * 24 * 7, // 7 days
              path: '/',
            });

            return response;
          }
        }
      } catch (dbErr) {
        console.warn('Supabase auth query notice:', dbErr);
      }
    }

    // 2. Fallback passkey verification for local dev / initial setup
    const validUsernames = ['admin', 'makisync', 'mark vencent juntilla', 'markjuntillava@gmail.com'];
    const validPasswords = ['admin123', 'makisync2026', 'password', 'admin', 'password123'];

    const userMatch = validUsernames.some(u => u.toLowerCase() === trimmedUsername.toLowerCase());
    const passMatch = validPasswords.includes(trimmedPassword);

    if (userMatch && passMatch) {
      clearAttempts(ip);
      const token = await signToken({
        id: 1,
        username: trimmedUsername,
        role: 'admin',
      });

      const response = NextResponse.json({ success: true });
      response.cookies.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });

      return response;
    }

    return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
  } catch (error) {
    console.error('Login Auth Error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
