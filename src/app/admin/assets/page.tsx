'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/layouts/AppLayout';
import FormModal from '@/components/FormModal';
import ConfirmModal from '@/components/ConfirmModal';
import { MediaAsset } from '@/types/database';
import { getAssets, saveAsset, deleteAsset } from '@/lib/supabase';

export default function AdminAssetsPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Partial<MediaAsset> | null>(null);
  const [saving, setSaving] = useState(false);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<MediaAsset | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadAssets();
  }, []);

  async function loadAssets() {
    setLoading(true);
    const data = await getAssets();
    setAssets(data);
    setLoading(false);
  }

  const filteredAssets = activeCategory === 'All'
    ? assets
    : assets.filter(a => a.category === activeCategory);

  function handleCreateNew() {
    setEditingAsset({
      id: `asset_${Date.now()}`,
      name: '',
      file_url: '',
      file_type: 'image/jpeg',
      file_size: '1.5 MB',
      category: 'Thumbnails',
      tags: ['Google Flow', 'AI Ad'],
      created_at: new Date().toISOString(),
    });
    setModalOpen(true);
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    await deleteAsset(deleteTarget.id);
    setDeleting(false);
    setDeleteTarget(null);
    await loadAssets();
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editingAsset || !editingAsset.name || !editingAsset.file_url) return;
    setSaving(true);

    const assetToSave: MediaAsset = {
      id: editingAsset.id || `asset_${Date.now()}`,
      name: editingAsset.name || 'Untitled Asset',
      file_url: editingAsset.file_url,
      file_type: editingAsset.file_type || 'image/jpeg',
      file_size: editingAsset.file_size || '1.5 MB',
      category: editingAsset.category || 'Thumbnails',
      tags: editingAsset.tags || ['AI Ad'],
      created_at: editingAsset.created_at || new Date().toISOString(),
    };

    await saveAsset(assetToSave);
    setSaving(false);
    setModalOpen(false);
    await loadAssets();
  }

  const inpStyle = {
    width: '100%',
    padding: '0.65rem 0.9rem',
    borderRadius: '10px',
    background: 'var(--admin-bg-secondary)',
    border: '1px solid var(--admin-border)',
    color: 'var(--admin-text-primary)',
    fontSize: '0.82rem',
    outline: 'none',
    fontFamily: 'inherit',
  };

  const lblStyle = {
    display: 'block',
    fontSize: '0.75rem',
    fontWeight: 700,
    color: 'var(--admin-text-secondary)',
    marginBottom: '0.35rem',
  };

  return (
    <AppLayout title="Media Assets Bucket" description="Storage Bucket Gallery for 4K Video Masters & Renders">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        {/* Actions Bar */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderRadius: 16,
          background: 'var(--admin-card)',
          border: '1px solid var(--admin-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--admin-text-primary)' }}>
              Commercial Media Gallery
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)', marginTop: '0.2rem' }}>
              Manage AI video renders, thumbnails, and 4K masters.
            </p>
          </div>

          <button
            onClick={handleCreateNew}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: 12,
              background: 'var(--admin-accent)',
              color: '#ffffff',
              border: 'none',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontFamily: 'inherit',
              boxShadow: '0 4px 12px rgba(59,130,246,0.25)'
            }}
          >
            <i className="bi bi-[#3b82f6] bi-cloud-upload-fill" />
            <span>Add Media Asset</span>
          </button>
        </div>

        {/* Assets Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '1.25rem'
        }}>
          {loading ? (
            <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
              Loading media assets...
            </div>
          ) : filteredAssets.map((asset) => (
            <div
              key={asset.id}
              style={{
                borderRadius: 16,
                background: 'var(--admin-card)',
                border: '1px solid var(--admin-border)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ height: 160, background: 'var(--admin-bg-secondary)', position: 'relative', overflow: 'hidden' }}>
                {asset.file_type.includes('video') ? (
                  <video src={asset.file_url} controls style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <img src={asset.file_url} alt={asset.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                )}
                <span style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  padding: '0.2rem 0.5rem',
                  borderRadius: 6,
                  background: 'rgba(0,0,0,0.75)',
                  color: '#60a5fa',
                  border: '1px solid rgba(59,130,246,0.3)'
                }}>
                  {asset.category}
                </span>
              </div>

              <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--admin-text-primary)', lineHeight: 1.3 }}>
                  {asset.name}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)', display: 'flex', gap: '0.5rem' }}>
                  <span>{asset.file_type}</span>
                  <span>•</span>
                  <span>{asset.file_size}</span>
                </div>
              </div>

              <div style={{
                padding: '0.75rem 1rem',
                borderTop: '1px solid var(--admin-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <a
                  href={asset.file_url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: '0.75rem', color: 'var(--admin-accent)', fontWeight: 600, textDecoration: 'none' }}
                >
                  Open File <i className="bi bi-box-arrow-up-right" />
                </a>

                <button
                  onClick={() => setDeleteTarget(asset)}
                  style={{
                    padding: '0.3rem 0.65rem',
                    borderRadius: 6,
                    border: '1px solid rgba(239,68,68,0.3)',
                    background: 'rgba(239,68,68,0.08)',
                    color: '#f87171',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* FormModal */}
      {modalOpen && editingAsset && (
        <FormModal
          title="Add Media Asset"
          onClose={() => setModalOpen(false)}
          onSubmit={handleSave}
          loading={saving}
          submitLabel="Save Asset"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={lblStyle}>Asset Name *</label>
              <input
                type="text"
                required
                value={editingAsset.name || ''}
                onChange={(e) => setEditingAsset({ ...editingAsset, name: e.target.value })}
                style={inpStyle}
              />
            </div>

            <div>
              <label style={lblStyle}>File URL *</label>
              <input
                type="text"
                required
                value={editingAsset.file_url || ''}
                onChange={(e) => setEditingAsset({ ...editingAsset, file_url: e.target.value })}
                style={inpStyle}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={lblStyle}>Category</label>
                <select
                  value={editingAsset.category || 'Thumbnails'}
                  onChange={(e) => setEditingAsset({ ...editingAsset, category: e.target.value })}
                  style={inpStyle}
                >
                  <option value="Thumbnails">Thumbnails</option>
                  <option value="Videos">Videos</option>
                  <option value="Storyboards">Storyboards</option>
                </select>
              </div>

              <div>
                <label style={lblStyle}>File Type</label>
                <input
                  type="text"
                  value={editingAsset.file_type || 'image/jpeg'}
                  onChange={(e) => setEditingAsset({ ...editingAsset, file_type: e.target.value })}
                  style={inpStyle}
                />
              </div>
            </div>
          </div>
        </FormModal>
      )}

      {/* ConfirmModal */}
      {deleteTarget && (
        <ConfirmModal
          message={`Delete asset "${deleteTarget.name}"?`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
          danger={true}
          confirmLabel="Delete Asset"
        />
      )}
    </AppLayout>
  );
}
