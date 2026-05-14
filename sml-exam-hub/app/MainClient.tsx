"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import OverviewSection from "@/components/OverviewSection";
import UnitSection from "@/components/UnitSection";
import ImportantSection from "@/components/ImportantSection";
import PYQSection from "@/components/PYQSection";
import CheatSheetsSection from "@/components/CheatSheetsSection";
import SearchResultsPanel from "@/components/SearchResultsPanel";
import ProgressWidget from "@/components/ProgressWidget";
import { useSearch } from "@/hooks/useSearch";

import type { Unit, PYQPaper, CheatSheet, Overview, SearchResult } from "@/types";

interface MainClientProps {
  units: Unit[];
  papers: PYQPaper[];
  sheets: CheatSheet[];
  overview: Overview;
  stats: Record<string, number>;
  repeated: SearchResult[];
  important: SearchResult[];
}

const SECTION_IDS = [
  "overview",
  "important",
  "pyq",
  "cheatsheets",
];

export default function MainClient({
  units,
  papers,
  sheets,
  overview,
  stats,
  repeated,
  important,
}: MainClientProps) {
  const [activeSection, setActiveSection] = useState("overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [revisionMode, setRevisionMode] = useState(false);
  const { query, setQuery, results, isSearching } = useSearch();
  const mainRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Intersection observer for active section tracking
  useEffect(() => {
    const allIds = [...SECTION_IDS, ...units.map((u) => u.id)];

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );

    allIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [units]);

  const navigateTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 72; // header height + padding
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, []);

  const showSearchResults = query.trim().length > 0;

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Sidebar */}
      <Sidebar
        units={units}
        activeSection={activeSection}
        onNavigate={navigateTo}
        revisionMode={revisionMode}
        onToggleRevision={() => setRevisionMode((v) => !v)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Header */}
      <Header
        query={query}
        onQueryChange={setQuery}
        onMobileMenuOpen={() => setMobileOpen(true)}
        resultCount={results.length}
      />

      {/* Search overlay */}
      {showSearchResults && (
        <SearchResultsPanel
          query={query}
          results={results}
          isSearching={isSearching}
          onClose={() => setQuery("")}
        />
      )}

      {/* Main content */}
      <main
        ref={mainRef}
        className="lg:pl-[260px] pt-14"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-16">
          <OverviewSection overview={overview} stats={stats} />

          {units.map((unit) => (
            <UnitSection key={unit.id} unit={unit} revisionMode={revisionMode} />
          ))}

          <ImportantSection repeated={repeated} important={important} />
          <PYQSection papers={papers} />
          <CheatSheetsSection sheets={sheets} />

          {/* Footer */}
          <footer className="text-center py-8 border-t border-[var(--surface-border)]">
            <p className="text-sm text-[var(--text-tertiary)]">
              SML Exam Hub · Statistical Machine Learning · 2024–25
            </p>
            <p className="text-xs text-[var(--text-tertiary)] mt-1">
              Built for students, by students. Study smart. 🎓
            </p>
          </footer>
        </div>
      </main>

      {/* Floating progress widget */}
      <ProgressWidget />
    </div>
  );
}
