'use client';

import { useEffect } from 'react';

interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  confirmLabel?: string;
  danger?: boolean;
}

export default function ConfirmModal({
  message,
  onConfirm,
  onCancel,
  loading,
  confirmLabel = 'Confirm',
  danger = false,
}: ConfirmModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onCancel]);

  return (
    <div
      onClick={onCancel}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9100,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--admin-card)',
          border: '1px solid var(--admin-border-strong)',
          borderRadius: 16,
          width: '100%',
          maxWidth: 420,
          boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
          overflow: 'hidden',
        }}
      >
        {/* Body Header */}
        <div style={{ padding: '1.5rem 1.5rem 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.85rem' }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                flexShrink: 0,
                background: danger ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.12)',
                border: `1px solid ${danger ? 'rgba(239,68,68,0.3)' : 'rgba(245,158,11,0.3)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <i
                className={`bi ${danger ? 'bi-trash3-fill' : 'bi-exclamation-triangle-fill'}`}
                style={{ color: danger ? '#f87171' : '#fbbf24', fontSize: '1.1rem' }}
              />
            </div>
            <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--admin-text-primary)' }}>
              {danger ? 'Confirm Delete' : 'Are you sure?'}
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--admin-text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            {message}
          </p>
        </div>

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
            onClick={onCancel}
            style={{
              padding: '0.55rem 1.25rem',
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
            onClick={onConfirm}
            disabled={loading}
            style={{
              padding: '0.55rem 1.4rem',
              borderRadius: 10,
              border: 'none',
              background: danger ? '#ef4444' : 'var(--admin-accent)',
              color: '#ffffff',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              fontFamily: 'inherit',
            }}
          >
            {loading ? 'Deleting...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
