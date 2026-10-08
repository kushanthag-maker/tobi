/**
 * ⚡ TOBI-BAILEYS - FULL STANDALONE WHATSAPP WEB ENGINE
 * 
 * 100% Custom Baileys Alternative. Zero @whiskeysockets/baileys dependency!
 * Designed to be installed directly via GitHub link in bot package.json files.
 * 
 * Features:
 * - Native WhatsApp WebSocket Protocol (wss://web.whatsapp.com/ws/chat)
 * - Curve25519 & AES-GCM Noise Protocol Handshake (pure Node.js crypto)
 * - Binary XML Stanza Encoder / Decoder (WABinary)
 * - Custom "tobi-devv" Pairing Code Engine
 * - Baileys v6+ NativeFlow Interactive Buttons & Lists
 * - 2GB+ Large Movie Streaming Engine (<30MB RAM)
 * - Drop-in replacement for Baileys (makeWASocket & useMultiFileAuthState)
 */

const { EventEmitter } = require('events');
const path = require('path');
const fs = require('fs');

const { TobiWASocket } = require('./lib/socket');
const { useMultiFileAuthState, initAuthCreds } = require('./lib/auth');
const { TobiPairingEngine } = require('./lib/pairing');
const { TobiInteractive } = require('./lib/interactive');
const { TobiStreamEngine } = require('./lib/streamMedia');
const { serializeMessage } = require('./lib/serializer');
const { TobiLogger, COLORS } = require('./lib/logger');
const { WABinary } = require('./lib/binary');

/**
 * Drop-in replacement for Baileys makeWASocket
 */
function makeWASocket(config = {}) {
  return new TobiWASocket(config);
}

class Tobi extends EventEmitter {
  constructor(config = {}) {
    super();

    this.config = {
      sessionDir: path.resolve(config.sessionDir || './tobi_session'),
      phoneNumber: config.phoneNumber ? String(config.phoneNumber).replace(/\D/g, '') : null,
      authType: config.authType || (config.phoneNumber ? 'pairing' : 'auto'),
      pairingMode: config.pairingMode || 'tobi-devv', // Custom 'tobi-devv' mode requested
      prefixes: config.prefixes || ['.', '/', '!'],
      owners: (config.owners || []).map(o => String(o).replace(/\D/g, '')),
      logLevel: config.logLevel || 'info',
      autoReconnect: config.autoReconnect !== false
    };

    this.prefixes = this.config.prefixes;
    this.logger = new TobiLogger({ name: 'Tobi-Baileys', level: this.config.logLevel });

    this.sock = null;
    this.authState = null;
    this.saveCreds = null;
    this.isConnected = false;

    this.commands = new Map();
    this.commandAliases = new Map();
  }

  isOwner(jid) {
    if (!jid) return false;
    const clean = String(jid).replace(/@.*$/, '').replace(/\D/g, '');
    return this.config.owners.includes(clean);
  }

  command(name, handler, options = {}) {
    const primary = Array.isArray(name) ? name[0].toLowerCase() : name.toLowerCase();
    const aliases = Array.isArray(name) ? name.slice(1).map(n => n.toLowerCase()) : [];
    if (options.aliases) aliases.push(...options.aliases.map(a => a.toLowerCase()));

    this.commands.set(primary, { name: primary, aliases, handler, ...options });
    for (const a of aliases) this.commandAliases.set(a, primary);
    return this;
  }

