"use client";

import * as React from "react";
import { Plus, ArrowUp, X } from "lucide-react";

interface SessionState {
  active: boolean;
  filename: string;
  dfName: string;
  columns: string[];
  dtypes: Record<string, string>;
  rowCount: number;
}

interface WelcomeScreenProps {
  session: SessionState;
  chips: string[];
  welcomeInput: string;
  setWelcomeInput: (val: string) => void;
  setChatInput: (val: string) => void;
  handleUpload: (file: File) => Promise<void>;
  handleUnloadDataset: () => void;
  handlePromptSubmit: (text: string) => void;
  handleLoadSampleData: () => void;
}

export default function WelcomeScreen({
  session,
  chips,
  welcomeInput,
  setWelcomeInput,
  setChatInput,
  handleUpload,
  handleUnloadDataset,
  handlePromptSubmit,
  handleLoadSampleData,
}: WelcomeScreenProps) {
  const welcomeFileInputRef = React.useRef<HTMLInputElement | null>(null);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 overflow-y-auto">
      <div className="w-full max-w-2xl flex flex-col items-center gap-7">
        {/* Greeting */}
        <div className="text-center">
          <h1 className="text-[36px] font-semibold tracking-tight text-slate-100 leading-none">
            Hello, Manjunathgan
          </h1>
          <p className="mt-3 text-[14px] text-slate-400">
            How can I help you today?
          </p>
        </div>

        {/* Suggestion chips — only shown when dataset uploaded */}
        {chips.length > 0 && (
          <div className="flex flex-col gap-2 w-full items-center">
            {chips.map((chip, i) => (
              <button
                key={i}
                onClick={() => {
                  setWelcomeInput(chip);
                  setChatInput(chip);
                }}
                className="px-5 py-2.5 rounded-full border border-emerald-500/20 bg-emerald-500/[0.03] text-[13px] text-emerald-400 hover:text-emerald-300 hover:border-emerald-400/40 hover:bg-emerald-500/[0.07] transition-all cursor-pointer w-full max-w-lg text-center"
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        {/* Prompt input box */}
        <div className="w-full max-w-lg">
          <div className="bg-[#00081a] border border-slate-800 rounded-2xl px-4 pt-4 pb-3 flex flex-col gap-3 focus-within:border-cyan-500/40 focus-within:shadow-[0_0_0_3px_rgba(6,182,212,0.04)] transition-all">
            <input
              type="file"
              ref={welcomeFileInputRef}
              accept=".csv,.xlsx,.xls"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleUpload(e.target.files[0]);
                  e.target.value = "";
                }
              }}
            />
            {session.active && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-xs w-fit select-none">
                <span className="font-mono font-medium">{session.filename}</span>
                <button
                  onClick={handleUnloadDataset}
                  className="text-emerald-500 hover:text-emerald-300 transition-colors cursor-pointer"
                  title="Unload dataset"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            <textarea
              value={welcomeInput}
              onChange={(e) => {
                setWelcomeInput(e.target.value);
                setChatInput(e.target.value);
                const el = e.currentTarget;
                el.style.height = "auto";
                el.style.height = Math.min(el.scrollHeight, 140) + "px";
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handlePromptSubmit(welcomeInput);
                }
              }}
              placeholder="What can I help you build?"
              rows={2}
              className="w-full bg-transparent outline-none resize-none text-slate-200 text-[14px] placeholder:text-slate-600 leading-relaxed min-h-[44px] max-h-36"
            />
            <div className="flex items-center justify-between border-t border-slate-800/60 pt-2.5">
              <button
                onClick={() => welcomeFileInputRef.current?.click()}
                className="p-1.5 text-slate-500 hover:text-slate-200 hover:bg-slate-800/60 rounded-lg transition-all cursor-pointer"
                title={session.active ? `Dataset: ${session.filename}` : "Upload dataset (.csv, .xlsx)"}
              >
                <Plus className="h-[18px] w-[18px] stroke-[2.5]" />
              </button>
              <button
                disabled={!welcomeInput.trim()}
                onClick={() => handlePromptSubmit(welcomeInput)}
                className={`h-8 w-8 rounded-full flex items-center justify-center transition-all ${
                  welcomeInput.trim()
                    ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950 cursor-pointer hover:shadow-[0_0_12px_rgba(16,185,129,0.35)]"
                    : "bg-slate-800 text-slate-600 cursor-not-allowed opacity-40"
                }`}
              >
                <ArrowUp className="h-4 w-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
          {/* Dataset status hint */}
          <p className="text-center text-[11px] text-slate-600 mt-2.5">
            {session.active
              ? `✓ ${session.filename} · ${session.rowCount} rows`
              : "Upload a dataset to get started"}
          </p>

          {!session.active && (
            <div className="mt-4 flex flex-col items-center gap-2 text-center">
              <p className="text-[11px] text-slate-500">
                Don't have a dataset? Try our sample data.
              </p>
              <button
                onClick={handleLoadSampleData}
                className="px-4 py-1.5 rounded-full border border-slate-700 bg-slate-900/60 hover:border-emerald-500/30 text-xs text-slate-350 hover:text-emerald-400 hover:bg-slate-900 transition-all cursor-pointer shadow-sm font-medium"
              >
                [Sample] Use Sample Data
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
