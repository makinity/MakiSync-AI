'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/layouts/AppLayout';
import { getAllProjects, getInquiries } from '@/lib/supabase';
import { Project, LeadInquiry } from '@/types/database';
import {
  AreaChart, Area,
  BarChart, Bar,
  PieChart, Pie, Cell,
  ResponsiveContainer,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

// ─── Colour palette ────────────────────────────────────────────────────────────
const ACCENT   = '#3b82f6';
const EMERALD  = '#10b981';
const AMBER    = '#f59e0b';
const PURPLE   = '#8b5cf6';
const ROSE     = '#f43f5e';
const CYAN     = '#06b6d4';

const STATUS_COLORS: Record<string, string> = {
  published: EMERALD,
  draft:     AMBER,
  archived:  '#64748b',
};

// ─── Tooltip shared style ──────────────────────────────────────────────────────
const tooltipStyle = {
  background: '#1e293b',
  border: '1px solid #334155',
  borderRadius: 10,
  color: '#e2e8f0',
  fontSize: '0.78rem',
};

// ─── Mock monthly project activity (based on created_at or synthetic) ─────────
function buildMonthlyData(projects: Project[]) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const counts: Record<string, { published: number; draft: number; views: number }> = {};
  months.forEach(m => { counts[m] = { published: 0, draft: 0, views: 0 }; });

  projects.forEach((p, i) => {
    const date = p.created_at ? new Date(p.created_at) : new Date();
    const month = months[date.getMonth()];
    if (p.status === 'published') counts[month].published++;
    else counts[month].draft++;
    // Synthetic view count – realistic for a small portfolio
    counts[month].views += 120 + i * 47 + (date.getMonth() * 15);
  });

  // Always show last 9 months so the chart isn't empty
  const now = new Date();
  const result = [];
  for (let i = 8; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const m = months[d.getMonth()];
    result.push({ month: m, ...counts[m] });
  }
  return result;
}

function buildFormatData(projects: Project[]) {
  const map: Record<string, number> = {};
  projects.forEach(p => { 
    const fmt = p.format || '16:9';
    map[fmt] = (map[fmt] || 0) + 1; 
  });
  return Object.entries(map).map(([name, value]) => ({ name, value }));
}

function buildToolsData(projects: Project[]) {
  const map: Record<string, number> = {};
  projects.forEach(p => {
    (p.tools_used || []).forEach(tool => {
      map[tool] = (map[tool] || 0) + 1;
    });
  });
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([tool, count]) => ({ tool, count }));
}

function buildInquiryStatusData(inquiries: LeadInquiry[]) {
  const map: Record<string, number> = { unread: 0, read: 0, archived: 0 };
  inquiries.forEach(i => { map[i.status] = (map[i.status] || 0) + 1; });
  return Object.entries(map).map(([name, value]) => ({ name, value }));
}

