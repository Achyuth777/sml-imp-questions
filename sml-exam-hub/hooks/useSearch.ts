"use client";

import { useState, useEffect, useCallback } from "react";
import { searchQuestions } from "@/lib/dataLoader";
import type { SearchResult, FilterState, QuestionType, QuestionTag } from "@/types";

const DEFAULT_FILTERS: FilterState = {
  types: [],
  tags: [],
  units: [],
  revisionMode: false,
};

export function useSearch() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Debounce the query
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 250);
    return () => clearTimeout(timer);
  }, [query]);

  // Run search when debounced query changes
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    const raw = searchQuestions(debouncedQuery);
    setResults(applyFilters(raw, filters));
    setIsSearching(false);
  }, [debouncedQuery, filters]);

  const toggleType = useCallback((type: QuestionType) => {
    setFilters((f) => ({
      ...f,
      types: f.types.includes(type)
        ? f.types.filter((t) => t !== type)
        : [...f.types, type],
    }));
  }, []);

  const toggleTag = useCallback((tag: QuestionTag) => {
    setFilters((f) => ({
      ...f,
      tags: f.tags.includes(tag)
        ? f.tags.filter((t) => t !== tag)
        : [...f.tags, tag],
    }));
  }, []);

  const toggleUnit = useCallback((unitId: string) => {
    setFilters((f) => ({
      ...f,
      units: f.units.includes(unitId)
        ? f.units.filter((u) => u !== unitId)
        : [...f.units, unitId],
    }));
  }, []);

  const toggleRevisionMode = useCallback(() => {
    setFilters((f) => ({ ...f, revisionMode: !f.revisionMode }));
  }, []);

  const clearFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);
  const clearSearch = useCallback(() => {
    setQuery("");
    setResults([]);
  }, []);

  const activeFilterCount =
    filters.types.length +
    filters.tags.length +
    filters.units.length +
    (filters.revisionMode ? 1 : 0);

  return {
    query,
    setQuery,
    results,
    isSearching,
    filters,
    toggleType,
    toggleTag,
    toggleUnit,
    toggleRevisionMode,
    clearFilters,
    clearSearch,
    activeFilterCount,
  };
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function applyFilters(
  results: SearchResult[],
  filters: FilterState
): SearchResult[] {
  return results.filter((r) => {
    if (filters.types.length > 0 && !filters.types.includes(r.question.type))
      return false;
    if (
      filters.tags.length > 0 &&
      !filters.tags.some((t) => r.question.tags.includes(t))
    )
      return false;
    if (filters.units.length > 0 && !filters.units.includes(r.unitId))
      return false;
    if (filters.revisionMode && !r.question.tags.includes("important"))
      return false;
    return true;
  });
}
