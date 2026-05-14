"use client";

import { useState } from "react";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import type { PYQPaper, PYQQuestion } from "@/types";

interface PYQSectionProps {
  papers: PYQPaper[];
}

export default function PYQSection({ papers }: PYQSectionProps) {
  const [activePaper, setActivePaper] = useState(papers[0]?.id ?? "");
  const [showAnswers, setShowAnswers] = useState(false);

  const paper = papers.find((p) => p.id === activePaper);

  return (
    <section id="pyq" className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Previous Year Papers</h2>
          <p className="text-sm text-[var(--text-tertiary)] mt-0.5">
            Actual CT questions with answer keys
          </p>
        </div>
        <button
          onClick={() => setShowAnswers((v) => !v)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer
            ${showAnswers
              ? "bg-green-500/10 text-green-500 border-green-500/20"
              : "border-[var(--surface-border)] text-[var(--text-secondary)] hover:border-[var(--accent)]/40"}`}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {showAnswers
              ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
              : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>}
          </svg>
          {showAnswers ? "Hide Answers" : "Show Answers"}
        </button>
      </div>

      {/* Paper tabs */}
      <div className="flex gap-2 flex-wrap">
        {papers.map((p) => (
          <button
            key={p.id}
            onClick={() => setActivePaper(p.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all cursor-pointer
              ${activePaper === p.id
                ? "border-[var(--accent)] bg-[var(--accent-light)] text-[var(--accent)]"
                : "border-[var(--surface-border)] text-[var(--text-secondary)] hover:border-[var(--accent)]/40"}`}
          >
            {p.exam}
            <span className="ml-1.5 text-xs opacity-60">{p.year}</span>
          </button>
        ))}
      </div>

      {/* Paper content */}
      {paper && (
        <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] overflow-hidden">
          {/* Paper meta */}
          <div className="px-5 py-4 border-b border-[var(--surface-border)] bg-[var(--bg-secondary)] flex flex-wrap gap-4 items-center">
            <div>
              <p className="text-xs text-[var(--text-tertiary)]">Exam</p>
              <p className="text-sm font-semibold text-[var(--text-primary)]">{paper.exam}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--text-tertiary)]">Total Marks</p>
              <p className="text-sm font-semibold text-[var(--text-primary)]">{paper.totalMarks}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--text-tertiary)]">Duration</p>
              <p className="text-sm font-semibold text-[var(--text-primary)]">{paper.duration}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--text-tertiary)]">Questions</p>
              <p className="text-sm font-semibold text-[var(--text-primary)]">{paper.questions.length}</p>
            </div>
          </div>

          {/* Questions list */}
          <div className="divide-y divide-[var(--surface-border)]">
            {paper.questions.map((q, i) => (
              <PYQQuestionRow key={q.id} q={q} index={i} showAnswer={showAnswers} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function PYQQuestionRow({
  q,
  index,
  showAnswer,
}: {
  q: PYQQuestion;
  index: number;
  showAnswer: boolean;
}) {
  const [localOpen, setLocalOpen] = useState(false);
  const { copy, copiedId } = useCopyToClipboard();
  const open = showAnswer || localOpen;

  return (
    <div className="p-4 hover:bg-[var(--surface-hover)] transition-colors">
      <div className="flex items-start gap-3">
        {/* Number */}
        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]
          text-xs flex items-center justify-center font-mono font-bold mt-0.5">
          {index + 1}
        </span>

        <div className="flex-1 min-w-0">
          {/* Question */}
          <p className="text-sm text-[var(--text-primary)] font-medium leading-snug">{q.question}</p>

          {/* Options */}
          {q.options && q.options.length > 0 && (
            <div className="mt-2 space-y-1">
              {q.options.map((opt, oi) => {
                const isCorrect = showAnswer && q.answer.startsWith(opt.split(")")[0]);
                return (
                  <div
                    key={oi}
                    className={`text-xs px-2.5 py-1.5 rounded-lg border transition-colors
                      ${isCorrect
                        ? "bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400 font-medium"
                        : "border-[var(--surface-border)] text-[var(--text-secondary)]"}`}
                  >
                    {isCorrect && <span className="mr-1">✓</span>}
                    {opt}
                  </div>
                );
              })}
            </div>
          )}

          {/* Answer */}
          {open && (
            <div className="mt-3 flex items-start gap-2 animate-slide-down">
              <div className="flex-1 px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/20 text-xs text-green-600 dark:text-green-400 font-medium">
                ✓ {q.answer}
              </div>
              <button
                onClick={() => copy(`Q: ${q.question}\nA: ${q.answer}`, q.id)}
                className="flex-shrink-0 px-2 py-2 rounded-lg text-xs border border-[var(--surface-border)]
                  text-[var(--text-tertiary)] hover:text-[var(--accent)] hover:border-[var(--accent)]/40
                  transition-all cursor-pointer"
              >
                {copiedId === q.id ? "✓" : "⎘"}
              </button>
            </div>
          )}

          {/* Metadata + toggle */}
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <span className="tag-pill bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]">{q.unit}</span>
            <span className="tag-pill bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]">{q.marks}M</span>
            {q.tags.map((t) => (
              <span key={t} className="tag-pill bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]">{t}</span>
            ))}
            {!showAnswer && (
              <button
                onClick={() => setLocalOpen((v) => !v)}
                className="ml-auto text-xs text-[var(--accent)] hover:underline cursor-pointer"
              >
                {localOpen ? "Hide" : "Reveal"} answer
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
