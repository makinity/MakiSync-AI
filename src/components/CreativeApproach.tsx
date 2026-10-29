'use client';

import { useState, useEffect, useRef } from 'react';

interface PipelineStep {
  step: string;
  title: string;
  icon: string;
  phase: string;
  description: string;
  tools: string[];
  deliverable: string;
}

const STEPS: PipelineStep[] = [
  {
    step: '01',
    title: 'Business Strategy',
    icon: 'bi-bullseye',
    phase: 'Phase 1 - Objective',
    description: 'Deconstruct brand goals, target audience psychology, and commercial placement (16:9 cinematic vs. 9:16 high-hook social ads).',
    tools: ['ROAS Strategy', 'Audience Hooks', 'Ad Placements'],
    deliverable: 'Campaign Strategy & ROI Architecture',
  },
  {
    step: '02',
    title: 'Concept & Storyboard',
    icon: 'bi-lightbulb',
    phase: 'Phase 2 - Narrative',
    description: 'Develop narrative arcs, visual themes, script copy, and shot-by-shot storyboards tuned for instant emotional hook and retention.',
    tools: ['Claude 3.5 Sonnet', 'Midjourney v6.1', 'Director Boards'],
    deliverable: 'Visual Script & Shot Storyboards',
  },
  {
    step: '03',
    title: 'Shot Architecture',
    icon: 'bi-camera-video',
    phase: 'Phase 3 - Framing',
    description: 'Define virtual camera lenses, 3D motion paths, lighting contrast ratios, and seed parameters for frame-to-frame consistency.',
    tools: ['Camera Motions', 'Lighting Prompts', 'Seed Locking'],
    deliverable: 'Virtual Cinematography Deck',
  },
  {
    step: '04',
    title: 'AI Production',
    icon: 'bi-cpu',
    phase: 'Phase 4 - Generation',
    description: 'Execute high-fidelity AI video generation via Google Flow & SOTA models with visual character & product asset continuity.',
    tools: ['Google Flow', 'Kling AI 1.5', 'Runway Gen-3', 'Luma Dream'],
    deliverable: 'Raw High-Def AI Video Renders',
  },
  {
    step: '05',
    title: 'Post-Production',
    icon: 'bi-sliders',
    phase: 'Phase 5 - Polish',
    description: 'Color grade, speed ramp, synthesize human-grade voiceover, layer spatial sound effects, and master for pristine 4K delivery.',
    tools: ['Premiere Pro', 'Topaz Video 4K', 'ElevenLabs', 'Spatial SFX'],
    deliverable: 'Commercial 4K Master Renders',
  },
];

