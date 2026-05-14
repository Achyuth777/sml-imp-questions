import QuestionCard from "./QuestionCard";
import type { SearchResult } from "@/types";

interface ImportantSectionProps {
  repeated: SearchResult[];
  important: SearchResult[];
}

export default function ImportantSection({ repeated, important }: ImportantSectionProps) {
  return (
    <section id="important" className="space-y-8">
      {/* Most Repeated */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-base">
            🔁
          </div>
          <div>
            <h2 className="text-lg font-bold text-[var(--text-primary)]">Most Repeated Questions</h2>
            <p className="text-xs text-[var(--text-tertiary)]">Appeared in multiple CTs — high priority</p>
          </div>
          <span className="ml-auto tag-pill bg-orange-500/10 text-orange-500 border border-orange-500/20">
            {repeated.length} questions
          </span>
        </div>
        {repeated.length === 0 ? (
          <p className="text-sm text-[var(--text-tertiary)]">No repeated questions found.</p>
        ) : (
          <div className="space-y-3">
            {repeated.map((r, i) => (
              <div key={r.question.id}>
                <p className="text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-widest mb-1.5 ml-1">
                  {r.unitTitle}
                </p>
                <QuestionCard question={r.question} index={i} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* All Important */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-base">
            ★
          </div>
          <div>
            <h2 className="text-lg font-bold text-[var(--text-primary)]">All Important Questions</h2>
            <p className="text-xs text-[var(--text-tertiary)]">Curated must-know questions across all units</p>
          </div>
          <span className="ml-auto tag-pill bg-red-500/10 text-red-500 border border-red-500/20">
            {important.length} questions
          </span>
        </div>
        <div className="space-y-3">
          {important.map((r, i) => (
            <QuestionCard key={r.question.id} question={r.question} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
