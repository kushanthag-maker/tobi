/**
 * Tobi-Baileys - Fast Message Serializer
 */

function serializeMessage(sock, rawMsg, tobiInstance) {
  if (!rawMsg) return null;

  const key = rawMsg.key || {};
  const from = key.remoteJid || '';
  const isGroup = from.endsWith('@g.us');
  const fromMe = Boolean(key.fromMe);
  const sender = fromMe ? (sock.user?.id || 'me') : (isGroup ? (key.participant || from) : from);

  let body = '';
  if (typeof rawMsg.message === 'string') {
    body = rawMsg.message;
  } else if (rawMsg.message?.conversation) {
    body = rawMsg.message.conversation;
  } else if (rawMsg.message?.extendedTextMessage?.text) {
    body = rawMsg.message.extendedTextMessage.text;
  } else if (rawMsg.message?.interactiveResponseMessage?.nativeFlowResponseMessage?.paramsJson) {
    try {
      const p = JSON.parse(rawMsg.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson);
      body = p.id || '';
    } catch {
      body = '';
    }
  }

  body = (body || '').trim();

  // Match prefix
  const prefixes = tobiInstance?.prefixes || ['.', '/', '!'];
  let matchedPrefix = null;
  for (const p of prefixes) {
    if (body.startsWith(p)) {
      matchedPrefix = p;
      break;
    }
  }

  let command = '';
  let args = [];
  let text = '';

  if (matchedPrefix !== null) {
    const after = body.slice(matchedPrefix.length).trim();
    const parts = after.split(/\s+/);
    command = (parts[0] || '').toLowerCase();
    args = parts.slice(1);
    text = args.join(' ');
  }

  const m = {
    raw: rawMsg,
    key,
    id: key.id || `msg_${Date.now()}`,
    from,
    sender,
    isGroup,
    fromMe,
    body,
    prefix: matchedPrefix,
    command,
    args,
    text,
    pushName: rawMsg.pushName || 'WhatsApp User',
    reply: async (content, options = {}) => {
      return sock.sendMessage(from, content, { quoted: rawMsg, ...options });
    },
    react: async (emoji) => {
      return sock.sendMessage(from, { react: { text: emoji, key } });
    },
    sendButtons: async (options) => {
      return tobiInstance.sendButtons(from, { quoted: rawMsg, ...options });
    },
    sendList: async (options) => {
      return tobiInstance.sendList(from, { quoted: rawMsg, ...options });
    },
    sendFile: async (source, options) => {
      return tobiInstance.sendFile(from, source, { quoted: rawMsg, ...options });
    }
  };

  return m;
}

module.exports = { serializeMessage };
