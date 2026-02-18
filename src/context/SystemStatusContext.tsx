// src/context/SystemStatusContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface SystemMetrics {
  cpu: number;
  memory: number;
  requestRate: number;
  activeConnections: number;
  errorRate: number;
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  category: 'auth' | 'api' | 'database' | 'security' | 'system';
  message: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
}

export type SystemHealth = 'healthy' | 'degraded' | 'critical';

interface SystemStatusContextType {
  metrics: SystemMetrics;
  systemHealth: SystemHealth;
  logs: LogEntry[];
  addLog: (log: Omit<LogEntry, 'id' | 'timestamp'>) => void;
}

const defaultMetrics: SystemMetrics = {
  cpu: 25,
  memory: 40,
  requestRate: 120,
  activeConnections: 45,
  errorRate: 0.5,
};

const SystemStatusContext = createContext<SystemStatusContextType | undefined>(undefined);

export const useSystemStatus = () => {
  const context = useContext(SystemStatusContext);
  if (!context) {
    throw new Error('useSystemStatus must be used within SystemStatusProvider');
  }
  return context;
};

export const SystemStatusProvider = ({ children }: { children: React.ReactNode }) => {
  const [metrics, setMetrics] = useState<SystemMetrics>(defaultMetrics);
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: '1',
      timestamp: new Date(),
      category: 'system',
      message: 'System initialized successfully',
      severity: 'info',
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 5000),
      category: 'security',
      message: 'Ghost detection active - all clear',
      severity: 'info',
    },
  ]);

  // Calculate system health based on metrics
  const calculateSystemHealth = (m: SystemMetrics): SystemHealth => {
    if (m.cpu >= 90 || m.memory >= 90 || m.errorRate >= 10) return 'critical';
    if (m.cpu >= 70 || m.memory >= 75 || m.errorRate >= 5) return 'degraded';
    return 'healthy';
  };

  const systemHealth = calculateSystemHealth(metrics);

  const addLog = (log: Omit<LogEntry, 'id' | 'timestamp'>) => {
    const newLog: LogEntry = {
      ...log,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
    };
    setLogs((prev) => [newLog, ...prev].slice(0, 50)); // Keep last 50 logs
  };

  // Simulate realtime metrics updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => {
        // Simulate natural metric fluctuations
        const cpuChange = (Math.random() - 0.5) * 10;
        const memoryChange = (Math.random() - 0.5) * 5;
        const requestRateChange = (Math.random() - 0.5) * 50;
        const connectionsChange = Math.floor((Math.random() - 0.5) * 10);
        const errorRateChange = (Math.random() - 0.5) * 0.5;

        const newMetrics = {
          cpu: Math.max(5, Math.min(95, prev.cpu + cpuChange)),
          memory: Math.max(20, Math.min(90, prev.memory + memoryChange)),
          requestRate: Math.max(0, Math.min(1000, prev.requestRate + requestRateChange)),
          activeConnections: Math.max(0, Math.min(500, prev.activeConnections + connectionsChange)),
          errorRate: Math.max(0, Math.min(15, prev.errorRate + errorRateChange)),
        };

        // Log significant changes
        if (newMetrics.cpu > 80 && prev.cpu <= 80) {
          addLog({
            category: 'system',
            message: `High CPU usage detected: ${newMetrics.cpu.toFixed(1)}%`,
            severity: 'warning',
          });
        }

        if (newMetrics.errorRate > 5 && prev.errorRate <= 5) {
          addLog({
            category: 'security',
            message: `Elevated error rate: ${newMetrics.errorRate.toFixed(1)}%`,
            severity: 'error',
          });
        }

        return newMetrics;
      });
    }, 3000); // Update every 3 seconds

    // Subscribe to realtime Supabase events (if connected)
    const channel = supabase
      .channel('system_stats_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'system_stats',
        },
        (payload) => {
          addLog({
            category: 'database',
            message: `Database event: ${payload.eventType}`,
            severity: 'info',
          });
        }
      )
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <SystemStatusContext.Provider value={{ metrics, systemHealth, logs, addLog }}>
      {children}
    </SystemStatusContext.Provider>
  );
};
