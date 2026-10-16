/**
 * MissionBriefing — Shows the lab mission statement, objectives, and estimated time.
 */
import { Target, Clock, BookOpen } from "lucide-react";

export default function MissionBriefing({ mission, objectives = [], estimatedTime }) {
  return (
    <div className="rounded-xl border border-white/12 bg-page p-6 mb-6">
      {/* Mission statement */}
      <div className="flex items-start gap-3 mb-5">
        <div className="mt-0.5 w-8 h-8 rounded-lg bg-white/[0.06] border border-white/12 flex items-center justify-center shrink-0">
          <Target className="w-4 h-4 text-accent" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-fg mb-1">Mission Briefing</h2>
          <p className="text-sm text-muted leading-relaxed">{mission}</p>
        </div>
      </div>

      <div className="border-t border-white/12 pt-5 grid sm:grid-cols-2 gap-5">
        {/* Learning objectives */}
        {objectives.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-2.5">
              <BookOpen className="w-3.5 h-3.5 text-muted" />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                Learning Objectives
              </span>
            </div>
            <ul className="space-y-1.5">
              {objectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-fg">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                  {obj}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Estimated time */}
        {estimatedTime && (
          <div className="flex items-start gap-1.5 self-start">
            <Clock className="w-3.5 h-3.5 text-muted mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-0.5">
                Estimated Time
              </p>
              <p className="text-sm text-fg">{estimatedTime}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
