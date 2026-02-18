// src/components/SystemHeartbeat.tsx
'use client';

import { motion } from 'framer-motion';

interface SystemHeartbeatProps {
  intensity: number; // 0-1 scale
}

export const SystemHeartbeat = ({ intensity }: SystemHeartbeatProps) => {
  const load = intensity * 100; // Convert to percentage
  
  // Pulse speed increases with load
  const pulseDuration = load > 80 ? 0.8 : load > 50 ? 1.5 : 2.5;
  
  // Color based on system status
  const glowColor = load > 80 
    ? 'rgba(255, 0, 0, 0.12)'    // Red for high load
    : load > 50
    ? 'rgba(255, 200, 0, 0.08)'  // Amber for medium load
    : 'rgba(0, 247, 255, 0.06)'; // Cyan for normal

  return (
    <motion.div
      animate={{
        opacity: [0.1, 0.4, 0.1],
        scale: [1, 1.08, 1],
      }}
      transition={{
        duration: pulseDuration,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        background: `radial-gradient(circle at 50% 50%, ${glowColor}, transparent 60%)`
      }}
    />
  );
};
