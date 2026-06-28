// "use client";

// import * as React from "react";
// import Link from "next/link";
// import { Eye, Sparkles, Upload } from "lucide-react";

// interface TopbarProps {
//   notebookTitle?: string;
//   setNotebookTitle?: (title: string) => void;
//   saveStatus?: string;
//   saveNotebook?: () => void;
// }

// export default function Topbar({
//   notebookTitle,
//   setNotebookTitle,
//   saveStatus,
//   saveNotebook,
// }: TopbarProps) {
//   return (
//     <header className="h-11 bg-[#0A1628] border-b border-slate-900/80 flex items-center justify-between px-4 z-50 flex-shrink-0">
//       {/* Left: title */}
//       <div className="flex items-center gap-3 min-w-0">
//         {notebookTitle !== undefined ? (
//           <input
//             value={notebookTitle}
//             onChange={(e) => setNotebookTitle && setNotebookTitle(e.target.value)}
//             className="bg-transparent text-slate-200 text-sm font-medium outline-none px-1 py-0.5 rounded hover:bg-slate-800/40 focus:bg-slate-800/40 transition-colors w-44 truncate"
//             aria-label="Notebook title"
//           />
//         ) : (
//           <span className="text-slate-200 text-sm font-medium select-none">Projects</span>
//         )}
//       </div>

//       {/* Center: notebook icons */}
//       <div className="flex items-center gap-1">
//         <button
//           className="h-7 w-7 rounded flex items-center justify-center text-slate-500 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
//           title="Preview"
//         >
//           <Eye className="h-3.5 w-3.5" />
//         </button>
//         <button
//           className="h-7 w-7 rounded flex items-center justify-center text-[#00bcd4] hover:bg-slate-800/60 transition-colors"
//           title="AI"
//         >
//           <Sparkles className="h-3.5 w-3.5 fill-current" />
//         </button>
//       </div>

//       {/* Right: save status + share */}
//       <div className="flex items-center gap-3">
//         {saveStatus && (
//           <span className="text-[10px] text-slate-600 font-mono hidden sm:block">{saveStatus}</span>
//         )}
//         <button
//           onClick={saveNotebook}
//           className="h-7 w-7 rounded flex items-center justify-center text-slate-500 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
//           title="Export / Share"
//         >
//           <Upload className="h-3.5 w-3.5" />
//         </button>
//       </div>
//     </header>
//   );
// }


"use client";

import * as React from "react";
import Link from "next/link";
import { Eye, Sparkles, Upload, Play } from "lucide-react";

interface TopbarProps {
  projectName?: string | null;
  notebookTitle?: string;
  setNotebookTitle?: (title: string) => void;
  saveStatus?: string;
  saveNotebook?: () => void;
  onRunAll?: () => void;
  isDatasetLoaded?: boolean;
}

export default function Topbar({
  projectName,
  notebookTitle,
  setNotebookTitle,
  saveStatus,
  saveNotebook,
  onRunAll,
  isDatasetLoaded = false,
}: TopbarProps) {
  return (
    <header className="h-11 bg-[#0A1628] border-b-3 border-black flex items-center justify-between px-4 z-50 flex-shrink-0 relative">
      {/* Left: Project name navigation */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2">
          <Link
            href="/projects"
            className="text-slate-400 hover:text-slate-200 text-sm font-medium transition-colors select-none"
          >
            Projects
          </Link>
          {projectName && (
            <>
              <span className="text-slate-600 select-none text-xs">/</span>
              <span className="text-slate-200 text-sm font-semibold truncate max-w-[150px] select-none" title={projectName}>
                {projectName}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Center: Dataset name & Run All */}
      <div className="flex items-center gap-3 absolute left-1/2 -translate-x-1/2">
        {isDatasetLoaded && notebookTitle !== undefined ? (
          <div className="flex items-center gap-2 bg-slate-900/40 border border-slate-800/60 px-3 py-0.5 rounded-md shadow-sm">
            <input
              value={notebookTitle}
              onChange={(e) => setNotebookTitle && setNotebookTitle(e.target.value)}
              className="bg-transparent text-slate-100 text-[12.5px] font-semibold outline-none px-1 text-center hover:bg-slate-800/40 focus:bg-slate-800/40 rounded transition-colors w-40 truncate"
              aria-label="Dataset title"
            />
            {onRunAll && (
              <button
                onClick={onRunAll}
                className="h-5 px-2 rounded bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 text-[10px] font-semibold flex items-center gap-1 transition-all select-none border border-emerald-500/20 hover:border-emerald-500/40 active:scale-95 cursor-pointer"
                title="Run all code cells in sequence"
              >
                <Play className="h-2 w-2 fill-emerald-400" />
                <span>Run All</span>
              </button>
            )}
          </div>
        ) : null}
      </div>

      {/* Right: save status, tools and share */}
      <div className="flex items-center gap-3">
        {/* Notebook icons */}
        <div className="flex items-center gap-1 mr-2 border-r border-slate-900/80 pr-2">
          <button
            className="h-7 w-7 rounded flex items-center justify-center text-slate-500 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
            title="Preview"
          >
            <Eye className="h-3.5 w-3.5" />
          </button>
          <button
            className="h-7 w-7 rounded flex items-center justify-center text-[#00bcd4] hover:bg-slate-800/60 transition-colors"
            title="AI"
          >
            <Sparkles className="h-3.5 w-3.5 fill-current" />
          </button>
        </div>

        {saveStatus && (
          <span className="text-[10px] text-slate-600 font-mono hidden sm:block">{saveStatus}</span>
        )}
        <button
          onClick={saveNotebook}
          className="h-7 w-7 rounded flex items-center justify-center text-slate-500 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
          title="Export / Share"
        >
          <Upload className="h-3.5 w-3.5" />
        </button>
      </div>
    </header>
  );
}