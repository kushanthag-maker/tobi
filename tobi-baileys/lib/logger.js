/**
 * Tobi-Baileys - Zero-Dependency Terminal Logger
 */

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  magenta: '\x1b[35m',
  gray: '\x1b[90m',
  bgBlue: '\x1b[44m'
};

class TobiLogger {
  constructor(options = {}) {
    this.name = options.name || 'Tobi-Baileys';
    this.level = options.level || 'info';
  }

  _time() {
    const d = new Date();
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
  }

  info(...args) {
    console.log(`${COLORS.gray}[${this._time()}]${COLORS.reset} ${COLORS.cyan}[${this.name}:INFO]${COLORS.reset}`, ...args);
  }

  success(...args) {
    console.log(`${COLORS.gray}[${this._time()}]${COLORS.reset} ${COLORS.green}[${this.name}:SUCCESS]${COLORS.reset}`, ...args);
  }

  warn(...args) {
    console.log(`${COLORS.gray}[${this._time()}]${COLORS.reset} ${COLORS.yellow}[${this.name}:WARN]${COLORS.reset}`, ...args);
  }

  error(...args) {
    console.log(`${COLORS.gray}[${this._time()}]${COLORS.reset} ${COLORS.red}[${this.name}:ERROR]${COLORS.reset}`, ...args);
  }

  banner(text) {
    console.log(`\n${COLORS.bright}${COLORS.cyan}======================================================${COLORS.reset}`);
    console.log(`${COLORS.bright}${COLORS.magenta}  🚀 ${this.name.toUpperCase()} (FULL OWN PROTOCOL)${COLORS.reset}`);
    console.log(`${COLORS.gray}  ${text || 'Custom Baileys Replacement | tobi-devv pairing'}${COLORS.reset}`);
    console.log(`${COLORS.bright}${COLORS.cyan}======================================================${COLORS.reset}\n`);
  }
}

module.exports = { TobiLogger, COLORS };
