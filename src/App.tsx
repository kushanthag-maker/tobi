import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Overview } from './components/Overview';
import { DualAuthPlayground } from './components/DualAuthPlayground';
import { InteractiveButtonsStudio } from './components/InteractiveButtonsStudio';
import { StreamBenchmarkStudio } from './components/StreamBenchmarkStudio';
import { CommandPlayground } from './components/CommandPlayground';
import { SourceCodeBrowser } from './components/SourceCodeBrowser';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [lang, setLang] = useState<'si' | 'en'>('si');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        setLang={setLang}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <Overview setActiveTab={setActiveTab} lang={lang} />
        )}

        {activeTab === 'auth' && (
          <DualAuthPlayground lang={lang} />
        )}

        {activeTab === 'interactive' && (
          <InteractiveButtonsStudio lang={lang} />
        )}

        {activeTab === 'streaming' && (
          <StreamBenchmarkStudio lang={lang} />
        )}

        {activeTab === 'commands' && (
          <CommandPlayground lang={lang} />
        )}

        {activeTab === 'code' && (
          <SourceCodeBrowser lang={lang} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-slate-400">TOBI ENGINE</span>
            <span>•</span>
            <span>High-Performance Baileys Wrapper</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Zero External Dependencies</span>
            <span>•</span>
            <span>2GB+ Stream Safe</span>
            <span>•</span>
            <span>Node.js v18+ / v20+ / v22+</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
