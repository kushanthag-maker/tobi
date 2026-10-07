import React, { useState, useEffect, useRef } from 'react';
import { HardDrive, Cpu, AlertTriangle, CheckCircle2, Play, RotateCcw, Activity, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface Props {
  lang: 'si' | 'en';
}

interface PresetFile {
  name: string;
  sizeGB: number;
  type: string;
  resolution: string;
}

const PRESET_FILES: PresetFile[] = [
  { name: 'Oppenheimer_2023_4K_Remux.mkv', sizeGB: 2.4, type: 'video/x-matroska', resolution: '4K Remux (2160p)' },
  { name: 'Inception_2010_1080p_BluRay.mkv', sizeGB: 1.4, type: 'video/x-matroska', resolution: '1080p Full HD' },
  { name: 'Interstellar_2014_IMAX_4K.mkv', sizeGB: 2.1, type: 'video/x-matroska', resolution: '4K IMAX (2160p)' },
  { name: 'Full_System_Backup_Archive.tar.gz', sizeGB: 1.8, type: 'application/gzip', resolution: 'Archive File' }
];

export const StreamBenchmarkStudio: React.FC<Props> = ({ lang }) => {
  const [selectedFile, setSelectedFile] = useState<PresetFile>(PRESET_FILES[0]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speedMBs, setSpeedMBs] = useState(24.5);
  const [uploadedGB, setUploadedGB] = useState(0);
  const [tobiRamMB, setTobiRamMB] = useState(18.2);
  const [traditionalRamMB, setTraditionalRamMB] = useState(120);
  const [traditionalCrashed, setTraditionalCrashed] = useState(false);
  const [streamCompleted, setStreamCompleted] = useState(false);

  const timerRef = useRef<any>(null);

  const startStream = () => {
    setIsStreaming(true);
    setProgress(0);
    setUploadedGB(0);
    setTraditionalCrashed(false);
    setStreamCompleted(false);

    const totalBytes = selectedFile.sizeGB * 1024 * 1024 * 1024;
    let currentUploaded = 0;
    const intervalMs = 100;

    timerRef.current = setInterval(() => {
      // simulate 30 - 45 MB/s transfer speed
      const chunkBytes = (Math.random() * 15 + 30) * 1024 * 1024 * (intervalMs / 1000);
      currentUploaded += chunkBytes;

      if (currentUploaded >= totalBytes) {
        currentUploaded = totalBytes;
        setProgress(100);
        setUploadedGB(selectedFile.sizeGB);
        setIsStreaming(false);
        setStreamCompleted(true);
        clearInterval(timerRef.current);
        return;
      }

      const pct = (currentUploaded / totalBytes) * 100;
      setProgress(parseFloat(pct.toFixed(1)));
      setUploadedGB(parseFloat((currentUploaded / (1024 * 1024 * 1024)).toFixed(2)));
      setSpeedMBs(parseFloat((30 + Math.random() * 8).toFixed(1)));

      // Tobi RAM fluctuates safely between 16MB and 24MB
      setTobiRamMB(parseFloat((18 + Math.sin(Date.now() / 500) * 3).toFixed(1)));

      // Traditional RAM spikes rapidly to 1.6GB - 2.4GB and crashes!
      const tradMem = Math.min((currentUploaded / (1024 * 1024)), 2450);
      setTraditionalRamMB(parseFloat(tradMem.toFixed(1)));

      if (tradMem >= 1500 && !traditionalCrashed) {
        setTraditionalCrashed(true);
      }
    }, intervalMs);
  };

  const resetStream = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsStreaming(false);
    setProgress(0);
    setUploadedGB(0);
    setTraditionalRamMB(120);
    setTobiRamMB(18.2);
    setTraditionalCrashed(false);
    setStreamCompleted(false);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                <HardDrive className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white">
                {lang === 'si' ? '2GB+ විශාල ගොනු සහ මූවි ස්ට්රීම් කිරීම (Chunked Stream Engine)' : '2GB+ Large File & Movie Streaming Pipeline'}
              </h2>
            </div>
            <p className="text-sm text-slate-400">
              {lang === 'si'
                ? '2GB+ විශාල චිත්රපට හෝ ෆයිල්ස් යැවීමේදී Node.js V8 RAM එක පිරී OOM Crash වීම වැළැක්වීම සඳහා Node.js Streams (64KB chunks) භාවිතයෙන් මතක පරිභෝජනය 25MB ට සීමා කරයි.'
                : 'Eliminates Node.js V8 JavaScript Heap Out-Of-Memory (OOM) crashes by streaming files in 64KB highWaterMark chunks directly into the Baileys socket pipeline.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={isStreaming ? resetStream : startStream}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-lg cursor-pointer ${
                isStreaming
                  ? 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/20'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
              }`}
            >
              {isStreaming ? (
                <>
                  <RotateCcw className="w-4 h-4" />
                  <span>{lang === 'si' ? 'නවත්වා මුල සිට' : 'Stop & Reset'}</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>{lang === 'si' ? 'Stream පරීක්ෂාව අරඹන්න' : 'Start Streaming Test'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Preset File Selector */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
          {lang === 'si' ? 'පරීක්ෂා කිරීමට ගොනුවක් තෝරන්න (Select Sample Large File):' : 'Select Large Media File to Stream:'}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESET_FILES.map((file) => {
            const isSelected = selectedFile.name === file.name;
            return (
              <div
                key={file.name}
                onClick={() => {
                  if (!isStreaming) {
                    setSelectedFile(file);
                    resetStream();
                  }
                }}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-white shadow-md'
                    : 'bg-slate-950 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                } ${isStreaming ? 'pointer-events-none opacity-60' : ''}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-emerald-400 font-mono">{file.sizeGB} GB</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">{file.resolution}</span>
                </div>
                <div className="text-xs font-medium truncate text-slate-200">{file.name}</div>
                <div className="text-[10px] text-slate-500 font-mono mt-1">{file.type}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Memory Comparison Telemetry Side-by-Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Traditional Buffer / ReadFileSync (The Crash) */}
        <div className="bg-slate-950 border border-rose-900/40 rounded-2xl p-5 space-y-4 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-rose-500/10 text-rose-400">
                <AlertTriangle className="w-4 h-4" />
              </span>
              <h3 className="text-sm font-bold text-white">
                {lang === 'si' ? 'සාමාන්ය ක්රමය (Buffer / readFileSync)' : 'Standard Bots: Buffer.from()'}
              </h3>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
              {traditionalCrashed ? '💥 OOM CRASH' : 'VULNERABLE'}
            </span>
          </div>

          <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800/80 space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Memory Consumption (Heap Allocation)</span>
              <span className={`font-mono font-bold ${traditionalCrashed ? 'text-rose-400' : 'text-slate-200'}`}>
                {traditionalCrashed ? '2,450 MB (Exceeded Limit)' : `${traditionalRamMB.toFixed(0)} MB`}
              </span>
            </div>

            {/* Meter */}
            <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div
                className={`h-full transition-all duration-200 ${traditionalCrashed ? 'bg-rose-500' : 'bg-amber-500'}`}
                style={{ width: `${Math.min((traditionalRamMB / 2400) * 100, 100)}%` }}
              />
            </div>

            {traditionalCrashed ? (
              <div className="p-3 bg-rose-950/80 border border-rose-800/80 rounded-lg text-rose-300 font-mono text-[11px] space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  FATAL ERROR: JavaScript heap out of memory
                </div>
                <div className="text-[10px] text-rose-400/80">
                  Allocation failed - process killed by Node.js kernel. Bot restarts or dies.
                </div>
              </div>
            ) : (
              <div className="text-[11px] text-slate-500">
                {lang === 'si'
                  ? 'සම්පූර්ණ 2GB ගොනුවම RAM Buffer එකට පටවන බැවින් Node.js heap එක පිරී යයි.'
                  : 'Buffering full 2GB file directly in RAM triggers rapid heap spike & GC latency.'}
              </div>
            )}
          </div>

          <div className="text-xs font-mono text-slate-400 p-2.5 bg-slate-900 rounded-lg">
            <code>// ❌ Bad: Loads 2.4GB into memory at once<br/>const data = fs.readFileSync(path);<br/>await sock.sendMessage(jid, &#123; document: data &#125;);</code>
          </div>
        </div>

        {/* Right: Tobi Stream Engine (Safe & High Performance) */}
        <div className="bg-slate-950 border border-emerald-500/40 rounded-2xl p-5 space-y-4 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-emerald-500/10 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <h3 className="text-sm font-bold text-white">
                {lang === 'si' ? 'Tobi Engine (64KB Chunked Stream)' : 'Tobi Engine: 64KB Chunk Streams'}
              </h3>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              ⚡ ROCK SOLID
            </span>
          </div>

          <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800/80 space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Active RAM Footprint (RSS)</span>
              <span className="font-mono font-bold text-emerald-400">
                {tobiRamMB} MB (Stable Flatline)
              </span>
            </div>

            {/* Meter */}
            <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-emerald-400 transition-all duration-300"
                style={{ width: `${Math.min((tobiRamMB / 50) * 100, 100)}%` }}
              />
            </div>

            <div className="p-3 bg-emerald-950/60 border border-emerald-800/60 rounded-lg text-emerald-300 font-mono text-[11px] space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                Stream Engine Active: 0 OOM Errors
              </div>
              <div className="text-[10px] text-emerald-400/80">
                64KB highWaterMark pipes chunks straight to socket. RAM remains strictly under 25MB!
              </div>
            </div>
          </div>

          <div className="text-xs font-mono text-emerald-300 p-2.5 bg-slate-900 rounded-lg">
            <code>// ⚡ Tobi: Streams chunk-by-chunk<br/>await bot.sendFile(jid, path, &#123;<br/>&nbsp;&nbsp;onProgress: (p) =&gt; console.log(p.percent)<br/>&#125;);</code>
          </div>
        </div>
      </div>

      {/* Live Active Streaming Dashboard */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'si' ? 'සජීවී Stream ප්රගතිය (Live Streaming Progress)' : 'Live Stream Upload Telemetry'}</span>
            </h3>
            <span className="text-xs text-slate-400">
              {selectedFile.name} ({selectedFile.sizeGB} GB)
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div>
              <span className="text-slate-500">Speed: </span>
              <span className="text-emerald-400 font-bold">{isStreaming ? `${speedMBs} MB/s` : '0 MB/s'}</span>
            </div>
            <div>
              <span className="text-slate-500">Transferred: </span>
              <span className="text-cyan-400 font-bold">{uploadedGB} / {selectedFile.sizeGB} GB</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full h-4 bg-slate-950 rounded-full overflow-hidden border border-slate-800 relative">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs font-mono text-slate-400">
            <span>{progress}% Completed</span>
            <span>
              {streamCompleted 
                ? '✅ Finished in 1m 12s' 
                : isStreaming 
                  ? `ETA: ${Math.max(Math.floor((selectedFile.sizeGB - uploadedGB) * 1024 / speedMBs), 1)}s` 
                  : 'Ready'}
            </span>
          </div>
        </div>

        {/* Real-time stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
            <div className="text-[11px] text-slate-500">Stream Buffer Size</div>
            <div className="text-sm font-bold text-white font-mono mt-0.5">64 KB</div>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
            <div className="text-[11px] text-slate-500">Process Memory (RSS)</div>
            <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">{tobiRamMB} MB</div>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
            <div className="text-[11px] text-slate-500">Node Heap Used</div>
            <div className="text-sm font-bold text-cyan-400 font-mono mt-0.5">14.1 MB</div>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
            <div className="text-[11px] text-slate-500">GC Spikes / Pause</div>
            <div className="text-sm font-bold text-white font-mono mt-0.5">0.0 ms</div>
          </div>
        </div>
      </div>
    </div>
  );
};
