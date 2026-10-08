import React from 'react';
import { Zap, ShieldCheck, Smartphone, MousePointerClick, HardDrive, Terminal, CheckCircle2, ArrowRight } from 'lucide-react';

interface Props {
  setActiveTab: (tab: string) => void;
  lang: 'si' | 'en';
}

export const Overview: React.FC<Props> = ({ setActiveTab, lang }) => {
  const pillars = [
    {
      id: 'auth',
      icon: Smartphone,
      titleEn: 'Dual Authentication (Pairing & QR)',
      titleSi: 'ද්විත්ව සත්යාපනය (Pairing & QR)',
      badge: 'Dual Engine',
      color: 'emerald',
      descEn: 'Automatic phone pairing code via sock.requestPairingCode() or zero-dep terminal UTF-8 QR code.',
      descSi: 'දුරකථන අංකය මඟින් Pairing Code එකක් හෝ Terminal එකේ QR කේතයක් ස්කෑන් කර පහසුවෙන් සම්බන්ධ වන්න.'
    },
    {
      id: 'interactive',
      icon: MousePointerClick,
      titleEn: 'Interactive Buttons & Lists (v6+)',
      titleSi: 'අන්තර්ක්රියාකාරී බටන් සහ ලැයිස්තු',
      badge: 'NativeFlow Proto',
      color: 'cyan',
      descEn: 'Full support for WhatsApp NativeFlow Quick Replies, CTA URL, CTA Call, Copy Code, and Single-Select Lists.',
      descSi: 'Baileys v6+ protocol මඟින් WhatsApp Native Buttons, Link Buttons, Call Buttons සහ List Menus යවන්න.'
    },
    {
      id: 'streaming',
      icon: HardDrive,
      titleEn: '2GB+ Large Movie Streaming',
      titleSi: '2GB+ විශාල ගොනු & මූවි ස්ට්රීම්',
      badge: 'Zero OOM Crash',
      color: 'amber',
      descEn: '64KB chunked Node.js stream pipeline. Prevents V8 heap memory exhaustion, keeping RAM footprint < 30MB.',
      descSi: 'RAM එක පිරී බොට් එක crash නොවී 2GB+ විශාල movies 64KB chunk streams මඟින් සුරක්ෂිතව යවන්න.'
    },
    {
      id: 'commands',
      icon: Terminal,
      titleEn: 'High-Speed Event-Driven Router',
      titleSi: 'ඉහළ වේගය සහ කමාන්ඩ් රවුටරය',
      badge: 'EventEmitter',
      color: 'indigo',
      descEn: 'Extends Node.js EventEmitter. Ultra-fast message deserialization, m.reply, m.react, and O(1) command lookup.',
      descSi: 'EventEmitter පදනම් කරගත් කඩිනම් ආකෘතිය. m.reply, m.react සහ O(1) Map lookup සමඟ සුපිරි වේගයක්.'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-8 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Zero @whiskeysockets/baileys • 100% Full Custom Standalone Engine • 18/18 Tests Passed</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            {lang === 'si' ? (
              <>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 font-mono">Tobi-Baileys</span>{' '}
                ස්වාධීන WhatsApp Web Protocol Engine
              </>
            ) : (
              <>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 font-mono">Tobi-Baileys</span>{' '}
                Standalone WhatsApp Web Protocol Engine
              </>
            )}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {lang === 'si'
              ? '@whiskeysockets/baileys කිසිසේත් භාවිත නොකර, Custom "tobi-devv" Pairing Code, WhatsApp Web WebSocket (Noise_XX_25519 & WABinary), v6+ Interactive Buttons, සහ RAM 30MB ට සීමා වූ 2GB+ Movie Streaming සහිතව Botලාගේ package.json එකට GitHub Link එකෙන් සෘජුව install කරගත හැකි සම්පූර්ණ ලයිබ්රරිය.'
              : 'Built from scratch without @whiskeysockets/baileys. Features custom "tobi-devv" pairing code, pure Node.js Noise handshake, WABinary stanzas, v6+ interactive buttons, and 2GB+ chunked streaming. Ready to install in bot package.json files directly via GitHub.'}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('code')}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 cursor-pointer"
            >
              <span>{lang === 'si' ? 'කෝඩ් ෆයිල්ස් බලන්න (Source Files)' : 'View Source Files & Example'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab('auth')}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm border border-slate-700 transition-all cursor-pointer"
            >
              {lang === 'si' ? 'Pairing Code පරීක්ෂාව' : 'Test Pairing Code'}
            </button>
            <button
              onClick={() => setActiveTab('streaming')}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm border border-slate-700 transition-all cursor-pointer"
            >
              {lang === 'si' ? '2GB+ RAM Benchmark' : 'Stream Benchmark'}
            </button>
          </div>
        </div>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div
              key={pillar.id}
              onClick={() => setActiveTab(pillar.id)}
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all hover:bg-slate-900/90 cursor-pointer space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <span className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 group-hover:scale-105 transition-transform">
                  <Icon className="w-5 h-5" />
                </span>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {pillar.badge}
                </span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                {lang === 'si' ? pillar.titleSi : pillar.titleEn}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {lang === 'si' ? pillar.descSi : pillar.descEn}
              </p>
              <div className="flex items-center gap-1 text-xs font-semibold text-emerald-400 pt-1">
                <span>{lang === 'si' ? 'මොඩියුලය විවෘත කරන්න' : 'Open Playground'}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Architecture Diagram Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Zap className="w-4 h-4 text-emerald-400" />
          <span>{lang === 'si' ? 'Tobi Core ආකෘතිය (System Architecture)' : 'Tobi System Architecture & Pipeline'}</span>
        </h3>

        <div className="p-4 sm:p-6 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
            <div className="p-3 bg-slate-900 border border-slate-700 rounded-xl w-full md:w-auto">
              <div className="text-[10px] text-slate-500 uppercase">Incoming Source</div>
              <div className="text-white font-bold">WhatsApp WebSocket</div>
            </div>
            <div className="text-emerald-400 font-bold hidden md:block">➔</div>
            <div className="p-3 bg-slate-900 border border-emerald-500/30 rounded-xl w-full md:w-auto">
              <div className="text-[10px] text-emerald-400 uppercase">Wrapper Core</div>
              <div className="text-white font-bold">Tobi (EventEmitter)</div>
            </div>
            <div className="text-emerald-400 font-bold hidden md:block">➔</div>
            <div className="p-3 bg-slate-900 border border-cyan-500/30 rounded-xl w-full md:w-auto">
              <div className="text-[10px] text-cyan-400 uppercase">Outbound Engines</div>
              <div className="text-white font-bold">Streams & NativeFlow</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 text-[11px]">
            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <div className="text-emerald-400 font-bold">1. Dual Auth Handler</div>
              <div className="text-slate-400 text-[10px]">Auto pairing code if phone provided, else terminal QR.</div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <div className="text-cyan-400 font-bold">2. 64KB Chunk Pipe</div>
              <div className="text-slate-400 text-[10px]">2GB+ media streams directly to socket without RAM buffering.</div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <div className="text-amber-400 font-bold">3. NativeFlow v6+</div>
              <div className="text-slate-400 text-[10px]">Interactive buttons, list menus, URLs, call & copy codes.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