export default function CreativeApproach() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isInView, setIsInView] = useState<boolean>(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Detect when the section is in the visitor's viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.25 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Continuous auto-cycling flow through the pipeline (pauses on hover)
  useEffect(() => {
    if (isPaused || !isInView) return;

    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % STEPS.length);
    }, 3400);

    return () => clearInterval(timer);
  }, [isPaused, isInView]);

  return (
    <section
      id="approach"
      ref={sectionRef}
      style={{
        padding: '6.5rem 2rem 7rem',
        background: 'var(--admin-bg-secondary)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle ambient background glow */}
      <div
        style={{
          position: 'absolute',
          top: '25%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 800,
          height: 380,
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(60px)',
        }}
      />

      <div style={{ maxWidth: 1240, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 3rem' }}>
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
              marginBottom: 14,
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
            Director-Led Pipeline
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
            How I Approach{' '}
            <span
              style={{
                background: 'var(--heading-gradient)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              AI Video Production
            </span>
          </h2>

          <p style={{ fontSize: '0.92rem', color: 'var(--admin-text-muted)', lineHeight: 1.7, margin: 0 }}>
            AI is the production engine; creative direction remains the craft. Every commercial video project follows a disciplined, automated pipeline from strategy to final 4K render.
          </p>
        </div>

        {/* ======================================================== */}
        {/* PIPELINE FLOW TRACK & INTERACTIVE STAGE NODES */}
        {/* ======================================================== */}
        <div
          className="pipeline-rail-wrapper"
          style={{
            position: 'relative',
            marginBottom: '2.5rem',
            padding: '0 1rem',
          }}
        >
          {/* Background Connecting Rail Line */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '5%',
              right: '5%',
              height: 2,
              background: 'var(--admin-border)',
              transform: 'translateY(-50%)',
              zIndex: 1,
            }}
          >
            {/* Animated Pulsing Energy Beam that flows across the rail */}
            <div
              className="pipeline-flow-beam"
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                width: '35%',
                background: 'linear-gradient(90deg, transparent 0%, #3b82f6 50%, #60a5fa 80%, transparent 100%)',
                boxShadow: '0 0 12px #3b82f6',
              }}
            />
          </div>

          {/* 5 Stage Node Checkpoints */}
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {STEPS.map((step, idx) => {
              const isActive = activeStep === idx;
              const isPast = activeStep > idx;

              return (
                <button
                  key={step.step}
                  type="button"
                  onClick={() => {
                    setActiveStep(idx);
                    setIsPaused(true);
                  }}
                  onMouseEnter={() => {
                    setActiveStep(idx);
                    setIsPaused(true);
                  }}
                  onMouseLeave={() => setIsPaused(false)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 12px',
                    borderRadius: 14,
                    transition: 'all 0.3s ease',
                  }}
                >
                  {/* Node Circle */}
                  <div
                    style={{
                      width: isActive ? 44 : 36,
                      height: isActive ? 44 : 36,
                      borderRadius: '50%',
                      background: isActive
                        ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
                        : isPast
                        ? 'rgba(59, 130, 246, 0.18)'
                        : 'var(--admin-card)',
                      border: isActive
                        ? '2px solid #60a5fa'
                        : isPast
                        ? '2px solid rgba(59, 130, 246, 0.4)'
                        : '2px solid var(--admin-border)',
                      boxShadow: isActive
                        ? '0 0 24px rgba(59, 130, 246, 0.65)'
                        : 'none',
                      color: isActive ? '#ffffff' : isPast ? 'var(--admin-accent)' : 'var(--admin-text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: isActive ? '0.88rem' : '0.78rem',
                      fontWeight: 800,
                      fontFamily: 'monospace',
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      position: 'relative',
                    }}
                  >
                    {isActive ? (
                      <i className={`bi ${step.icon}`} style={{ fontSize: '1rem' }} />
                    ) : (
                      step.step
                    )}

                    {/* Active Ripple Aura */}
                    {isActive && (
                      <span
                        className="node-ring-aura"
                        style={{
                          position: 'absolute',
                          inset: -5,
                          borderRadius: '50%',
                          border: '2px solid rgba(59, 130, 246, 0.6)',
                          pointerEvents: 'none',
                        }}
                      />
                    )}
                  </div>

                  {/* Stage Title */}
                  <span
                    className="pipeline-node-title"
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: isActive ? 800 : 600,
                      color: isActive ? 'var(--admin-accent)' : 'var(--admin-text-secondary)',
                      letterSpacing: '-0.01em',
                      whiteSpace: 'nowrap',
                      transition: 'color 0.2s ease',
                    }}
                  >
                    {step.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ======================================================== */}
        {/* 5 CARDS GRID WITH CONTINUOUS FLOW & HOVER SPOTLIGHT */}
        {/* ======================================================== */}
        <div
          className="approach-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 16,
            alignItems: 'stretch',
          }}
        >
          {STEPS.map((step, idx) => {
            const isActive = activeStep === idx;

            return (
              <div
                key={step.step}
                onClick={() => {
                  setActiveStep(idx);
                  setIsPaused(true);
                }}
                onMouseEnter={() => {
                  setActiveStep(idx);
                  setIsPaused(true);
                }}
                onMouseLeave={() => setIsPaused(false)}
                className={`pipeline-card ${isActive ? 'active-pipeline-card' : ''}`}
                style={{
                  background: 'var(--admin-card)',
                  border: isActive
                    ? '1.5px solid rgba(59, 130, 246, 0.75)'
                    : '1px solid var(--admin-border)',
                  borderRadius: 20,
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 16,
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  transform: isActive ? 'translateY(-8px)' : 'translateY(0)',
                  boxShadow: isActive
                    ? '0 20px 40px rgba(59, 130, 246, 0.2), 0 0 0 1px rgba(59, 130, 246, 0.3)'
                    : '0 6px 20px rgba(0, 0, 0, 0.04)',
                  transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                {/* Active Animated Progress Line */}
                {isActive && (
                  <div
                    className="active-progress-bar"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 3,
                      background: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
                      boxShadow: '0 0 10px #3b82f6',
                    }}
                  />
                )}

                {/* Card Header & Content */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span
                        style={{
                          fontSize: '1.45rem',
                          fontWeight: 900,
                          color: isActive ? '#3b82f6' : 'var(--admin-accent)',
                          fontFamily: 'monospace',
                          lineHeight: 1,
                          textShadow: isActive ? '0 0 14px rgba(59, 130, 246, 0.45)' : 'none',
                        }}
                      >
                        {step.step}
                      </span>
                      {isActive && (
                        <span
                          style={{
                            fontSize: '0.58rem',
                            fontWeight: 800,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            padding: '2px 7px',
                            borderRadius: 6,
                            background: 'rgba(59, 130, 246, 0.15)',
                            color: '#3b82f6',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                          }}
                        >
                          ACTIVE
                        </span>
                      )}
                    </div>

                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 12,
                        background: isActive
                          ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
                          : 'rgba(59, 130, 246, 0.08)',
                        border: isActive
                          ? '1px solid #60a5fa'
                          : '1px solid rgba(59, 130, 246, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isActive ? '#ffffff' : 'var(--admin-accent)',
                        boxShadow: isActive ? '0 4px 14px rgba(59, 130, 246, 0.4)' : 'none',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <i className={`bi ${step.icon}`} style={{ fontSize: 16 }} />
                    </div>
                  </div>

                  <div>
                    <h3
                      style={{
                        fontSize: '0.92rem',
                        fontWeight: 800,
                        color: 'var(--admin-text-primary)',
                        margin: '0 0 8px',
                        lineHeight: 1.35,
                      }}
                    >
                      {step.title}
                    </h3>
                    <p
                      style={{
                        fontSize: '0.76rem',
                        color: 'var(--admin-text-secondary)',
                        lineHeight: 1.6,
                        margin: 0,
                      }}
                    >
                      {step.description}
                    </p>
                  </div>

                  {/* Micro Tech Tools Badges */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, paddingTop: 4 }}>
                    {step.tools.map((tool, tIdx) => (
                      <span
                        key={tIdx}
                        style={{
                          fontSize: '0.62rem',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: 6,
                          background: isActive
                            ? 'rgba(59, 130, 246, 0.12)'
                            : 'var(--admin-bg-secondary)',
                          color: isActive
                            ? '#2563eb'
                            : 'var(--admin-text-muted)',
                          border: isActive
                            ? '1px solid rgba(59, 130, 246, 0.35)'
                            : '1px solid var(--admin-border)',
                          transition: 'all 0.25s ease',
                        }}
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Phase & Deliverable */}
                <div
                  style={{
                    paddingTop: 12,
                    borderTop: '1px solid var(--admin-border)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.62rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      color: isActive ? 'var(--admin-accent)' : 'var(--admin-text-muted)',
                    }}
                  >
                    <span>{step.phase}</span>
                    <i
                      className="bi bi-chevron-right"
                      style={{
                        color: 'var(--admin-accent)',
                        fontSize: 11,
                        transform: isActive ? 'translateX(3px)' : 'none',
                        transition: 'transform 0.2s ease',
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ======================================================== */}
        {/* LIVE STAGE HIGHLIGHT BANNER (Shows exact phase deliverable) */}
        {/* ======================================================== */}
        <div
          style={{
            marginTop: '2rem',
            padding: '1rem 1.5rem',
            borderRadius: 16,
            background: 'var(--admin-card)',
            border: '1px solid var(--admin-border)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: '#10b981',
                boxShadow: '0 0 10px #10b981',
                animation: 'pulseGreen 2s infinite',
              }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--admin-text-muted)',
                }}
              >
                LIVE STAGE {STEPS[activeStep].step}:
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--admin-text-primary)' }}>
                {STEPS[activeStep].title}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--admin-accent)',
              }}
            >
              Key Deliverable:
            </span>
            <span
              style={{
                fontSize: '0.82rem',
                fontWeight: 700,
                color: 'var(--admin-text-primary)',
                background: 'rgba(59, 130, 246, 0.08)',
                padding: '4px 12px',
                borderRadius: 8,
                border: '1px solid rgba(59, 130, 246, 0.2)',
              }}
            >
              {STEPS[activeStep].deliverable}
            </span>
          </div>
        </div>

      </div>

      {/* CSS Flow Animations */}
      <style>{`
        /* Energy flow beam traveling across the pipeline rail */
        @keyframes pipelineBeamMotion {
          0% {
            left: -35%;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            left: 100%;
            opacity: 0;
          }
        }

        .pipeline-flow-beam {
          animation: pipelineBeamMotion 4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        /* Pulsing node aura */
        @keyframes ringAuraPulse {
          0% {
            transform: scale(0.95);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.15);
            opacity: 0.3;
          }
          100% {
            transform: scale(0.95);
            opacity: 0.8;
          }
        }

        .node-ring-aura {
          animation: ringAuraPulse 2s ease-in-out infinite;
        }

        /* Progress fill bar */
        @keyframes progressFill {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }

        .active-progress-bar {
          animation: progressFill 3.4s linear forwards;
        }

        @keyframes pulseGreen {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.25);
            opacity: 0.6;
          }
        }

        /* Responsive Breakpoints */
        @media (max-width: 1080px) {
          .approach-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 14px !important;
          }
        }

        @media (max-width: 768px) {
          .approach-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 12px !important;
          }
          .pipeline-node-title {
            display: none !important;
          }
        }

        @media (max-width: 540px) {
          .approach-grid {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
        }
      `}</style>
    </section>
  );
}
