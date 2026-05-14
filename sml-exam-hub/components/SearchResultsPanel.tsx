"use client";

import QuestionCard from "./QuestionCard";
import type { SearchResult } from "@/types";

interface SearchResultsPanelProps {
  query: string;
  results: SearchResult[];
  isSearching: boolean;
  onClose: () => void;
}

export default function SearchResultsPanel({
  query,
  results,
  isSearching,
  onClose,
}: SearchResultsPanelProps) {
  if (!query.trim()) return null;

  return (
    <div className="fixed inset-0 z-20 pt-14 lg:pl-[260px]" onClick={onClose}>
      <div
        className="h-full flex flex-col max-w-3xl mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex-1 overflow-y-auto bg-[var(--bg)] border-x border-b border-[var(--surface-border)]
            shadow-xl rounded-b-2xl mx-4 mb-4 p-4 space-y-3 animate-slide-down"
          style={{ maxHeight: "calc(100vh - 120px)" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-[var(--surface-border)]">
            <p className="text-sm font-medium text-[var(--text-secondary)]">
              {isSearching ? (
                "Searching…"
              ) : results.length === 0 ? (
                `No results for "${query}"`
              ) : (
                <span>
                  <span className="text-[var(--text-primary)] font-semibold">{results.length}</span>{" "}
                  result{results.length !== 1 ? "s" : ""} for{" "}
                  <span className="text-[var(--accent)]">"{query}"</span>
                </span>
              )}
            </p>
            <button
              onClick={onClose}
              className="text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)] cursor-pointer
                px-2 py-1 rounded hover:bg-[var(--surface-hover)] transition-colors"
            >
              Close
            </button>
          </div>

          {/* Results */}
          {results.length === 0 && !isSearching && (
            <div className="text-center py-12 text-[var(--text-tertiary)]">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-sm">Try different keywords or check spelling</p>
            </div>
          )}

          {results.map((r) => (
            <div key={r.question.id}>
              <p className="text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-widest mb-1.5 ml-1">
                {r.unitTitle}
              </p>
              <QuestionCard
                question={r.question}
                defaultOpen={results.length <= 3}
                highlight={query}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
