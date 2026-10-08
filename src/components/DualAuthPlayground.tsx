import React, { useState } from 'react';
import { Smartphone, QrCode, KeyRound, Copy, Check, Terminal, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';

interface Props {
  lang: 'si' | 'en';
}

export const DualAuthPlayground: React.FC<Props> = ({ lang }) => {
  const [authMode, setAuthMode] = useState<'pairing' | 'qr'>('pairing');
  const [phone, setPhone] = useState('94712345678');
  const [isGenerating, setIsGenerating] = useState(false);
  const [pairingCode, setPairingCode] = useState('TOBI-DEVV');
  const [codeFormat, setCodeFormat] = useState<'tobi-devv' | 'tobi-devv-full' | 'standard'>('tobi-devv');
  const [copied, setCopied] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  const generateCode = () => {
    setIsGenerating(true);
    setTimeout(() => {
      if (codeFormat === 'tobi-devv') {
        setPairingCode('TOBI-DEVV');
      } else if (codeFormat === 'tobi-devv-full') {
        const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
        let suffix = '';
        for (let i = 0; i < 4; i++) suffix += chars.charAt(Math.floor(Math.random() * chars.length));
        setPairingCode(`TOBI-DEVV-${suffix}`);
      } else {
        const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
        let part1 = '';
        let part2 = '';
        for (let i = 0; i < 4; i++) {
          part1 += chars.charAt(Math.floor(Math.random() * chars.length));
          part2 += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setPairingCode(`${part1}-${part2}`);
      }
      setIsGenerating(false);
    }, 400);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                <KeyRound className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white">
                {lang === 'si' ? 'ද්විත්ව සත්යාපන මොඩියුලය (Dual Authentication Engine)' : 'Dual Authentication Engine (Pairing & QR)'}
              </h2>
            </div>
            <p className="text-sm text-slate-400">
              {lang === 'si'
                ? 'දුරකථන අංකයක් ලබා දී ඇති විට ස්වයංක්රීයව sock.requestPairingCode() මඟින් පේයිරින් කේතය ලබා ගනී. අංකයක් නොමැති නම් Zero-dependency Terminal QR එකක් පෙන්වයි.'
                : 'Automatically initiates sock.requestPairingCode() when phone number is provided, or seamlessly switches to terminal QR code scanning.'}
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex p-1 bg-slate-950 border border-slate-800 rounded-xl self-start md:self-auto">
            <button
              onClick={() => setAuthMode('pairing')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                authMode === 'pairing'
                  ? 'bg-emerald-500 text-slate-950 font-semibold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>{lang === 'si' ? 'Pairing Code (දුරකථන අංකය)' : 'Pairing Code Mode'}</span>
            </button>
            <button
              onClick={() => setAuthMode('qr')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                authMode === 'qr'
                  ? 'bg-emerald-500 text-slate-950 font-semibold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>{lang === 'si' ? 'QR Code Mode (ටර්මිනල්)' : 'QR Code Mode'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Controls */}
        <div className="lg:col-span-6 space-y-6">
          {authMode === 'pairing' ? (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  {lang === 'si' ? 'දුරකථන අංකය මඟින් සම්බන්ධ වීම' : 'Phone Pairing Code Configuration'}
                </h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                  sock.requestPairingCode()
                </span>
              </div>

              {/* Phone Input */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300">
                  {lang === 'si' ? 'WhatsApp දුරකථන අංකය (Country code සමඟ):' : 'WhatsApp Phone Number (with Country Code):'}
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-mono">+</span>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="94712345678"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-7 pr-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                  <button
                    onClick={generateCode}
                    disabled={isGenerating || !phone}
                    className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-bold rounded-xl transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                    <span>{lang === 'si' ? 'කේතය ගන්න' : 'Generate Code'}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-500">
                  {lang === 'si' 
                    ? 'උදාහරණ: ශ්රී ලංකාව සඳහා 947XXXXXXXX, ඉන්දියාව සඳහා 91XXXXXXXX'
                    : 'Digits only. No "+" or spaces needed (Tobi cleans formatting automatically).'}
                </p>
              </div>

              {/* Format selector */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400 font-medium">Format:</span>
                <button
                  onClick={() => { setCodeFormat('tobi-devv'); setPairingCode('TOBI-DEVV'); }}
                  className={`px-2.5 py-1 rounded-lg font-mono font-bold transition-all cursor-pointer ${
                    codeFormat === 'tobi-devv'
                      ? 'bg-emerald-500 text-slate-950 shadow'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  TOBI-DEVV
                </button>
                <button
                  onClick={() => { setCodeFormat('tobi-devv-full'); setPairingCode('TOBI-DEVV-8942'); }}
                  className={`px-2.5 py-1 rounded-lg font-mono font-bold transition-all cursor-pointer ${
                    codeFormat === 'tobi-devv-full'
                      ? 'bg-emerald-500 text-slate-950 shadow'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  TOBI-DEVV-XXXX
                </button>
                <button
                  onClick={() => { setCodeFormat('standard'); setPairingCode('7B4K-92MN'); }}
                  className={`px-2.5 py-1 rounded-lg font-mono transition-all cursor-pointer ${
                    codeFormat === 'standard'
                      ? 'bg-emerald-500 text-slate-950 shadow'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  Standard 8-char
                </button>
              </div>

              {/* Generated Pairing Code Card */}
              <div className="p-5 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-emerald-500/30 rounded-2xl text-center space-y-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  {lang === 'si' ? 'ඔබේ WHATSAPP පේයිරින් කේතය (Pairing Code)' : 'Your Active WhatsApp Pairing Code'}
                </span>

                <div className="flex items-center justify-center gap-3">
                  <div className="text-3xl sm:text-4xl font-extrabold tracking-widest text-white font-mono bg-slate-950 px-6 py-3 rounded-xl border border-slate-800 shadow-inner">
                    {pairingCode}
                  </div>
                  <button
                    onClick={() => copyToClipboard(pairingCode)}
                    className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors cursor-pointer"
                    title="Copy code"
                  >
                    {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>

                <p className="text-xs text-slate-400">
                  {lang === 'si'
                    ? 'මෙම කේතය WhatsApp > Linked Devices > Link with phone number තුළ ඇතුළත් කරන්න.'
                    : 'Enter this 8-digit code in your WhatsApp Linked Devices prompt within 2 minutes.'}
                </p>
              </div>

              {/* Step By Step Guide */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {lang === 'si' ? 'දුරකථනය සම්බන්ධ කරන පියවර (Linking Steps)' : 'Linking Steps on Device'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {[
                    { num: '1', titleEn: 'Open WhatsApp', titleSi: 'WhatsApp විවෘත කරන්න', descEn: 'Go to Settings or ⋮ Menu', descSi: 'Settings හෝ ⋮ Menu වෙත යන්න' },
                    { num: '2', titleEn: 'Linked Devices', titleSi: 'Linked Devices වෙත යන්න', descEn: 'Tap "Link a Device"', descSi: '"Link a Device" ඔබන්න' },
                    { num: '3', titleEn: 'Link with Phone', titleSi: 'Link with Phone තෝරන්න', descEn: 'Tap "Link with phone number instead"', descSi: 'පහළ ඇති විකල්පය ඔබන්න' },
                    { num: '4', titleEn: 'Enter Pairing Code', titleSi: 'කේතය ඇතුළත් කරන්න', descEn: `Enter: ${pairingCode}`, descSi: `ඉහත කේතය (${pairingCode}) ගසන්න` }
                  ].map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-2.5"
                    >
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[11px]">
                        {step.num}
                      </span>
                      <div>
                        <div className="font-semibold text-slate-200">
                          {lang === 'si' ? step.titleSi : step.titleEn}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {lang === 'si' ? step.descSi : step.descEn}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* QR Code Mode View */
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-emerald-400" />
                  {lang === 'si' ? 'Zero-Dependency Terminal QR Code' : 'Terminal QR Code Scanner'}
                </h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
                  Pure Node.js UTF-8 Blocks
                </span>
              </div>

              {/* QR Render Preview */}
              <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col items-center justify-center space-y-4">
                <div className="bg-white p-4 rounded-xl shadow-xl flex items-center justify-center">
                  {/* Stylized QR Code Visual */}
                  <svg className="w-48 h-48" viewBox="0 0 200 200" fill="black">
                    {/* Corner 1 */}
                    <rect x="10" y="10" width="50" height="50" fill="black" />
                    <rect x="20" y="20" width="30" height="30" fill="white" />
                    <rect x="25" y="25" width="20" height="20" fill="black" />
                    {/* Corner 2 */}
                    <rect x="140" y="10" width="50" height="50" fill="black" />
                    <rect x="150" y="20" width="30" height="30" fill="white" />
                    <rect x="155" y="25" width="20" height="20" fill="black" />
                    {/* Corner 3 */}
                    <rect x="10" y="140" width="50" height="50" fill="black" />
                    <rect x="20" y="150" width="30" height="30" fill="white" />
                    <rect x="25" y="155" width="20" height="20" fill="black" />
                    {/* Grid patterns */}
                    <rect x="70" y="20" width="10" height="10" fill="black" />
                    <rect x="90" y="20" width="10" height="10" fill="black" />
                    <rect x="110" y="20" width="10" height="10" fill="black" />
                    <rect x="70" y="40" width="20" height="10" fill="black" />
                    <rect x="100" y="40" width="10" height="20" fill="black" />
                    <rect x="20" y="70" width="10" height="20" fill="black" />
                    <rect x="40" y="80" width="20" height="10" fill="black" />
                    <rect x="70" y="70" width="60" height="60" rx="10" fill="#10b981" />
                    <text x="100" y="105" fill="black" fontSize="14" fontWeight="bold" textAnchor="middle">TOBI</text>
                    <rect x="140" y="70" width="20" height="10" fill="black" />
                    <rect x="170" y="80" width="10" height="20" fill="black" />
                    <rect x="70" y="140" width="10" height="10" fill="black" />
                    <rect x="90" y="150" width="20" height="10" fill="black" />
                    <rect x="120" y="140" width="10" height="20" fill="black" />
                    <rect x="140" y="160" width="30" height="10" fill="black" />
                    <rect x="160" y="140" width="10" height="10" fill="black" />
                  </svg>
                </div>
                <div className="text-center">
                  <div className="text-sm font-semibold text-slate-200">
                    {lang === 'si' ? 'Zero-Dep Terminal QR Renderer' : 'Auto Terminal QR Generator'}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {lang === 'si' 
                      ? 'qrcode-terminal පැකේජය අවශ්ය නොවේ. Node.js Unicode blocks මඟින් සෘජුව ටර්මිනලයේ අඳියි.'
                      : 'Renders in pure terminal using UTF-8 half-block characters without third-party npm tools.'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Real-time Terminal Output Simulation */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-full min-h-[420px]">
            {/* Terminal Header */}
            <div className="bg-slate-900/90 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="text-xs text-slate-400 font-mono ml-2">node example.js (Tobi Terminal)</span>
              </div>
              <span className="text-[11px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                LIVE LOGS
              </span>
            </div>

            {/* Terminal Body */}
            <div className="p-4 font-mono text-xs text-slate-300 space-y-2 flex-1 overflow-y-auto leading-relaxed">
              <div className="text-slate-500">
                ======================================================
              </div>
              <div className="text-cyan-400 font-bold">
                &nbsp;&nbsp;🚀 TOBI ENGINE - BAILEYS WRAPPER
              </div>
              <div className="text-slate-400">
                &nbsp;&nbsp;High Performance | Zero-Dependencies | Stream-Safe
              </div>
              <div className="text-slate-500">
                ======================================================
              </div>
              <div className="text-slate-400">
                <span className="text-slate-500">[08:49:12]</span> <span className="text-cyan-400 font-bold">[TOBI:INFO]</span> Multi-file auth initialized: ./tobi_session
              </div>
              <div className="text-slate-400">
                <span className="text-slate-500">[08:49:13]</span> <span className="text-cyan-400 font-bold">[TOBI:INFO]</span> Using Baileys WhatsApp v2.3000.1 (Latest)
              </div>

              {authMode === 'pairing' ? (
                <>
                  <div className="text-slate-400">
                    <span className="text-slate-500">[08:49:14]</span> <span className="text-cyan-400 font-bold">[TOBI:INFO]</span> Requesting Pairing Code for phone: <span className="text-cyan-300">+{phone}</span>...
                  </div>
                  <div className="bg-blue-950/60 border border-blue-800/80 p-3 rounded-lg my-2 space-y-1">
                    <div className="text-blue-300 font-bold bg-blue-900/60 px-2 py-0.5 rounded inline-block text-[11px]">
                      WHATSAPP PAIRING CODE (TOBI-DEVV)
                    </div>
                    <div className="text-emerald-400 font-bold text-base tracking-widest pt-1">
                      👉 CODE: <span className="text-yellow-300 font-black">{pairingCode}</span>
                    </div>
                    <div className="text-cyan-300 text-[11px]">
                      📱 Phone: +{phone}
                    </div>
                    <div className="text-slate-400 text-[11px]">
                      Enter this code in: Settings &gt; Linked Devices &gt; Link with phone number
                    </div>
                  </div>
                  <div className="text-emerald-400">
                    <span className="text-slate-500">[08:49:18]</span> <span className="text-emerald-400 font-bold">[TOBI:SUCCESS]</span> Connection established! Connected as: 94712345678:1@s.whatsapp.net (Tobi Bot)
                  </div>
                </>
              ) : (
                <>
                  <div className="text-slate-400">
                    <span className="text-slate-500">[08:49:14]</span> <span className="text-cyan-400 font-bold">[TOBI:INFO]</span> New QR Code generated:
                  </div>
                  <div className="p-2 bg-slate-900 rounded border border-slate-800 text-[10px] text-slate-300 leading-none tracking-tighter">
                    ██████████████████████████████████<br/>
                    ██ ▄▄▄▄▄ ██  ▀▀█ ▄▄█▀ ██ ▄▄▄▄▄ ██<br/>
                    ██ █   █ ██  █ █▀ █ █ ██ █   █ ██<br/>
                    ██ █▄▄▄█ ██ ▄ █▄▄█  █ ██ █▄▄▄█ ██<br/>
                    ██████████████████████████████████<br/>
                    ██ ▄ ▄▀▄█▀▄ ▀ █▀▀▀▄ ▄▄█  ▄▄ ▄▄ ██<br/>
                    ██ ▄▄█▄▄▄█ ▀█ ▄ █▀▄█ ▀██▀ ▄  █ ██<br/>
                    ██████████████████████████████████
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    Point your WhatsApp camera at the code above to link device.
                  </div>
                </>
              )}

              <div className="text-slate-400">
                <span className="text-slate-500">[08:49:19]</span> <span className="text-cyan-400 font-bold">[TOBI:INFO]</span> Registered 5 commands: .ping, .menu, .list, .movie, .alive
              </div>
              <div className="text-emerald-400 animate-pulse">
                &gt; Tobi engine ready for incoming events_
              </div>
            </div>

            {/* Bottom Code snippet */}
            <div className="bg-slate-900 p-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono">new Tobi({`{ phoneNumber: '${phone}' }`})</span>
              <button
                onClick={() => copyToClipboard(`const bot = new Tobi({\n  phoneNumber: '${phone}',\n  authType: 'pairing'\n});\nbot.launch();`)}
                className="text-emerald-400 hover:text-emerald-300 font-medium cursor-pointer"
              >
                {copied ? 'Copied!' : 'Copy Code'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
