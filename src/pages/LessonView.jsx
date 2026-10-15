import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Shield,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  BookOpen,
  AlertTriangle,
  ExternalLink,
  Laptop,
  Check,
  Award,
  Sparkles,
  Terminal,
  FileText,
  LockKeyhole,
  Copy,
  CheckCheck,
  Lightbulb,
  AlertCircle,
  Info,
  ChevronDown,
  ListChecks,
  HelpCircle,
  ArrowRight,
} from "lucide-react";
import {
  getPathBySlug,
  getLessonBySlug,
} from "../data/curriculumData";
import {
  markLessonComplete,
  getCompletedLessonSlugs,
} from "../lib/learningService";
import AssessmentCard from "../components/learning/AssessmentCard";
import BadgeUnlockedModal from "../components/learning/BadgeUnlockedModal";

const RELATED_CYBERPATH_LABS = {
  "introduction-to-sql-injection": {
    title: "Lab 1: SQL Injection Fundamentals",
    route: "/labs/sqli-basics",
    category: "Web Security",
    difficulty: "Beginner",
    estTime: "20 min",
    badge: "CyberPath Interactive Lab",
    description: "Launch the sandboxed SQLi lab to practice auth bypass simulation, query inspection, and parameterized defense.",
  },
  "introduction-to-cross-site-scripting": {
    title: "Lab 2: XSS Playground",
    route: "/labs/xss-playground",
    category: "Browser Security",
    difficulty: "Beginner",
    estTime: "25 min",
    badge: "CyberPath Interactive Lab",
    description: "Safely test HTML output encoding vs interpretation in our interactive comments simulator without executing unsafe scripts.",
  },
  "access-control-vulnerabilities": {
    title: "Lab 3: IDOR Investigation",
    route: "/labs/idor-investigation",
    category: "Access Control",
    difficulty: "Beginner",
    estTime: "20 min",
    badge: "CyberPath Interactive Lab",
    description: "Investigate broken object-level authorization across mock user records and compare vulnerable vs secure server-side checks.",
  },
  "cookies-sessions-and-authentication": {
    title: "Lab 4: Authentication Checkpoint",
    route: "/labs/auth-checkpoint",
    category: "Authentication",
    difficulty: "Beginner",
    estTime: "25 min",
    badge: "CyberPath Interactive Lab",
    description: "Audit authentication workflows: enforce password policies, rate limiting, session timeout, and secure server-side state.",
  },
};

/* ─────────────────────────────────────────────
   Reusable Content Components
───────────────────────────────────────────── */

function Callout({ type = "tip", title, children }) {
  const styles = {
    rule: {
      bar: "bg-[#2f81f7]",
      icon: <Info className="w-4 h-4 text-[#58a6ff] shrink-0 mt-0.5" />,
      label: title || "Rule",
      bg: "bg-[#2f81f7]/5",
    },
    warning: {
      bar: "bg-[#f85149]",
      icon: <AlertCircle className="w-4 h-4 text-[#f85149] shrink-0 mt-0.5" />,
      label: title || "Warning",
      bg: "bg-[#f85149]/5",
    },
    tip: {
      bar: "bg-[#3fb950]",
      icon: <Lightbulb className="w-4 h-4 text-[#3fb950] shrink-0 mt-0.5" />,
      label: title || "Tip",
      bg: "bg-[#3fb950]/5",
    },
  };
  const s = styles[type] || styles.tip;
  return (
    <div className={`flex gap-0 rounded-r-xl overflow-hidden my-6 ${s.bg}`}>
      <div className={`w-1 shrink-0 ${s.bar}`} />
      <div className="flex items-start gap-3 px-4 py-3.5 flex-1">
        {s.icon}
        <div className="flex-1 min-w-0">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8b98a8] block mb-1">
            {s.label}
          </span>
          <div className="text-sm leading-relaxed text-[#c9d1d9]">{children}</div>
        </div>
      </div>
    </div>
  );
}

