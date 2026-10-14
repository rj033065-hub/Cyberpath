import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Shield,
  Search,
  ExternalLink,
  Flame,
  ShieldCheck,
  Globe,
  Sparkles,
  Info,
  Compass,
  X,
  User,
} from "lucide-react";
import {
  CURATED_RESOURCES,
  RESOURCE_PLATFORMS,
  RESOURCE_TYPES,
  RESOURCE_DIFFICULTIES,
  RESOURCE_TOPICS,
} from "../data/resourceCatalogData";
import { getStudentDashboardMetrics } from "../lib/learningService";

const PATH_BADGES = {
  "red-team": { label: "Red Team", color: "bg-[#2f81f7]/15 text-[#58a6ff] border-[#2f81f7]/30", icon: Flame },
  "blue-team": { label: "Blue Team", color: "bg-[#3fb950]/15 text-[#3fb950] border-[#3fb950]/30", icon: ShieldCheck },
  "web-security": { label: "Web Security", color: "bg-[#a371f7]/15 text-[#bc8cff] border-[#a371f7]/30", icon: Globe },
};

const DIFFICULTY_COLORS = {
  Beginner: "bg-[#3fb950]/15 text-[#3fb950] border-[#3fb950]/40",
  Intermediate: "bg-[#d29922]/15 text-[#f2cc60] border-[#d29922]/40",
  Advanced: "bg-[#fa7970]/15 text-[#fa7970] border-[#fa7970]/40",
};