// ─── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({
  label, value, sub, icon, color, trend,
}: {
  label: string; value: number | string; sub?: string;
  icon: string; color: string; trend?: string;
}) {
  return (
    <div style={{
      padding: '1.4rem 1.5rem',
      borderRadius: 16,
      background: 'var(--admin-card)',
      border: '1px solid var(--admin-border)',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.6rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {label}
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--admin-text-primary)', lineHeight: 1.2, marginTop: '0.35rem' }}>
            {value}
          </div>
          {sub && (
            <div style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)', marginTop: '0.2rem' }}>{sub}</div>
          )}
        </div>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: `${color}1a`,
          border: `1px solid ${color}33`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <i className={`bi ${icon}`} style={{ fontSize: '1.2rem', color }} />
        </div>
      </div>
      {trend && (
        <div style={{ fontSize: '0.72rem', color: EMERALD, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <i className="bi bi-arrow-up-right" /> {trend}
        </div>
      )}
    </div>
  );
}

// ─── Chart card wrapper ────────────────────────────────────────────────────────
function ChartCard({ title, subtitle, children, span = 1 }: {
  title: string; subtitle?: string; children: React.ReactNode; span?: number;
}) {
  return (
    <div style={{
      padding: '1.4rem 1.5rem',
      borderRadius: 16,
      background: 'var(--admin-card)',
      border: '1px solid var(--admin-border)',
      gridColumn: span > 1 ? `span ${span}` : undefined,
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem',
    }}>
      <div>
        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--admin-text-primary)' }}>{title}</div>
        {subtitle && <div style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)', marginTop: '0.2rem' }}>{subtitle}</div>}
      </div>
      {children}
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const [projects, setProjects]     = useState<Project[]>([]);
  const [inquiries, setInquiries]   = useState<LeadInquiry[]>([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [p, i] = await Promise.all([getAllProjects(), getInquiries()]);
      setProjects(p);
      setInquiries(i);
      setLoading(false);
    })();
  }, []);

  // ── Derived metrics ──────────────────────────────────────────────────────────
  const published   = projects.filter(p => p.status === 'published').length;
  const drafts      = projects.filter(p => p.status === 'draft').length;
  const archived    = projects.filter(p => p.status === 'archived').length;
  const featured    = projects.filter(p => p.is_featured).length;
  const unreadLeads = inquiries.filter(i => i.status === 'unread').length;
  const totalTools  = [...new Set(projects.flatMap(p => p.tools_used || []))].length;

  // ── Chart data ───────────────────────────────────────────────────────────────
  const monthlyData     = buildMonthlyData(projects);
  const formatData      = buildFormatData(projects);
  const toolsData       = buildToolsData(projects);
  const inquiryData     = buildInquiryStatusData(inquiries);

  const gridStyle = {
    display: 'grid',
    gap: '1.25rem',
  } as const;

  if (loading) {
    return (
      <AppLayout title="Dashboard" description="Analytics Overview">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>
          Loading analytics...
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Dashboard" description="MakiSync AI Video Creator — Analytics Overview">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* ── KPI Row ─────────────────────────────────────────────────────────── */}
        <div style={{ ...gridStyle, gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))' }}>
          <StatCard label="Total Projects"     value={projects.length} icon="bi-film"            color={ACCENT}   sub="Commercial AI video ads"     trend={projects.length > 0 ? 'Active portfolio' : undefined} />
          <StatCard label="Published Ads"      value={published}       icon="bi-check-circle-fill" color={EMERALD} sub={`${((published/Math.max(projects.length,1))*100).toFixed(0)}% of slate`} />
          <StatCard label="Draft Concepts"     value={drafts}          icon="bi-clock-fill"       color={AMBER}   sub="In production pipeline" />
          <StatCard label="Archived"           value={archived}        icon="bi-archive-fill"     color={'#64748b'} sub="Retired projects" />
          <StatCard label="Featured Projects"  value={featured}        icon="bi-star-fill"        color={PURPLE}  sub="On public portfolio" />
          <StatCard label="Unread Leads"       value={unreadLeads}     icon="bi-envelope-fill"    color={ROSE}    sub={`${inquiries.length} total inquiries`} />
          <StatCard label="Tools in Stack"     value={totalTools}      icon="bi-cpu-fill"         color={CYAN}    sub="Unique AI & production tools" />
          <StatCard label="Formats"            value={formatData.length} icon="bi-aspect-ratio-fill" color={AMBER} sub="16:9 · 9:16 aspect ratios" />
        </div>

        {/* ── Row 2: Area chart (wide) + Tool Stack bar (narrow) ──────────────── */}
        <div style={{ ...gridStyle, gridTemplateColumns: '1.6fr 1fr' }}>

          <ChartCard title="Monthly Commercial Ad Activity" subtitle="Projects published vs. drafts over the last 9 months">
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={monthlyData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradPublished" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={ACCENT}  stopOpacity={0.35} />
                    <stop offset="95%" stopColor={ACCENT}  stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradDraft" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={AMBER}   stopOpacity={0.35} />
                    <stop offset="95%" stopColor={AMBER}   stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: '0.75rem', color: '#94a3b8' }} />
                <Area type="monotone" dataKey="published" name="Published" stroke={ACCENT}  strokeWidth={2} fill="url(#gradPublished)" dot={{ r: 3, fill: ACCENT }} />
                <Area type="monotone" dataKey="draft"     name="Draft"     stroke={AMBER}   strokeWidth={2} fill="url(#gradDraft)"     dot={{ r: 3, fill: AMBER }} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="AI Tool Stack Usage" subtitle="How many projects use each tool">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={toolsData} layout="vertical" margin={{ top: 0, right: 16, left: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" allowDecimals={false} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="tool" width={108} tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v} project${Number(v) !== 1 ? 's' : ''}`, 'Usage']} />
                <Bar dataKey="count" name="Projects" radius={[0, 6, 6, 0]}>
                  {toolsData.map((_, i) => (
                    <Cell key={i} fill={[ACCENT, EMERALD, PURPLE, CYAN, AMBER, ROSE, '#ec4899', '#14b8a6'][i % 8]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* ── Row 3: Views Area + Formats + Inquiries ─────────────────────────── */}
        <div style={{ ...gridStyle, gridTemplateColumns: '1.6fr 1fr 1fr' }}>

          <ChartCard title="Estimated Portfolio Views" subtitle="Synthetic engagement trend across 9 months">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthlyData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={CYAN} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={CYAN} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v} views`, 'Portfolio Views']} />
                <Area type="monotone" dataKey="views" name="Views" stroke={CYAN} strokeWidth={2} fill="url(#gradViews)" dot={{ r: 3, fill: CYAN }} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Video Formats" subtitle="Aspect ratio split">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={formatData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v} project${Number(v) !== 1 ? 's' : ''}`, 'Format']} />
                <Bar dataKey="value" name="Projects" radius={[6, 6, 0, 0]}>
                  {formatData.map((_, i) => (
                    <Cell key={i} fill={[ACCENT, PURPLE][i % 2]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Lead Inquiries" subtitle="By status breakdown">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={inquiryData.filter(d => d.value > 0).length > 0 ? inquiryData : [{ name: 'No data', value: 1 }]}
                  cx="50%" cy="50%"
                  innerRadius={52}
                  outerRadius={82}
                  paddingAngle={3}
                  dataKey="value"
                  labelLine={false}
                >
                  {inquiryData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={entry.name === 'No data' ? '#1e293b' : (STATUS_COLORS[entry.name] || '#334155')}
                    />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v, n) => [n === 'No data' ? 'None yet' : `${v} lead${Number(v) !== 1 ? 's' : ''}`, n]} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '0.72rem', color: '#94a3b8' }} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* ── Row 4: Recent projects table ─────────────────────────────────────── */}
        <div style={{
          borderRadius: 16,
          background: 'var(--admin-card)',
          border: '1px solid var(--admin-border)',
          overflow: 'hidden',
        }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--admin-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--admin-text-primary)' }}>Recent Projects</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)', marginTop: '0.15rem' }}>Latest additions to the commercial slate</div>
            </div>
            <a href="/admin/projects" style={{ fontSize: '0.75rem', color: ACCENT, fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              View All <i className="bi bi-arrow-right" />
            </a>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--admin-border)', background: 'rgba(0,0,0,0.15)', fontSize: '0.7rem', fontWeight: 800, color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  <th style={{ padding: '0.85rem 1.25rem', textAlign: 'left' }}>Project</th>
                  <th style={{ padding: '0.85rem 1rem', textAlign: 'left' }}>Client</th>
                  <th style={{ padding: '0.85rem 1rem', textAlign: 'left' }}>Format & Duration</th>
                  <th style={{ padding: '0.85rem 1rem', textAlign: 'left' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {projects.slice(0, 5).map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--admin-border)' }}>
                    <td style={{ padding: '0.85rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img src={p.thumbnail_url} alt={p.title} style={{ width: 44, height: 30, borderRadius: 6, objectFit: 'cover', border: '1px solid var(--admin-border)', flexShrink: 0 }} />
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--admin-text-primary)', lineHeight: 1.3 }}>{p.title}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--admin-text-muted)' }}>/{p.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--admin-text-secondary)' }}>
                      {p.client_spec || (p.tools_used && p.tools_used[0]) || 'AI Video'}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--admin-text-secondary)' }}>
                      <span style={{
                        padding: '0.2rem 0.55rem',
                        borderRadius: 6,
                        fontSize: '0.68rem',
                        fontWeight: 600,
                        background: 'rgba(59,130,246,0.1)',
                        color: 'var(--admin-accent)',
                        border: '1px solid rgba(59,130,246,0.25)',
                        marginRight: 6
                      }}>
                        {p.format}
                      </span>
                      {p.duration}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{ padding: '0.2rem 0.55rem', borderRadius: 6, fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', background: `${STATUS_COLORS[p.status]}1a`, color: STATUS_COLORS[p.status], border: `1px solid ${STATUS_COLORS[p.status]}33` }}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {projects.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--admin-text-muted)', fontSize: '0.82rem' }}>
                      No projects in the slate yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
