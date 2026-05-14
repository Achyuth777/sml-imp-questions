"use client";

import { useState } from "react";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import type { CheatSheet } from "@/types";

interface CheatSheetsSectionProps {
  sheets: CheatSheet[];
}

export default function CheatSheetsSection({ sheets }: CheatSheetsSectionProps) {
  const { copy, copiedId } = useCopyToClipboard();

  const copySheet = (sheet: CheatSheet) => {
    const text = `${sheet.title}\n${"─".repeat(40)}\n` +
      sheet.items.map(i => `${i.label}:\n  Formula: ${i.formula}\n  Note: ${i.note}`).join("\n\n");
    copy(text, sheet.id);
  };

  return (
    <section id="cheatsheets" className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-[var(--text-primary)]">Cheat Sheets</h2>
        <p className="text-sm text-[var(--text-tertiary)] mt-0.5">
          Key formulas and concepts — quick reference before the exam
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {sheets.map((sheet) => (
          <CheatSheetCard
            key={sheet.id}
            sheet={sheet}
            onCopy={() => copySheet(sheet)}
            copied={copiedId === sheet.id}
          />
        ))}
      </div>
    </section>
  );
}

function CheatSheetCard({
  sheet,
  onCopy,
  copied,
}: {
  sheet: CheatSheet;
  onCopy: () => void;
  copied: boolean;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className="rounded-xl border bg-[var(--surface)] overflow-hidden"
      style={{ borderColor: `${sheet.color}30` }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: `${sheet.color}20`, background: `${sheet.color}08` }}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{sheet.icon}</span>
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">{sheet.title}</p>
            <p className="text-xs" style={{ color: sheet.color }}>{sheet.unit}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={onCopy}
            className="px-2.5 py-1.5 rounded-lg text-xs border border-[var(--surface-border)]
              text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)]/40
              transition-all cursor-pointer flex items-center gap-1"
          >
            {copied ? "✓ Copied" : "⎘ Copy"}
          </button>
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:bg-[var(--surface-hover)]
              transition-all cursor-pointer"
          >
            <svg
              width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2"
              className={`transition-transform duration-200 ${collapsed ? "rotate-180" : ""}`}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Formula rows */}
      {!collapsed && (
        <div className="divide-y divide-[var(--surface-border)]">
          {sheet.items.map((item, i) => (
            <div key={i} className="px-4 py-3 hover:bg-[var(--surface-hover)] transition-colors group">
              <div className="flex items-start justify-between gap-3">
                <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wide flex-shrink-0 w-28">
                  {item.label}
                </p>
                <div className="flex-1 min-w-0 text-right">
                  <code
                    className="text-sm font-mono font-bold block"
                    style={{ color: sheet.color }}
                  >
                    {item.formula}
                  </code>
                  <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{item.note}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
