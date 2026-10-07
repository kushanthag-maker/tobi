import React, { useState } from 'react';
import { MousePointerClick, ListFilter, ExternalLink, Phone, Copy, Check, Code, Sparkles, Plus, Trash2 } from 'lucide-react';

interface Props {
  lang: 'si' | 'en';
}

interface ButtonItem {
  id: string;
  type: 'reply' | 'url' | 'call' | 'copy';
  label: string;
  payload: string;
}

export const InteractiveButtonsStudio: React.FC<Props> = ({ lang }) => {
  const [headerTitle, setHeaderTitle] = useState('⚡ TOBI WHATSAPP ENGINE');
  const [bodyText, setBodyText] = useState(
    '👋 Welcome to Tobi Core!\n\nThis message uses the modern Baileys v6+ NativeFlow Interactive message format. Select an option below:'
  );
  const [footerText, setFooterText] = useState('Powered by Tobi • High Performance');
  
  const [buttons, setButtons] = useState<ButtonItem[]>([
    { id: '1', type: 'reply', label: '⚡ Check Ping', payload: '.ping' },
    { id: '2', type: 'url', label: '🌐 Open GitHub', payload: 'https://github.com/whiskeysockets/baileys' },
    { id: '3', type: 'call', label: '📞 Call Hotline', payload: '+94712345678' },
    { id: '4', type: 'copy', label: '📋 Copy Code', payload: 'TOBI-PRO-2026' }
  ]);

  const [activeListModal, setActiveListModal] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedButtonText, setCopiedButtonText] = useState<string | null>(null);

  const addButton = (type: 'reply' | 'url' | 'call' | 'copy') => {
    const newId = String(Date.now());
    const defaults = {
      reply: { label: 'New Quick Reply', payload: '.command' },
      url: { label: 'Visit Link', payload: 'https://example.com' },
      call: { label: 'Direct Call', payload: '+94712345678' },
      copy: { label: 'Copy Coupon', payload: 'DISCOUNT-50' }
    };
    setButtons([...buttons, { id: newId, type, label: defaults[type].label, payload: defaults[type].payload }]);
  };

  const removeButton = (id: string) => {
    setButtons(buttons.filter(b => b.id !== id));
  };

  const handleSimulatedClick = (btn: ButtonItem) => {
    if (btn.type === 'copy') {
      setCopiedButtonText(btn.payload);
      setTimeout(() => setCopiedButtonText(null), 2000);
      setSelectedResponse(`[Action] Copied coupon code: "${btn.payload}"`);
    } else if (btn.type === 'url') {
      setSelectedResponse(`[Action] Opened URL: ${btn.payload}`);
    } else if (btn.type === 'call') {
      setSelectedResponse(`[Action] Triggered Phone Call to: ${btn.payload}`);
    } else {
      setSelectedResponse(`[User Replied] "${btn.payload}" (Dispatched to Tobi command router)`);
    }
  };

  // Generate runnable code
  const generatedCode = `// 🔘 Baileys v6+ Interactive NativeFlow Message
await bot.sendButtons(m.from, {
  headerTitle: ${JSON.stringify(headerTitle)},
  body: ${JSON.stringify(bodyText)},
  footer: ${JSON.stringify(footerText)},
  buttons: [
${buttons.map(b => `    {
      type: '${b.type}',
      display_text: '${b.label}',
      ${b.type === 'url' ? `url: '${b.payload}'` : b.type === 'call' ? `phone: '${b.payload}'` : b.type === 'copy' ? `code: '${b.payload}'` : `id: '${b.payload}'`}
    }`).join(',\n')}
  ]
});`;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                <MousePointerClick className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white">
                {lang === 'si' ? 'අන්තර්ක්රියාකාරී බටන් සහ ලැයිස්තු (Interactive Buttons & Lists)' : 'Interactive Buttons & Lists Studio'}
              </h2>
            </div>
            <p className="text-sm text-slate-400">
              {lang === 'si'
                ? 'Baileys v6+ protocol සහ WhatsApp NativeFlow ආකෘතිය භාවිතයෙන් Quick Reply, URL Buttons, Call Buttons, Copy Buttons සහ Single-Select Lists සාදන්න.'
                : 'Build and preview Baileys v6+ NativeFlow Interactive Messages with interactive buttons, URLs, calls, copy codes, and lists.'}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveListModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors cursor-pointer"
            >
              <ListFilter className="w-4 h-4 text-cyan-400" />
              <span>{lang === 'si' ? 'List Menu පරීක්ෂාව' : 'Preview List Menu'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Editor & Mockup Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Message Editor */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
              <span>{lang === 'si' ? 'පණිවිඩ සැකසුම් (Message Fields)' : 'Message Content Configuration'}</span>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Baileys v6+ Proto
              </span>
            </h3>

            {/* Header input */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Header Title (Optional)</label>
              <input
                type="text"
                value={headerTitle}
                onChange={(e) => setHeaderTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            {/* Body input */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Body Text (Supports WhatsApp formatting *bold*, _italic_)</label>
              <textarea
                rows={4}
                value={bodyText}
                onChange={(e) => setBodyText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            {/* Footer input */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Footer Text (Subtext)</label>
              <input
                type="text"
                value={footerText}
                onChange={(e) => setFooterText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            {/* Button List Management */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  {lang === 'si' ? 'අන්තර්ක්රියාකාරී බටන් (Buttons)' : 'Interactive Buttons'} ({buttons.length})
                </label>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => addButton('reply')}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Quick Reply
                  </button>
                  <button
                    onClick={() => addButton('url')}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> URL
                  </button>
                  <button
                    onClick={() => addButton('copy')}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Copy
                  </button>
                </div>
              </div>

              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {buttons.map((btn, idx) => (
                  <div key={btn.id} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-slate-900 text-slate-400 font-mono text-[11px] flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <select
                      value={btn.type}
                      onChange={(e) => {
                        const newType = e.target.value as any;
                        setButtons(buttons.map(b => b.id === btn.id ? { ...b, type: newType } : b));
                      }}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white"
                    >
                      <option value="reply">Quick Reply</option>
                      <option value="url">CTA URL</option>
                      <option value="call">CTA Call</option>
                      <option value="copy">CTA Copy</option>
                    </select>
                    <input
                      type="text"
                      value={btn.label}
                      onChange={(e) => setButtons(buttons.map(b => b.id === btn.id ? { ...b, label: e.target.value } : b))}
                      placeholder="Display Text"
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white"
                    />
                    <input
                      type="text"
                      value={btn.payload}
                      onChange={(e) => setButtons(buttons.map(b => b.id === btn.id ? { ...b, payload: e.target.value } : b))}
                      placeholder="Value / ID"
                      className="w-28 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-300 font-mono"
                    />
                    <button
                      onClick={() => removeButton(btn.id)}
                      className="p-1 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: WhatsApp Mobile Screen Mockup */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                  Live WhatsApp Mobile Screen Preview
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">Simulated WhatsApp Client</span>
            </div>

            {/* Mobile Phone Mockup Frame */}
            <div className="max-w-sm mx-auto bg-[#0b141a] rounded-[28px] border-4 border-slate-800 overflow-hidden shadow-2xl relative">
              {/* WhatsApp Chat Header */}
              <div className="bg-[#1f2c34] px-4 py-3 flex items-center gap-3 border-b border-[#2a3942]">
                <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
                  TB
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white truncate">Tobi WhatsApp Bot</div>
                  <div className="text-[10px] text-emerald-400">online</div>
                </div>
              </div>

              {/* Chat Canvas */}
              <div className="p-4 space-y-3 min-h-[360px] bg-[radial-gradient(#17242d_1px,transparent_1px)] [background-size:16px_16px]">
                {/* Incoming Interactive Message Bubble */}
                <div className="max-w-[88%] bg-[#1f2c34] rounded-2xl rounded-tl-sm p-3.5 shadow-md border border-[#2a3942] space-y-2 text-slate-100">
                  {/* Header Title */}
                  {headerTitle && (
                    <div className="font-bold text-emerald-400 text-xs tracking-wide">
                      {headerTitle}
                    </div>
                  )}

                  {/* Body Text */}
                  <div className="text-xs leading-relaxed whitespace-pre-line text-slate-200">
                    {bodyText}
                  </div>

                  {/* Footer Text */}
                  {footerText && (
                    <div className="text-[10px] text-slate-400 border-t border-[#2a3942] pt-1">
                      {footerText}
                    </div>
                  )}

                  {/* WhatsApp Interactive Action Buttons */}
                  <div className="space-y-1.5 pt-1">
                    {buttons.map((btn) => (
                      <button
                        key={btn.id}
                        onClick={() => handleSimulatedClick(btn)}
                        className="w-full py-2 px-3 rounded-lg bg-[#2a3942]/90 hover:bg-[#32444f] active:bg-emerald-600/30 text-emerald-400 hover:text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm border border-emerald-500/20 cursor-pointer"
                      >
                        {btn.type === 'url' && <ExternalLink className="w-3.5 h-3.5" />}
                        {btn.type === 'call' && <Phone className="w-3.5 h-3.5" />}
                        {btn.type === 'copy' && <Copy className="w-3.5 h-3.5" />}
                        {btn.type === 'reply' && <MousePointerClick className="w-3.5 h-3.5" />}
                        <span>{btn.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Timestamp */}
                  <div className="text-[9px] text-slate-500 text-right">08:49 AM ✓✓</div>
                </div>

                {/* Simulated Click Response Event */}
                {selectedResponse && (
                  <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-[11px] animate-fade-in font-mono">
                    {selectedResponse}
                  </div>
                )}
              </div>
            </div>

            {/* Generated Code Preview */}
            <div className="bg-slate-900 rounded-xl p-3 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-slate-400">Executable Code Snippet</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedCode);
                    setCopiedCode(true);
                    setTimeout(() => setCopiedCode(false), 2000);
                  }}
                  className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>
              <pre className="text-[11px] font-mono text-slate-300 overflow-x-auto p-2 bg-slate-950 rounded-lg">
                {generatedCode}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* List Menu Bottom Sheet Modal Preview */}
      {activeListModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1f2c34] border border-[#2a3942] rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between border-b border-[#2a3942] pb-3">
              <div>
                <h4 className="text-sm font-bold text-white">🎬 MOVIE QUALITY SELECTOR</h4>
                <p className="text-xs text-slate-400">Choose resolution from high-speed streaming server</p>
              </div>
              <button
                onClick={() => setActiveListModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-[#2a3942] cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto">
              <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                Ultra HD (4K / 2160p) - Remux
              </div>
              <div
                onClick={() => {
                  setSelectedResponse('[List Selected] "Inception (2010) - 4K Remux (2.1 GB)"');
                  setActiveListModal(false);
                }}
                className="p-3 bg-[#2a3942]/60 hover:bg-[#2a3942] rounded-xl border border-emerald-500/20 cursor-pointer space-y-1 transition-colors"
              >
                <div className="text-xs font-semibold text-white flex items-center justify-between">
                  <span>Inception (2010) - 4K Remux</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">Recommended</span>
                </div>
                <div className="text-[11px] text-slate-400">Size: 2.1 GB • MKV • Dolby Atmos 7.1 • Fast Server 1</div>
              </div>

              <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider pt-1">
                Full HD (1080p) - High Quality
              </div>
              <div
                onClick={() => {
                  setSelectedResponse('[List Selected] "Inception (2010) - 1080p BluRay (1.4 GB)"');
                  setActiveListModal(false);
                }}
                className="p-3 bg-[#2a3942]/60 hover:bg-[#2a3942] rounded-xl border border-slate-700/50 cursor-pointer space-y-1 transition-colors"
              >
                <div className="text-xs font-semibold text-white">Inception (2010) - 1080p BluRay</div>
                <div className="text-[11px] text-slate-400">Size: 1.4 GB • x264 • AAC 5.1 • Fast Server 2</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
