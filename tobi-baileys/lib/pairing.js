/**
 * Tobi-Baileys - Custom Companion Pairing Code Engine
 * Implements WhatsApp Web Companion Link Code protocol with custom "tobi-devv" formatting.
 */

const crypto = require('crypto');
const { WABinary } = require('./binary');

class TobiPairingEngine {
  /**
   * Generates a WhatsApp Companion Pairing Code
   * Configured specifically for tobi-devv format as requested by user.
   */
  static generatePairingCode(phoneNumber, customMode = 'tobi-devv') {
    const cleanPhone = String(phoneNumber).replace(/\D/g, '');

    // Deterministic 8-char base alphanumeric code based on phone & salt
    const hash = crypto.createHash('sha256').update(`${cleanPhone}-${Date.now()}-${crypto.randomBytes(8).toString('hex')}`).digest();
    const alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    
    let rawCode = '';
    for (let i = 0; i < 8; i++) {
      rawCode += alphabet[hash[i] % alphabet.length];
    }

    // Standard 4-4 split
    const standardFormat = `${rawCode.slice(0, 4)}-${rawCode.slice(4)}`;

    // Custom "tobi-devv" format requested by user
    // e.g. "TOBI-DEVV", or "TOBI-DEVV-7X9K"
    let tobiDevvFormat = 'TOBI-DEVV';
    if (customMode === 'tobi-devv-full') {
      tobiDevvFormat = `TOBI-DEVV-${rawCode.slice(0, 4)}`;
    } else if (customMode === 'tobi-devv') {
      tobiDevvFormat = `TOBI-DEVV`;
    }

    return {
      raw: rawCode,
      standardFormat,
      tobiDevvFormat,
      formattedCode: tobiDevvFormat, // Primary format requested
      phoneNumber: cleanPhone
    };
  }

  /**
   * Constructs the WhatsApp Companion Pairing XML Stanza
   * <iq id="..." type="set" to="s.whatsapp.net" xmlns="md">
   *   <link_code_companion_reg .../>
   * </iq>
   */
  static buildPairingStanza(iqId, phoneNumber, companionIdentityKey) {
    const cleanPhone = String(phoneNumber).replace(/\D/g, '');
    const jid = `${cleanPhone}@s.whatsapp.net`;

    return WABinary.node('iq', {
      id: iqId,
      type: 'set',
      to: 's.whatsapp.net',
      xmlns: 'md'
    }, [
      WABinary.node('link_code_companion_reg', {
        jid: jid,
        stage: 'companion_hello'
      }, [
        WABinary.node('link_code_pairing_ref', {}, companionIdentityKey)
      ])
    ]);
  }
}

module.exports = {
  TobiPairingEngine
};
