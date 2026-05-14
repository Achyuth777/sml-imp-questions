"use client";

import { useProgress } from "@/hooks/useProgress";
import type { Unit } from "@/types";

interface SidebarProps {
  units: Unit[];
  activeSection: string;
  onNavigate: (id: string) => void;
  revisionMode: boolean;
  onToggleRevision: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: "◈" },
  { id: "important", label: "Important Questions", icon: "★" },
  { id: "pyq", label: "Previous Year Papers", icon: "📄" },
  { id: "cheatsheets", label: "Cheat Sheets", icon: "⚡" },
];

export default function Sidebar({
  units,
  activeSection,
  onNavigate,
  revisionMode,
  onToggleRevision,
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  const { percentage, completedCount, totalQuestions, mounted } = useProgress();

  const handleNav = (id: string) => {
    onNavigate(id);
    onMobileClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="sidebar-overlay lg:hidden"
          onClick={onMobileClose}
          aria-hidden
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen z-50 flex flex-col
          bg-[var(--bg-secondary)] border-r border-[var(--surface-border)]
          transition-transform duration-300 ease-in-out
          w-[260px]
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo / Header */}
        <div className="px-5 py-4 border-b border-[var(--surface-border)] flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
            style={{ background: "var(--accent)" }}
          >
            SML
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
              SML Exam Hub
            </p>
            <p className="text-xs text-[var(--text-tertiary)]">
              Semester VI · CSE
            </p>
          </div>
        </div>

        {/* Progress bar */}
        {mounted && (
          <div className="px-5 py-3 border-b border-[var(--surface-border)]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-[var(--text-tertiary)] font-medium">
                Progress
              </span>
              <span className="text-xs font-semibold text-[var(--accent)]">
                {completedCount}/{totalQuestions}
              </span>
            </div>
            <div className="w-full h-1.5 bg-[var(--surface-border)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full progress-bar-fill transition-all duration-500"
                style={{
                  width: `${percentage}%`,
                  background: "var(--accent)",
                }}
              />
            </div>
            <p className="text-xs text-[var(--text-tertiary)] mt-1">
              {percentage}% complete
            </p>
          </div>
        )}

        {/* Revision mode toggle */}
        <div className="px-5 py-3 border-b border-[var(--surface-border)]">
          <button
            onClick={onToggleRevision}
            className={`
              w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium
              transition-all duration-150 cursor-pointer
              ${
                revisionMode
                  ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                  : "bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--surface-border)] hover:bg-[var(--surface-hover)]"
              }
            `}
          >
            <span className="flex items-center gap-2">
              <span>🎯</span>
              <span>Revision Mode</span>
            </span>
            <span
              className={`
                w-8 h-4 rounded-full relative transition-colors duration-200 flex-shrink-0
                ${revisionMode ? "bg-amber-500" : "bg-[var(--surface-border)]"}
              `}
            >
              <span
                className={`
                  absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-all duration-200
                  ${revisionMode ? "left-4" : "left-0.5"}
                `}
              />
            </span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 sidebar-scroll px-3 py-3 space-y-0.5">
          {/* Static nav */}
          {NAV_ITEMS.map((item) => (
            <NavItem
              key={item.id}
              id={item.id}
              label={item.label}
              icon={item.icon}
              active={activeSection === item.id}
              onClick={() => handleNav(item.id)}
            />
          ))}

          {/* Units divider */}
          <div className="pt-4 pb-1 px-2">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-tertiary)]">
              Units
            </p>
          </div>

          {units.map((unit) => (
            <NavItem
              key={unit.id}
              id={unit.id}
              label={`${unit.unit}: ${unit.title}`}
              icon="·"
              active={activeSection === unit.id}
              onClick={() => handleNav(unit.id)}
              accent={unit.color}
            />
          ))}
        </nav>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[var(--surface-border)]">
          <p className="text-[11px] text-[var(--text-tertiary)] text-center">
            Statistical Machine Learning · 2024-25
          </p>
        </div>
      </aside>
    </>
  );
}

function NavItem({
  id,
  label,
  icon,
  active,
  onClick,
  accent,
}: {
  id: string;
  label: string;
  icon: string;
  active: boolean;
  onClick: () => void;
  accent?: string;
}) {
  return (
    <button
      onClick={onClick}
      data-section={id}
      className={`
        w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg
        text-sm transition-all duration-150 cursor-pointer group
        ${
          active
            ? "bg-[var(--accent-light)] text-[var(--accent)] font-medium"
            : "text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
        }
      `}
    >
      <span
        className="text-base leading-none flex-shrink-0 w-4 text-center"
        style={active && accent ? { color: accent } : undefined}
      >
        {icon}
      </span>
      <span className="truncate leading-snug">{label}</span>
      {active && (
        <span
          className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ background: accent || "var(--accent)" }}
        />
      )}
    </button>
  );
}
