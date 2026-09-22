"use client";

import React, { useState } from "react";
import { Copy, Check, FileCode, Terminal } from "lucide-react";

interface CodeSnippetViewerProps {
  title: string;
  language: string;
  code: string;
  badge?: string;
  notes?: string;
}

export const CodeSnippetViewer: React.FC<CodeSnippetViewerProps> = ({
  title,
  language,
  code,
  badge,
  notes,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = code;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Gracefully handle clipboard errors without unhandled promise rejections
    }
  };

  const getLanguageColor = (lang: string) => {
    switch (lang.toLowerCase()) {
      case "c# .net":
      case "csharp":
      case "cs":
        return "text-purple-400 bg-purple-950/40 border-purple-800/40";
      case "java":
      case "spring boot":
        return "text-orange-400 bg-orange-950/40 border-orange-800/40";
      case "python":
      case "fastapi":
        return "text-amber-400 bg-amber-950/40 border-amber-800/40";
      case "typescript":
      case "javascript":
      case "node.js":
        return "text-sky-400 bg-sky-950/40 border-sky-800/40";
      case "curl":
      case "bash":
      case "shell":
        return "text-emerald-400 bg-emerald-950/40 border-emerald-800/40";
      default:
        return "text-slate-400 bg-slate-800/40 border-slate-700/40";
    }
  };

  return (
    <div className="flex flex-col border border-slate-800 rounded-2xl overflow-hidden shadow-xl bg-[#090D16] group">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0F172A] border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
          </div>
          <div className="h-4 w-px bg-slate-700 mx-1"></div>
          <div className="flex items-center gap-2">
            {language.toLowerCase() === "curl" ? (
              <Terminal className="w-4 h-4 text-emerald-400" />
            ) : (
              <FileCode className="w-4 h-4 text-sky-400" />
            )}
            <span className="font-mono text-xs font-bold text-slate-200">{title}</span>
          </div>
          {badge && (
            <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-md uppercase tracking-wider border ${getLanguageColor(language)}`}>
              {badge}
            </span>
          )}
        </div>

        {/* Copy Button */}
        <button
          type="button"
          aria-label="Copy snippet to clipboard"
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
            copied
              ? "bg-emerald-600/20 text-emerald-400 border-emerald-500/50"
              : "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700 hover:text-white"
          }`}
          title="Copy snippet to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>Copy Code</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <div className="relative p-5 overflow-x-auto text-[13px] leading-relaxed font-mono text-slate-200">
        <pre className="whitespace-pre">
          <code>{code}</code>
        </pre>
      </div>

      {/* Context Notes Footer */}
      {notes && (
        <div className="px-5 py-2.5 bg-[#0B1120] border-t border-slate-800/80 text-xs font-sans text-slate-400 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
          <span>{notes}</span>
        </div>
      )}
    </div>
  );
};

export default CodeSnippetViewer;

