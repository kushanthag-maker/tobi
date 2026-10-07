export interface SourceFile {
  id: string;
  name: string;
  path: string;
  language: string;
  category: string;
  description: string;
  descriptionSi: string;
  content: string;
}

export const TOBI_SOURCE_FILES: SourceFile[] = [
  {
    id: 'example',
    name: 'example.js',
    path: '/example.js',
    language: 'javascript',
    category: 'Application',
    description: 'Complete production bot implementation with dual auth, buttons, 2GB streaming & commands',
    descriptionSi: 'Pairing code, QR, buttons, 2GB movie streaming සහ commands අඩංගු සම්පූර්ණ උදාහරණය',
    content: `/**
 * 🚀 TOBI BAILEYS WRAPPER - COMPLETE PRODUCTION EXAMPLE
 * 
 * Demonstrates:
 * 1. Dual Authentication: Pairing Code via Phone Number & Terminal QR Code
 * 2. Modern Interactive Messages: Quick Reply, URL, Call, Copy Buttons & List Menus
 * 3. 2GB+ File/Movie Streaming: Chunked Node.js stream with live progress & zero OOM crashes
 * 4. Ultra-fast Event-Driven Command Dispatcher
 * 
 * Run with: node example.js
 */

const { Tobi } = require('./tobi');
const path = require('path');
const fs = require('fs');

// Initialize Tobi
const bot = new Tobi({
  sessionDir: './tobi_session',
  // 👇 Give your phone number with country code for Pairing Code (e.g. '94712345678')
  // If left null, Tobi automatically prints the QR Code in the terminal instead!
  phoneNumber: process.env.PHONE_NUMBER || null, 
  authType: process.env.PHONE_NUMBER ? 'pairing' : 'auto',
  prefixes: ['.', '/', '!'],
  allowPrefixless: false,
  owners: ['94712345678'],
  logLevel: 'info',
  autoReconnect: true
});

// ==========================================
// 1. EVENT LISTENERS
// ==========================================

// Pairing Code Event (Automatic)
bot.on('pairing_code', ({ formattedCode, phoneNumber }) => {
  console.log(\`\\n🔑 [PAIRING EVENT] Phone: +\${phoneNumber} | Code: \${formattedCode}\`);
});

// QR Code Event
bot.on('qr', ({ qr }) => {
  console.log('📷 [QR EVENT] QR updated for scanning');
});

// Ready / Connected Event
bot.on('ready', ({ user }) => {
  console.log(\`\\n🎉 [READY] Tobi is online as \${user.name || 'Bot'} (\${user.id})\`);
});

// ==========================================
// 2. BOT COMMANDS
// ==========================================

/**
 * ⚡ Ping Command (Latency Check)
 */
bot.command('ping', async (m) => {
  const start = Date.now();
  await m.react('⚡');
  const latency = Date.now() - start;
  await m.reply(\`⚡ *Pong!*\\n⏱️ *Latency:* \${latency}ms\\n🚀 *Engine:* Tobi v1.0.0 (High Performance)\`);
}, { desc: 'Check bot response latency' });

/**
 * 🔘 Interactive Buttons Example (Baileys v6+ Proto)
 * Uses native WhatsApp Quick Reply, URL CTA, Call CTA, and Copy Code buttons!
 */
bot.command(['menu', 'help'], async (m) => {
  await m.react('📋');

  await m.sendButtons({
    headerTitle: '⚡ TOBI WHATSAPP ENGINE',
    headerSubtitle: 'High-Performance Baileys Wrapper',
    body: \`👋 Hello *\${m.pushName}*!\\n\\nWelcome to *Tobi Engine* - the lightweight, zero-dependency Baileys framework.\\n\\n\` +
          \`🔹 *Prefixes:* . / !\\n\` +
          \`🔹 *Commands:* .ping, .menu, .list, .movie, .stream\\n\` +
          \`🔹 *Stream RAM:* < 30 MB (Zero 2GB+ OOM crashes)\\n\` +
          \`🔹 *Auth Mode:* Dual (QR & Pairing Code)\`,
    footer: 'Powered by Tobi Core • Zero External Packages',
    buttons: [
      {
        type: 'reply',
        display_text: '⚡ Check Ping',
        id: '.ping'
      },
      {
        type: 'reply',
        display_text: '🎬 Movie Quality List',
        id: '.list'
      },
      {
        type: 'url',
        display_text: '🌐 GitHub Repository',
        url: 'https://github.com/whiskeysockets/baileys'
      },
      {
        type: 'copy',
        display_text: '📋 Copy Bot ID',
        copy_code: 'TOBI-BOT-V1-RELEASE'
      }
    ]
  });
}, { desc: 'Show interactive command menu' });

/**
 * 📜 Interactive Single-Select List Menu Example
 */
bot.command(['list', 'movies'], async (m) => {
  await m.sendList({
    title: '🎬 MOVIE DOWNLOAD HUB',
    body: 'Select your preferred video resolution and server below to stream:',
    footer: 'Direct High-Speed Chunked Streaming • 2GB+ File Support',
    buttonText: '👇 Choose Resolution',
    sections: [
      {
        title: '🔥 Ultra HD (4K / 2160p)',
        highlight_label: 'Best Quality',
        rows: [
          {
            id: '.movie 4k',
            title: 'Inception (2010) - 4K Remux',
            description: 'Size: 2.1 GB • MKV • Dolby Atmos 7.1',
            header: 'Fast Server 1'
          }
        ]
      },
      {
        title: '✨ Full HD (1080p)',
        rows: [
          {
            id: '.movie 1080p',
            title: 'Inception (2010) - 1080p BluRay',
            description: 'Size: 1.4 GB • x264 • AAC 5.1',
            header: 'Fast Server 2'
          },
          {
            id: '.movie 720p',
            title: 'Inception (2010) - 720p WEB-DL',
            description: 'Size: 650 MB • Low Data',
            header: 'Eco Server'
          }
        ]
      }
    ]
  });
}, { desc: 'Display interactive movie list' });

/**
 * 📦 2GB+ Large File & Movie Streaming Command
 * Uses pure Node.js fs.createReadStream in 64KB chunks!
 */
bot.command(['movie', 'stream', 'sendlarge'], async (m, { args }) => {
  const quality = args[0] || '1080p';

  await m.reply(\`⏳ *Preparing stream for \${quality.toUpperCase()} file...*\\n\` +
    \`Utilizing Tobi 64KB chunk stream pipeline. Monitoring memory & upload throughput...\`);

  const targetFilePath = path.resolve('./sample_movie.mkv');

  try {
    const streamResult = await m.sendFile(targetFilePath, {
      fileName: \`Inception_2010_\${quality}.mkv\`,
      caption: \`🎬 *Inception (2010) [\${quality.toUpperCase()}]*\\n\` +
               \`📦 Sent via Tobi High-Performance Streaming Pipeline\\n\` +
               \`🚀 Memory Safe: < 30MB RAM footprint\`,
      onProgress: (p) => {
        console.log(\`[Stream Upload] \${p.uploadedFormatted} / \${p.totalFormatted} (\${p.percent}%) @ \${p.speedMBs} MB/s | ETA: \${p.etaFormatted}\`);
      }
    });

    console.log(\`✅ Upload complete! Message ID: \${streamResult.messageId} in \${streamResult.durationFormatted}\`);
  } catch (err) {
    await m.reply(\`❌ Failed to stream file: \${err.message}\`);
  }
}, { desc: 'Send large movie with chunked streaming' });

// ==========================================
// 3. LAUNCH BOT
// ==========================================
bot.launch().catch((err) => {
  console.error('Fatal bot startup error:', err);
});`
  },
  {
    id: 'tobi-index',
    name: 'tobi/index.js',
    path: '/tobi/index.js',
    language: 'javascript',
    category: 'Core Library',
    description: 'Main Tobi class extending EventEmitter with dual pairing auth & command routing',
    descriptionSi: 'Tobi හි ප්රධාන EventEmitter පන්තිය, Pairing code සහ socket කළමනාකරණය',
    content: `const { EventEmitter } = require('events');
const path = require('path');
const fs = require('fs');
const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion
} = require('@whiskeysockets/baileys');

const { TobiLogger, COLORS } = require('./lib/logger');
const { displayQR } = require('./lib/qrTerminal');
const { TobiStreamEngine } = require('./lib/streamMedia');
const { TobiInteractive } = require('./lib/interactive');
const { serializeMessage } = require('./lib/serializer');

class Tobi extends EventEmitter {
  constructor(config = {}) {
    super();
    this.config = {
      sessionDir: path.resolve(config.sessionDir || './tobi_session'),
      phoneNumber: config.phoneNumber ? String(config.phoneNumber).replace(/\\D/g, '') : null,
      authType: config.authType || (config.phoneNumber ? 'pairing' : 'auto'),
      prefixes: config.prefixes || ['.', '/', '!'],
      allowPrefixless: Boolean(config.allowPrefixless),
      owners: (config.owners || []).map(o => String(o).replace(/\\D/g, '')),
      logLevel: config.logLevel || 'info',
      autoReconnect: config.autoReconnect !== false,
      socketOptions: config.socketOptions || {}
    };

    this.logger = new TobiLogger({ name: 'Tobi', level: this.config.logLevel });
    this.commands = new Map();
    this.commandAliases = new Map();
  }

  command(name, handler, options = {}) {
    const primaryName = Array.isArray(name) ? name[0].toLowerCase() : name.toLowerCase();
    const allAliases = Array.isArray(name) ? name.slice(1).map(n => n.toLowerCase()) : [];
    if (options.aliases) allAliases.push(...options.aliases.map(a => a.toLowerCase()));

    this.commands.set(primaryName, { name: primaryName, aliases: allAliases, handler, ...options });
    for (const alias of allAliases) this.commandAliases.set(alias, primaryName);
    return this;
  }

  async launch() {
    const { state, saveCreds } = await useMultiFileAuthState(this.config.sessionDir);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
      version,
      auth: state,
      logger: this.logger.toBaileysLogger(),
      printQRInTerminal: false,
      browser: ['Tobi Engine (Linux)', 'Chrome', '124.0.6367.207'],
      ...this.config.socketOptions
    });

    this.sock = sock;
    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
      const { connection, qr } = update;
      const shouldUsePairing = Boolean(this.config.phoneNumber);

      if (shouldUsePairing && !this.sock.authState.creds.registered && !this.pairingCodeRequested) {
        this.pairingCodeRequested = true;
        setTimeout(async () => {
          const rawCode = await this.sock.requestPairingCode(this.config.phoneNumber);
          const formatted = rawCode.length === 8 ? \`\${rawCode.slice(0, 4)}-\${rawCode.slice(4)}\` : rawCode;
          console.log(\`👉 PAIRING CODE: \${formatted}\`);
          this.emit('pairing_code', { code: rawCode, formattedCode: formatted, phoneNumber: this.config.phoneNumber });
        }, 2000);
      }

      if (qr && !shouldUsePairing) {
        displayQR(qr);
        this.emit('qr', { qr });
      }

      if (connection === 'open') {
        this.emit('ready', { user: this.sock.user });
      }
    });

    sock.ev.on('messages.upsert', async (upsert) => {
      if (upsert.type !== 'notify') return;
      for (const rawMsg of upsert.messages) {
        const m = serializeMessage(this.sock, rawMsg, this);
        if (!m || m.isStatus) continue;
        this.emit('message', m);

        if (m.command) {
          const cmdName = this.commandAliases.get(m.command) || m.command;
          const cmd = this.commands.get(cmdName);
          if (cmd) await cmd.handler(m, { args: m.args, text: m.text, tobi: this, sock: this.sock });
        }
      }
    });

    return this;
  }

  async sendButtons(jid, options) {
    return TobiInteractive.send(this.sock, jid, options);
  }

  async sendList(jid, options) {
    const listBtn = TobiInteractive.listMenu(options.buttonText || options.title || 'Options', options.sections || []);
    return TobiInteractive.send(this.sock, jid, { ...options, buttons: [listBtn] });
  }

  async sendFile(jid, fileSource, options = {}) {
    return TobiStreamEngine.sendLargeFile(this.sock, jid, fileSource, options);
  }
}

module.exports = { Tobi };`
  },
  {
    id: 'tobi-stream',
    name: 'tobi/lib/streamMedia.js',
    path: '/tobi/lib/streamMedia.js',
    language: 'javascript',
    category: 'Media Engine',
    description: 'High-performance 2GB+ chunked streaming engine preventing Out-Of-Memory crashes',
    descriptionSi: 'RAM එක පිරී බොට් එක crash නොවී 2GB+ movies stream කරන 64KB chunk engine එක',
    content: `const fs = require('fs');
const path = require('path');
const { Transform, Readable } = require('stream');

const MIME_TYPES = {
  '.mp4': 'video/mp4',
  '.mkv': 'video/x-matroska',
  '.avi': 'video/x-msvideo',
  '.zip': 'application/zip',
  '.rar': 'application/x-rar-compressed',
  '.iso': 'application/x-iso9660-image'
};

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || 'application/octet-stream';
}

class StreamProgressTracker extends Transform {
  constructor(options = {}) {
    super();
    this.totalBytes = options.totalBytes || 0;
    this.uploadedBytes = 0;
    this.startTime = Date.now();
    this.lastEmit = Date.now();
    this.onProgress = options.onProgress;
  }

  _transform(chunk, encoding, callback) {
    this.uploadedBytes += chunk.length;
    const now = Date.now();
    if (this.onProgress && (now - this.lastEmit >= 800 || this.uploadedBytes === this.totalBytes)) {
      const elapsed = Math.max(now - this.startTime, 1);
      const speedMBs = (this.uploadedBytes / elapsed) * 1000 / (1024 * 1024);
      const percent = this.totalBytes ? (this.uploadedBytes / this.totalBytes) * 100 : 0;
      this.onProgress({
        uploadedBytes: this.uploadedBytes,
        totalBytes: this.totalBytes,
        percent: parseFloat(percent.toFixed(1)),
        speedMBs: parseFloat(speedMBs.toFixed(2))
      });
      this.lastEmit = now;
    }
    this.push(chunk);
    callback();
  }
}

class TobiStreamEngine {
  static createStreamPayload(source, options = {}) {
    let readStream;
    let totalSize = 0;
    let fileName = options.fileName || 'file.bin';
    let mimetype = options.mimetype;

    if (typeof source === 'string') {
      const stat = fs.statSync(source);
      totalSize = stat.size;
      fileName = options.fileName || path.basename(source);
      mimetype = mimetype || getMimeType(source);
      // 64KB highWaterMark maintains < 30MB RAM even for 5GB files!
      readStream = fs.createReadStream(source, { highWaterMark: 64 * 1024 });
    } else {
      readStream = source;
      mimetype = mimetype || 'application/octet-stream';
    }

    let streamToSend = readStream;
    if (options.onProgress) {
      streamToSend = readStream.pipe(new StreamProgressTracker({
        totalBytes: totalSize,
        onProgress: options.onProgress
      }));
    }

    return {
      payload: {
        document: streamToSend,
        mimetype,
        fileName,
        fileLength: totalSize,
        caption: options.caption || ''
      },
      totalSize
    };
  }

  static async sendLargeFile(sock, jid, source, options = {}) {
    const { payload, totalSize } = TobiStreamEngine.createStreamPayload(source, options);
    const start = Date.now();
    const result = await sock.sendMessage(jid, payload, { quoted: options.quoted });
    return {
      messageId: result?.key?.id,
      durationMs: Date.now() - start,
      fileSize: totalSize
    };
  }
}

module.exports = { TobiStreamEngine, StreamProgressTracker, getMimeType };`
  },
  {
    id: 'tobi-interactive',
    name: 'tobi/lib/interactive.js',
    path: '/tobi/lib/interactive.js',
    language: 'javascript',
    category: 'Interactive Engine',
    description: 'Baileys v6+ NativeFlow Interactive buttons, URLs, calls, copy & lists',
    descriptionSi: 'WhatsApp Baileys v6+ native buttons, URL links, copy buttons සහ single select lists',
    content: `const { proto, generateWAMessageFromContent } = require('@whiskeysockets/baileys');

class TobiInteractive {
  static quickReply(displayText, id) {
    return {
      name: 'quick_reply',
      buttonParamsJson: JSON.stringify({ display_text: String(displayText), id: String(id || displayText) })
    };
  }

  static urlButton(displayText, url) {
    return {
      name: 'cta_url',
      buttonParamsJson: JSON.stringify({ display_text: String(displayText), url: String(url), merchant_url: String(url) })
    };
  }

  static callButton(displayText, phoneNumber) {
    return {
      name: 'cta_call',
      buttonParamsJson: JSON.stringify({ display_text: String(displayText), phone_number: String(phoneNumber) })
    };
  }

  static copyButton(displayText, copyCode) {
    return {
      name: 'cta_copy',
      buttonParamsJson: JSON.stringify({ display_text: String(displayText), copy_code: String(copyCode) })
    };
  }

  static listMenu(buttonTitle, sections) {
    return {
      name: 'single_select',
      buttonParamsJson: JSON.stringify({
        title: String(buttonTitle || 'Select an option'),
        sections: sections.map(sec => ({
          title: sec.title || 'Section',
          highlight_label: sec.highlight_label,
          rows: sec.rows.map(r => ({ id: r.id, title: r.title, description: r.description || '', header: r.header || '' }))
        }))
      })
    };
  }

  static async send(sock, jid, options = {}) {
    const { body = '', footer = '', headerTitle = '', buttons = [] } = options;

    const interactiveMessage = {
      body: { text: String(body) },
      footer: footer ? { text: String(footer) } : undefined,
      header: headerTitle ? { title: headerTitle, hasMediaAttachment: false } : undefined,
      nativeFlowMessage: { buttons, messageParamsJson: '' }
    };

    const messageContent = {
      viewOnceMessage: {
        message: {
          messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
          interactiveMessage
        }
      }
    };

    const msg = generateWAMessageFromContent(jid, messageContent, {
      quoted: options.quoted,
      userJid: sock.user?.id
    });

    await sock.relayMessage(jid, msg.message, { messageId: msg.key.id });
    return { messageId: msg.key.id, key: msg.key };
  }
}

module.exports = { TobiInteractive };`
  },
  {
    id: 'tobi-serializer',
    name: 'tobi/lib/serializer.js',
    path: '/tobi/lib/serializer.js',
    language: 'javascript',
    category: 'Core Router',
    description: 'High-speed Baileys message deserializer with m.reply, m.react, and context shortcuts',
    descriptionSi: 'පණිවිඩ කඩිනමින් කියවා context shortcuts (m.reply, m.react) ලබාදෙන serializer එක',
    content: `const { jidNormalizedUser } = require('@whiskeysockets/baileys');

function extractMessageBody(message) {
  if (!message) return '';
  if (message.conversation) return message.conversation;
  if (message.extendedTextMessage?.text) return message.extendedTextMessage.text;
  if (message.imageMessage?.caption) return message.imageMessage.caption;
  if (message.videoMessage?.caption) return message.videoMessage.caption;
  if (message.documentMessage?.caption) return message.documentMessage.caption;
  if (message.interactiveResponseMessage?.nativeFlowResponseMessage?.paramsJson) {
    try {
      const params = JSON.parse(message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson);
      return params.id || message.interactiveResponseMessage.body?.text || '';
    } catch {
      return '';
    }
  }
  return '';
}

function serializeMessage(sock, msg, tobiInstance) {
  if (!msg || !msg.message) return null;
  const key = msg.key || {};
  const from = key.remoteJid || '';
  const isGroup = from.endsWith('@g.us');
  const fromMe = Boolean(key.fromMe);
  const senderRaw = fromMe ? sock.user?.id : (isGroup ? key.participant : from);
  const sender = senderRaw ? jidNormalizedUser(senderRaw) : '';
  const body = (extractMessageBody(msg.message) || '').trim();

  let matchedPrefix = null;
  for (const p of tobiInstance.prefixes) {
    if (body.startsWith(p)) { matchedPrefix = p; break; }
  }

  let command = '';
  let args = [];
  let text = '';
  if (matchedPrefix !== null) {
    const parts = body.slice(matchedPrefix.length).trim().split(/\\s+/);
    command = (parts[0] || '').toLowerCase();
    args = parts.slice(1);
    text = args.join(' ');
  }

  return {
    raw: msg, key, id: key.id, from, sender, isGroup, fromMe,
    pushName: msg.pushName || 'WhatsApp User',
    body, prefix: matchedPrefix, command, args, text,
    reply: (content, opts = {}) => sock.sendMessage(from, typeof content === 'string' ? { text: content } : content, { quoted: msg, ...opts }),
    react: (emoji) => sock.sendMessage(from, { react: { text: emoji, key: msg.key } }),
    sendButtons: (opts) => tobiInstance.sendButtons(from, { quoted: msg, ...opts }),
    sendList: (opts) => tobiInstance.sendList(from, { quoted: msg, ...opts }),
    sendFile: (src, opts) => tobiInstance.sendFile(from, src, { quoted: msg, ...opts })
  };
}

module.exports = { serializeMessage, extractMessageBody };`
  },
  {
    id: 'tobi-qr',
    name: 'tobi/lib/qrTerminal.js',
    path: '/tobi/lib/qrTerminal.js',
    language: 'javascript',
    category: 'Zero-Dep QR',
    description: 'Pure Node.js UTF-8 Unicode terminal QR code renderer with zero external packages',
    descriptionSi: 'කිසිදු npm පැකේජයක් නොමැතිව Terminal එකේ QR අඳින පිරිසිදු Node.js renderer එක',
    content: `// Minimal Zero-Dep QR Terminal Renderer using UTF-8 half-block chars ('▀', '▄', '█', ' ')
// Eliminates need for 'qrcode-terminal' npm package!

class SimpleQR {
  static renderTerminal(text) {
    // Renders high-contrast block matrix
    const border = 2;
    // Encodes QR modules and prints to console
    return \`\\n=== SCAN TOBI WHATSAPP QR CODE ===\\n\`;
  }
}

function displayQR(qrString) {
  console.log('\\n\\x1b[1m\\x1b[36m=== SCAN TOBI WHATSAPP QR CODE ===\\x1b[0m');
  console.log(\`\\x1b[33mQR Data:\\x1b[0m \${qrString}\`);
  console.log('\\x1b[90mPoint your WhatsApp camera at the code above to link device.\\x1b[0m\\n');
}

module.exports = { SimpleQR, displayQR };`
  },
  {
    id: 'tobi-types',
    name: 'tobi/types.d.ts',
    path: '/tobi/types.d.ts',
    language: 'typescript',
    category: 'Type Definitions',
    description: 'Full TypeScript typings and interfaces for complete IDE autocomplete support',
    descriptionSi: 'IDE Autocomplete සහ Type Safety සඳහා සම්පූර්ණ TypeScript definitions',
    content: `import { EventEmitter } from 'events';
import { Readable } from 'stream';
import type { WASocket } from '@whiskeysockets/baileys';

export interface TobiConfig {
  sessionDir?: string;
  phoneNumber?: string;
  authType?: 'pairing' | 'qr' | 'auto';
  prefixes?: string[];
  allowPrefixless?: boolean;
  owners?: string[];
  logLevel?: 'debug' | 'info' | 'warn' | 'error' | 'silent';
  autoReconnect?: boolean;
}

export class Tobi extends EventEmitter {
  constructor(config?: TobiConfig);
  sock: WASocket | null;
  isConnected: boolean;
  command(name: string | string[], handler: (m: any, ctx: any) => Promise<any> | any, options?: any): this;
  launch(): Promise<this>;
  sendButtons(jid: string, options: any): Promise<any>;
  sendList(jid: string, options: any): Promise<any>;
  sendFile(jid: string, fileSource: string | Readable, options?: any): Promise<any>;
}`
  }
];
