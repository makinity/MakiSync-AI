import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--admin-border)',
      background: 'var(--admin-bg-primary)',
      padding: '3rem 2rem',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'space-between',
        gap: 24,
      }} className="footer-inner">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: 16 }}>
          {/* Brand */}
          <div>
            <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--admin-text-primary)' }}>
              Maki<span style={{ color: 'var(--admin-accent)' }}>Sync</span>
            </span>
            <span style={{
              marginLeft: 8, fontSize: '0.62rem', fontWeight: 700,
              padding: '2px 7px', borderRadius: 5,
              background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)',
              color: 'var(--admin-accent)', textTransform: 'uppercase', letterSpacing: '0.08em',
            }}>
              AI Creative
            </span>
            <p style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)', marginTop: 4 }}>
              © {new Date().getFullYear()} Mark Vencent L. Juntilla. All rights reserved.
            </p>
          </div>

          {/* Nav links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
            {[
              { label: 'Work', href: '#selected-work' },
              { label: 'Approach', href: '#approach' },
              { label: 'Capabilities', href: '#capabilities' },
              { label: 'About', href: '#about' },
            ].map(link => (
              <a
                key={link.label}
                href={link.href}
                style={{
                  fontSize: '0.78rem', fontWeight: 500,
                  color: 'var(--admin-text-muted)', textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--admin-text-primary)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--admin-text-muted)'; }}
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/login"
              style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--admin-accent)', textDecoration: 'none' }}
            >
              CMS Admin
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
