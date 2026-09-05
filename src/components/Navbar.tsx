'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [scrolled, setScrolled]           = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode]           = useState(true);

  // Sync initial state from whatever the layout script already set
  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'dark';
    setDarkMode(saved === 'dark');
  }, []);

  // Apply theme to <html> and persist on toggle
  const toggleTheme = () => {
    const next = darkMode ? 'light' : 'dark';
    setDarkMode(!darkMode);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { label: 'WORK',     href: '#selected-work' },
    { label: 'SERVICES', href: '#approach' },
    { label: 'ABOUT',    href: '#about' },
    { label: 'GALLERY',  href: '#capabilities' },
    { label: 'CONTACT',  href: '#contact' },
  ];

  return (
    <>
      {/* Fixed full-width header layer */}
      <header
        style={{
          position:   'fixed',
          top:        0,
          left:       0,
          right:      0,
          zIndex:     9999,
          display:    'flex',
          justifyContent: 'center',
          padding:    scrolled ? '10px 16px' : '18px 16px',
          transition: 'padding 0.3s ease',
          pointerEvents: 'none',
        }}
      >
        {/* The pill container */}
        <div
          style={{
            pointerEvents: 'auto',
            display:        'flex',
            alignItems:     'center',
            gap:            '0',
            width:          '100%',
            maxWidth:       820,
            background:     scrolled
              ? 'var(--nav-bg-scrolled, rgba(10,15,26,0.97))'
              : 'var(--nav-bg)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border:         '1px solid var(--stroke-color)',
            borderRadius:   '999px',
            padding:        '6px 8px 6px 10px',
            boxShadow:      scrolled
              ? '0 8px 40px rgba(0,0,0,0.45), 0 0 0 1px rgba(59,130,246,0.08)'
              : '0 4px 24px rgba(0,0,0,0.25)',
            transition:     'all 0.3s ease',
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              display:        'flex',
              alignItems:     'center',
              gap:            8,
              textDecoration: 'none',
              flexShrink:     0,
              marginRight:    4,
            }}
          >
            {/* Direct transparent PNG logo image */}
            <img
              src="/logo.png"
              alt="MakiSync"
              style={{
                width:      32,
                height:     32,
                objectFit:  'contain',
                flexShrink: 0,
              }}
            />

            {/* Wordmark */}
            <span
              style={{
                fontSize:   '1rem',
                fontWeight: 800,
                color:      'var(--admin-text-primary)',
                letterSpacing: '-0.02em',
                lineHeight: 1,
                whiteSpace: 'nowrap',
              }}
            >
              Maki<span style={{ color: '#3b82f6' }}>Sync</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <nav
            style={{
              display:        'flex',
              alignItems:     'center',
              gap:            2,
              flex:           1,
              justifyContent: 'center',
            }}
            className="navbar-desktop-links"
          >
            {links.map(link => (
              <a
                key={link.label}
                href={link.href}
                style={{
                  fontSize:       '0.68rem',
                  fontWeight:     700,
                  letterSpacing:  '0.08em',
                  color:          'var(--nav-link-color)',
                  textDecoration: 'none',
                  padding:        '7px 13px',
                  borderRadius:   '999px',
                  transition:     'color 0.15s, background 0.15s',
                  whiteSpace:     'nowrap',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.color = 'var(--admin-text-primary)';
                  (e.currentTarget as HTMLElement).style.background = 'var(--nav-link-hover-bg)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.color = 'var(--nav-link-color)';
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right controls */}
          <div
            style={{
              display:    'flex',
              alignItems: 'center',
              gap:        6,
              marginLeft: 'auto',
              flexShrink: 0,
            }}
          >
            {/* Dark / Light toggle */}
            <button
              onClick={toggleTheme}
              style={{
                width:           34,
                height:          34,
                borderRadius:    '50%',
                border:          'none',
                background:      'transparent',
                color:           'var(--nav-link-color)',
                cursor:          'pointer',
                display:         'flex',
                alignItems:      'center',
                justifyContent:  'center',
                transition:      'color 0.15s, background 0.15s',
                flexShrink:      0,
              }}
              title="Toggle theme"
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = 'var(--nav-link-hover-bg)';
                (e.currentTarget as HTMLElement).style.color = 'var(--admin-text-primary)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'transparent';
                (e.currentTarget as HTMLElement).style.color = 'var(--nav-link-color)';
              }}
            >
              <i className={`bi bi-${darkMode ? 'moon' : 'sun'}`} style={{ fontSize: '0.9rem' }} />
            </button>

            {/* CMS Admin icon */}
            <Link
              href="/login"
              style={{
                width:           34,
                height:          34,
                borderRadius:    '50%',
                border:          'none',
                background:      'transparent',
                color:           'var(--nav-link-color)',
                cursor:          'pointer',
                display:         'flex',
                alignItems:      'center',
                justifyContent:  'center',
                textDecoration:  'none',
                transition:      'color 0.15s, background 0.15s',
                flexShrink:      0,
              }}
              title="Admin Portal"
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = 'var(--nav-link-hover-bg)';
                (e.currentTarget as HTMLElement).style.color = 'var(--admin-text-primary)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'transparent';
                (e.currentTarget as HTMLElement).style.color = 'var(--nav-link-color)';
              }}
            >
              <i className="bi bi-shield-lock" style={{ fontSize: '0.85rem' }} />
            </Link>

            {/* Hire Me CTA */}
            <a
              href="#contact"
              style={{
                padding:        '8px 20px',
                borderRadius:   '999px',
                background:     '#3b82f6',
                color:          '#fff',
                fontWeight:     800,
                fontSize:       '0.78rem',
                letterSpacing:  '-0.01em',
                textDecoration: 'none',
                whiteSpace:     'nowrap',
                boxShadow:      '0 0 20px rgba(59,130,246,0.35)',
                transition:     'background 0.15s, box-shadow 0.15s, transform 0.1s',
                display:        'inline-flex',
                alignItems:     'center',
                flexShrink:     0,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = '#2563eb';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 0 28px rgba(59,130,246,0.5)';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = '#3b82f6';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px rgba(59,130,246,0.35)';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              }}
            >
              Hire Me
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="navbar-mobile-toggle"
            style={{
              display:         'none',
              width:           36,
              height:          36,
              borderRadius:    '50%',
              border:          'none',
              background:      'transparent',
              color:           'var(--nav-link-color)',
              cursor:          'pointer',
              alignItems:      'center',
              justifyContent:  'center',
              marginLeft:      4,
            }}
          >
            <i className={`bi bi-${mobileMenuOpen ? 'x-lg' : 'list'}`} style={{ fontSize: '1.1rem' }} />
          </button>
        </div>
      </header>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div
          style={{
            position:       'fixed',
            top:            70,
            left:           12,
            right:          12,
            zIndex:         9998,
            background:     'var(--nav-bg-scrolled)',
            backdropFilter: 'blur(20px)',
            border:         '1px solid var(--stroke-color)',
            borderRadius:   24,
            padding:        '1.25rem',
            boxShadow:      '0 16px 48px rgba(0,0,0,0.4)',
            display:        'flex',
            flexDirection:  'column',
            gap:            4,
          }}
        >
          {links.map(link => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                padding:        '10px 16px',
                borderRadius:   12,
                fontSize:       '0.8rem',
                fontWeight:     700,
                letterSpacing:  '0.06em',
                color:          'var(--nav-link-color)',
                textDecoration: 'none',
                transition:     'background 0.15s, color 0.15s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = 'var(--nav-link-hover-bg)';
                (e.currentTarget as HTMLElement).style.color = 'var(--admin-text-primary)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'transparent';
                (e.currentTarget as HTMLElement).style.color = 'var(--nav-link-color)';
              }}
            >
              {link.label}
            </a>
          ))}
          <div style={{ height: 1, background: 'var(--stroke-color)', margin: '8px 0' }} />
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              padding:        '11px 16px',
              borderRadius:   12,
              background:     '#3b82f6',
              color:          '#fff',
              fontWeight:     800,
              fontSize:       '0.82rem',
              textAlign:      'center',
              textDecoration: 'none',
            }}
          >
            Hire Me
          </a>
        </div>
      )}

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .navbar-desktop-links { display: none !important; }
          .navbar-mobile-toggle { display: flex !important; }
        }
      `}</style>
    </>
  );
}
