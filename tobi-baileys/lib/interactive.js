/**
 * Tobi-Baileys - Standalone Interactive Messages Engine (WhatsApp NativeFlow v6+)
 * Zero external packages. Generates modern interactive button & list payloads.
 */

class TobiInteractive {
  /**
   * Quick Reply Native Button
   */
  static quickReply(displayText, id) {
    return {
      name: 'quick_reply',
      buttonParamsJson: JSON.stringify({
        display_text: String(displayText),
        id: String(id || displayText)
      })
    };
  }

  /**
   * Click-to-Action URL Button
   */
  static urlButton(displayText, url) {
    return {
      name: 'cta_url',
      buttonParamsJson: JSON.stringify({
        display_text: String(displayText),
        url: String(url),
        merchant_url: String(url)
      })
    };
  }

  /**
   * Click-to-Call Phone Button
   */
  static callButton(displayText, phoneNumber) {
    return {
      name: 'cta_call',
      buttonParamsJson: JSON.stringify({
        display_text: String(displayText),
        phone_number: String(phoneNumber)
      })
    };
  }

  /**
   * Click-to-Copy Text Button
   */
  static copyButton(displayText, copyCode) {
    return {
      name: 'cta_copy',
      buttonParamsJson: JSON.stringify({
        display_text: String(displayText),
        copy_code: String(copyCode)
      })
    };
  }

  /**
   * Single-Select List Menu
   */
  static listMenu(buttonTitle, sections = []) {
    return {
      name: 'single_select',
      buttonParamsJson: JSON.stringify({
        title: String(buttonTitle || 'Select an option'),
        sections: sections.map((sec, secIdx) => ({
          title: sec.title || `Section ${secIdx + 1}`,
          highlight_label: sec.highlight_label,
          rows: (sec.rows || []).map((row, rowIdx) => ({
            header: row.header || '',
            title: row.title || `Option ${rowIdx + 1}`,
            description: row.description || '',
            id: row.id || `row_${secIdx}_${rowIdx}`
          }))
        }))
      })
    };
  }

  /**
   * Formats raw button shortcuts into WhatsApp NativeFlow buttons
   */
  static normalizeButtons(rawButtons = []) {
    return rawButtons.map((btn) => {
      if (btn.name && btn.buttonParamsJson) return btn;
      if (btn.type === 'url' || btn.url) return TobiInteractive.urlButton(btn.display_text || btn.title || btn.text, btn.url);
      if (btn.type === 'call' || btn.phone || btn.phone_number) return TobiInteractive.callButton(btn.display_text || btn.title || btn.text, btn.phone || btn.phone_number);
      if (btn.type === 'copy' || btn.copy_code || btn.code) return TobiInteractive.copyButton(btn.display_text || btn.title || btn.text, btn.copy_code || btn.code);
      if (btn.type === 'list' || btn.sections) return TobiInteractive.listMenu(btn.buttonTitle || btn.title || 'Options', btn.sections);
      return TobiInteractive.quickReply(btn.display_text || btn.title || btn.text || 'Button', btn.id || btn.value);
    });
  }

  /**
   * Generates the complete WhatsApp Interactive Message structure
   */
  static createPayload(options = {}) {
    const {
      body = '',
      footer = '',
      headerTitle = '',
      headerSubtitle = '',
      buttons = []
    } = options;

    const normalizedButtons = TobiInteractive.normalizeButtons(buttons);

    return {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2
          },
          interactiveMessage: {
            body: { text: String(body) },
            footer: footer ? { text: String(footer) } : undefined,
            header: headerTitle ? {
              title: headerTitle,
              subtitle: headerSubtitle || '',
              hasMediaAttachment: false
            } : undefined,
            nativeFlowMessage: {
              buttons: normalizedButtons,
              messageParamsJson: ''
            }
          }
        }
      }
    };
  }
}

module.exports = {
  TobiInteractive
};
