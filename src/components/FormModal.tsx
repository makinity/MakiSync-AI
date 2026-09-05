'use client';

import { useEffect } from 'react';

interface FormModalProps {
  title: string;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  loading?: boolean;
  children: React.ReactNode;
  submitLabel?: string;
  maxWidth?: number;
}

export default function FormModal({
  title,
  onClose,
  onSubmit,
  loading,
  children,
  submitLabel = 'Save',
  maxWidth = 580,
}: FormModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
        .form-modal-inner {
          background: var(--admin-card);
          border: 1px solid var(--admin-border-strong);
          border-radius: 16px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 24px 60px rgba(0,0,0,0.5);
        }
        @media (max-width: 767px) {
          .form-modal-inner {
            position: fixed; bottom: 0; left: 0; right: 0;
            border-radius: 20px 20px 0 0; max-width: 100% !important;
            animation: slideUp 0.25s ease;
          }
        }
      `}</style>

      {/* Backdrop Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9000,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
        }}
      >
        <div
          className="form-modal-inner"
          style={{ maxWidth }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Mobile Handle */}
          <div className="mobile-handle" style={{ display: 'none', justifyContent: 'center', padding: '0.6rem 0 0' }}>
            <div style={{ width: 36, height: 4, borderRadius: 99, background: 'var(--admin-border-strong)' }} />
          </div>
          <style>{`@media(max-width:767px){.mobile-handle{display:flex!important}}`}</style>

          {/* Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid var(--admin-border)',
            }}
          >
            <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--admin-text-primary)' }}>
              {title}
            </span>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--admin-text-muted)',
                fontSize: '1.2rem',
                lineHeight: 1,
              }}
            >
              <i className="bi bi-x-lg" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={onSubmit}>
            <div style={{ padding: '1.5rem', overflowY: 'auto' }}>{children}</div>

            {/* Footer */}
            <div
              style={{
                padding: '1rem 1.5rem',
                borderTop: '1px solid var(--admin-border)',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '0.75rem',
              }}
            >
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '0.6rem 1.25rem',
                  borderRadius: 10,
                  border: '1px solid var(--admin-border)',
                  background: 'transparent',
                  color: 'var(--admin-text-secondary)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '0.6rem 1.4rem',
                  borderRadius: 10,
                  border: 'none',
                  background: 'var(--admin-accent)',
                  color: '#ffffff',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  fontFamily: 'inherit',
                  boxShadow: '0 4px 12px rgba(59,130,246,0.25)',
                }}
              >
                {loading ? 'Saving...' : submitLabel}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
