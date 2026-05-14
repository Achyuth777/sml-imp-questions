"use client";

import { useTheme } from "@/hooks/useTheme";

interface HeaderProps {
  query: string;
  onQueryChange: (q: string) => void;
  onMobileMenuOpen: () => void;
  resultCount: number;
}

export default function Header({
  query,
  onQueryChange,
  onMobileMenuOpen,
  resultCount,
}: HeaderProps) {
  const { theme, toggle, mounted } = useTheme();

  return (
    <header
      className="
        fixed top-0 right-0 left-0 lg:left-[260px] z-30 h-14
        bg-[var(--bg)]/80 backdrop-blur-md
        border-b border-[var(--surface-border)]
        flex items-center gap-3 px-4
      "
    >
      {/* Mobile menu button */}
      <button
        className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg
          text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] transition-colors"
        onClick={onMobileMenuOpen}
        aria-label="Open menu"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Search bar */}
      <div className="flex-1 max-w-xl relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search questions, topics, answers…"
          className="
            w-full h-9 pl-9 pr-9 rounded-lg text-sm
            bg-[var(--surface)] border border-[var(--surface-border)]
            text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]
            focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/30
            transition-all duration-150
          "
        />
        {query && (
          <button
            onClick={() => onQueryChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]
              hover:text-[var(--text-primary)] transition-colors"
            aria-label="Clear search"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Search result count */}
      {query && (
        <span className="hidden sm:block text-xs text-[var(--text-tertiary)] whitespace-nowrap">
          {resultCount} result{resultCount !== 1 ? "s" : ""}
        </span>
      )}

      {/* Spacer */}
      <div className="flex-1 hidden sm:block" />

      {/* Theme toggle */}
      {mounted && (
        <button
          onClick={toggle}
          className="
            flex items-center justify-center w-8 h-8 rounded-lg
            text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]
            border border-[var(--surface-border)] transition-all duration-150
          "
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
          )}
        </button>
      )}
    </header>
  );
}
