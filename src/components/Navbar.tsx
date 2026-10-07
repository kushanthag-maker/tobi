import React from 'react';
import { Zap, ShieldCheck, HardDrive, Terminal, Cpu, Globe } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  lang: 'si' | 'en';
  setLang: (lang: 'si' | 'en') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, lang, setLang }) => {
  const tabs = [
    { id: 'overview', labelEn: 'Overview & Architecture', labelSi: 'හැඳින්වීම සහ ආකෘතිය' },
    { id: 'auth', labelEn: 'Dual Auth (Pairing/QR)', labelSi: 'ද්විත්ව සත්යාපනය (Pairing/QR)' },
    { id: 'interactive', labelEn: 'Interactive Buttons & Lists', labelSi: 'බටන් සහ ලැයිස්තු (v6+)' },
    { id: 'streaming', labelEn: '2GB+ Stream Benchmark', labelSi: '2GB+ මූවි ස්ට්රීම් සහ RAM' },
    { id: 'commands', labelEn: 'Command Playground', labelSi: 'කමාන්ඩ් පරීක්ෂාව' },
    { id: 'code', labelEn: 'Source Files (Export)', labelSi: 'කෝඩ් ෆයිල්ස් (Export)' },
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur sticky top-0 z-50">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Zap className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white font-mono">TOBI</span>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  v1.0.0 Baileys Wrapper
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                {lang === 'si' 
                  ? 'අධි-වේගී, Zero-Dependency Node.js WhatsApp Wrapper Engine'
                  : 'High-Performance Zero-Dependency Node.js Baileys Framework'}
              </p>
            </div>
          </div>

          {/* Quick Badges & Lang Toggle */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Zero 3rd-Party Deps
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
                <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
                2GB+ Stream Safe
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
                <Cpu className="w-3.5 h-3.5 text-amber-400" />
                &lt; 30MB RAM
              </span>
            </div>

            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'si' ? 'en' : 'si')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-xs font-medium text-slate-200 transition-colors cursor-pointer"
              title="Toggle Sinhala / English"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>{lang === 'si' ? 'සිංහල (SI)' : 'English (EN)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/80">
        <nav className="flex space-x-1 overflow-x-auto py-2 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {lang === 'si' ? tab.labelSi : tab.labelEn}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
