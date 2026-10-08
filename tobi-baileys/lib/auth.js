/**
 * Tobi-Baileys - Multi-File Auth State Engine
 * Zero external packages. Pure Node.js fs and crypto.
 * Completely standalone authentication storage compatible with WhatsApp Signal protocol.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { TobiNoiseHandshake } = require('./noise');

/**
 * Generates an initial clean WhatsApp credentials object
 */
function initAuthCreds() {
  const noiseKey = TobiNoiseHandshake.generateKeyPair();
  const pairingEphemeralKeyPair = TobiNoiseHandshake.generateKeyPair();
  const signedIdentityKey = TobiNoiseHandshake.generateKeyPair();
  const signedPreKey = {
    keyPair: TobiNoiseHandshake.generateKeyPair(),
    signature: crypto.randomBytes(64),
    keyId: 1
  };

  const registrationId = Math.floor(Math.random() * 16380) + 1;
  const advSecretKey = crypto.randomBytes(32).toString('base64');

  return {
    noiseKey: {
      private: noiseKey.private.toString('base64'),
      public: noiseKey.public.toString('base64')
    },
    pairingEphemeralKeyPair: {
      private: pairingEphemeralKeyPair.private.toString('base64'),
      public: pairingEphemeralKeyPair.public.toString('base64')
    },
    signedIdentityKey: {
      private: signedIdentityKey.private.toString('base64'),
      public: signedIdentityKey.public.toString('base64')
    },
    signedPreKey: {
      keyPair: {
        private: signedPreKey.keyPair.private.toString('base64'),
        public: signedPreKey.keyPair.public.toString('base64')
      },
      signature: signedPreKey.signature.toString('base64'),
      keyId: 1
    },
    registrationId,
    advSecretKey,
    processedHistoryMessages: [],
    nextPreKeyId: 1,
    firstUnuploadedPreKeyId: 1,
    accountSettings: { unarchiveChats: false },
    deviceId: crypto.randomBytes(16).toString('base64'),
    phoneId: crypto.randomUUID(),
    identityId: crypto.randomBytes(20),
    registered: false,
    backupToken: crypto.randomBytes(20),
    registration: {},
    pairingCode: null,
    lastAccountSyncTimestamp: undefined,
    myAppStateKeyId: undefined
  };
}

/**
 * useMultiFileAuthState - Replaces Baileys auth with pure Node.js multi-file session manager
 */
async function useMultiFileAuthState(folder) {
  const resolvedDir = path.resolve(folder);
  if (!fs.existsSync(resolvedDir)) {
    fs.mkdirSync(resolvedDir, { recursive: true });
  }

  const credsPath = path.join(resolvedDir, 'creds.json');
  let creds;

  if (fs.existsSync(credsPath)) {
    try {
      const raw = fs.readFileSync(credsPath, 'utf-8');
      creds = JSON.parse(raw);
    } catch {
      creds = initAuthCreds();
    }
  } else {
    creds = initAuthCreds();
    fs.writeFileSync(credsPath, JSON.stringify(creds, null, 2), 'utf-8');
  }

  const saveCreds = async () => {
    try {
      fs.writeFileSync(credsPath, JSON.stringify(creds, null, 2), 'utf-8');
    } catch (err) {
      console.error('[Tobi Auth] Failed to save creds.json:', err.message);
    }
  };

  return {
    state: {
      creds,
      keys: {
        get: async (type, ids) => {
          const data = {};
          for (const id of ids) {
            const filePath = path.join(resolvedDir, `${type}-${id}.json`);
            if (fs.existsSync(filePath)) {
              try {
                data[id] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
              } catch {
                data[id] = null;
              }
            }
          }
          return data;
        },
        set: async (data) => {
          for (const category in data) {
            for (const id in data[category]) {
              const value = data[category][id];
              const filePath = path.join(resolvedDir, `${category}-${id}.json`);
              if (value) {
                fs.writeFileSync(filePath, JSON.stringify(value), 'utf-8');
              } else if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
              }
            }
          }
        }
      }
    },
    saveCreds
  };
}

module.exports = {
  useMultiFileAuthState,
  initAuthCreds
};
