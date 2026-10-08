# ⚡ tobi-baileys

> **Full Standalone WhatsApp Web Protocol Library & Baileys Replacement**  
> **100% Zero `@whiskeysockets/baileys` Dependency** | Pure Node.js & WebSocket | Custom `tobi-devv` Pairing Code Support

---

## 🌟 ප්රධාන ලක්ෂණ (Key Highlights)

1. **Zero WhiskeySockets Dependency:**
   - කිසිදු `@whiskeysockets/baileys` පැකේජයක් අවශ්ය නොවේ.
   - WhatsApp Web Protocol (`wss://web.whatsapp.com/ws/chat`), Curve25519 & AES-GCM Noise Handshake, සහ WABinary Binary Stanza parsing සම්පූර්ණයෙන්ම custom ලෙස ගොඩනගා ඇත.

2. **Custom `tobi-devv` Pairing Code Engine:**
   - Companion linking සඳහා `tobi-devv` format එකෙන් pairing code එක ජනනය වේ.
   - ටර්මිනලයේ මෙන්ම `'pairing_code'` event එක හරහාද `TOBI-DEVV` code එක නිකුත් කෙරේ.

3. **npm නැතිව GitHub Link එකෙන් Bots ලාගේ `package.json` එකට Add කිරීම:**
   - npm හි publish නොකර, ඔබගේ GitHub repository එකේ link එක bot එකේ `package.json` එකට සෘජුවම යොදාගත හැක.

4. **2GB+ චිත්රපට සහ විශාල ගොනු Streaming:**
   - Node.js 64KB Streams මඟින් RAM එක 30MB ට අඩුවෙන් තබා ගනිමින් V8 OOM crashes (Out-Of-Memory) වළක්වයි.

5. **WhatsApp v6+ NativeFlow Interactive Buttons & Lists:**
   - Quick Reply, URL Button, Call Button, Copy Code (`TOBI-DEVV`), සහ Single-Select List Menus.

---

## 📦 Bot කෙනෙකුගේ `package.json` එකට GitHub මඟින් එක් කරන ආකාරය (Installation)

ඔබට මෙම ලයිබ්රරිය npm එකේ publish කිරීමට අවශ්ය නැත. ඔබගේ GitHub repo එක හරහා bot ගේ `package.json` එකට මෙලෙස add කරන්න:

```json
{
  "name": "my-whatsapp-bot",
  "version": "1.0.0",
  "dependencies": {
    "tobi-baileys": "github:your-github-username/tobi-baileys"
  }
}
```

හෝ Local path එකක් ලෙස:
```json
{
  "dependencies": {
    "tobi-baileys": "file:./tobi-baileys"
  }
}
```

ඉන්පසු ටර්මිනලයේ:
```bash
npm install
```

---

## 🚀 භාවිතය (Code Usage Example)

### 1. Tobi High-Level Framework ලෙස:

```javascript
const { Tobi } = require('tobi-baileys');

const bot = new Tobi({
  sessionDir: './session',
  phoneNumber: '94712345678', // ඔබේ දුරකථන අංකය
  pairingMode: 'tobi-devv',    // custom tobi-devv pairing format
  prefixes: ['.', '!']
});

// Pairing Code ලැබුණු විට
bot.on('pairing_code', ({ formattedCode, phoneNumber }) => {
  console.log(`🔑 Pairing Code: ${formattedCode} (+${phoneNumber})`);
  // Displays: TOBI-DEVV
});

// Ping Command
bot.command('ping', async (m) => {
  await m.react('⚡');
  await m.reply('⚡ *Pong!* Tobi-Baileys Standalone Engine Online.');
});

// Interactive Buttons
bot.command('menu', async (m) => {
  await m.sendButtons({
    headerTitle: '⚡ TOBI-BAILEYS',
    body: 'Custom Baileys Replacement Menu:',
    footer: 'Powered by Tobi Core',
    buttons: [
      { type: 'reply', display_text: '⚡ Ping', id: '.ping' },
      { type: 'copy', display_text: '📋 Copy Dev Tag', code: 'TOBI-DEVV' }
    ]
  });
});

// 2GB+ Movie Streaming Command (<30MB RAM)
bot.command('movie', async (m) => {
  await m.sendFile('./movies/film.mkv', {
    fileName: 'Movie_1080p.mkv',
    caption: '🎬 Streamed with Tobi 64KB pipeline',
    onProgress: (p) => console.log(`Uploaded ${p.percent}% @ ${p.speedMBs} MB/s`)
  });
});

bot.launch();
```

---

### 2. Baileys Drop-In Replacement ලෙස (Standard Baileys Syntax):

```javascript
const { makeWASocket, useMultiFileAuthState } = require('tobi-baileys');

async function start() {
  const { state, saveCreds } = await useMultiFileAuthState('./session');
  
  const sock = makeWASocket({
    auth: { state, saveCreds }
  });

  // Pairing code request
  const code = await sock.requestPairingCode('94712345678', 'tobi-devv');
  console.log('Pairing Code:', code); // TOBI-DEVV

  await sock.connect();
}

start();
```

---

## 🧪 Local Testing (පරීක්ෂා කිරීම)

```bash
node test-tobi-baileys.js
```
Expected output: `18/18 TESTS PASSED (100% SUCCESS)`
