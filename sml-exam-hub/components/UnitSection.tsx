"use client";

import { useState } from "react";
import QuestionCard from "./QuestionCard";
import type { Unit, QuestionType } from "@/types";

interface UnitSectionProps {
  unit: Unit;
  revisionMode: boolean;
}

const TYPES: QuestionType[] = ["2-mark", "5-mark", "10-mark"];

export default function UnitSection({ unit, revisionMode }: UnitSectionProps) {
  const [activeType, setActiveType] = useState<QuestionType | "all">("all");
  const [topicsOpen, setTopicsOpen] = useState(false);

  const questions = unit.questions.filter((q) => {
    if (revisionMode && !q.tags.includes("important")) return false;
    if (activeType !== "all" && q.type !== activeType) return false;
    return true;
  });

  const countByType = (type: QuestionType) =>
    unit.questions.filter((q) => q.type === type && (!revisionMode || q.tags.includes("important"))).length;

  return (
    <section id={unit.id} className="space-y-4">
      {/* Unit header card */}
      <div
        className="rounded-2xl border p-5 sm:p-6"
        style={{ borderColor: `${unit.color}30`, background: `${unit.color}08` }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-md text-white"
                style={{ background: unit.color }}
              >
                {unit.unit}
              </span>
              {revisionMode && (
                <span className="tag-pill bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  🎯 Revision Mode
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">{unit.title}</h2>
            <p className="text-sm text-[var(--text-secondary)] mt-1 max-w-2xl">{unit.summary}</p>
          </div>
        </div>

        {/* Topics toggle */}
        <button
          onClick={() => setTopicsOpen((o) => !o)}
          className="mt-4 flex items-center gap-2 text-xs font-medium text-[var(--text-tertiary)]
            hover:text-[var(--text-primary)] transition-colors cursor-pointer"
        >
          <svg
            width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5"
            className={`transition-transform duration-200 ${topicsOpen ? "rotate-90" : ""}`}
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
          {topicsOpen ? "Hide" : "Show"} topics ({unit.topics.length})
        </button>

        {topicsOpen && (
          <div className="mt-3 flex flex-wrap gap-2 animate-slide-down">
            {unit.topics.map((t) => (
              <span
                key={t}
                className="text-xs px-2.5 py-1 rounded-lg border"
                style={{ borderColor: `${unit.color}40`, color: unit.color, background: `${unit.color}10` }}
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setActiveType("all")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer
            ${activeType === "all"
              ? "border-[var(--accent)] bg-[var(--accent-light)] text-[var(--accent)]"
              : "border-[var(--surface-border)] text-[var(--text-secondary)] hover:border-[var(--accent)]/40"}`}
        >
          All ({unit.questions.filter(q => !revisionMode || q.tags.includes("important")).length})
        </button>
        {TYPES.map((type) => {
          const cnt = countByType(type);
          return (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer
                ${activeType === type
                  ? "border-[var(--accent)] bg-[var(--accent-light)] text-[var(--accent)]"
                  : "border-[var(--surface-border)] text-[var(--text-secondary)] hover:border-[var(--accent)]/40"}`}
            >
              {type} ({cnt})
            </button>
          );
        })}
      </div>

      {/* Questions */}
      {questions.length === 0 ? (
        <div className="text-center py-10 text-[var(--text-tertiary)] text-sm">
          {revisionMode ? "No important questions for this filter." : "No questions found."}
        </div>
      ) : (
        <div className="space-y-3">
          {questions.map((q, i) => (
            <QuestionCard key={q.id} question={q} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}