export default function ResourceExplorer() {
  const { user, profile } = useAuth();
  const currentSelectedPath = profile?.selected_path || "red-team";

  const [studentMetrics, setStudentMetrics] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPathFilter, setSelectedPathFilter] = useState("all");
  const [selectedTopicFilter, setSelectedTopicFilter] = useState("all");
  const [selectedDifficultyFilter, setSelectedDifficultyFilter] = useState("all");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState("all");
  const [recommendedOnly, setRecommendedOnly] = useState(false);

  useEffect(() => {
    if (user?.id) {
      getStudentDashboardMetrics(user.id, currentSelectedPath).then((data) => {
        setStudentMetrics(data);
      });
    }
  }, [user?.id, currentSelectedPath]);

  // Is student a beginner? (< 5 completed lessons)
  const isBeginnerStudent = (studentMetrics?.completedCount || 0) < 5;

  // Filtered resources
  const filteredResources = useMemo(() => {
    return CURATED_RESOURCES.filter((res) => {
      // 1. Path Filter
      if (selectedPathFilter !== "all") {
        if (!res.paths.includes(selectedPathFilter)) return false;
      }

      // 2. Topic Filter
      if (selectedTopicFilter !== "all") {
        if (!res.topics.includes(selectedTopicFilter)) return false;
      }

      // 3. Difficulty Filter
      if (selectedDifficultyFilter !== "all") {
        if (res.difficulty !== selectedDifficultyFilter) return false;
      }

      // 4. Resource Type Filter
      if (selectedTypeFilter !== "all") {
        if (res.resourceType !== selectedTypeFilter) return false;
      }

      // 5. Recommended Only Toggle (matches user's path & skill level)
      if (recommendedOnly) {
        const matchesUserPath = res.paths.includes(currentSelectedPath);
        const matchesSkill = isBeginnerStudent
          ? res.difficulty === "Beginner"
          : true;
        if (!matchesUserPath || !matchesSkill) return false;
      }

      // 6. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inTitle = res.title.toLowerCase().includes(q);
        const inDesc = res.description.toLowerCase().includes(q);
        const inPlatform = res.platform.toLowerCase().includes(q);
        const inTopics = res.topics.some((t) => t.toLowerCase().includes(q));
        if (!inTitle && !inDesc && !inPlatform && !inTopics) return false;
      }

      return true;
    });
  }, [
    searchQuery,
    selectedPathFilter,
    selectedTopicFilter,
    selectedDifficultyFilter,
    selectedTypeFilter,
    recommendedOnly,
    currentSelectedPath,
    isBeginnerStudent,
  ]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedPathFilter("all");
    setSelectedTopicFilter("all");
    setSelectedDifficultyFilter("all");
    setSelectedTypeFilter("all");
    setRecommendedOnly(false);
  };

  const hasActiveFilters =
    searchQuery !== "" ||
    selectedPathFilter !== "all" ||
    selectedTopicFilter !== "all" ||
    selectedDifficultyFilter !== "all" ||
    selectedTypeFilter !== "all" ||
    recommendedOnly;

  return (
    <div className="min-h-screen bg-[#090d14] text-[#f0f6fc] flex flex-col selection:bg-[#2f81f7]/30 selection:text-white">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-[#21262d] bg-[#090d14]/90 backdrop-blur-md px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2f81f7] to-[#111821] border border-[#2f81f7]/40 flex items-center justify-center text-[#f0f6fc] group-hover:border-[#58a6ff] transition-colors shadow-sm shadow-[#2f81f7]/20">
            <Shield className="w-4 h-4 text-[#58a6ff]" strokeWidth={2.4} />
          </div>
          <span className="font-bold tracking-tight text-base text-[#f0f6fc]">
            Cyber<span className="text-[#58a6ff]">Path</span>
            <span className="text-xs font-mono text-[#8b98a8] ml-2 font-normal hidden sm:inline">
              / CTF & Lab Explorer
            </span>
          </span>
        </Link>

        {/* Global Nav Links */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/dashboard"
            className="text-xs text-[#8b98a8] hover:text-[#f0f6fc] px-3 py-1.5 rounded-lg hover:bg-[#111722] transition-colors"
          >
            Dashboard
          </Link>
          <Link
            to={`/learn/${currentSelectedPath}`}
            className="text-xs text-[#8b98a8] hover:text-[#f0f6fc] px-3 py-1.5 rounded-lg hover:bg-[#111722] transition-colors hidden sm:block"
          >
            Curriculum
          </Link>
          <Link
            to="/profile"
            className="text-xs text-[#8b98a8] hover:text-[#f0f6fc] px-3 py-1.5 rounded-lg hover:bg-[#111722] transition-colors flex items-center gap-1.5"
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-page-enter">
        {/* Header Hero */}
        <div className="relative overflow-hidden rounded-2xl bg-[#111722] p-6 sm:p-8">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#2f81f7]/10 blur-[100px] pointer-events-none rounded-full" />

          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#58a6ff]">
              <Compass className="w-3.5 h-3.5" />
              <span className="tracking-wider uppercase">Official Resource Discovery</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold tracking-tight text-[#f0f6fc] leading-tight">
              CTF Challenges & Guided Labs Explorer
            </h1>

            <p className="text-sm sm:text-base text-[#8b98a8] max-w-3xl leading-relaxed">
              Explore verified hands-on laboratories, wargames, and CTF challenges from premier security training platforms. Every resource is mapped directly to CyberPath learning tracks and foundational security topics.
            </p>

            {/* Platform Badges Row */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-[#8b98a8]">
              <span className="font-semibold text-[#58a6ff] mr-1">Verified Platforms:</span>
              {RESOURCE_PLATFORMS.map((plat) => (
                <a
                  key={plat.id}
                  href={plat.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-md bg-[#182232] hover:bg-[#223147] text-[#f0f6fc] transition-colors inline-flex items-center gap-1.5 card-interactive"
                >
                  <span>{plat.name}</span>
                  <ExternalLink className="w-3 h-3 text-[#8b98a8]" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Educational Disclosure Banner */}
        <div className="p-4 rounded-xl bg-[#111722] text-xs text-[#8b98a8] flex items-start gap-3">
          <Info className="w-4 h-4 text-[#58a6ff] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-[#f0f6fc]">
              External Lab Access & Verification Notice
            </p>
            <p className="leading-relaxed">
              External resources open directly on the provider's official training servers. CyberPath curates and recommends these environments for hands-on practice; CyberPath does not synchronize third-party accounts or fabricate external completion badges without a supported direct API integration.
            </p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="rounded-xl bg-[#111722] p-5 space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#8b98a8] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search labs by title, platform, topic, or keyword..."
                className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-[#21262d] bg-[#090d14] text-xs text-[#f0f6fc] placeholder-[#8b98a8] focus:outline-none focus:border-[#2f81f7] transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b98a8] hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Smart Matching Toggle */}
            <button
              type="button"
              onClick={() => setRecommendedOnly(!recommendedOnly)}
              className={`px-3.5 py-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-all card-interactive ${
                recommendedOnly
                  ? "border-[#2f81f7] bg-[#2f81f7]/20 text-[#58a6ff] shadow-sm shadow-[#2f81f7]/20"
                  : "border-[#21262d] bg-[#090d14] text-[#8b98a8] hover:text-[#f0f6fc] hover:border-[#30363d]"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Recommended for My Track ({currentSelectedPath.toUpperCase()})</span>
            </button>
          </div>

          {/* Filter Dropdowns Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-white/5">
            {/* Path Filter */}
            <div>
              <label className="block text-[10px] font-mono uppercase text-[#8b98a8] mb-1">
                Learning Path
              </label>
              <select
                value={selectedPathFilter}
                onChange={(e) => setSelectedPathFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#21262d] bg-[#090d14] text-xs text-[#f0f6fc] focus:outline-none focus:border-[#2f81f7]"
              >
                <option value="all">All Learning Paths</option>
                <option value="red-team">Red Team (Offensive)</option>
                <option value="blue-team">Blue Team (Defensive)</option>
                <option value="web-security">Web Security (Application)</option>
              </select>
            </div>

            {/* Topic Filter */}
            <div>
              <label className="block text-[10px] font-mono uppercase text-[#8b98a8] mb-1">
                Topic or Skill
              </label>
              <select
                value={selectedTopicFilter}
                onChange={(e) => setSelectedTopicFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#21262d] bg-[#090d14] text-xs text-[#f0f6fc] focus:outline-none focus:border-[#2f81f7]"
              >
                <option value="all">All Topics</option>
                {RESOURCE_TOPICS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="block text-[10px] font-mono uppercase text-[#8b98a8] mb-1">
                Difficulty
              </label>
              <select
                value={selectedDifficultyFilter}
                onChange={(e) => setSelectedDifficultyFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#21262d] bg-[#090d14] text-xs text-[#f0f6fc] focus:outline-none focus:border-[#2f81f7]"
              >
                <option value="all">All Difficulties</option>
                {RESOURCE_DIFFICULTIES.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Resource Type Filter */}
            <div>
              <label className="block text-[10px] font-mono uppercase text-[#8b98a8] mb-1">
                Resource Type
              </label>
              <select
                value={selectedTypeFilter}
                onChange={(e) => setSelectedTypeFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#21262d] bg-[#090d14] text-xs text-[#f0f6fc] focus:outline-none focus:border-[#2f81f7]"
              >
                <option value="all">All Types</option>
                {RESOURCE_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters Summary & Reset */}
          {hasActiveFilters && (
            <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
              <span className="text-[#8b98a8]">
                Showing <strong className="text-[#f0f6fc]">{filteredResources.length}</strong> of{" "}
                {CURATED_RESOURCES.length} resources
              </span>
              <button
                type="button"
                onClick={resetFilters}
                className="text-[#58a6ff] hover:underline flex items-center gap-1 font-medium"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset all filters</span>
              </button>
            </div>
          )}
        </div>

        {/* Resources Layout */}
        {filteredResources.length === 0 ? (
          <div className="p-12 rounded-2xl bg-[#111821] text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#182232] text-[#8b98a8] flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#f0f6fc]">No matching resources found</h3>
            <p className="text-xs text-[#8b98a8] max-w-md mx-auto">
              No laboratories match your current filter combination. Try adjusting or resetting your search criteria.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="px-4 py-2 rounded-xl bg-[#2f81f7] text-white text-xs font-semibold card-interactive"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Featured Lab / Challenge (Focal Element) */}
            {(() => {
              const featured = filteredResources[0];
              const diffClass =
                DIFFICULTY_COLORS[featured.difficulty] ||
                "bg-[#21262d] text-[#8b98a8] border-[#30363d]";

              return (
                <div className="rounded-2xl bg-[#182232] border border-[#2f81f7]/40 p-6 sm:p-7 relative overflow-hidden card-interactive shadow-xl shadow-black/30">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-[#2f81f7]/10 blur-[90px] pointer-events-none rounded-full" />

                  <div className="relative z-10 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#58a6ff] tracking-wide uppercase">
                          Featured Challenge · {featured.platform}
                        </span>
                        <span className="text-xs text-[#8b98a8]">·</span>
                        <span className="text-xs text-[#8b98a8]">{featured.resourceType}</span>
                        {featured.estimatedHours && (
                          <>
                            <span className="text-xs text-[#8b98a8]">·</span>
                            <span className="text-xs text-[#8b98a8]">{featured.estimatedHours}</span>
                          </>
                        )}
                      </div>

                      <span
                        className={`text-[11px] font-mono uppercase px-2.5 py-0.5 rounded-full border ${diffClass}`}
                      >
                        {featured.difficulty}
                      </span>
                    </div>

                    <div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-[#f0f6fc] tracking-tight">
                        {featured.title}
                      </h2>
                      <p className="text-sm text-[#8b98a8] leading-relaxed max-w-3xl mt-2">
                        {featured.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-white/5">
                      <div className="text-xs text-[#8b98a8]">
                        <span className="text-[#f0f6fc] font-medium mr-1.5">Focus:</span>
                        {featured.topics.join(" · ")}
                      </div>

                      <a
                        href={featured.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2f81f7] hover:bg-[#2069cc] text-white text-xs font-semibold transition-all shadow-md shadow-[#2f81f7]/25 shrink-0 card-interactive"
                      >
                        <span>Launch Featured Lab</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* List Rows for Remaining Resources */}
            {filteredResources.length > 1 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[#f0f6fc]">
                    Curated Labs & Challenges
                  </h3>
                  <span className="text-xs text-[#8b98a8] font-mono">
                    {filteredResources.length - 1} more {(filteredResources.length - 1) === 1 ? "lab" : "labs"}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {filteredResources.slice(1).map((res) => {
                    const diffClass =
                      DIFFICULTY_COLORS[res.difficulty] ||
                      "bg-[#21262d] text-[#8b98a8] border-[#30363d]";

                    return (
                      <div
                        key={res.id}
                        className="rounded-xl bg-[#111821] hover:bg-[#182232] p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all card-interactive group"
                      >
                        {/* Left Info */}
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <span className="font-semibold text-[#58a6ff]">
                              {res.platform}
                            </span>
                            <span className="text-[#8b98a8]">·</span>
                            <span className="text-[#8b98a8]">{res.resourceType}</span>
                            {res.estimatedHours && (
                              <>
                                <span className="text-[#8b98a8]">·</span>
                                <span className="text-[#8b98a8]">{res.estimatedHours}</span>
                              </>
                            )}
                          </div>

                          <h4 className="text-base font-bold text-[#f0f6fc] group-hover:text-[#58a6ff] transition-colors leading-snug">
                            {res.title}
                          </h4>

                          <p className="text-xs text-[#8b98a8] line-clamp-1 max-w-2xl leading-relaxed">
                            {res.description}
                          </p>

                          <div className="text-[11px] text-[#8b98a8] pt-0.5">
                            <span className="text-[#8b98a8]/70">Topics: </span>
                            {res.topics.join(" · ")}
                          </div>
                        </div>

                        {/* Right: Exactly 1 Status Pill (Difficulty) + Action */}
                        <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                          <span
                            className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full border ${diffClass}`}
                          >
                            {res.difficulty}
                          </span>

                          <a
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#2f81f7] hover:bg-[#2069cc] text-white text-xs font-semibold transition-all shadow-sm shadow-[#2f81f7]/20 card-interactive"
                          >
                            <span>Launch</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
