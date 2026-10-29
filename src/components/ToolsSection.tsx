'use client';

import { useState } from 'react';

interface ToolItem {
  name: string;
  category: 'Frontier AI Engine' | 'Creative Studio' | 'Audio & Polish';
  badge: string;
  icon: string;
  accent: string;
  description: string;
}

const TOOLS_DATA: ToolItem[] = [
  // --- Frontier Generative AI Video Engines ---
  {
    name: 'Omniflash',
    category: 'Frontier AI Engine',
    badge: 'Ultra-Fast Gen',
    icon: 'bi-lightning-charge-fill',
    accent: '#f59e0b',
    description: 'High-speed generative video rendering for rapid concept ideation.',
  },
  {
    name: 'Veo 3.1',
    category: 'Frontier AI Engine',
    badge: 'Cinematic Video',
    icon: 'bi-camera-video-fill',
    accent: '#3b82f6',
    description: 'Cinematic depth, prompt adherence & advanced camera control.',
  },
  {
    name: 'Kling 3.0',
    category: 'Frontier AI Engine',
    badge: 'Motion Physics',
    icon: 'bi-cpu-fill',
    accent: '#6366f1',
    description: 'Complex human kinetics, facial consistency & physical realism.',
  },
  {
    name: 'Seedance 2.5',
    category: 'Frontier AI Engine',
    badge: 'Photorealism',
    icon: 'bi-person-bounding-box',
    accent: '#10b981',
    description: 'Hyper-realistic micro-expressions & natural human emotion.',
  },
  {
    name: 'Nano Banana',
    category: 'Frontier AI Engine',
    badge: 'Creative VFX',
    icon: 'bi-stars',
    accent: '#eab308',
    description: 'Dynamic stylized aesthetics, micro-motion & viral visual hooks.',
  },
  {
    name: 'Grok Imagine',
    category: 'Frontier AI Engine',
    badge: 'Multimodal Video',
    icon: 'bi-box-seam-fill',
    accent: '#ec4899',
    description: 'High-resolution image-to-video synthesis & native sound pairing.',
  },

  // --- Director Orchestration, Audio & Post-Production ---
  {
    name: 'Google Flow',
    category: 'Creative Studio',
    badge: 'Orchestrator',
    icon: 'bi-diagram-3-fill',
    accent: '#2563eb',
    description: 'Director-level multi-shot chaining & strict character seed locking.',
  },
  {
    name: 'Higgsfield',
    category: 'Creative Studio',
    badge: 'Camera Motion',
    icon: 'bi-camera-reels-fill',
    accent: '#8b5cf6',
    description: 'Specialized 3D camera paths, bullet-time & cinematic maneuvers.',
  },
  {
    name: 'Kie.ai',
    category: 'Creative Studio',
    badge: 'Workflow Hub',
    icon: 'bi-stack',
    accent: '#06b6d4',
    description: 'Prompt routing, rapid iteration & multi-model workflow synthesis.',
  },
  {
    name: 'ElevenLabs',
    category: 'Audio & Polish',
    badge: 'Voice Cloning',
    icon: 'bi-soundwave',
    accent: '#14b8a6',
    description: 'Studio voice synthesis, commercial voiceover & localized accents.',
  },
  {
    name: 'Suno AI',
    category: 'Audio & Polish',
    badge: 'Music Synthesis',
    icon: 'bi-music-note-beamed',
    accent: '#f43f5e',
    description: 'Original commercial soundtracks, custom beats & genre composition.',
  },
  {
    name: 'CapCut',
    category: 'Audio & Polish',
    badge: 'Post-Production',
    icon: 'bi-film',
    accent: '#0284c7',
    description: 'Frame-accurate speed ramps, viral pacing & broadcast delivery.',
  },
];

