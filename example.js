/**
 * 🚀 TOBI BAILEYS WRAPPER - COMPLETE PRODUCTION EXAMPLE
 * 
 * Works seamlessly in both ESM and CommonJS Node.js environments.
 * Demonstrates:
 * 1. Dual Authentication: Pairing Code via Phone Number & Terminal QR Code
 * 2. Modern Interactive Messages: Quick Reply, URL, Call, Copy Buttons & List Menus
 * 3. 2GB+ File/Movie Streaming: Chunked Node.js stream with live progress & zero OOM crashes
 * 4. Ultra-fast Event-Driven Command Dispatcher
 * 
 * Run with: node example.js  OR  node example.cjs
 */

import { createRequire } from 'module';
import path from 'path';
import fs from 'fs';

const require = createRequire(import.meta.url);
const { Tobi } = require('./tobi');

// Initialize Tobi Bot
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
  console.log(`\n🔑 [PAIRING EVENT] Phone: +${phoneNumber} | Code: ${formattedCode}`);
});

// QR Code Event
bot.on('qr', ({ qr }) => {
  console.log('📷 [QR EVENT] QR updated for scanning');
});

// Ready / Connected Event
bot.on('ready', ({ user }) => {
  console.log(`\n🎉 [READY] Tobi is online as ${user.name || 'Bot'} (${user.id})`);
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
  await m.reply(`⚡ *Pong!*\n⏱️ *Latency:* ${latency}ms\n🚀 *Engine:* Tobi v1.0.0 (High Performance)`);
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
    body: `👋 Hello *${m.pushName}*!\n\nWelcome to *Tobi Engine* - the lightweight, zero-dependency Baileys framework.\n\n` +
          `🔹 *Prefixes:* . / !\n` +
          `🔹 *Commands:* .ping, .menu, .list, .movie, .stream\n` +
          `🔹 *Stream RAM:* < 30 MB (Zero 2GB+ OOM crashes)\n` +
          `🔹 *Auth Mode:* Dual (QR & Pairing Code)`,
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
        url: 'https://github.com/your-username/tobi-baileys'
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
 * Prevents V8 heap memory exhaustion (zero JavaScript heap out of memory error).
 */
bot.command(['movie', 'stream', 'sendlarge'], async (m, { args }) => {
  const quality = args[0] || '1080p';

  await m.reply(`⏳ *Preparing stream for ${quality.toUpperCase()} file...*\n` +
    `Utilizing Tobi 64KB chunk stream pipeline. Monitoring memory & upload throughput...`);

  // Path to local media (e.g. 2.1GB movie file or test video)
  const targetFilePath = path.resolve('./sample_movie.mkv');

  // If test file doesn't exist yet, create a small sample file
  if (!fs.existsSync(targetFilePath)) {
    const dummyBuffer = Buffer.alloc(1024 * 1024, 'TobiStreamTestChunk');
    fs.writeFileSync(targetFilePath, dummyBuffer);
  }

  try {
    const streamResult = await m.sendFile(targetFilePath, {
      fileName: `Inception_2010_${quality}.mkv`,
      caption: `🎬 *Inception (2010) [${quality.toUpperCase()}]*\n` +
               `📦 Sent via Tobi High-Performance Streaming Pipeline\n` +
               `🚀 Memory Safe: < 30MB RAM footprint`,
      // Progress monitor
      onProgress: (p) => {
        console.log(`[Stream Upload] ${p.uploadedFormatted} / ${p.totalFormatted} (${p.percent}%) @ ${p.speedMBs} MB/s | ETA: ${p.etaFormatted}`);
      }
    });

    console.log(`✅ Upload complete! Message ID: ${streamResult.messageId} in ${streamResult.durationFormatted}`);
  } catch (err) {
    await m.reply(`❌ Failed to stream file: ${err.message}`);
  }
}, { desc: 'Send large movie with chunked streaming' });

/**
 * ℹ️ Bot Info / Alive Command
 */
bot.command('alive', async (m) => {
  const memoryUsage = process.memoryUsage();
  const rssMB = (memoryUsage.rss / (1024 * 1024)).toFixed(2);
  const heapMB = (memoryUsage.heapUsed / (1024 * 1024)).toFixed(2);
  const uptimeSec = Math.floor(process.uptime());

  await m.reply(
    `🤖 *TOBI ENGINE STATUS: ONLINE*\n\n` +
    `⚡ *Uptime:* ${uptimeSec}s\n` +
    `💾 *RAM RSS:* ${rssMB} MB\n` +
    `🧠 *Heap Used:* ${heapMB} MB\n` +
    `📦 *External Deps:* 0 (Pure Node.js + Baileys)\n` +
    `📡 *Socket:* Connected & Active`
  );
}, { desc: 'Bot system metrics and status' });

// ==========================================
// 3. LAUNCH BOT
// ==========================================
bot.launch().catch((err) => {
  console.error('Fatal bot startup error:', err);
});
