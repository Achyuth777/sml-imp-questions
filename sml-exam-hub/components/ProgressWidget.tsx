"use client";

import { useProgress } from "@/hooks/useProgress";

export default function ProgressWidget() {
  const { percentage, completedCount, totalQuestions, reset, mounted } = useProgress();

  if (!mounted) return null;

  return (
    <div className="fixed bottom-4 right-4 z-30">
      <div className="bg-[var(--surface)] border border-[var(--surface-border)] rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3 min-w-[180px]">
        {/* Ring */}
        <div className="relative w-10 h-10 flex-shrink-0">
          <svg viewBox="0 0 36 36" className="w-10 h-10 -rotate-90">
            <circle cx="18" cy="18" r="15" fill="none" stroke="var(--surface-border)" strokeWidth="3" />
            <circle
              cx="18" cy="18" r="15"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="3"
              strokeDasharray={`${(percentage / 100) * 94.2} 94.2`}
              strokeLinecap="round"
              className="transition-all duration-700"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-[var(--accent)]">
            {percentage}%
          </span>
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-[var(--text-primary)]">Progress</p>
          <p className="text-xs text-[var(--text-tertiary)]">{completedCount}/{totalQuestions} done</p>
        </div>

        {/* Reset */}
        {completedCount > 0 && (
          <button
            onClick={reset}
            title="Reset progress"
            className="text-[var(--text-tertiary)] hover:text-[var(--danger)] transition-colors cursor-pointer"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
