"use client";

import { useState } from "react";
import { useProgress } from "@/hooks/useProgress";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import type { Question } from "@/types";

interface QuestionCardProps {
  question: Question;
  index?: number;
  defaultOpen?: boolean;
  highlight?: string;
}

const TAG_STYLES: Record<string, string> = {
  important: "bg-red-500/10 text-red-500 border border-red-500/20",
  repeated:  "bg-orange-500/10 text-orange-500 border border-orange-500/20",
  easy:      "bg-green-500/10 text-green-500 border border-green-500/20",
  tricky:    "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20",
  "10-mark": "bg-purple-500/10 text-purple-500 border border-purple-500/20",
  MCQ:       "bg-blue-500/10 text-blue-500 border border-blue-500/20",
};

const TYPE_STYLES: Record<string, string> = {
  "2-mark":  "bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--surface-border)]",
  "5-mark":  "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  "10-mark": "bg-purple-500/10 text-purple-400 border border-purple-500/20",
};

function highlightText(text: string, query: string): React.ReactNode {
  if (!query?.trim()) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-yellow-400/30 text-[var(--text-primary)] rounded px-0.5">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export default function QuestionCard({
  question,
  index,
  defaultOpen = false,
  highlight,
}: QuestionCardProps) {
  const [open, setOpen] = useState(defaultOpen);
  const { toggle, isCompleted } = useProgress();
  const { copy, copiedId } = useCopyToClipboard();
  const done = isCompleted(question.id);

  const copyText = `Q: ${question.question}\n\nA: ${question.answer}${question.answer_key ? `\n\nAnswer Key: ${question.answer_key}` : ""}`;

  return (
    <div
      className={`
        group rounded-xl border transition-all duration-200
        ${done
          ? "border-green-500/30 bg-green-500/5"
          : "border-[var(--surface-border)] bg-[var(--surface)] hover:border-[var(--accent)]/30"}
        ${open ? "shadow-md" : ""}
      `}
    >
      {/* Header row */}
      <div
        className="flex items-start gap-3 p-4 cursor-pointer select-none"
        onClick={() => setOpen((o) => !o)}
      >
        {/* Index number */}
        {index !== undefined && (
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]
            text-xs flex items-center justify-center font-mono mt-0.5">
            {index + 1}
          </span>
        )}

        {/* Question text */}
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium leading-snug transition-colors ${done ? "text-[var(--text-tertiary)] line-through" : "text-[var(--text-primary)]"}`}>
            {highlight ? highlightText(question.question, highlight) : question.question}
          </p>

          {/* Tags row */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            <span className={`tag-pill ${TYPE_STYLES[question.type] ?? ""}`}>
              {question.type}
            </span>
            {question.year && (
              <span className="tag-pill bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]">
                {question.year}
              </span>
            )}
            {question.tags.filter(t => t !== "10-mark").map((tag) => (
              <span key={tag} className={`tag-pill ${TAG_STYLES[tag] ?? "bg-gray-500/10 text-gray-400"}`}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Chevron */}
        <span className={`flex-shrink-0 text-[var(--text-tertiary)] transition-transform duration-200 mt-0.5 ${open ? "rotate-180" : ""}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </div>

      {/* Expanded answer */}
      {open && (
        <div className="px-4 pb-4 animate-slide-down">
          <div className="border-t border-[var(--surface-border)] pt-4 space-y-3">
            {/* Answer key badge */}
            {question.answer_key && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg
                bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-semibold">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                Answer Key: {question.answer_key}
              </div>
            )}

            {/* Answer text */}
            <div className="answer-prose">{question.answer}</div>

            {/* Action row */}
            <div className="flex items-center gap-2 pt-2 border-t border-[var(--surface-border)]">
              {/* Mark complete */}
              <button
                onClick={(e) => { e.stopPropagation(); toggle(question.id); }}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                  border transition-all duration-150 cursor-pointer
                  ${done
                    ? "bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20"
                    : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--surface-border)] hover:border-green-500/40 hover:text-green-500"}
                `}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                {done ? "Completed" : "Mark done"}
              </button>

              {/* Copy */}
              <button
                onClick={(e) => { e.stopPropagation(); copy(copyText, question.id); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                  bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--surface-border)]
                  hover:border-[var(--accent)]/40 hover:text-[var(--accent)]
                  transition-all duration-150 cursor-pointer"
              >
                {copiedId === question.id ? (
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                    </svg>
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
