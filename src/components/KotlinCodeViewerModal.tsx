import React, { useState } from 'react';
import { KOTLIN_CODE_FILES, KotlinFile } from '../data/kotlinCodeFiles';
import { Code2, Copy, Check, FileCode, Terminal } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export default function KotlinCodeViewerModal({ onClose }: Props) {
  const [selectedFile, setSelectedFile] = useState<KotlinFile>(KOTLIN_CODE_FILES[0]);
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-6">
      <div className="bg-slate-900 border border-teal-500/40 rounded-3xl max-w-4xl w-full h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-slate-800/90 border-b border-slate-700/80 p-4 sm:px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">سورس‌کد کامل Kotlin و Jetpack Compose</h3>
              <p className="text-xs text-slate-400">ساختار استاندارد MVVM و استاندارد اندروید</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-all"
          >
            ✕
          </button>
        </div>

        {/* Modal Body: Sidebar + Code Editor View */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* File Tree Sidebar */}
          <div className="w-full md:w-72 bg-slate-950/60 border-l border-slate-800 p-4 overflow-y-auto shrink-0 space-y-2">
            <div className="text-[11px] font-bold text-slate-400 px-2 uppercase tracking-wider mb-2">
              فایل‌های پروژه اندروید
            </div>
            {KOTLIN_CODE_FILES.map((file, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedFile(file)}
                className={`w-full text-right px-3.5 py-3 rounded-xl transition-all flex items-center gap-2.5 text-xs font-mono ${
                  selectedFile.path === file.path
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30 font-bold'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                <FileCode className="w-4 h-4 text-teal-400 shrink-0" />
                <span className="truncate">{file.title}</span>
              </button>
            ))}
          </div>

          {/* Code Viewer Panel */}
          <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
            <div className="bg-slate-900/80 border-b border-slate-800 px-4 py-3 flex items-center justify-between text-xs text-slate-400 font-mono shrink-0">
              <span className="truncate">{selectedFile.path}</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-500 text-white px-3 py-1.5 rounded-lg transition-all font-sans font-bold shadow-md"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'کپی شد!' : 'کپی سورس‌کد'}</span>
              </button>
            </div>

            <div className="flex-1 p-4 overflow-auto font-mono text-xs text-teal-100/90 leading-relaxed bg-[#0b1329] selection:bg-teal-500 selection:text-white">
              <pre className="whitespace-pre">{selectedFile.code}</pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-950 border-t border-slate-800 p-3 sm:px-6 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-teal-400" />
            <span>آماده برای اجرا در Android Studio (Kotlin & Jetpack Compose M3)</span>
          </span>
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-xs font-medium transition-all"
          >
            بستن پنجره
          </button>
        </div>

      </div>
    </div>
  );
}