export default function ToolsSection() {
  const [hoveredTool, setHoveredTool] = useState<string | null>(null);

  return (
    <section
      id="tools"
      style={{
        padding: '5.5rem 2rem 6.5rem',
        background: 'var(--admin-bg-primary)',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid var(--admin-border)',
      }}
    >
      {/* Ambient background light */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          right: '10%',
          width: 500,
          height: 350,
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(70px)',
        }}
      />

      <div style={{ maxWidth: 1240, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 3rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: '0.68rem',
              fontWeight: 800,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--admin-accent)',
              marginBottom: 12,
              padding: '5px 14px',
              borderRadius: 99,
              background: 'rgba(59,130,246,0.1)',
              border: '1px solid rgba(59,130,246,0.22)',
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: 'var(--admin-accent)',
                boxShadow: '0 0 10px var(--admin-accent)',
              }}
            />
            Production Arsenal
          </div>

          <h2
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
              fontWeight: 900,
              color: 'var(--admin-text-primary)',
              letterSpacing: '-0.03em',
              margin: '0 0 14px',
            }}
          >
            Frontier AI Models &amp;{' '}
            <span
              style={{
                background: 'var(--heading-gradient)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Studio Tools
            </span>
          </h2>

          <p style={{ fontSize: '0.92rem', color: 'var(--admin-text-muted)', lineHeight: 1.7, margin: 0 }}>
            I don&apos;t limit your brand to a single AI tool. I route each shot through the exact frontier engine and mastering suite that delivers artifact-free, commercial-grade results.
          </p>
        </div>

        {/* 12-Tool Grid (6 Columns on Desktop) */}
        <div className="tools-grid">
          {TOOLS_DATA.map((tool) => {
            const isHovered = hoveredTool === tool.name;

            return (
              <div
                key={tool.name}
                onMouseEnter={() => setHoveredTool(tool.name)}
                onMouseLeave={() => setHoveredTool(null)}
                style={{
                  background: 'var(--admin-card)',
                  border: isHovered
                    ? `1.5px solid ${tool.accent}`
                    : '1px solid var(--admin-border)',
                  borderRadius: 18,
                  padding: '1.35rem 1.15rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 14,
                  boxShadow: isHovered
                    ? `0 16px 36px rgba(0, 0, 0, 0.12), 0 0 24px ${tool.accent}30`
                    : 'var(--admin-shadow)',
                  transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
                  transition: 'all 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Top ambient color edge when hovered */}
                {isHovered && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 3,
                      background: tool.accent,
                      boxShadow: `0 0 10px ${tool.accent}`,
                    }}
                  />
                )}

                {/* Header: Icon & Category Tag */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 12,
                      background: `${tool.accent}15`,
                      border: `1px solid ${tool.accent}35`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: tool.accent,
                      fontSize: 18,
                      transition: 'all 0.25s ease',
                      transform: isHovered ? 'scale(1.08)' : 'scale(1)',
                    }}
                  >
                    <i className={`bi ${tool.icon}`} />
                  </div>

                  <span
                    style={{
                      fontSize: '0.62rem',
                      fontWeight: 800,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      padding: '3px 8px',
                      borderRadius: 6,
                      background: 'var(--admin-bg-secondary)',
                      color: 'var(--admin-text-muted)',
                      border: '1px solid var(--admin-border)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {tool.badge}
                  </span>
                </div>

                {/* Name & Description */}
                <div>
                  <h3
                    style={{
                      fontSize: '0.98rem',
                      fontWeight: 800,
                      color: 'var(--admin-text-primary)',
                      margin: '0 0 6px',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {tool.name}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.74rem',
                      color: 'var(--admin-text-secondary)',
                      lineHeight: 1.55,
                      margin: 0,
                    }}
                  >
                    {tool.description}
                  </p>
                </div>

                {/* Footer: Live pipeline indicator */}
                <div
                  style={{
                    paddingTop: 10,
                    borderTop: '1px solid var(--admin-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: '#10b981',
                        boxShadow: '0 0 8px #10b981',
                      }}
                    />
                    <span
                      style={{
                        fontSize: '0.62rem',
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        color: 'var(--admin-text-muted)',
                      }}
                    >
                      Production Ready
                    </span>
                  </div>

                  <i
                    className="bi bi-arrow-up-right"
                    style={{
                      fontSize: 11,
                      color: isHovered ? tool.accent : 'var(--admin-text-muted)',
                      transition: 'color 0.2s',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Responsive Grid Layout */}
      <style>{`
        .tools-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 16px;
        }

        @media (max-width: 1200px) {
          .tools-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 14px !important;
          }
        }

        @media (max-width: 768px) {
          .tools-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
          }
        }

        @media (max-width: 480px) {
          .tools-grid {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
        }
      `}</style>
    </section>
  );
}

