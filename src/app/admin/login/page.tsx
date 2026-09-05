'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const SLIDES = ['/slides/1.png', '/slides/2.png', '/slides/3.png'];

export default function AdminLoginPage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [username, setUsername] = useState('Mark Vencent Juntilla');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Slideshow rotation
  useEffect(() => {
    if (SLIDES.length < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const interval = setInterval(() => {
      setActiveSlide(i => (i + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push('/admin/dashboard');
      } else {
        const data = await res.json();
        setError(data.error || 'Invalid credentials');
      }
    } catch {
      setError('Network error during login');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (hasErr: boolean) => ({
    width: '100%', padding: '0.75rem 1rem', borderRadius: 10,
    background: 'var(--admin-bg-primary)',
    border: `1px solid ${hasErr ? '#f87171' : 'var(--admin-border)'}`,
    color: 'var(--admin-text-primary)', fontSize: '0.9rem',
    outline: 'none', transition: 'border-color 0.15s',
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--admin-bg-primary)' }}>
      <style>{`
        .login-left {
          flex: 1.1; background: linear-gradient(135deg, #0a0f1a 0%, #0f1a2e 60%, #0d1729 100%);
          padding: 3rem; display: flex; flex-direction: column; justify-content: space-between;
          border-right: 1px solid var(--admin-border); position: relative; overflow: hidden;
        }
        .login-right {
          flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center;
          padding: 2.5rem; position: relative; background: var(--admin-bg-primary);
        }
        .login-card {
          width: 100%; max-width: 420px; background: var(--admin-card);
          border: 1px solid var(--admin-border-strong); border-radius: 20px;
          padding: 2.5rem; box-shadow: var(--admin-shadow);
        }
        @media (max-width: 900px) { .login-left { display: none; } }
      `}</style>

      {/* LEFT PANEL */}
      <div className="login-left">
        {/* Slide images */}
        {SLIDES.map((src, i) => (
          <img key={src} src={src} alt="" style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', opacity: i === activeSlide ? 0.45 : 0,
            transition: 'opacity 0.8s ease', zIndex: 0,
          }} />
        ))}
        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(8,14,24,0.85) 0%, rgba(8,14,24,0.3) 50%, rgba(8,14,24,0.1) 100%)',
          zIndex: 1,
        }} />

        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <img src="/logo.png" alt="MakiSync" style={{ width: 42, height: 42, objectFit: 'contain' }} />
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f4f8ff', letterSpacing: '-0.02em' }}>
                Maki<span style={{ color: '#3b82f6' }}>Sync</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#6f83a6', fontWeight: 600 }}>AI Creative & Video Ads</div>
            </div>
          </div>

          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f4f8ff', lineHeight: 1.15, marginBottom: '1rem', letterSpacing: '-0.03em' }}>
            AI Video Ads &amp; Creative Direction Portal
          </h1>
          <p style={{ fontSize: '0.92rem', color: '#a5b4cf', lineHeight: 1.6, maxWidth: 460 }}>
            Director-led AI video commercial production, commercial concept strategy, and creative technology management hub.
          </p>
        </div>

        <div style={{ position: 'relative', zIndex: 2, fontSize: '0.75rem', color: '#6f83a6' }}>
          © 2026 MakiSync. Mark Vencent Juntilla.
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="login-right">
        <Link
          href="/"
          style={{
            position: 'absolute', top: '1.5rem', left: '1.5rem',
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.4rem 0.85rem', borderRadius: 8,
            border: '1px solid var(--admin-border)',
            background: 'var(--admin-card)',
            color: 'var(--admin-text-secondary)',
            fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none',
          }}
        >
          ← Portfolio Home
        </Link>

        <div className="login-card">
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--admin-text-primary)', letterSpacing: '-0.03em', marginBottom: '0.25rem' }}>
              Sign in
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--admin-text-muted)' }}>
              Enter passkey to access CMS Portal
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--admin-text-secondary)', marginBottom: '0.4rem' }}>
                User / Admin Name
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                style={inputStyle(false)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--admin-text-secondary)', marginBottom: '0.4rem' }}>
                Passkey Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ ...inputStyle(!!error), paddingRight: '2.5rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  style={{
                    position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--admin-text-muted)',
                  }}
                >
                  <i className={`bi bi-eye${showPass ? '-slash' : ''}`} />
                </button>
              </div>
            </div>

            {error && <div style={{ fontSize: '0.8rem', color: '#f87171' }}>{error}</div>}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '0.75rem', borderRadius: 10, border: 'none',
                background: 'var(--admin-accent)', color: '#fff',
                fontWeight: 700, fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1, transition: 'opacity 0.15s',
              }}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
