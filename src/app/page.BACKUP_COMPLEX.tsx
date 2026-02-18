'use client';

import React from 'react';
import { useSystemStatus } from '@/context/SystemStatusContext';
import { useSafeMode } from '@/hooks/useSafeMode';
import { DancingText } from '@/components/DancingText';
import { GlowCard } from '@/components/GlowCard';
import { SystemHeartbeat } from '@/components/SystemHeartbeat';
import LogDashboard from '@/components/LogDashboard';
import MetricDisplay from '@/components/MetricDisplay';
import { Shield, Activity, Database, Users, FileText, AlertTriangle } from 'lucide-react';

export default function HomePage() {
  const { metrics, systemHealth, logs } = useSystemStatus();
  const { isSafeMode, reason: safeModeReason } = useSafeMode();

  const getFrameColor = () => {
    if (isSafeMode) return 'ice-blue';
    if (systemHealth === 'critical') return 'red';
    if (systemHealth === 'degraded') return 'orange';
    return 'metallic';
  };

  const frameColor = getFrameColor();

  return (
    <div className="min-h-screen relative">
      <SystemHeartbeat intensity={metrics.cpu / 100} />

      <div 
        className={`fixed inset-0 pointer-events-none z-10 frame-${frameColor}`}
        style={{
          border: '20px solid transparent',
          borderImage: frameColor === 'metallic' 
            ? 'var(--metallic-gradient) 1' 
            : frameColor === 'ice-blue'
            ? 'linear-gradient(135deg, #00BFFF, #87CEEB, #B0E0E6, #00BFFF) 1'
            : frameColor === 'red'
            ? 'linear-gradient(135deg, #FF0000, #8B0000, #FF4500, #FF0000) 1'
            : 'linear-gradient(135deg, #FFA500, #FF8C00, #FFD700, #FFA500) 1',
          boxShadow: isSafeMode 
            ? '0 0 60px rgba(0, 191, 255, 0.8), inset 0 0 60px rgba(0, 191, 255, 0.4)'
            : systemHealth === 'critical'
            ? '0 0 60px rgba(255, 0, 0, 0.8), inset 0 0 60px rgba(255, 0, 0, 0.4)'
            : '0 0 40px rgba(255, 215, 0, 0.6), inset 0 0 40px rgba(192, 192, 192, 0.3)',
          animation: isSafeMode 
            ? 'ice-pulse 3s ease-in-out infinite'
            : systemHealth === 'critical'
            ? 'danger-pulse 1s ease-in-out infinite'
            : 'metallic-shimmer 8s ease-in-out infinite',
        }}
      />

      {isSafeMode && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-lg shadow-2xl border-2 border-cyan-300 animate-bounce-slow">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6" />
            <div>
              <h3 className="font-bold text-lg">🧊 SAFE MODE ACTIVATED</h3>
              <p className="text-sm opacity-90">{safeModeReason}</p>
            </div>
          </div>
        </div>
      )}

      <main className="relative z-20 max-w-7xl mx-auto px-6 py-12">
        <section className="text-center mb-16 pt-8">
          <DancingText 
            text="GHOST-FREE ENTERPRISE SYSTEM"
            className="text-6xl font-bold mb-6"
            variant="stagger"
          />
          <DancingText 
            text="by Hnoss PrisManTHarIOn"
            className="text-2xl text-gray-400 mb-8"
            variant="wave"
          />
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Living, breathing frontend that dances with your data. 
            Watch metrics flow, animations respond, and the system protect itself.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            <DancingText text="LIVE SYSTEM METRICS" variant="pulse" />
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <MetricDisplay
              label="CPU Usage"
              value={metrics.cpu}
              unit="%"
              icon={<Activity className="w-5 h-5" />}
              threshold={80}
            />
            <MetricDisplay
              label="Memory Usage"
              value={metrics.memory}
              unit="%"
              icon={<Database className="w-5 h-5" />}
              threshold={85}
            />
            <MetricDisplay
              label="Request Rate"
              value={metrics.requestRate}
              unit="req/s"
              icon={<Users className="w-5 h-5" />}
              threshold={500}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MetricDisplay
              label="Active Connections"
              value={metrics.activeConnections}
              unit="conn"
              icon={<Activity className="w-5 h-5" />}
              threshold={1000}
            />
            <MetricDisplay
              label="Error Rate"
              value={metrics.errorRate}
              unit="%"
              icon={<AlertTriangle className="w-5 h-5" />}
              threshold={5}
              isInverted
            />
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            <DancingText text="CORE CAPABILITIES" variant="stagger" />
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <GlowCard 
              variant="gold"
              className="p-6"
            >
              <Shield className="w-12 h-12 mb-4 text-yellow-400" />
              <h3 className="text-xl font-bold mb-3">Ghost-Proof Security</h3>
              <p className="text-gray-300">
                10-table architecture with 30+ RLS policies. Every action tracked, 
                every ghost attempt logged.
              </p>
            </GlowCard>

            <GlowCard 
              variant="silver"
              className="p-6"
            >
              <Activity className="w-12 h-12 mb-4 text-blue-400" />
              <h3 className="text-xl font-bold mb-3">Real-Time Metrics</h3>
              <p className="text-gray-300">
                CPU, memory, request rates update live. System adapts to load 
                automatically.
              </p>
            </GlowCard>

            <GlowCard 
              variant="platinum"
              className="p-6"
            >
              <Database className="w-12 h-12 mb-4 text-purple-400" />
              <h3 className="text-xl font-bold mb-3">Supabase Backend</h3>
              <p className="text-gray-300">
                Enterprise-grade PostgreSQL with realtime subscriptions. 
                Mock mode for development.
              </p>
            </GlowCard>

            <GlowCard 
              variant="copper"
              className="p-6"
            >
              <FileText className="w-12 h-12 mb-4 text-orange-400" />
              <h3 className="text-xl font-bold mb-3">Comprehensive Logging</h3>
              <p className="text-gray-300">
                Every action logged with timestamps, categories, and full context.
                Audit trail guaranteed.
              </p>
            </GlowCard>

            <GlowCard 
              variant="rose"
              className="p-6"
            >
              <Users className="w-12 h-12 mb-4 text-pink-400" />
              <h3 className="text-xl font-bold mb-3">Role-Based Access</h3>
              <p className="text-gray-300">
                Admin, Moderator, User roles with granular permissions. 
                Ban system with appeal process.
              </p>
            </GlowCard>

            <GlowCard 
              variant="cyan"
              className="p-6"
            >
              <Shield className="w-12 h-12 mb-4 text-cyan-400" />
              <h3 className="text-xl font-bold mb-3">Safe Mode Protection</h3>
              <p className="text-gray-300">
                Auto-activates at 80% CPU. Ice blue frame, reduced animations, 
                system stays responsive.
              </p>
            </GlowCard>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            <DancingText text="LIVE ACTIVITY LOG" variant="wave" />
          </h2>
          <LogDashboard logs={logs} maxHeight={400} />
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            <DancingText text="TECHNICAL ARCHITECTURE" variant="pulse" />
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-yellow-400">Frontend Stack</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Next.js 14.2.35 (App Router)</li>
                <li>• React 18.3.1 with TypeScript</li>
                <li>• Framer Motion animations</li>
                <li>• Tailwind CSS styling</li>
                <li>• Lucide React icons</li>
                <li>• 14 custom animated components</li>
              </ul>
            </div>

            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-blue-400">Backend Stack</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Supabase (PostgreSQL)</li>
                <li>• 10-table normalized schema</li>
                <li>• 30+ RLS policies</li>
                <li>• Real-time subscriptions</li>
                <li>• TypeScript type generation</li>
                <li>• Mock mode for development</li>
              </ul>
            </div>

            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-purple-400">System Features</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Auto Safe Mode at 80% CPU</li>
                <li>• Metric-driven animations</li>
                <li>• Stress testing scripts</li>
                <li>• Log aggregation</li>
                <li>• Ghost detection algorithms</li>
                <li>• Complete audit trails</li>
              </ul>
            </div>

            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-green-400">Security Layers</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Row-Level Security (RLS)</li>
                <li>• Ban system with appeals</li>
                <li>• Comprehensive logging</li>
                <li>• Permission escalation tracking</li>
                <li>• Evidence attachment system</li>
                <li>• Admin oversight dashboard</li>
              </ul>
            </div>
          </div>
        </section>

        <footer className="text-center text-gray-500 text-sm">
          <p>System Status: <span className={`font-bold ${
            systemHealth === 'healthy' ? 'text-green-400' :
            systemHealth === 'degraded' ? 'text-yellow-400' :
            'text-red-400'
          }`}>{systemHealth.toUpperCase()}</span></p>
          <p className="mt-2">
            Frame: <span className="font-bold text-yellow-400">
              {frameColor === 'metallic' ? 'GOLD/SILVER/PLATINUM' : 
               frameColor === 'ice-blue' ? 'ICE BLUE (SAFE MODE)' : 
               frameColor === 'red' ? 'RED (CRITICAL)' : 'ORANGE (DEGRADED)'}
            </span>
          </p>
          <p className="mt-4 text-xs">
            Built by Hnoss PrisManTHarIOn | Ghost-Free Since 2026
          </p>
        </footer>
      </main>
    </div>
  );
}
