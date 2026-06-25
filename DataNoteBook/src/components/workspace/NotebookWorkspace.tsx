"use client";

import * as React from "react";
import CodeCell from "@/components/workspace/CodeCell";
import TextCell from "@/components/workspace/TextCell";

interface Cell {
  id: string;
  type: "code" | "text";
  source: string;
  output?: string | null;
  output_type?: "text" | "image" | "table" | null;
}

interface NotebookWorkspaceProps {
  cells: Cell[];
  runningCellId: string | null;
  streamExec: (cellId: string, code: string) => Promise<void>;
  setCells: React.Dispatch<React.SetStateAction<Cell[]>>;
  addCodeCell: (initialCode?: string, executeImmediately?: boolean) => void;
  addTextCell: () => void;
  moveCellUp: (index: number) => void;
  moveCellDown: (index: number) => void;
}

export default function NotebookWorkspace({
  cells,
  runningCellId,
  streamExec,
  setCells,
  addCodeCell,
  addTextCell,
  moveCellUp,
  moveCellDown,
}: NotebookWorkspaceProps) {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-6">
      <div className="flex flex-col gap-5 pb-28">
        {/* Cell list */}
        {cells.map((cell, idx) =>
          cell.type === "code" ? (
            <CodeCell
              key={cell.id}
              cellId={cell.id}
              source={cell.source}
              output={cell.output}
              outputType={cell.output_type}
              index={idx}
              runningCellId={runningCellId}
              streamExec={streamExec}
              onUpdateSource={(id, src) =>
                setCells((prev) => prev.map((c) => (c.id === id ? { ...c, source: src } : c)))
              }
              onMoveUp={moveCellUp}
              onMoveDown={moveCellDown}
              onDelete={(id) => setCells((prev) => prev.filter((c) => c.id !== id))}
            />
          ) : (
            <TextCell
              key={cell.id}
              cellId={cell.id}
              source={cell.source}
              index={idx}
              onUpdateSource={(id, src) =>
                setCells((prev) => prev.map((c) => (c.id === id ? { ...c, source: src } : c)))
              }
              onMoveUp={moveCellUp}
              onMoveDown={moveCellDown}
              onDelete={(id) => setCells((prev) => prev.filter((c) => c.id !== id))}
            />
          )
        )}

        {/* Add cell bar */}
        <div className="relative flex items-center justify-center py-4 mt-2">
          <div className="absolute inset-x-0 top-1/2 h-px bg-slate-800/60" />
          <div className="relative flex items-center gap-3 z-10">
            <button
              onClick={() => addCodeCell()}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-[#0a1628] border border-slate-800 hover:border-cyan-500/30 rounded-full text-[11px] text-slate-500 hover:text-cyan-400 font-semibold transition-all cursor-pointer shadow-sm"
            >
              + Code
            </button>
            <button
              onClick={() => addTextCell()}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-[#0a1628] border border-slate-800 hover:border-cyan-500/30 rounded-full text-[11px] text-slate-500 hover:text-cyan-400 font-semibold transition-all cursor-pointer shadow-sm"
            >
              + Text
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
