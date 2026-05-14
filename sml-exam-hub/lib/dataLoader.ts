/**
 * Data Loader Utility
 *
 * Central data access layer. All JSON is imported statically so Next.js
 * can tree-shake and bundle it at build time with zero runtime fetch cost.
 * To add a new subject: drop JSON files in /data/<subject>/ and call these
 * functions with the appropriate import.
 */

import type {
  Unit,
  PYQPaper,
  CheatSheet,
  Overview,
  Question,
  SearchResult,
} from "@/types";

import unitsData from "@/data/units.json";
import pyqData from "@/data/pyq.json";
import cheatsheetsData from "@/data/cheatsheets.json";
import overviewData from "@/data/overview.json";

// ─── Raw loaders ──────────────────────────────────────────────────────────────

export function getUnits(): Unit[] {
  return unitsData as Unit[];
}

export function getPYQPapers(): PYQPaper[] {
  return pyqData as PYQPaper[];
}

export function getCheatSheets(): CheatSheet[] {
  return cheatsheetsData as CheatSheet[];
}

export function getOverview(): Overview {
  return overviewData as Overview;
}

// ─── Derived helpers ──────────────────────────────────────────────────────────

/** Flatten every question from every unit into a single list with context. */
export function getAllQuestions(): SearchResult[] {
  const units = getUnits();
  const results: SearchResult[] = [];
  for (const unit of units) {
    for (const q of unit.questions) {
      results.push({
        question: q,
        unitId: unit.id,
        unitTitle: `${unit.unit}: ${unit.title}`,
        score: 0,
      });
    }
  }
  return results;
}

/** Return questions tagged "repeated", sorted by most common topic. */
export function getMostRepeatedQuestions(): SearchResult[] {
  return getAllQuestions().filter((r) =>
    r.question.tags.includes("repeated")
  );
}

/** Return all "important" questions for revision mode. */
export function getImportantQuestions(): SearchResult[] {
  return getAllQuestions().filter((r) =>
    r.question.tags.includes("important")
  );
}

/** Full-text search across question + answer fields. Returns ranked results. */
export function searchQuestions(query: string): SearchResult[] {
  if (!query.trim()) return [];
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);

  return getAllQuestions()
    .map((r) => {
      const haystack =
        `${r.question.question} ${r.question.answer} ${r.question.tags.join(" ")} ${r.unitTitle}`.toLowerCase();

      let score = 0;
      for (const term of terms) {
        if (haystack.includes(term)) score += 1;
        // Exact phrase bonus
        if (r.question.question.toLowerCase().includes(term)) score += 2;
      }
      return { ...r, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);
}

/** Get a single question by id across all units. */
export function getQuestionById(id: string): Question | null {
  for (const unit of getUnits()) {
    const q = unit.questions.find((q) => q.id === id);
    if (q) return q;
  }
  return null;
}

/** Get total question count by type across all units. */
export function getQuestionStats(): Record<string, number> {
  const all = getAllQuestions();
  return {
    total: all.length,
    "2-mark": all.filter((r) => r.question.type === "2-mark").length,
    "5-mark": all.filter((r) => r.question.type === "5-mark").length,
    "10-mark": all.filter((r) => r.question.type === "10-mark").length,
    important: all.filter((r) => r.question.tags.includes("important")).length,
    repeated: all.filter((r) => r.question.tags.includes("repeated")).length,
  };
}
