'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/layouts/AppLayout';
import ConfirmModal from '@/components/ConfirmModal';
import { LeadInquiry } from '@/types/database';
import { getInquiries, updateInquiryStatus, deleteInquiry } from '@/lib/supabase';

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<LeadInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState<string>('all');
  
  // Delete confirm modal state
  const [deleteTarget, setDeleteTarget] = useState<LeadInquiry | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadInquiries();
  }, []);

  async function loadInquiries() {
    setLoading(true);
    const data = await getInquiries();
    setInquiries(data);
    setLoading(false);
  }

  const filteredInquiries = activeStatus === 'all'
    ? inquiries
    : inquiries.filter(i => i.status === activeStatus);

  async function handleToggleStatus(inquiry: LeadInquiry) {
    const nextStatus = inquiry.status === 'unread' ? 'read' : 'unread';
    await updateInquiryStatus(inquiry.id, nextStatus);
    await loadInquiries();
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    await deleteInquiry(deleteTarget.id);
    setDeleting(false);
    setDeleteTarget(null);
    await loadInquiries();
  }

  return (
    <AppLayout title="Lead Inquiries Inbox" description="Client Commercial Briefs & Project Requests">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['all', 'unread', 'read'].map((st) => (
            <button
              key={st}
              onClick={() => setActiveStatus(st)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: 10,
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                textTransform: 'capitalize',
                fontFamily: 'inherit',
                background: activeStatus === st ? 'var(--admin-accent)' : 'var(--admin-card)',
                color: activeStatus === st ? '#ffffff' : 'var(--admin-text-secondary)',
                border: `1px solid ${activeStatus === st ? 'var(--admin-accent)' : 'var(--admin-border)'}`
              }}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Inbox Table Card */}
        <div style={{
          borderRadius: 16,
          background: 'var(--admin-card)',
          border: '1px solid var(--admin-border)',
          overflow: 'hidden'
        }}>
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>
              Loading lead inquiries inbox...
            </div>
          ) : filteredInquiries.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>
              No commercial lead inquiries found.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{
                    borderBottom: '1px solid var(--admin-border)',
                    background: 'rgba(0,0,0,0.2)',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    color: 'var(--admin-text-muted)',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase'
                  }}>
                    <th style={{ padding: '1rem 1.25rem' }}>Client</th>
                    <th style={{ padding: '1rem 1rem' }}>Project Spec & Budget</th>
                    <th style={{ padding: '1rem 1rem' }}>Timeline</th>
                    <th style={{ padding: '1rem 1rem' }}>Status</th>
                    <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody style={{ fontSize: '0.82rem' }}>
                  {filteredInquiries.map((inq) => (
                    <tr key={inq.id} style={{ borderBottom: '1px solid var(--admin-border)' }}>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ fontWeight: 700, color: 'var(--admin-text-primary)' }}>{inq.name}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)', marginTop: '0.15rem' }}>{inq.email}</div>
                      </td>

                      <td style={{ padding: '1rem 1rem' }}>
                        <div style={{ fontWeight: 700, color: '#60a5fa' }}>{inq.project_type}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--admin-text-secondary)', marginTop: '0.15rem' }}>{inq.budget_range}</div>
                      </td>

                      <td style={{ padding: '1rem 1rem', color: 'var(--admin-text-secondary)' }}>
                        {inq.timeline}
                      </td>

                      <td style={{ padding: '1rem 1rem' }}>
                        <span style={{
                          padding: '0.2rem 0.55rem',
                          borderRadius: 6,
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          background: inq.status === 'unread' ? 'rgba(245,158,11,0.12)' : 'rgba(52,211,153,0.12)',
                          color: inq.status === 'unread' ? '#fbbf24' : '#34d399',
                          border: `1px solid ${inq.status === 'unread' ? 'rgba(245,158,11,0.3)' : 'rgba(52,211,153,0.3)'}`
                        }}>
                          {inq.status}
                        </span>
                      </td>

                      <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => handleToggleStatus(inq)}
                            style={{
                              padding: '0.35rem 0.75rem',
                              borderRadius: 8,
                              border: '1px solid var(--admin-border-strong)',
                              background: 'transparent',
                              color: 'var(--admin-text-secondary)',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            Mark {inq.status === 'unread' ? 'Read' : 'Unread'}
                          </button>
                          <button
                            onClick={() => setDeleteTarget(inq)}
                            style={{
                              padding: '0.35rem 0.75rem',
                              borderRadius: 8,
                              border: '1px solid rgba(239,68,68,0.3)',
                              background: 'rgba(239,68,68,0.08)',
                              color: '#f87171',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* ConfirmModal */}
      {deleteTarget && (
        <ConfirmModal
          message={`Delete inquiry from "${deleteTarget.name}"?`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
          danger={true}
          confirmLabel="Delete Inquiry"
        />
      )}
    </AppLayout>
  );
}
