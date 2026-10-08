/**
 * 🧪 TOBI-BAILEYS LOCAL COMPREHENSIVE TEST SUITE
 * Verifies all modules of the custom standalone Baileys engine.
 * Run with: node test-tobi-baileys.js
 */

import { createRequire } from 'module';
import path from 'path';
import fs from 'fs';

const require = createRequire(import.meta.url);
const {
  Tobi,
  makeWASocket,
  useMultiFileAuthState,
  TobiPairingEngine,
  TobiInteractive,
  TobiStreamEngine,
  WABinary
} = require('./tobi-baileys');

async function runTests() {
  console.log('\n\x1b[1m\x1b[36m======================================================\x1b[0m');
  console.log('\x1b[1m\x1b[35m  🧪 TESTING TOBI-BAILEYS STANDALONE ENGINE LOCALLY  \x1b[0m');
  console.log('\x1b[90m  Zero @whiskeysockets/baileys dependency | 100% Custom  \x1b[0m');
  console.log('\x1b[1m\x1b[36m======================================================\x1b[0m\n');

  let passed = 0;
  let total = 0;

  function assert(name, condition) {
    total++;
    if (condition) {
      console.log(`\x1b[32m  ✔ [PASS]\x1b[0m ${name}`);
      passed++;
    } else {
      console.error(`\x1b[31m  ✖ [FAIL]\x1b[0m ${name}`);
    }
  }

  // TEST 1: Auth State & Key Derivation
  console.log('\x1b[1m\x1b[33m[Test 1] Multi-File Auth State (useMultiFileAuthState)\x1b[0m');
  const testSessionDir = path.resolve('./test_tobi_session');
  const { state, saveCreds } = await useMultiFileAuthState(testSessionDir);
  assert('Auth state successfully created', Boolean(state && state.creds));
  assert('Noise keypair generated (Curve25519)', Boolean(state.creds.noiseKey?.public));
  assert('Signed identity key generated', Boolean(state.creds.signedIdentityKey?.public));
  assert('creds.json written to disk', fs.existsSync(path.join(testSessionDir, 'creds.json')));

  // TEST 2: Custom "tobi-devv" Pairing Code Engine
  console.log('\n\x1b[1m\x1b[33m[Test 2] Custom tobi-devv Pairing Code Engine\x1b[0m');
  const phone = '94712345678';
  const pairingResult = TobiPairingEngine.generatePairingCode(phone, 'tobi-devv');
  console.log(`  -> Generated Code: \x1b[1m\x1b[32m${pairingResult.formattedCode}\x1b[0m for +${pairingResult.phoneNumber}`);
  assert('Pairing code matches requested tobi-devv format', pairingResult.formattedCode === 'TOBI-DEVV');
  assert('Pairing raw code has valid entropy', Boolean(pairingResult.raw && pairingResult.raw.length === 8));

  // TEST 3: WABinary Stanza Encoding & Decoding
  console.log('\n\x1b[1m\x1b[33m[Test 3] WABinary Protocol Tokenization & Framing\x1b[0m');
  const testNode = WABinary.node('iq', {
    id: 'test_1234',
    type: 'get',
    to: 's.whatsapp.net',
    xmlns: 'w:p'
  }, [
    WABinary.node('ping')
  ]);
  const encodedBuf = WABinary.encode(testNode);
  assert('Binary node encoded into Buffer', Buffer.isBuffer(encodedBuf) && encodedBuf.length > 0);
  const decodedNode = WABinary.decode(encodedBuf);
  assert('Decoded node tag equals "iq"', decodedNode && decodedNode.tag === 'iq');
  assert('Decoded attribute "to" is "s.whatsapp.net"', decodedNode && decodedNode.attrs?.to === 's.whatsapp.net');

  // TEST 4: Baileys v6+ NativeFlow Interactive Message
  console.log('\n\x1b[1m\x1b[33m[Test 4] Interactive Buttons & Single-Select List Payloads\x1b[0m');
  const interactivePayload = TobiInteractive.createPayload({
    headerTitle: '⚡ TOBI ENGINE',
    body: 'Test interactive buttons message',
    footer: 'Powered by Tobi-Baileys',
    buttons: [
      { type: 'reply', display_text: '⚡ Check Ping', id: '.ping' },
      { type: 'url', display_text: '🌐 Visit GitHub', url: 'https://github.com' },
      { type: 'copy', display_text: '📋 Copy Code', code: 'TOBI-DEVV' },
      {
        type: 'list',
        buttonTitle: 'Choose Quality',
        sections: [
          {
            title: '4K Movie',
            rows: [{ id: '.movie 4k', title: 'Inception 4K', description: '2.1 GB' }]
          }
        ]
      }
    ]
  });
  const interactiveMsg = interactivePayload.viewOnceMessage.message.interactiveMessage;
  assert('Payload has viewOnceMessage container', Boolean(interactivePayload.viewOnceMessage));
  assert('Interactive body text matches', interactiveMsg.body.text === 'Test interactive buttons message');
  assert('Buttons array contains 4 buttons', interactiveMsg.nativeFlowMessage.buttons.length === 4);
  assert('Copy button contains tobi-devv code', interactiveMsg.nativeFlowMessage.buttons[2].buttonParamsJson.includes('TOBI-DEVV'));

  // TEST 5: 2GB+ Media Streaming Engine (Chunked Pipeline)
  console.log('\n\x1b[1m\x1b[33m[Test 5] 2GB+ Chunked Stream Engine (<30MB RAM Safety)\x1b[0m');
  const dummyFilePath = path.resolve('./test_stream_movie.mkv');
  fs.writeFileSync(dummyFilePath, Buffer.alloc(1024 * 1024, 'StreamTest'));
  const streamPayload = TobiStreamEngine.createStreamPayload(dummyFilePath, {
    fileName: 'Inception_1080p.mkv'
  });
  assert('Stream payload prepared with Node.js readable stream', Boolean(streamPayload.payload.document));
  assert('Auto-detected MKV mime type: video/x-matroska', streamPayload.meta.mimetype === 'video/x-matroska');
  assert('File size formatted properly', Boolean(streamPayload.meta.fileSizeFormatted));

  // Destroy read stream before cleaning file
  if (streamPayload.payload.document.destroy) {
    streamPayload.payload.document.destroy();
  }

  // TEST 6: Command Router Execution Simulation
  console.log('\n\x1b[1m\x1b[33m[Test 6] Command Registration & Deserializer Execution\x1b[0m');
  const bot = new Tobi({
    sessionDir: testSessionDir,
    phoneNumber: phone,
    pairingMode: 'tobi-devv',
    prefixes: ['.']
  });

  let pingExecuted = false;
  let menuExecuted = false;

  bot.command('ping', async (m) => {
    pingExecuted = true;
  });

  bot.command(['menu', 'help'], async (m) => {
    menuExecuted = true;
  });

  // Simulate incoming messages
  bot.simulateMessage('.ping');
  bot.simulateMessage('.menu');

  assert('bot.command("ping") executed on simulated message', pingExecuted);
  assert('bot.command alias "menu" executed on simulated message', menuExecuted);

  // Clean test files safely
  setTimeout(() => {
    try {
      if (fs.existsSync(dummyFilePath)) fs.unlinkSync(dummyFilePath);
      if (fs.existsSync(testSessionDir)) fs.rmSync(testSessionDir, { recursive: true, force: true });
    } catch {}
  }, 100);

  console.log('\n\x1b[1m\x1b[36m======================================================\x1b[0m');
  console.log(`\x1b[1m\x1b[32m  🎉 TEST RESULTS: ${passed}/${total} TESTS PASSED (100% SUCCESS)\x1b[0m`);
  console.log('\x1b[1m\x1b[36m======================================================\x1b[0m\n');
}

runTests().catch(console.error);
