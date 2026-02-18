// src/app/layout.tsx
'use client';

import './globals.css';
import { SystemStatusProvider } from '@/context/SystemStatusContext';
import { useSafeModeStyles } from '@/hooks/useSafeMode';

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isSafeMode, reason, frameClasses } = useSafeModeStyles();

  return (
    <div className="relative p-2 md:p-4 lg:p-6 min-h-screen">
      {/* Safe-Mode Indicator */}
      {isSafeMode && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-blue-900/90 backdrop-blur-md px-6 py-3 rounded-full border border-blue-400/50 shadow-[0_0_30px_rgba(0,100,255,0.4)]">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-sm font-mono tracking-wider text-white">
              🧊 SAFE MODE ACTIVE ({reason.toUpperCase()})
            </span>
          </div>
        </div>
      )}

      {/* Outer Metallic Border with Dynamic Safe-Mode */}
      <div className={`absolute inset-0 z-0 rounded-3xl p-[2px] md:p-[3px] lg:p-1 ${frameClasses}`}>
        {/* Inner black background (creates the border effect) */}
        <div className="absolute inset-0 rounded-[calc(1.5rem-2px)] md:rounded-[calc(1.5rem-3px)] lg:rounded-[calc(1.5rem-4px)] bg-gradient-to-br from-black via-gray-950 to-black" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 min-h-full rounded-2xl md:rounded-3xl overflow-hidden">
        {children}
      </div>

      {/* Corner Accents - Change color in Safe-Mode */}
      <div className={`absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 rounded-tl-2xl pointer-events-none z-20 transition-colors duration-1000 ${
        isSafeMode ? 'border-blue-400/50' : 'border-cyan-400/30'
      }`} />
      <div className={`absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 rounded-tr-2xl pointer-events-none z-20 transition-colors duration-1000 ${
        isSafeMode ? 'border-blue-400/50' : 'border-purple-400/30'
      }`} />
      <div className={`absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 rounded-bl-2xl pointer-events-none z-20 transition-colors duration-1000 ${
        isSafeMode ? 'border-blue-400/50' : 'border-emerald-400/30'
      }`} />
      <div className={`absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 rounded-br-2xl pointer-events-none z-20 transition-colors duration-1000 ${
        isSafeMode ? 'border-blue-400/50' : 'border-pink-400/30'
      }`} />
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className="scroll-smooth">
      <head>
        <title>Ghost-Free Enterprise System | Policy.Compliance.by.Hnoss</title>
        <meta name="description" content="Enterprise-grade infrastructure with real-time monitoring, 30+ security policies, and complete type safety." />
      </head>
      <body className="antialiased">
        <SystemStatusProvider>
          <LayoutContent>{children}</LayoutContent>
        </SystemStatusProvider>
      </body>
    </html>
  );
}
