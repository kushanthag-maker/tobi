import React, { useState } from 'react';
import { FileCode, Copy, Check, Download, Folder, File, ExternalLink, Sparkles } from 'lucide-react';
import { TOBI_SOURCE_FILES, SourceFile } from '../data/sourceFiles';

interface Props {
  lang: 'si' | 'en';
}

export const SourceCodeBrowser: React.FC<Props> = ({ lang }) => {
  const [selectedFile, setSelectedFile] = useState<SourceFile>(TOBI_SOURCE_FILES[0]);
  const [copied, setCopied] = useState(false);

  const copyContent = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = (file: SourceFile) => {
    const blob = new Blob([file.content], { type: 'text/javascript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name.split('/').pop() || 'file.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                <FileCode className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white">
                {lang === 'si' ? 'Tobi ලයිබ්රරි කෝඩ් ෆයිල්ස් (Source Code Browser)' : 'Tobi Library Source Files & Architecture'}
              </h2>
            </div>
            <p className="text-sm text-slate-400">
              {lang === 'si'
                ? 'පිරිසිදු, මොඩියුලර් කේත ආකෘතිය. සියලුම ගොනු Node.js අභ්යන්තර මොඩියුල මත පමණක් රඳා පවතී (Zero 3rd-party dependencies).'
                : 'Clean, standalone production files with zero third-party dependencies. Inspect, copy, or download each module.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyContent}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? (lang === 'si' ? 'කොපි විය!' : 'Copied!') : (lang === 'si' ? 'කෝඩ් එක කොපි කරන්න' : 'Copy File Content')}</span>
            </button>
            <button
              onClick={() => downloadFile(selectedFile)}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm rounded-xl transition-all border border-slate-700 cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'si' ? 'Download' : 'Download File'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Browser Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: File Tree Directory */}
        <div className="lg:col-span-4 space-y-2">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Folder className="w-3.5 h-3.5 text-emerald-400" />
                Project File Tree
              </span>
              <span className="font-mono text-[11px] text-slate-500">{TOBI_SOURCE_FILES.length} files</span>
            </div>

            <div className="space-y-1">
              {TOBI_SOURCE_FILES.map((file) => {
                const isSelected = selectedFile.id === file.id;
                return (
                  <button
                    key={file.id}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-2.5 cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500/15 border border-emerald-500/30 text-white shadow-sm'
                        : 'hover:bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-transparent'
                    }`}
                  >
                    <File className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-medium text-slate-200 truncate">{file.name}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                          {file.category}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5">
                        {lang === 'si' ? file.descriptionSi : file.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Code Viewer */}
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[650px]">
          {/* Header */}
          <div className="bg-slate-900/90 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <File className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono font-bold text-white">{selectedFile.path}</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
              {selectedFile.language.toUpperCase()}
            </span>
          </div>

          {/* Description banner */}
          <div className="bg-slate-900/40 px-4 py-2 border-b border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
            <span>{lang === 'si' ? selectedFile.descriptionSi : selectedFile.description}</span>
            <span className="text-slate-500 font-mono text-[11px]">{selectedFile.content.split('\n').length} lines</span>
          </div>

          {/* Code text */}
          <div className="flex-1 p-4 font-mono text-xs text-slate-300 overflow-y-auto leading-relaxed select-text bg-[#0d1117]">
            <pre>
              {selectedFile.content.split('\n').map((line, idx) => (
                <div key={idx} className="table-row">
                  <span className="table-cell select-none pr-4 text-right text-slate-600 font-mono text-[11px] w-10">
                    {idx + 1}
                  </span>
                  <span className="table-cell whitespace-pre text-slate-200">
                    {line}
                  </span>
                </div>
              ))}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
