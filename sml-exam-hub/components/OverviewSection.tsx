import type { Overview } from "@/types";

interface OverviewSectionProps {
  overview: Overview;
  stats: Record<string, number>;
}

export default function OverviewSection({ overview, stats }: OverviewSectionProps) {
  return (
    <section id="overview" className="space-y-6">
      {/* Hero */}
      <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-5"
          style={{ background: "radial-gradient(circle, var(--accent), transparent)", transform: "translate(30%, -30%)" }} />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="tag-pill bg-[var(--accent-light)] text-[var(--accent)]">{overview.code}</span>
            <span className="tag-pill bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]">Semester {overview.semester}</span>
            <span className="tag-pill bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]">{overview.department}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-2">{overview.subject}</h1>
          <p className="text-[var(--text-secondary)] text-sm leading-relaxed max-w-2xl">{overview.description}</p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Total Questions", value: stats.total, color: "#6366f1" },
          { label: "2-Mark Qs", value: stats["2-mark"], color: "#06b6d4" },
          { label: "5-Mark Qs", value: stats["5-mark"], color: "#8b5cf6" },
          { label: "10-Mark Qs", value: stats["10-mark"], color: "#ec4899" },
          { label: "Important", value: stats.important, color: "#ef4444" },
          { label: "Repeated", value: stats.repeated, color: "#f59e0b" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] p-4 text-center">
            <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-[var(--text-tertiary)] mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Exam pattern */}
      <div className="rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] p-5">
        <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Exam Pattern</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {Object.entries(overview.examPattern).map(([key, exam]) => (
            <div key={key} className="rounded-lg bg-[var(--bg-secondary)] border border-[var(--surface-border)] p-4">
              <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wide font-medium mb-1">{key.toUpperCase()}</p>
              <p className="font-semibold text-[var(--text-primary)] text-sm">{exam.name}</p>
              <p className="text-2xl font-bold text-[var(--accent)] mt-1">{exam.marks}</p>
              <p className="text-xs text-[var(--text-tertiary)]">marks · {exam.units}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Important topics + References */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] p-5">
          <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
            <span>🔥</span> High-Frequency Topics
          </h2>
          <ul className="space-y-2">
            {overview.importantTopics.map((t, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <span className="w-4 h-4 rounded-full bg-red-500/10 text-red-500 text-xs flex items-center justify-center font-bold flex-shrink-0">
                  {i + 1}
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] p-5">
          <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
            <span>📚</span> References
          </h2>
          <ul className="space-y-2">
            {overview.references.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                <span className="text-[var(--text-tertiary)] mt-0.5">›</span>
                {r}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
