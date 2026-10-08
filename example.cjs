/**
 * 🚀 TOBI BAILEYS WRAPPER - COMMONJS EXAMPLE
 * Run with: node example.cjs
 */

const { Tobi } = require('./tobi');
const path = require('path');
const fs = require('fs');

const bot = new Tobi({
  sessionDir: './tobi_session',
  phoneNumber: process.env.PHONE_NUMBER || null, 
  authType: process.env.PHONE_NUMBER ? 'pairing' : 'auto',
  prefixes: ['.', '/', '!'],
  allowPrefixless: false,
  owners: ['94712345678'],
  logLevel: 'info'
});

bot.on('pairing_code', ({ formattedCode, phoneNumber }) => {
  console.log(`\n🔑 [PAIRING] Phone: +${phoneNumber} | Code: ${formattedCode}`);
});

bot.on('qr', ({ qr }) => {
  console.log('📷 [QR] QR ready for scan');
});

bot.on('ready', ({ user }) => {
  console.log(`\n🎉 [READY] Tobi online as ${user.name || 'Bot'} (${user.id})`);
});

bot.command('ping', async (m) => {
  const start = Date.now();
  await m.react('⚡');
  await m.reply(`⚡ *Pong!* Latency: ${Date.now() - start}ms`);
});

bot.command(['menu', 'help'], async (m) => {
  await m.sendButtons({
    headerTitle: '⚡ TOBI ENGINE',
    body: `👋 Hello *${m.pushName}*! Select an option:`,
    footer: 'Powered by Tobi Core',
    buttons: [
      { type: 'reply', display_text: '⚡ Check Ping', id: '.ping' },
      { type: 'reply', display_text: '🎬 Movie Quality', id: '.list' },
      { type: 'url', display_text: '🌐 GitHub', url: 'https://github.com/your-username/tobi-baileys' },
      { type: 'copy', display_text: '📋 Copy ID', copy_code: 'TOBI-PRO-2026' }
    ]
  });
});

bot.command(['movie', 'stream'], async (m, { args }) => {
  const quality = args[0] || '1080p';
  const samplePath = path.resolve('./sample_movie.mkv');
  if (!fs.existsSync(samplePath)) {
    fs.writeFileSync(samplePath, Buffer.alloc(1024 * 1024, 'TobiStreamSample'));
  }
  await m.sendFile(samplePath, {
    fileName: `Movie_${quality}.mkv`,
    caption: `🎬 Streaming 2GB+ file safely with < 30MB RAM`,
    onProgress: (p) => {
      console.log(`[Stream] ${p.percent}% @ ${p.speedMBs} MB/s`);
    }
  });
});

bot.launch().catch(console.error);
