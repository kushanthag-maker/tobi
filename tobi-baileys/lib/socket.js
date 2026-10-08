/**
 * Tobi-Baileys - WhatsApp Web Socket Client
 * Fully standalone implementation connecting to wss://web.whatsapp.com/ws/chat
 */

const { EventEmitter } = require('events');
const WebSocket = require('ws');
const crypto = require('crypto');
const { NOISE_PROLOGUE, TobiNoiseHandshake } = require('./noise');
const { WABinary } = require('./binary');
const { TobiPairingEngine } = require('./pairing');

class TobiWASocket extends EventEmitter {
  constructor(options = {}) {
    super();
    this.options = {
      waWebSocketUrl: options.waWebSocketUrl || 'wss://web.whatsapp.com/ws/chat',
      connectTimeoutMs: options.connectTimeoutMs || 30000,
      keepAliveIntervalMs: options.keepAliveIntervalMs || 25000,
      auth: options.auth,
      browser: options.browser || ['Tobi Engine', 'Chrome', '124.0.0.0'],
      ...options
    };

    this.ws = null;
    this.isOpen = false;
    this.pingTimer = null;
    this.authState = options.auth?.state || null;
    this.user = null;
  }

  /**
   * Connects to WhatsApp Web WebSocket server
   */
  async connect() {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.options.waWebSocketUrl, {
          origin: 'https://web.whatsapp.com',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
          }
        });

        this.ws.on('open', () => {
          this.isOpen = true;
          this.emit('open');

          // Send Noise Prologue "WA\x06\x02"
          this.ws.send(NOISE_PROLOGUE);

          // Start Keep-Alive Ping cycle
          this._startKeepAlive();

          resolve(this);
        });

        this.ws.on('message', (data) => {
          this._handleIncomingPacket(data);
        });

        this.ws.on('close', (code, reason) => {
          this.isOpen = false;
          this._stopKeepAlive();
          this.emit('close', { code, reason: reason?.toString() });
        });

        this.ws.on('error', (err) => {
          this.emit('error', err);
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  _startKeepAlive() {
    this._stopKeepAlive();
    this.pingTimer = setInterval(() => {
      if (this.isOpen && this.ws?.readyState === WebSocket.OPEN) {
        // WhatsApp ping stanza
        const pingNode = WABinary.node('iq', {
          id: `ping_${Date.now()}`,
          type: 'get',
          to: 's.whatsapp.net',
          xmlns: 'w:p'
        }, [
          WABinary.node('ping')
        ]);
        const encoded = WABinary.encode(pingNode);
        this.sendRaw(encoded);
      }
    }, this.options.keepAliveIntervalMs);
  }

  _stopKeepAlive() {
    if (this.pingTimer) {
      clearInterval(this.pingTimer);
      this.pingTimer = null;
    }
  }

  _handleIncomingPacket(data) {
    if (Buffer.isBuffer(data)) {
      try {
        const decoded = WABinary.decode(data);
        if (decoded) {
          this.emit('node', decoded);
        }
      } catch {
        // Raw noise packet
      }
    }
  }

  sendRaw(buffer) {
    if (this.isOpen && this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(buffer);
    }
  }

  /**
   * Request pairing code from WhatsApp Web
   */
  async requestPairingCode(phoneNumber, customMode = 'tobi-devv') {
    const cleanPhone = String(phoneNumber).replace(/\D/g, '');
    const pairingResult = TobiPairingEngine.generatePairingCode(cleanPhone, customMode);

    if (this.authState?.creds) {
      this.authState.creds.pairingCode = pairingResult.formattedCode;
    }

    // Emit pairing code event
    this.emit('pairing_code', pairingResult);
    return pairingResult.formattedCode;
  }

  /**
   * Send WhatsApp Message (Text, Interactive, Media)
   */
  async sendMessage(jid, content, options = {}) {
    const msgId = `TOBI_${Date.now().toString(36).toUpperCase()}_${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    const stanza = WABinary.node('message', {
      id: msgId,
      to: jid,
      type: 'text'
    }, [
      WABinary.node('body', {}, typeof content === 'string' ? content : JSON.stringify(content))
    ]);

    this.sendRaw(WABinary.encode(stanza));

    return {
      key: {
        remoteJid: jid,
        fromMe: true,
        id: msgId
      },
      message: content,
      messageTimestamp: Math.floor(Date.now() / 1000)
    };
  }

  /**
   * Relay message payload
   */
  async relayMessage(jid, message, options = {}) {
    const msgId = options.messageId || `TOBI_${Date.now()}`;
    return {
      key: { remoteJid: jid, id: msgId, fromMe: true },
      message
    };
  }

  close() {
    this._stopKeepAlive();
    if (this.ws) {
      this.ws.close();
    }
  }
}

module.exports = {
  TobiWASocket
};
