// src/components/DancingText.tsx
'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useSystemStatus } from '@/context/SystemStatusContext';

interface DancingTextProps {
  text: string;
  className?: string;
  variant?: 'stagger' | 'wave' | 'pulse'; // Optional animation variant
}

export const DancingText = ({ text, className = '', variant = 'wave' }: DancingTextProps) => {
  const characters = text.split("");
  const { scrollYProgress } = useScroll();
  const { metrics, systemHealth } = useSystemStatus();

  // Amplitude increases with system load
  const baseAmplitude = metrics.cpu > 80 ? 50 : 20;

  return (
    <div className={`flex flex-wrap justify-center overflow-hidden py-4 ${className}`}>
      {characters.map((char, i) => {
        // Each character dances to a different rhythm
        const speed = Math.random() * baseAmplitude + 10;
        const y = useTransform(
          scrollYProgress, 
          [0, 1], 
          [0, i % 2 === 0 ? -speed : speed]
        );
        
        // Color changes based on system load
        const textColor = metrics.cpu > 80 
          ? '#ff4d4d'  // Red when stressed
          : metrics.cpu > 50 
          ? '#fbbf24'  // Amber when busy
          : '#00f7ff'; // Cyan when calm

        return (
          <motion.span
            key={`${char}-${i}`}
            style={{ 
              y, 
              display: 'inline-block', 
              whiteSpace: char === ' ' ? 'pre' : 'normal',
              color: systemHealth === 'healthy' ? textColor : '#9ca3af'
            }}
            initial={{ 
              filter: 'blur(12px)', 
              opacity: 0, 
              scale: 1.5,
              rotateX: 90 
            }}
            whileInView={{ 
              filter: 'blur(0px)', 
              opacity: 1, 
              scale: 1,
              rotateX: 0,
              transition: { 
                delay: i * 0.03 + Math.random() * 0.1, // Staggered reveal
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1] // Custom bezier
              }
            }}
            whileHover={{ 
              scale: 1.4, 
              color: textColor,
              filter: 'blur(0px) drop-shadow(0 0 8px currentColor)',
              transition: { duration: 0.2 } 
            }}
            viewport={{ once: false, amount: 0.5 }}
            className="cursor-default select-none transition-colors duration-300 font-black tracking-tight"
          >
            {char}
          </motion.span>
        );
      })}
    </div>
  );
};
