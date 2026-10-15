/**
 * MissionBriefing — Shows the lab mission statement, objectives, and estimated time.
 */
import { Target, Clock, BookOpen } from "lucide-react";

export default function MissionBriefing({ mission, objectives = [], estimatedTime }) {
  return (
    <div className="rounded-xl border border-[#21262d] bg-[#0d1117] p-6 mb-6">
      {/* Mission statement */}
      <div className="flex items-start gap-3 mb-5">
        <div className="mt-0.5 w-8 h-8 rounded-lg bg-[#2f81f7]/10 border border-[#2f81f7]/30 flex items-center justify-center shrink-0">
          <Target className="w-4 h-4 text-[#58a6ff]" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-[#f0f6fc] mb-1">Mission Briefing</h2>
          <p className="text-sm text-[#8b949e] leading-relaxed">{mission}</p>
        </div>
      </div>

      <div className="border-t border-[#21262d] pt-5 grid sm:grid-cols-2 gap-5">
        {/* Learning objectives */}
        {objectives.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-2.5">
              <BookOpen className="w-3.5 h-3.5 text-[#8b949e]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8b949e]">
                Learning Objectives
              </span>
            </div>
            <ul className="space-y-1.5">
              {objectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[#c9d1d9]">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#2f81f7] shrink-0" />
                  {obj}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Estimated time */}
        {estimatedTime && (
          <div className="flex items-start gap-1.5 self-start">
            <Clock className="w-3.5 h-3.5 text-[#8b949e] mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#8b949e] mb-0.5">
                Estimated Time
              </p>
              <p className="text-sm text-[#c9d1d9]">{estimatedTime}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