  /**
   * Launch Tobi Engine and connect to WhatsApp
   */
  async launch() {
    this.logger.banner('Launching Custom Tobi-Baileys Engine (No WhiskeySockets)...');

    // 1. Initialize MultiFile Auth State
    const { state, saveCreds } = await useMultiFileAuthState(this.config.sessionDir);
    this.authState = state;
    this.saveCreds = saveCreds;

    // 2. Initialize Custom Socket Client
    const sock = new TobiWASocket({
      auth: { state, saveCreds },
      connectTimeoutMs: 30000,
      keepAliveIntervalMs: 25000
    });

    this.sock = sock;

    // 3. Setup Connection Events
    sock.on('open', async () => {
      this.isConnected = true;
      this.logger.success('Connected to WhatsApp Web WebSocket (wss://web.whatsapp.com/ws/chat)!');

      // Pairing Code Flow if Phone Number is provided
      if (this.config.phoneNumber && !state.creds.registered) {
        try {
          const code = await sock.requestPairingCode(this.config.phoneNumber, this.config.pairingMode);

          console.log(`\n${COLORS.bright}${COLORS.bgBlue}   WHATSAPP PAIRING CODE (TOBI-DEVV)   ${COLORS.reset}`);
          console.log(`${COLORS.bright}${COLORS.green}👉 CODE: ${COLORS.yellow}${code}${COLORS.reset}`);
          console.log(`${COLORS.cyan}📱 Phone: +${this.config.phoneNumber}${COLORS.reset}`);
          console.log(`${COLORS.gray}Enter code in: WhatsApp > Linked Devices > Link with phone number\n${COLORS.reset}`);

          this.emit('pairing_code', {
            code,
            formattedCode: code,
            phoneNumber: this.config.phoneNumber
          });
        } catch (err) {
          this.logger.error('Pairing code generation error:', err.message);
        }
      }

      this.emit('ready', { user: { id: this.config.phoneNumber ? `${this.config.phoneNumber}@s.whatsapp.net` : 'tobi@s.whatsapp.net', name: 'Tobi Bot' } });
    });

    sock.on('close', ({ code, reason }) => {
      this.isConnected = false;
      this.logger.warn(`Connection closed: ${code} - ${reason}`);
      this.emit('close', { code, reason });

      if (this.config.autoReconnect) {
        this.logger.info('Reconnecting in 5 seconds...');
        setTimeout(() => this.launch().catch(err => this.logger.error('Reconnect failed:', err.message)), 5000);
      }
    });

    sock.on('node', (node) => {
      this.emit('node', node);
      // Route incoming message nodes
      if (node.tag === 'message') {
        const fakeMsg = {
          key: { remoteJid: node.attrs?.from, id: node.attrs?.id, fromMe: false },
          message: { conversation: node.content }
        };
        this._dispatchIncomingMessage(fakeMsg);
      }
    });

    // Connect to WebSocket server
    await sock.connect();
    return this;
  }

  _dispatchIncomingMessage(rawMsg) {
    const m = serializeMessage(this.sock, rawMsg, this);
    if (!m) return;

    this.emit('message', m);

    if (m.command) {
      const targetName = this.commandAliases.get(m.command) || m.command;
      const cmd = this.commands.get(targetName);
      if (cmd) {
        cmd.handler(m, { args: m.args, text: m.text, tobi: this, sock: this.sock });
      }
    }
  }

  /**
   * Simulate or dispatch message for testing
   */
  simulateMessage(text, from = '94712345678@s.whatsapp.net') {
    const rawMsg = {
      key: { remoteJid: from, id: `test_${Date.now()}`, fromMe: false },
      message: { conversation: text },
      pushName: 'Tobi Tester'
    };
    this._dispatchIncomingMessage(rawMsg);
  }

  async sendText(jid, text) {
    return this.sock.sendMessage(jid, text);
  }

  async sendButtons(jid, options = {}) {
    const payload = TobiInteractive.createPayload(options);
    return this.sock.sendMessage(jid, payload, options);
  }

  async sendList(jid, options = {}) {
    const listBtn = TobiInteractive.listMenu(options.buttonText || options.title || 'Options', options.sections || []);
    const payload = TobiInteractive.createPayload({ ...options, buttons: [listBtn] });
    return this.sock.sendMessage(jid, payload, options);
  }

  async sendFile(jid, source, options = {}) {
    const { payload, meta } = TobiStreamEngine.createStreamPayload(source, options);
    const start = Date.now();
    const result = await this.sock.sendMessage(jid, payload, options);
    return {
      messageId: result?.key?.id,
      meta,
      durationMs: Date.now() - start
    };
  }
}

module.exports = {
  Tobi,
  makeWASocket,
  useMultiFileAuthState,
  TobiWASocket,
  TobiPairingEngine,
  TobiInteractive,
  TobiStreamEngine,
  WABinary
};
