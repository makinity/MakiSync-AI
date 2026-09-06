'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isError?: boolean;
}

const QUICK_PROMPTS = [
  'What services does Mark offer?',
  'What AI tools does Mark use?',
  'How can I hire Mark for a project?',
];

function FormattedText({ content }: { content: string }) {
  const lines = content.split('\n');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {lines.map((line, lIdx) => {
        if (!line.trim()) return <div key={lIdx} style={{ height: 4 }} />;

        const parts: ReactNode[] = [];
        const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
        let lastIndex = 0;
        let match;

        while ((match = regex.exec(line)) !== null) {
          if (match.index > lastIndex) {
            parts.push(line.substring(lastIndex, match.index));
          }

          const token = match[0];
          if (token.startsWith('**') && token.endsWith('**')) {
            parts.push(
              <strong key={match.index} style={{ fontWeight: 700, color: 'inherit' }}>
                {token.slice(2, -2)}
              </strong>
            );
          } else if (token.startsWith('*') && token.endsWith('*')) {
            parts.push(<em key={match.index}>{token.slice(1, -1)}</em>);
          } else if (token.startsWith('`') && token.endsWith('`')) {
            parts.push(
              <code
                key={match.index}
                style={{
                  padding: '2px 6px',
                  borderRadius: 6,
                  background: 'rgba(59,130,246,0.12)',
                  color: 'var(--admin-accent)',
                  fontSize: '0.85em',
                  fontFamily: 'monospace',
                  border: '1px solid rgba(59,130,246,0.2)',
                }}
              >
                {token.slice(1, -1)}
              </code>
            );
          } else if (token.startsWith('[') && token.includes('](')) {
            const label = token.slice(1, token.indexOf(']'));
            const url = token.slice(token.indexOf('](') + 2, -1);
            parts.push(
              <a
                key={match.index}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#3b82f6',
                  textDecoration: 'none',
                  fontWeight: 700,
                  borderBottom: '1px solid rgba(59,130,246,0.4)',
                }}
              >
                {label}
              </a>
            );
          }

          lastIndex = regex.lastIndex;
        }

        if (lastIndex < line.length) {
          parts.push(line.substring(lastIndex));
        }

        if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
          return (
            <div key={lIdx} style={{ display: 'flex', gap: 8, paddingLeft: 4, alignItems: 'flex-start' }}>
              <span style={{ color: '#3b82f6', fontWeight: 800 }}>•</span>
              <div style={{ flex: 1 }}>{parts.length > 0 ? parts : line.slice(2)}</div>
            </div>
          );
        }

        return <div key={lIdx}>{parts.length > 0 ? parts : line}</div>;
      })}
    </div>
  );
}

