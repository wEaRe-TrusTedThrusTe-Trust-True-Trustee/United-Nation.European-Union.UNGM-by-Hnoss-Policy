'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface MetricDisplayProps {
  label: string;
  value: number;
  unit: string;
  icon: React.ReactNode;
  threshold: number;
  isInverted?: boolean; // For error rate (high = bad)
}

export default function MetricDisplay({
  label,
  value,
  unit,
  icon,
  threshold,
  isInverted = false,
}: MetricDisplayProps) {
  // Determine status color
  const getStatusColor = () => {
    const isOverThreshold = value >= threshold;
    const isCritical = isInverted ? isOverThreshold : isOverThreshold;
    
    if (isCritical) return 'border-red-500 bg-red-500/10';
    if (value >= threshold * 0.7) return 'border-yellow-500 bg-yellow-500/10';
    return 'border-green-500 bg-green-500/10';
  };

  const getTextColor = () => {
    const isOverThreshold = value >= threshold;
    const isCritical = isInverted ? isOverThreshold : isOverThreshold;
    
    if (isCritical) return 'text-red-400';
    if (value >= threshold * 0.7) return 'text-yellow-400';
    return 'text-green-400';
  };

  // Calculate percentage for progress bar
  const percentage = Math.min((value / threshold) * 100, 100);

  return (
    <motion.div
      className={`relative p-6 rounded-lg border-2 transition-all duration-300 ${getStatusColor()}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Icon and Label */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`${getTextColor()}`}>
            {icon}
          </div>
          <h3 className="text-sm font-medium text-gray-300">{label}</h3>
        </div>
      </div>

      {/* Value Display */}
      <div className="mb-3">
        <motion.div
          className={`text-4xl font-bold ${getTextColor()}`}
          key={value} // Force re-render on value change
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.3 }}
        >
          {value.toFixed(1)}
          <span className="text-xl ml-1">{unit}</span>
        </motion.div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className={`absolute top-0 left-0 h-full transition-colors duration-300 ${
            percentage >= 100
              ? 'bg-red-500'
              : percentage >= 70
              ? 'bg-yellow-500'
              : 'bg-green-500'
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* Threshold Indicator */}
      <div className="mt-2 text-xs text-gray-500">
        Threshold: {threshold}{unit}
      </div>

      {/* Warning Pulse Effect when over threshold */}
      {value >= threshold && (
        <motion.div
          className="absolute inset-0 border-2 border-red-500 rounded-lg pointer-events-none"
          animate={{
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
    </motion.div>
  );
}
