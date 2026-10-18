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
import CyberPathLogo from "../components/common/CyberPathLogo";

const PATH_BADGES = {
  "red-team": { label: "Red Team", color: "bg-transparent text-fg border-white/12", icon: Flame },
  "blue-team": { label: "Blue Team", color: "bg-transparent text-fg border-white/12", icon: ShieldCheck },
  "web-security": { label: "Web Security", color: "bg-transparent text-fg border-white/12", icon: Globe },
};

const DIFFICULTY_COLORS = {
  Beginner: "bg-transparent text-fg border-white/12",
  Intermediate: "bg-transparent text-fg border-white/12",
  Advanced: "bg-transparent text-fg border-white/12",
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
    <div className="min-h-screen bg-page text-fg flex flex-col selection:bg-white/20 selection:text-white">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-white/12 bg-page/90 backdrop-blur-md px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2.5 group">
          <CyberPathLogo size="sm" glow className="group-hover:scale-105 transition-transform" />
          <span className="font-bold tracking-tight text-base text-fg">
            Cyber<span className="text-blue-400">Path</span>
            <span className="text-xs font-mono text-muted ml-2 font-normal hidden sm:inline">
              / CTF & Lab Explorer
            </span>
          </span>
        </Link>

        {/* Global Nav Links */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/dashboard"
            className="text-xs text-muted hover:text-fg px-3 py-1.5 rounded-lg hover:bg-raised transition-colors"
          >
            Dashboard
          </Link>
          <Link
            to={`/learn/${currentSelectedPath}`}
            className="text-xs text-muted hover:text-fg px-3 py-1.5 rounded-lg hover:bg-raised transition-colors hidden sm:block"
          >
            Curriculum
          </Link>
          <Link
            to="/labs"
            className="text-xs text-accent hover:text-white px-3 py-1.5 rounded-lg hover:bg-raised transition-colors font-medium"
          >
            Interactive Labs
          </Link>
          <Link
            to="/profile"
            className="text-xs text-muted hover:text-fg px-3 py-1.5 rounded-lg hover:bg-raised transition-colors flex items-center gap-1.5"
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-page-enter">
        {/* Header Hero */}
        <div className="relative overflow-hidden rounded-2xl bg-surface p-6 sm:p-8">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/[0.04] blur-[100px] pointer-events-none rounded-full" />

          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-accent">
              <Compass className="w-3.5 h-3.5" />
              <span className="tracking-wider uppercase">Official Resource Discovery</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold tracking-tight text-fg leading-tight">
              CTF Challenges & Guided Labs Explorer
            </h1>

            <p className="text-sm sm:text-base text-muted max-w-3xl leading-relaxed">
              Explore verified hands-on laboratories, wargames, and CTF challenges from premier security training platforms. Every resource is mapped directly to CyberPath learning tracks and foundational security topics.
            </p>

            {/* Platform Badges Row */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-muted">
              <span className="font-semibold text-accent mr-1">Verified Platforms:</span>
              {RESOURCE_PLATFORMS.map((plat) => (
                <a
                  key={plat.id}
                  href={plat.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-md bg-raised hover:bg-[#223147] text-fg transition-colors inline-flex items-center gap-1.5 card-interactive"
                >
                  <span>{plat.name}</span>
                  <ExternalLink className="w-3 h-3 text-muted" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Educational Disclosure Banner */}
        <div className="p-4 rounded-xl bg-surface text-xs text-muted flex items-start gap-3">
          <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-fg">
              External Lab Access & Verification Notice
            </p>
            <p className="leading-relaxed">
              External resources open directly on the provider's official training servers. CyberPath curates and recommends these environments for hands-on practice; CyberPath does not synchronize third-party accounts or fabricate external completion badges without a supported direct API integration.
            </p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="rounded-xl bg-surface p-5 space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search labs by title, platform, topic, or keyword..."
                className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-white/12 bg-page text-xs text-fg placeholder:text-muted focus:outline-none focus:border-white/40 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-white"
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
                  ? "border-white/28 bg-white/[0.06] text-accent shadow-sm"
                  : "border-white/12 bg-page text-muted hover:text-fg hover:border-white/12"
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
              <label className="block text-[10px] font-mono uppercase text-muted mb-1">
                Learning Path
              </label>
              <select
                value={selectedPathFilter}
                onChange={(e) => setSelectedPathFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-white/12 bg-page text-xs text-fg focus:outline-none focus:border-white/40"
              >
                <option value="all">All Learning Paths</option>
                <option value="red-team">Red Team (Offensive)</option>
                <option value="blue-team">Blue Team (Defensive)</option>
                <option value="web-security">Web Security (Application)</option>
              </select>
            </div>

            {/* Topic Filter */}
            <div>
              <label className="block text-[10px] font-mono uppercase text-muted mb-1">
                Topic or Skill
              </label>
              <select
                value={selectedTopicFilter}
                onChange={(e) => setSelectedTopicFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-white/12 bg-page text-xs text-fg focus:outline-none focus:border-white/40"
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
              <label className="block text-[10px] font-mono uppercase text-muted mb-1">
                Difficulty
              </label>
              <select
                value={selectedDifficultyFilter}
                onChange={(e) => setSelectedDifficultyFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-white/12 bg-page text-xs text-fg focus:outline-none focus:border-white/40"
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
              <label className="block text-[10px] font-mono uppercase text-muted mb-1">
                Resource Type
              </label>
              <select
                value={selectedTypeFilter}
                onChange={(e) => setSelectedTypeFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-white/12 bg-page text-xs text-fg focus:outline-none focus:border-white/40"
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
              <span className="text-muted">
                Showing <strong className="text-fg">{filteredResources.length}</strong> of{" "}
                {CURATED_RESOURCES.length} resources
              </span>
              <button
                type="button"
                onClick={resetFilters}
                className="text-accent hover:underline flex items-center gap-1 font-medium"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset all filters</span>
              </button>
            </div>
          )}
        </div>

        {/* Resources Layout */}
        {filteredResources.length === 0 ? (
          <div className="p-12 rounded-2xl bg-surface text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-raised text-muted flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-fg">No matching resources found</h3>
            <p className="text-xs text-muted max-w-md mx-auto">
              No laboratories match your current filter combination. Try adjusting or resetting your search criteria.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="px-4 py-2 rounded-xl bg-accent text-on-accent text-xs font-semibold card-interactive"
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
                "bg-raised text-muted border-white/12";

              return (
                <div className="rounded-2xl bg-raised border border-white/28 p-6 sm:p-7 relative overflow-hidden card-interactive shadow-xl shadow-black/30">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-white/[0.04] blur-[90px] pointer-events-none rounded-full" />

                  <div className="relative z-10 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-accent tracking-wide uppercase">
                          Featured Challenge · {featured.platform}
                        </span>
                        <span className="text-xs text-muted">·</span>
                        <span className="text-xs text-muted">{featured.resourceType}</span>
                        {featured.estimatedHours && (
                          <>
                            <span className="text-xs text-muted">·</span>
                            <span className="text-xs text-muted">{featured.estimatedHours}</span>
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
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-fg tracking-tight">
                        {featured.title}
                      </h2>
                      <p className="text-sm text-muted leading-relaxed max-w-3xl mt-2">
                        {featured.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-white/5">
                      <div className="text-xs text-muted">
                        <span className="text-fg font-medium mr-1.5">Focus:</span>
                        {featured.topics.join(" · ")}
                      </div>

                      <a
                        href={featured.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-on-accent text-xs font-semibold transition-all shadow-sm shrink-0 card-interactive"
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
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight text-fg">
                    Curated Labs & Challenges
                  </h3>
                  <span className="text-xs text-muted font-mono">
                    {filteredResources.length - 1} more {(filteredResources.length - 1) === 1 ? "lab" : "labs"}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {filteredResources.slice(1).map((res) => {
                    const diffClass =
                      DIFFICULTY_COLORS[res.difficulty] ||
                      "bg-raised text-muted border-white/12";

                    return (
                      <div
                        key={res.id}
                        className="rounded-xl bg-surface hover:bg-raised p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all card-interactive group"
                      >
                        {/* Left Info */}
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <span className="font-semibold text-accent">
                              {res.platform}
                            </span>
                            <span className="text-muted">·</span>
                            <span className="text-muted">{res.resourceType}</span>
                            {res.estimatedHours && (
                              <>
                                <span className="text-muted">·</span>
                                <span className="text-muted">{res.estimatedHours}</span>
                              </>
                            )}
                          </div>

                          <h4 className="text-base font-bold text-fg group-hover:text-accent transition-colors leading-snug">
                            {res.title}
                          </h4>

                          <p className="text-xs text-muted line-clamp-1 max-w-2xl leading-relaxed">
                            {res.description}
                          </p>

                          <div className="text-[11px] text-muted pt-0.5">
                            <span className="text-muted/70">Topics: </span>
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
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-accent hover:bg-accent-hover text-on-accent text-xs font-semibold transition-all shadow-sm card-interactive"
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
