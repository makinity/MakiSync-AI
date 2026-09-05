'use client';

import { motion } from 'framer-motion';

interface MarqueeTextProps {
  text: string;
  speed?: number;
  reverse?: boolean;
}

export default function MarqueeText({ text, speed = 40, reverse = false }: MarqueeTextProps) {
  const repeated = Array(8).fill(text).join('  ·  ');

  return (
    <div style={{ overflow: 'hidden', width: '100%', userSelect: 'none', pointerEvents: 'none' }}>
      <motion.div
        style={{ display: 'inline-flex', whiteSpace: 'nowrap' }}
        animate={{ x: reverse ? ['0%', '50%'] : ['0%', '-50%'] }}
        transition={{ duration: speed, ease: 'linear', repeat: Infinity }}
      >
        {[0, 1].map(i => (
          <span
            key={i}
            style={{
              fontSize: 'clamp(64px, 11vw, 150px)',
              fontWeight: 900,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              color: 'transparent',
              WebkitTextStroke: '1.5px var(--stroke-color)',
              lineHeight: 1,
              paddingRight: '0.4em',
              fontFamily: 'inherit',
            }}
          >
            {repeated}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
