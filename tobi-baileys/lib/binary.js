/**
 * Tobi-Baileys - WhatsApp Binary Protocol (WABinary Stanza Encoder / Decoder)
 * Replaces Baileys WABinary with pure Node.js buffer parsing.
 */

const SINGLE_BYTE_TOKENS = [
  null,
  'xmlstreamstart',
  'xmlstreamend',
  's.whatsapp.net',
  'type',
  'participant',
  'from',
  'receipt',
  'id',
  'broadcast',
  'status',
  'message',
  'notification',
  'notify',
  'call',
  'iq',
  'g.us',
  'promote',
  'demote',
  'creator',
  'Bell.caf',
  'Boing.caf',
  'Glass.caf',
  'Harp.caf',
  'TimePassing.caf',
  'Tri-tone.caf',
  'Xylophone.caf',
  'body',
  'user',
  'server',
  'unavailable',
  'available',
  'presence',
  'chat',
  'audio',
  'video',
  'image',
  'document',
  'protocol',
  'read',
  'relay',
  'error',
  'ping',
  'pong',
  'link_code_companion_reg',
  'link_code_pairing_ref',
  'stage',
  'companion',
  'companion_props',
  'device',
  'link_code',
  'link_code_companion'
];

const TOKEN_MAP = new Map();
SINGLE_BYTE_TOKENS.forEach((t, i) => {
  if (t) TOKEN_MAP.set(t, i);
});

class BinaryNode {
  constructor(tag, attrs = {}, content = null) {
    this.tag = tag;
    this.attrs = attrs;
    this.content = content;
  }
}

class WABinary {
  /**
   * Helper to construct a BinaryNode
   */
  static node(tag, attrs = {}, content = null) {
    return new BinaryNode(tag, attrs, content);
  }

  /**
   * Encodes a BinaryNode into WhatsApp binary representation
   */
  static encode(node) {
    const buffers = [];

    function writeString(str) {
      if (TOKEN_MAP.has(str)) {
        buffers.push(Buffer.from([TOKEN_MAP.get(str)]));
      } else {
        const strBuf = Buffer.from(str, 'utf-8');
        if (strBuf.length < 256) {
          buffers.push(Buffer.from([252, strBuf.length]));
          buffers.push(strBuf);
        } else {
          const lenBuf = Buffer.alloc(4);
          lenBuf.writeUInt32BE(strBuf.length, 0);
          buffers.push(Buffer.from([253]));
          buffers.push(lenBuf.slice(1));
          buffers.push(strBuf);
        }
      }
    }

    function writeNode(n) {
      if (!n) return;
      const attrKeys = Object.keys(n.attrs || {});
      const hasContent = n.content !== null && n.content !== undefined;
      const listLen = 1 + attrKeys.length * 2 + (hasContent ? 1 : 0);

      // List header
      buffers.push(Buffer.from([248, listLen]));

      // Tag
      writeString(n.tag);

      // Attributes
      for (const key of attrKeys) {
        writeString(key);
        writeString(String(n.attrs[key]));
      }

      // Content
      if (hasContent) {
        if (Array.isArray(n.content)) {
          buffers.push(Buffer.from([248, n.content.length]));
          for (const child of n.content) {
            writeNode(child);
          }
        } else if (Buffer.isBuffer(n.content)) {
          buffers.push(Buffer.from([252, n.content.length]));
          buffers.push(n.content);
        } else if (typeof n.content === 'object' && n.content.tag) {
          writeNode(n.content);
        } else {
          writeString(String(n.content));
        }
      }
    }

    writeNode(node);
    return Buffer.concat(buffers);
  }

  /**
   * Decodes WhatsApp binary buffer into a BinaryNode structure
   */
  static decode(buffer) {
    if (!buffer || buffer.length === 0) return null;
    let offset = 0;

    function readByte() {
      return buffer[offset++];
    }

    function readString() {
      const tag = readByte();
      if (tag < 240) {
        return SINGLE_BYTE_TOKENS[tag] || `token_${tag}`;
      }
      if (tag === 252) { // 8-bit string
        const len = readByte();
        const str = buffer.slice(offset, offset + len).toString('utf-8');
        offset += len;
        return str;
      }
      if (tag === 253) { // 20-bit string
        const b1 = readByte();
        const b2 = readByte();
        const b3 = readByte();
        const len = (b1 << 16) | (b2 << 8) | b3;
        const str = buffer.slice(offset, offset + len).toString('utf-8');
        offset += len;
        return str;
      }
      return '';
    }

    function readNode() {
      if (offset >= buffer.length) return null;
      const listTag = readByte();
      if (listTag !== 248) return null;

      const listLen = readByte();
      const nodeTag = readString();
      const attrs = {};

      let remaining = listLen - 1;
      while (remaining > 1) {
        const k = readString();
        const v = readString();
        attrs[k] = v;
        remaining -= 2;
      }

      let content = null;
      if (remaining === 1) {
        if (offset < buffer.length) {
          content = readString();
        }
      }

      return new BinaryNode(nodeTag, attrs, content);
    }

    try {
      return readNode();
    } catch {
      return null;
    }
  }
}

module.exports = {
  BinaryNode,
  WABinary
};