export default function MakiBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "👋 Hi! I'm **MakiBot**, Mark Vencent Juntilla's AI assistant. Ask me anything about Mark's AI video campaigns, commercial direction, or workflow!",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const apiMessages = [...messages, userMsg].map(m => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data) {
        throw new Error(data?.content || data?.error || 'Unable to connect to MakiBot API');
      }

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content || 'Sorry, I could not generate a response.',
        isError: data.isError,
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `⚠️ ${err.message || 'Connection error. Please try again.'}`,
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ── Floating Round Button ────────────────────────────────────────── */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle MakiBot Chat"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        style={{
          position:   'fixed',
          bottom:     '1.8rem',
          right:      '1.8rem',
          zIndex:      9999,
          width:      56,
          height:     56,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #6366f1 100%)',
          color:      '#ffffff',
          border:     '1px solid rgba(255,255,255,0.35)',
          boxShadow:  '0 10px 36px rgba(99,102,241,0.4), 0 0 20px rgba(59,130,246,0.3)',
          cursor:     'pointer',
          display:    'flex',
          alignItems: 'center',
          justifyContent: 'center',
          outline:    'none',
        }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.i
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              className="bi bi-x-lg"
              style={{ fontSize: '1.3rem' }}
            />
          ) : (
            <motion.div
              key="robot"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <i className="bi bi-robot" style={{ fontSize: '1.5rem' }} />
              {/* Pulsing emerald status dot */}
              <span
                style={{
                  position:     'absolute',
                  top:          -3,
                  right:        -3,
                  width:        12,
                  height:       12,
                  borderRadius: '50%',
                  background:   '#10b981',
                  border:       '2px solid #ffffff',
                  boxShadow:    '0 0 10px #10b981, 0 0 20px #10b981',
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* ── Chat Container Drawer / Modal ───────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position:       'fixed',
              bottom:         '5.8rem',
              right:          '1.8rem',
              zIndex:          9998,
              width:          'min(390px, calc(100vw - 2.4rem))',
              height:         'min(540px, calc(100vh - 7.5rem))',
              background:     'var(--admin-card)',
              backdropFilter: 'blur(28px)',
              WebkitBackdropFilter: 'blur(28px)',
              border:         '1px solid var(--admin-border-strong)',
              borderRadius:   28,
              boxShadow:      '0 24px 64px -12px rgba(0,0,0,0.3), 0 0 0 1px rgba(59,130,246,0.18)',
              display:        'flex',
              flexDirection:  'column',
              overflow:       'hidden',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding:        '16px 20px',
                borderBottom:   '1px solid var(--admin-border)',
                background:     'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(139,92,246,0.06) 100%)',
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width:          40,
                    height:         40,
                    borderRadius:   '50%',
                    background:     'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: 'center',
                    color:          '#fff',
                    boxShadow:      '0 4px 16px rgba(99,102,241,0.35)',
                    border:         '1.5px solid rgba(255,255,255,0.3)',
                  }}
                >
                  <i className="bi bi-robot" style={{ fontSize: '1.2rem' }} />
                </div>
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--admin-text-primary)', display: 'flex', alignItems: 'center', gap: 6, letterSpacing: '-0.01em' }}>
                    MakiBot
                    <span
                      style={{
                        fontSize: '0.58rem',
                        padding: '2px 7px',
                        borderRadius: 99,
                        background: 'linear-gradient(135deg, rgba(52,211,153,0.2), rgba(59,130,246,0.2))',
                        color: '#10b981',
                        border: '1px solid rgba(16,185,129,0.35)',
                        fontWeight: 800,
                        letterSpacing: '0.04em',
                      }}
                    >
                      AI PRO
                    </span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--admin-text-muted)', fontWeight: 500 }}>
                    Mark Vencent Juntilla Assistant
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'rgba(0,0,0,0.04)',
                  border:     '1px solid var(--admin-border)',
                  color:      'var(--admin-text-muted)',
                  cursor:     'pointer',
                  width:      32,
                  height:     32,
                  borderRadius: '50%',
                  display:    'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(59,130,246,0.15)';
                  (e.currentTarget as HTMLElement).style.color = 'var(--admin-text-primary)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.04)';
                  (e.currentTarget as HTMLElement).style.color = 'var(--admin-text-muted)';
                }}
              >
                <i className="bi bi-x-lg" style={{ fontSize: '0.9rem' }} />
              </button>
            </div>

            {/* Messages Area */}
            <div
              style={{
                flex:           1,
                padding:        '18px 16px',
                overflowY:      'auto',
                display:        'flex',
                flexDirection:  'column',
                gap:            14,
              }}
            >
              {messages.map(msg => (
                <div
                  key={msg.id}
                  style={{
                    display:        'flex',
                    flexDirection:  'column',
                    alignItems:     msg.role === 'user' ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div
                    style={{
                      maxWidth:     '88%',
                      padding:      '12px 16px',
                      borderRadius: msg.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                      background:   msg.role === 'user'
                        ? 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)'
                        : msg.isError
                        ? 'rgba(239, 68, 68, 0.1)'
                        : 'var(--admin-bg-secondary)',
                      color:        msg.role === 'user' ? '#ffffff' : 'var(--admin-text-primary)',
                      border:       msg.role === 'user'
                        ? 'none'
                        : msg.isError
                        ? '1px solid rgba(239, 68, 68, 0.3)'
                        : '1px solid var(--admin-border-strong)',
                      borderLeft:   msg.role === 'assistant' && !msg.isError ? '3px solid #3b82f6' : undefined,
                      fontSize:     '0.83rem',
                      lineHeight:   1.55,
                      wordBreak:    'break-word',
                      boxShadow:    msg.role === 'user'
                        ? '0 6px 20px rgba(37,99,235,0.3)'
                        : '0 4px 16px rgba(0,0,0,0.05)',
                    }}
                  >
                    <FormattedText content={msg.content} />
                  </div>
                </div>
              ))}

              {/* Suggested Prompts (Shown on start) */}
              {messages.length === 1 && (
                <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--admin-text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    Suggested Questions
                  </div>
                  {QUICK_PROMPTS.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(prompt)}
                      style={{
                        textAlign:     'left',
                        padding:        '9px 14px',
                        borderRadius:   14,
                        background:     'var(--admin-bg-secondary)',
                        border:         '1px solid var(--admin-border-strong)',
                        color:          'var(--admin-accent)',
                        fontSize:       '0.77rem',
                        fontWeight:      600,
                        cursor:         'pointer',
                        transition:     'all 0.2s ease',
                        boxShadow:      '0 2px 8px rgba(0,0,0,0.03)',
                      }}
                      onMouseEnter={e => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.borderColor = '#3b82f6';
                        el.style.transform   = 'translateY(-1px)';
                        el.style.boxShadow   = '0 4px 14px rgba(59,130,246,0.15)';
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.borderColor = 'var(--admin-border-strong)';
                        el.style.transform   = 'translateY(0)';
                        el.style.boxShadow   = '0 2px 8px rgba(0,0,0,0.03)';
                      }}
                    >
                      💡 {prompt}
                    </button>
                  ))}
                </div>
              )}

              {/* Animated 3-dot pulse typing indicator */}
              {loading && (
                <div
                  style={{
                    display:        'inline-flex',
                    alignItems:     'center',
                    gap:            8,
                    padding:        '10px 16px',
                    borderRadius:   '18px 18px 18px 4px',
                    background:     'var(--admin-bg-secondary)',
                    border:         '1px solid var(--admin-border)',
                    borderLeft:     '3px solid #3b82f6',
                    width:          'fit-content',
                  }}
                >
                  <i className="bi bi-robot" style={{ color: '#3b82f6', fontSize: '0.9rem' }} />
                  <span style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)', fontWeight: 600 }}>MakiBot is thinking</span>
                  <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                    <motion.span
                      animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
                      transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut', delay: 0 }}
                      style={{ width: 4, height: 4, borderRadius: '50%', background: '#3b82f6', display: 'inline-block' }}
                    />
                    <motion.span
                      animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
                      transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut', delay: 0.2 }}
                      style={{ width: 4, height: 4, borderRadius: '50%', background: '#8b5cf6', display: 'inline-block' }}
                    />
                    <motion.span
                      animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
                      transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut', delay: 0.4 }}
                      style={{ width: 4, height: 4, borderRadius: '50%', background: '#6366f1', display: 'inline-block' }}
                    />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSend();
              }}
              style={{
                padding:      '12px 16px 16px 16px',
                borderTop:    '1px solid var(--admin-border)',
                background:   'var(--admin-bg-secondary)',
                display:      'flex',
                alignItems:   'center',
                gap:           10,
              }}
            >
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask MakiBot anything..."
                disabled={loading}
                style={{
                  flex:         1,
                  padding:      '11px 16px',
                  borderRadius: 99,
                  background:   'var(--admin-card)',
                  border:       '1px solid var(--admin-border-strong)',
                  color:        'var(--admin-text-primary)',
                  fontSize:     '0.82rem',
                  outline:      'none',
                  boxShadow:    '0 2px 8px rgba(0,0,0,0.02)',
                  transition:   'border-color 0.2s, box-shadow 0.2s',
                }}
                onFocus={e => {
                  e.currentTarget.style.borderColor = '#3b82f6';
                  e.currentTarget.style.boxShadow   = '0 0 16px rgba(59,130,246,0.2)';
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = 'var(--admin-border-strong)';
                  e.currentTarget.style.boxShadow   = '0 2px 8px rgba(0,0,0,0.02)';
                }}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                style={{
                  width:        38,
                  height:       38,
                  borderRadius: '50%',
                  background:   input.trim() && !loading
                    ? 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)'
                    : 'var(--admin-border)',
                  color:        '#fff',
                  border:       'none',
                  cursor:       input.trim() && !loading ? 'pointer' : 'default',
                  display:      'flex',
                  alignItems:   'center',
                  justifyContent: 'center',
                  transition:   'all 0.2s ease',
                  flexShrink:   0,
                  boxShadow:    input.trim() && !loading ? '0 4px 14px rgba(59,130,246,0.35)' : 'none',
                }}
              >
                <i className="bi bi-send-fill" style={{ fontSize: '0.9rem' }} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