function CodeBlock({ filename, language = "bash", children }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    const text = typeof children === "string" ? children : "";
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <div className="rounded-xl overflow-hidden border border-[#21262d] my-6">
      <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-[#21262d]">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-[#58a6ff]" />
          <span className="text-[11px] font-mono text-[#8b98a8]">{filename || language}</span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 text-[11px] font-mono text-[#8b98a8] hover:text-[#f0f6fc] transition-colors"
        >
          {copied ? (
            <><CheckCheck className="w-3.5 h-3.5 text-[#3fb950]" /><span className="text-[#3fb950]">Copied</span></>
          ) : (
            <><Copy className="w-3.5 h-3.5" /><span>Copy</span></>
          )}
        </button>
      </div>
      <pre className="px-4 py-4 bg-[#090d16] overflow-x-auto text-[13px] leading-[1.65] font-mono text-[#58a6ff] whitespace-pre">
        {children}
      </pre>
    </div>
  );
}

function KeyTakeaways({ items }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="my-8 rounded-xl border border-[#3fb950]/20 bg-[#3fb950]/5 p-5">
      <div className="flex items-center gap-2 mb-3">
        <ListChecks className="w-4 h-4 text-[#3fb950]" />
        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#3fb950]">
          Key Takeaways
        </span>
      </div>
      <ul className="space-y-2">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2.5 text-sm text-[#c9d1d9]">
            <Check className="w-4 h-4 text-[#3fb950] shrink-0 mt-0.5" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CheckYourself({ question, options, correctId, explanation }) {
  const [selected, setSelected] = useState(null);
  const revealed = selected !== null;
  const isCorrect = selected === correctId;
  return (
    <div className="my-8 rounded-xl border border-[#21262d] bg-[#111821] overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3 border-b border-[#21262d] bg-[#0d1117]">
        <HelpCircle className="w-4 h-4 text-[#58a6ff]" />
        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#58a6ff]">
          Check Yourself
        </span>
      </div>
      <div className="px-5 py-4 space-y-3">
        <p className="text-sm font-semibold text-[#f0f6fc] leading-snug">{question}</p>
        <div className="space-y-2">
          {options.map((opt) => {
            let cls = "w-full text-left px-3.5 py-2.5 rounded-lg border text-sm transition-all ";
            if (!revealed) {
              cls += "border-[#21262d] bg-[#0d1117] text-[#c9d1d9] hover:border-[#2f81f7]/50 hover:bg-[#16202e] cursor-pointer";
            } else if (opt.id === correctId) {
              cls += "border-[#3fb950]/60 bg-[#3fb950]/10 text-[#3fb950] font-medium cursor-default";
            } else if (opt.id === selected) {
              cls += "border-[#f85149]/60 bg-[#f85149]/10 text-[#f85149] cursor-default";
            } else {
              cls += "border-[#21262d] bg-[#0d1117] text-[#8b98a8] cursor-default opacity-60";
            }
            return (
              <button key={opt.id} type="button" disabled={revealed} onClick={() => setSelected(opt.id)} className={cls}>
                <span className="flex items-center gap-2">
                  <span className="font-mono text-[11px] shrink-0 w-5 h-5 rounded border border-current flex items-center justify-center">
                    {opt.id.toUpperCase()}
                  </span>
                  {opt.text}
                </span>
              </button>
            );
          })}
        </div>
        {revealed && (
          <div className={`mt-1 text-xs rounded-lg px-3.5 py-3 flex items-start gap-2 ${isCorrect ? "bg-[#3fb950]/10 border border-[#3fb950]/30 text-[#3fb950]" : "bg-[#f85149]/10 border border-[#f85149]/30 text-[#f85149]"}`}>
            {isCorrect ? <Check className="w-3.5 h-3.5 shrink-0 mt-0.5" /> : <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />}
            <span>{explanation}</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Inline formatter: bold + inline-code
───────────────────────────────────────────── */
function inlineFormat(text) {
  if (!text) return null;
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="text-[#f0f6fc] font-semibold">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={i} className="px-1.5 py-0.5 rounded bg-[#161b22] text-[#79c0ff] font-mono text-[14px] border border-[#21262d]">{part.slice(1, -1)}</code>;
    }
    return part;
  });
}

/* ─────────────────────────────────────────────
   Parse outline from H3 headings
───────────────────────────────────────────── */
function parseOutline(markdown) {
  if (!markdown) return [];
  return markdown
    .split("\n")
    .filter((l) => l.startsWith("### "))
    .map((l, i) => ({ id: `section-${i}`, label: l.slice(4).trim() }));
}

/* ─────────────────────────────────────────────
   Markdown renderer with scroll-spy refs on H3
───────────────────────────────────────────── */
function renderMarkdown(markdown, sectionRefs, outline) {
  if (!markdown) return null;
  const lines = markdown.split("\n");
  const elements = [];
  let i = 0;
  let key = 0;
  let sectionIdx = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("```")) {
      const lang = line.slice(3).trim() || "bash";
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) { codeLines.push(lines[i]); i++; }
      i++;
      elements.push(<CodeBlock key={key++} language={lang}>{codeLines.join("\n")}</CodeBlock>);
      continue;
    }

    if (line.startsWith("### ")) {
      const ci = sectionIdx++;
      elements.push(
        <h3 key={key++} ref={(el) => { sectionRefs.current[ci] = el; }} data-section-idx={ci}
          id={outline[ci]?.id} className="text-xl font-bold text-[#f0f6fc] mt-10 mb-3 scroll-mt-28">
          {inlineFormat(line.slice(4))}
        </h3>
      );
      i++; continue;
    }

    if (line.startsWith("#### ")) {
      elements.push(<h4 key={key++} className="text-base font-semibold text-[#58a6ff] mt-6 mb-2">{inlineFormat(line.slice(5))}</h4>);
      i++; continue;
    }

    if (line.match(/^[-*] /)) {
      const items = [];
      while (i < lines.length && lines[i].match(/^[-*] /)) { items.push(lines[i].slice(2)); i++; }
      elements.push(
        <ul key={key++} className="space-y-1.5 my-4 ml-1">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-[17px] leading-[1.7] text-[#c9d1d9]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#58a6ff]/70 shrink-0 mt-[10px]" />
              <span>{inlineFormat(item)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    if (line.match(/^\d+\. /)) {
      const items = [];
      while (i < lines.length && lines[i].match(/^\d+\. /)) { items.push(lines[i].replace(/^\d+\. /, "")); i++; }
      elements.push(
        <ol key={key++} className="space-y-1.5 my-4 ml-1 list-none">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-[17px] leading-[1.7] text-[#c9d1d9]">
              <span className="font-mono text-[12px] text-[#58a6ff] shrink-0 mt-[6px] w-5 text-right">{idx + 1}.</span>
              <span>{inlineFormat(item)}</span>
            </li>
          ))}
        </ol>
      );
      continue;
    }

    if (line.trim() === "") { i++; continue; }

    elements.push(<p key={key++} className="text-[17px] leading-[1.75] text-[#c9d1d9] my-4">{inlineFormat(line)}</p>);
    i++;
  }
  return elements;
}

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
export default function LessonView() {
  const { pathSlug, lessonSlug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [completedSlugs, setCompletedSlugs] = useState([]);
  const [marking, setMarking] = useState(false);
  const [unlockedBadge, setUnlockedBadge] = useState(null);
  const [xpEarnedNotice, setXpEarnedNotice] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const [outlineOpen, setOutlineOpen] = useState(false);

  const sectionRefs = useRef([]);

  const path = getPathBySlug(pathSlug);
  const lessonData = getLessonBySlug(pathSlug, lessonSlug);

  useEffect(() => {
    if (user?.id) {
      getCompletedLessonSlugs(user.id).then((slugs) => setCompletedSlugs(slugs));
    }
  }, [user?.id]);

  // Scroll-spy
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = parseInt(entry.target.dataset.sectionIdx, 10);
            if (!isNaN(idx)) setActiveSection(idx);
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );
    sectionRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [lessonData]);

  if (!path || !lessonData) {
    return (
      <div className="min-h-screen bg-[#0d1117] text-[#f0f6fc] flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full p-6 rounded-2xl border border-[#21262d] bg-[#111821] text-center space-y-4">
          <AlertTriangle className="w-10 h-10 text-[#f2cc60] mx-auto" />
          <h2 className="text-lg font-bold">Lesson Not Found</h2>
          <p className="text-xs text-[#8b98a8]">The requested lesson could not be found in the CyberPath curriculum.</p>
          <Link to="/dashboard" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2f81f7] text-white text-xs font-semibold">
            <ArrowLeft className="w-4 h-4" /><span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  const { lesson, prevLesson, nextLesson, totalInPath, currentIndex } = lessonData;
  const isCompleted = completedSlugs.includes(lesson.slug);
  const outline = parseOutline(lesson.contentMarkdown);
  const progressPercent = Math.round((completedSlugs.length / totalInPath) * 100);

  const handleMarkComplete = async () => {
    if (!user) { navigate("/login"); return; }
    setMarking(true);
    try {
      const res = await markLessonComplete(user.id, pathSlug, lesson.slug);
      if (res.success) {
        setCompletedSlugs(res.completedSlugs);
        if (res.xpAwarded && res.xpAwarded > 0) {
          setXpEarnedNotice(res.xpAwarded);
          setTimeout(() => setXpEarnedNotice(0), 4000);
        }
        if (res.newlyAwardedBadges && res.newlyAwardedBadges.length > 0) {
          setUnlockedBadge(res.newlyAwardedBadges[0]);
        }
      }
    } finally { setMarking(false); }
  };

  const handleBadgeAwarded = (badges) => {
    if (badges && badges.length > 0) setUnlockedBadge(badges[0]);
  };

  const scrollToSection = (idx) => {
    sectionRefs.current[idx]?.scrollIntoView({ behavior: "smooth", block: "start" });
    setOutlineOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#f0f6fc] flex flex-col selection:bg-[#2f81f7]/30 selection:text-white">

      {/* ── Sticky Top Bar ── */}
      <header className="sticky top-0 z-40 w-full border-b border-[#21262d] bg-[#0d1117]/96 backdrop-blur-md px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Link to={`/learn/${path.slug}`}
            className="p-1.5 rounded-lg text-[#8b98a8] hover:text-[#f0f6fc] hover:bg-[#16202e] transition-colors flex items-center gap-1.5 text-xs shrink-0">
            <ArrowLeft className="w-4 h-4" /><span className="hidden sm:inline">Roadmap</span>
          </Link>
          <div className="h-4 w-px bg-[#21262d] hidden sm:block shrink-0" />
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border border-[#21262d] bg-[#111821] text-[#58a6ff] shrink-0">
              {path.title}
            </span>
            <span className="text-xs text-[#8b98a8] truncate hidden md:block">/ {lesson.title}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {xpEarnedNotice > 0 && (
            <span className="px-2.5 py-1 rounded-lg bg-[#f2cc60]/15 border border-[#d29922]/40 text-[#f2cc60] text-xs font-mono font-bold">
              +{xpEarnedNotice} XP!
            </span>
          )}
          <span className="text-[11px] text-[#8b98a8] hidden lg:block">Lesson {currentIndex}/{totalInPath}</span>
          <Link to="/labs"
            className="text-xs text-[#58a6ff] hover:text-white px-2.5 py-1.5 rounded-lg border border-[#2f81f7]/30 bg-[#111821] hover:bg-[#16202e] transition-colors hidden md:inline">
            Labs
          </Link>
          <Link to="/dashboard"
            className="text-xs text-[#8b98a8] hover:text-[#f0f6fc] px-2.5 py-1.5 rounded-lg border border-[#21262d] bg-[#111821] hover:bg-[#16202e] transition-colors hidden md:inline">
            Dashboard
          </Link>
          <button type="button" onClick={handleMarkComplete} disabled={marking || isCompleted}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${isCompleted
              ? "bg-[#3fb950]/15 text-[#3fb950] border border-[#3fb950]/40 cursor-default"
              : "bg-[#2f81f7] hover:bg-[#2069cc] text-white shadow-sm shadow-[#2f81f7]/25"}`}>
            {isCompleted ? <><Check className="w-3.5 h-3.5" /><span>Completed</span></> : <><CheckCircle2 className="w-3.5 h-3.5" /><span>{marking ? "Saving…" : "Mark Complete"}</span></>}
          </button>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="flex-1 flex max-w-[1200px] w-full mx-auto">

        {/* ── Sidebar (desktop) ── */}
        <aside className="hidden lg:flex flex-col w-[260px] shrink-0">
          <div className="sticky top-14 h-[calc(100vh-3.5rem)] flex flex-col py-8 px-5 overflow-y-auto">
            <div className="mb-6">
              <div className="flex items-center justify-between text-[11px] text-[#8b98a8] mb-2">
                <span className="font-mono">Lesson {currentIndex} of {totalInPath}</span>
                <span className="font-mono text-[#58a6ff]">{progressPercent}%</span>
              </div>
              <div className="h-1 rounded-full bg-[#21262d] overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-[#2f81f7] to-[#58a6ff] transition-all duration-500" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-3.5 h-3.5 text-[#8b98a8]" />
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#8b98a8]">In this lesson</span>
            </div>
            {outline.length > 0 ? (
              <nav className="space-y-0.5 flex-1">
                {outline.map((item, idx) => (
                  <button key={item.id} type="button" onClick={() => scrollToSection(idx)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all leading-snug ${activeSection === idx
                      ? "bg-[#2f81f7]/10 text-[#58a6ff] font-medium border-l-2 border-[#2f81f7] pl-[10px]"
                      : "text-[#8b98a8] hover:text-[#c9d1d9] hover:bg-[#111821]"}`}>
                    {item.label}
                  </button>
                ))}
              </nav>
            ) : <p className="text-[11px] text-[#8b98a8]">No sections.</p>}
            <div className="mt-8 pt-5 border-t border-[#21262d] space-y-2">
              {prevLesson && (
                <Link to={`/learn/${pathSlug}/${prevLesson.slug}`}
                  className="flex items-center gap-2 text-xs text-[#8b98a8] hover:text-[#c9d1d9] transition-colors">
                  <ChevronLeft className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{prevLesson.title}</span>
                </Link>
              )}
              {nextLesson && (
                <Link to={`/learn/${pathSlug}/${nextLesson.slug}`}
                  className="flex items-center gap-2 text-xs text-[#58a6ff] hover:text-[#79c0ff] transition-colors">
                  <span className="truncate">{nextLesson.title}</span>
                  <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                </Link>
              )}
            </div>
          </div>
        </aside>

        {/* ── Mobile outline dropdown ── */}
        <div className="lg:hidden sticky top-14 z-30 w-full border-b border-[#21262d] bg-[#0d1117]/96 backdrop-blur-md px-4 py-2">
          <button type="button" onClick={() => setOutlineOpen((v) => !v)}
            className="w-full flex items-center justify-between text-xs text-[#8b98a8] hover:text-[#f0f6fc] py-1.5">
            <div className="flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{outline[activeSection]?.label || "Lesson Outline"} — {currentIndex}/{totalInPath}</span>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${outlineOpen ? "rotate-180" : ""}`} />
          </button>
          {outlineOpen && (
            <div className="pb-3 pt-1 space-y-1">
              {outline.map((item, idx) => (
                <button key={item.id} type="button" onClick={() => scrollToSection(idx)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs ${activeSection === idx ? "bg-[#2f81f7]/10 text-[#58a6ff] font-medium" : "text-[#8b98a8] hover:text-[#c9d1d9]"}`}>
                  {item.label}
                </button>
              ))}
            </div>
          )}
          <div className="h-0.5 w-full bg-[#21262d] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#2f81f7] to-[#58a6ff] transition-all" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        {/* ── Reading column ── */}
        <main className="flex-1 min-w-0">
          <div className="max-w-[680px] mx-auto px-5 sm:px-8 lg:px-10 py-10 lg:py-12">

            {/* Hero Block */}
            <div className="mb-10">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-3">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#58a6ff]">{lesson.moduleTitle}</span>
                <span className="flex items-center gap-1 text-[11px] text-[#8b98a8]">
                  <Clock className="w-3 h-3" />~{lesson.estimatedMinutes} min
                </span>
                {isCompleted && (
                  <span className="flex items-center gap-1 text-[11px] text-[#3fb950] font-mono">
                    <Check className="w-3 h-3" /> Completed
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#f0f6fc] leading-[1.15] mb-3">
                {lesson.title}
              </h1>
              <p className="text-[15px] text-[#8b98a8] leading-relaxed mb-5">{lesson.summary}</p>

              {lesson.objectives && lesson.objectives.length > 0 && (
                <div className="bg-[#111821] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="w-3.5 h-3.5 text-[#58a6ff]" />
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#58a6ff]">Learning Objectives</span>
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                    {lesson.objectives.map((obj, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-[#c9d1d9]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#58a6ff]/70 shrink-0 mt-1.5" />
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {lesson.prerequisites && lesson.prerequisites.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mt-4">
                  <span className="text-[11px] font-mono text-[#8b98a8]">Prerequisites:</span>
                  {lesson.prerequisites.map((p, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#0d1117] border border-[#21262d] text-[#c9d1d9]">{p}</span>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-[#21262d] mb-10" />

            {/* Article body */}
            <article>
              {renderMarkdown(lesson.contentMarkdown, sectionRefs, outline)}
            </article>

            {/* Key Takeaways */}
            {lesson.keyTakeaways && lesson.keyTakeaways.length > 0 && (
              <KeyTakeaways items={lesson.keyTakeaways} />
            )}

            {/* Common Pitfalls */}
            {lesson.commonPitfalls && lesson.commonPitfalls.length > 0 && (
              <Callout type="warning" title="Common Beginner Mistakes">
                <ul className="space-y-1.5 mt-1">
                  {lesson.commonPitfalls.map((cp, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#f85149] font-bold shrink-0">!</span>
                      <span>{cp}</span>
                    </li>
                  ))}
                </ul>
              </Callout>
            )}

            {/* Labs & Resources */}
            <div className="mt-10 mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Laptop className="w-4 h-4 text-[#58a6ff]" />
                <h3 className="text-sm font-bold text-[#f0f6fc]">Hands-On Labs &amp; Documentation</h3>
                <span className="ml-auto text-[10px] font-mono text-[#8b98a8] uppercase">Legal Only</span>
              </div>
              {/* Connected CyberPath Interactive Lab */}
              {RELATED_CYBERPATH_LABS[lesson.slug] && (
                <div className="mb-4 p-4 rounded-xl border border-[#2f81f7]/40 bg-[#2f81f7]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#2f81f7]/20 text-[#58a6ff] border border-[#2f81f7]/40 uppercase">
                        {RELATED_CYBERPATH_LABS[lesson.slug].badge}
                      </span>
                      <span className="text-[11px] font-mono text-[#8b98a8]">
                        {RELATED_CYBERPATH_LABS[lesson.slug].estTime} · {RELATED_CYBERPATH_LABS[lesson.slug].difficulty}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-[#f0f6fc]">
                      {RELATED_CYBERPATH_LABS[lesson.slug].title}
                    </h4>
                    <p className="text-xs text-[#8b98a8] max-w-xl">
                      {RELATED_CYBERPATH_LABS[lesson.slug].description}
                    </p>
                  </div>
                  <Link
                    to={RELATED_CYBERPATH_LABS[lesson.slug].route}
                    className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#2f81f7] hover:bg-[#2069cc] text-white text-xs font-semibold shadow-md shadow-[#2f81f7]/25 transition-all"
                  >
                    <Terminal className="w-4 h-4" />
                    <span>Launch Lab</span>
                  </Link>
                </div>
              )}
              {lesson.labGuidance && (
                <Callout type="tip" title="Practical Mission">{lesson.labGuidance}</Callout>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {(lesson.resources || [
                  { title: "TryHackMe Guided Security Room", url: "https://tryhackme.com/", platform: "TryHackMe", type: "lab" },
                  { title: "Official Security Tool Documentation", url: "https://owasp.org/", platform: "Documentation", type: "documentation" },
                ]).map((res, idx) => (
                  <a key={idx} href={res.url} target="_blank" rel="noreferrer"
                    className="p-3.5 rounded-xl border border-[#21262d] bg-[#0d1117] hover:border-[#2f81f7]/50 hover:bg-[#111821] transition-all group flex items-center justify-between">
                    <div className="space-y-0.5 min-w-0">
                      <span className="text-[10px] font-mono text-[#58a6ff] uppercase block">{res.platform} · {res.type}</span>
                      <div className="text-xs font-semibold text-[#f0f6fc] group-hover:text-[#58a6ff] transition-colors truncate">{res.title}</div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-[#8b98a8] group-hover:text-[#58a6ff] shrink-0 ml-3" />
                  </a>
                ))}
              </div>
            </div>

            {/* Assessment quiz */}
            {lesson.quiz && (
              <div className="mt-8">
                <AssessmentCard
                  userId={user?.id}
                  quiz={lesson.quiz}
                  onQuizPassed={() => {
                    if (user?.id) {
                      markLessonComplete(user.id, pathSlug, lesson.slug).then((res) => {
                        setCompletedSlugs(res.completedSlugs);
                      });
                    }
                  }}
                  onBadgeAwarded={handleBadgeAwarded}
                />
              </div>
            )}

            {/* Bottom: Mark Complete + Next Lesson */}
            <div className="mt-12 pt-8 border-t border-[#21262d] space-y-5">
              {!isCompleted ? (
                <button type="button" onClick={handleMarkComplete} disabled={marking}
                  className="w-full py-3.5 rounded-xl bg-[#2f81f7] hover:bg-[#2069cc] text-white text-sm font-semibold shadow-md shadow-[#2f81f7]/20 transition-all flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  {marking ? "Saving…" : "Mark Lesson as Complete"}
                </button>
              ) : (
                <div className="w-full py-3.5 rounded-xl bg-[#3fb950]/10 border border-[#3fb950]/30 text-[#3fb950] text-sm font-semibold flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" /> Lesson Completed
                </div>
              )}

              {nextLesson ? (
                <Link to={`/learn/${pathSlug}/${nextLesson.slug}`}
                  className="block w-full rounded-xl border border-[#21262d] bg-[#111821] hover:border-[#2f81f7]/40 hover:bg-[#16202e] transition-all p-5 group">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono uppercase text-[#8b98a8] block mb-1">Next Lesson</span>
                      <span className="text-sm font-bold text-[#f0f6fc] group-hover:text-[#58a6ff] transition-colors block truncate">{nextLesson.title}</span>
                      {nextLesson.estimatedMinutes && (
                        <span className="text-[11px] text-[#8b98a8] flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" />~{nextLesson.estimatedMinutes} min
                        </span>
                      )}
                    </div>
                    <ArrowRight className="w-5 h-5 text-[#8b98a8] group-hover:text-[#58a6ff] shrink-0 ml-4 transition-colors" />
                  </div>
                </Link>
              ) : (
                <Link to={`/learn/${pathSlug}`}
                  className="block w-full rounded-xl border border-[#3fb950]/30 bg-[#3fb950]/10 hover:bg-[#3fb950]/15 transition-all p-5 text-center">
                  <Award className="w-6 h-6 text-[#3fb950] mx-auto mb-2" />
                  <span className="text-sm font-bold text-[#3fb950] block">Track Complete! View Your Badge</span>
                  <span className="text-[11px] text-[#8b98a8] mt-1 block">Return to {path.title} roadmap</span>
                </Link>
              )}

              {prevLesson && (
                <Link to={`/learn/${pathSlug}/${prevLesson.slug}`}
                  className="flex items-center gap-2 text-xs text-[#8b98a8] hover:text-[#c9d1d9] transition-colors">
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous: {prevLesson.title}</span>
                </Link>
              )}
            </div>
          </div>
        </main>
      </div>

      {unlockedBadge && (
        <BadgeUnlockedModal badge={unlockedBadge} onClose={() => setUnlockedBadge(null)} />
      )}
    </div>
  );
}
