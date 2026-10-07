import React, { useState } from 'react';
import { Terminal, Send, Check, Copy, Sparkles, Shield, Users, Lock, HelpCircle } from 'lucide-react';

interface Props {
  lang: 'si' | 'en';
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  type?: 'text' | 'buttons' | 'list' | 'media';
  meta?: any;
}

export const CommandPlayground: React.FC<Props> = ({ lang }) => {
  const [inputCmd, setInputCmd] = useState('.ping');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'bot',
      text: '🤖 Tobi Bot initialized! Type a command like .ping, .menu, .movie 1080p, or .alive to test response routing.'
    }
  ]);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleSendCommand = (cmdText?: string) => {
    const textToSend = cmdText || inputCmd;
    if (!textToSend.trim()) return;

    const userMsgId = String(Date.now());
    const newMessages: ChatMessage[] = [
      ...messages,
      { id: userMsgId, sender: 'user', text: textToSend }
    ];

    const clean = textToSend.trim().toLowerCase();
    const parts = clean.slice(1).split(/\s+/);
    const cmd = clean.startsWith('.') ? parts[0] : '';

    let botResponse: ChatMessage = {
      id: String(Date.now() + 1),
      sender: 'bot',
      text: `❌ Unknown command "${clean}". Type .menu to see available commands.`
    };

    if (cmd === 'ping') {
      botResponse = {
        id: String(Date.now() + 1),
        sender: 'bot',
        text: '⚡ Pong!\n⏱️ Latency: 12ms\n🚀 Engine: Tobi Core (EventEmitter Router)'
      };
    } else if (cmd === 'alive') {
      botResponse = {
        id: String(Date.now() + 1),
        sender: 'bot',
        text: '🤖 TOBI ENGINE STATUS: ONLINE\n\n⚡ Uptime: 4h 32m\n💾 RAM RSS: 21.4 MB\n🧠 Heap Used: 14.8 MB\n📦 External Deps: 0 (Pure Node.js + Baileys)\n📡 Socket: Connected & Active'
      };
    } else if (cmd === 'menu' || cmd === 'help') {
      botResponse = {
        id: String(Date.now() + 1),
        sender: 'bot',
        text: '📋 *TOBI BOT COMMAND MENU*\n\n' +
              '• .ping - Check latency & speed\n' +
              '• .menu - Display interactive menu\n' +
              '• .movies - List downloadable movies\n' +
              '• .movie 1080p - 2GB+ chunked stream download\n' +
              '• .alive - Bot telemetry & memory stats'
      };
    } else if (cmd === 'movie' || cmd === 'stream') {
      const q = parts[1] || '1080p';
      botResponse = {
        id: String(Date.now() + 1),
        sender: 'bot',
        text: `⏳ *Preparing ${q.toUpperCase()} stream...*\n` +
              `📦 Utilizing Tobi 64KB chunk stream pipeline.\n` +
              `🚀 Target: Inception_2010_${q}.mkv (1.4 GB)\n` +
              `⚡ Memory footprint stays capped under 25MB RAM!`
      };
    }

    setMessages([...newMessages, botResponse]);
    setInputCmd('');
  };

  const sampleRegisterCode = `// ⚡ Fast Command Registration Pattern in Tobi
bot.command('movie', async (m, { args, text }) => {
  const quality = args[0] || '1080p';
  
  await m.reply(\`⏳ Streaming \${quality} movie in 64KB chunks...\`);
  
  // Stream 2GB+ file safely without OOM crash
  await m.sendFile('./movies/film.mkv', {
    fileName: \`Movie_\${quality}.mkv\`,
    onProgress: (p) => {
      console.log(\`\${p.uploadedFormatted} / \${p.totalFormatted} (\${p.percent}%)\`);
    }
  });
}, {
  desc: 'Stream movies directly to WhatsApp',
  aliases: ['film', 'stream'],
  groupOnly: false,
  ownerOnly: false
});`;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Terminal className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white">
              {lang === 'si' ? 'අධි-වේගී කමාන්ඩ් රෙජිස්ට්රේෂන් (Command Engine & Router)' : 'High-Speed Command Router & Sandbox'}
            </h2>
          </div>
          <p className="text-sm text-slate-400">
            {lang === 'si'
              ? 'Node.js EventEmitter විස්තාරණය කරමින් bot.command(name, handler, options) මඟින් කමාන්ඩ් ලියාපදිංචි කිරීම සහ O(1) Map lookup මඟින් ක්ෂණිකව execute කිරීම.'
              : 'Built on Node.js EventEmitter with O(1) Map lookup for instant command execution, permission checks, aliases, and rich context shortcuts.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Chat Sandbox */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex flex-col h-[520px] shadow-2xl">
          {/* Chat Header */}
          <div className="bg-slate-900/90 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-xs text-white">
                TB
              </div>
              <div>
                <div className="text-xs font-bold text-white">Tobi Interactive Test Client</div>
                <div className="text-[10px] text-emerald-400">Response time: ~12ms</div>
              </div>
            </div>
            <div className="flex gap-1.5">
              {['.ping', '.menu', '.movie 1080p', '.alive'].map((pill) => (
                <button
                  key={pill}
                  onClick={() => handleSendCommand(pill)}
                  className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[10px] transition-colors cursor-pointer"
                >
                  {pill}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[radial-gradient(#17242d_1px,transparent_1px)] [background-size:16px_16px]">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed whitespace-pre-line shadow-md ${
                    m.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-tr-sm font-mono'
                      : 'bg-[#1f2c34] text-slate-100 rounded-tl-sm border border-[#2a3942]'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-3 bg-slate-900/90 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={inputCmd}
              onChange={(e) => setInputCmd(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendCommand()}
              placeholder="Type .ping, .menu, or .movie 1080p..."
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={() => handleSendCommand()}
              className="p-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Code & Architecture Breakdown */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                {lang === 'si' ? 'කමාන්ඩ් ලියාපදිංචි කේතය (Code)' : 'Command Registration Code'}
              </h3>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(sampleRegisterCode);
                  setCopiedCode(true);
                  setTimeout(() => setCopiedCode(false), 2000);
                }}
                className="text-emerald-400 hover:text-emerald-300 text-xs font-medium flex items-center gap-1 cursor-pointer"
              >
                {copiedCode ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCode ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <pre className="text-[11px] font-mono text-slate-300 overflow-x-auto p-3 bg-slate-950 rounded-xl border border-slate-800 leading-relaxed">
              {sampleRegisterCode}
            </pre>
          </div>

          {/* Context shortcuts cheat-sheet */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {lang === 'si' ? 'පණිවිඩ Context Shortcuts (Serializer)' : 'Message Serializer Shortcuts'}
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 flex justify-between items-center">
                <code className="text-emerald-400 font-mono">m.reply('text')</code>
                <span className="text-slate-400 text-[11px]">Auto-quoted reply</span>
              </div>
              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 flex justify-between items-center">
                <code className="text-cyan-400 font-mono">m.react('⚡')</code>
                <span className="text-slate-400 text-[11px]">Instant emoji reaction</span>
              </div>
              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 flex justify-between items-center">
                <code className="text-amber-400 font-mono">m.sendButtons(&#123;...&#125;)</code>
                <span className="text-slate-400 text-[11px]">Interactive buttons</span>
              </div>
              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 flex justify-between items-center">
                <code className="text-indigo-400 font-mono">m.sendFile(path, &#123;...&#125;)</code>
                <span className="text-slate-400 text-[11px]">2GB+ chunked stream</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
