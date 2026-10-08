/**
 * Tobi-Baileys - High-Performance 2GB+ Media Streaming Engine
 * Pure Node.js streams. Zero external packages.
 * Prevents V8 heap exhaustion (0 OOM crashes) during 2GB+ movie uploads.
 */

const fs = require('fs');
const path = require('path');
const { Transform, Readable } = require('stream');

const MIME_MAP = {
  '.mp4': 'video/mp4',
  '.mkv': 'video/x-matroska',
  '.avi': 'video/x-msvideo',
  '.mov': 'video/quicktime',
  '.wmv': 'video/x-ms-wmv',
  '.webm': 'video/webm',
  '.zip': 'application/zip',
  '.rar': 'application/x-rar-compressed',
  '.7z': 'application/x-7z-compressed',
  '.tar': 'application/x-tar',
  '.gz': 'application/gzip',
  '.iso': 'application/x-iso9660-image',
  '.pdf': 'application/pdf',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg'
};

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_MAP[ext] || 'application/octet-stream';
}

function formatBytes(bytes, decimals = 2) {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

class StreamProgressTracker extends Transform {
  constructor(options = {}) {
    super();
    this.totalBytes = options.totalBytes || 0;
    this.uploadedBytes = 0;
    this.startTime = Date.now();
    this.lastEmit = Date.now();
    this.onProgress = options.onProgress;
  }

  _transform(chunk, encoding, callback) {
    this.uploadedBytes += chunk.length;
    const now = Date.now();

    if (this.onProgress && (now - this.lastEmit >= 800 || this.uploadedBytes === this.totalBytes)) {
      const elapsed = Math.max(now - this.startTime, 1);
      const speedMBs = (this.uploadedBytes / elapsed) * 1000 / (1024 * 1024);
      const percent = this.totalBytes ? (this.uploadedBytes / this.totalBytes) * 100 : 0;
      const remainingBytes = Math.max(this.totalBytes - this.uploadedBytes, 0);
      const etaSeconds = speedMBs > 0 ? (remainingBytes / (speedMBs * 1024 * 1024)) : 0;

      this.onProgress({
        uploadedBytes: this.uploadedBytes,
        totalBytes: this.totalBytes,
        percent: parseFloat(percent.toFixed(1)),
        speedMBs: parseFloat(speedMBs.toFixed(2)),
        uploadedFormatted: formatBytes(this.uploadedBytes),
        totalFormatted: formatBytes(this.totalBytes),
        etaFormatted: `${Math.round(etaSeconds)}s`
      });

      this.lastEmit = now;
    }

    this.push(chunk);
    callback();
  }
}

class TobiStreamEngine {
  static createStreamPayload(source, options = {}) {
    let readStream;
    let totalSize = options.fileLength || 0;
    let fileName = options.fileName || 'file.bin';
    let mimetype = options.mimetype;

    if (typeof source === 'string') {
      const stat = fs.statSync(source);
      totalSize = stat.size;
      fileName = options.fileName || path.basename(source);
      mimetype = mimetype || getMimeType(source);
      readStream = fs.createReadStream(source, { highWaterMark: options.highWaterMark || 64 * 1024 });
    } else if (source instanceof Readable) {
      readStream = source;
      mimetype = mimetype || 'application/octet-stream';
    } else {
      throw new Error('[Tobi Stream] Invalid file source. Expected path or stream.');
    }

    let streamToSend = readStream;
    if (typeof options.onProgress === 'function') {
      streamToSend = readStream.pipe(new StreamProgressTracker({
        totalBytes: totalSize,
        onProgress: options.onProgress
      }));
    }

    return {
      payload: {
        document: streamToSend,
        mimetype,
        fileName,
        fileLength: totalSize,
        caption: options.caption || ''
      },
      meta: {
        fileName,
        fileSize: totalSize,
        fileSizeFormatted: formatBytes(totalSize),
        mimetype
      }
    };
  }
}

module.exports = {
  TobiStreamEngine,
  StreamProgressTracker,
  getMimeType,
  formatBytes
};
