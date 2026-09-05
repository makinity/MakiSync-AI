'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/layouts/AppLayout';
import { getSiteSettings, saveSiteSettings } from '@/lib/supabase';
import { SiteSettings } from '@/types/database';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const s = await getSiteSettings();
    setSettings(s);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    await saveSiteSettings(settings);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!settings) return null;

  return (
    <AppLayout title="Site CMS Settings" description="Manage Homepage Hero & 2026 Showreel CMS">
      <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--admin-text-primary)' }}>
            Homepage & Showreel CMS Settings
          </h2>
          {saved && (
            <span style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 700 }}>
              ✓ Settings Saved Successfully!
            </span>
          )}
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Showreel Config */}
          <div style={{
            padding: '1.5rem',
            borderRadius: 16,
            background: 'var(--admin-card)',
            border: '1px solid var(--admin-border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--admin-accent)' }}>
              2026 Director Cut Showreel Modal
            </h3>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--admin-text-secondary)', marginBottom: '0.4rem' }}>
                Showreel Title
              </label>
              <input
                type="text"
                value={settings.showreel.title}
                onChange={e => setSettings({ ...settings, showreel: { ...settings.showreel, title: e.target.value } })}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.9rem',
                  borderRadius: 10,
                  background: 'var(--admin-bg-primary)',
                  border: '1px solid var(--admin-border)',
                  color: 'var(--admin-text-primary)',
                  fontSize: '0.82rem',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--admin-text-secondary)', marginBottom: '0.4rem' }}>
                Showreel Master 4K Video URL
              </label>
              <input
                type="text"
                value={settings.showreel.video_url}
                onChange={e => setSettings({ ...settings, showreel: { ...settings.showreel, video_url: e.target.value } })}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.9rem',
                  borderRadius: 10,
                  background: 'var(--admin-bg-primary)',
                  border: '1px solid var(--admin-border)',
                  color: 'var(--admin-text-primary)',
                  fontSize: '0.82rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: 12,
              border: 'none',
              background: 'var(--admin-accent)',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: saving ? 'not-allowed' : 'pointer',
              width: 'fit-content',
              boxShadow: '0 4px 12px rgba(59,130,246,0.25)'
            }}
          >
            {saving ? 'Saving Settings...' : 'Save CMS Settings'}
          </button>
        </form>

      </div>
    </AppLayout>
  );
}
