import { useState, useEffect } from "react";
import ScrollIntroHero from "../components/ui/ScrollIntroHero";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DecryptText from "../components/ui/DecryptText";
import { RippleGrid } from "../components/ui/ripple-grid";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Compass,
  Crown,
  Database,
  ExternalLink,
  Flame,
  GitBranch,
  Globe,
  HelpCircle,
  Laptop,
  LockKeyhole,
  LogOut,
  Menu,
  Network,
  RefreshCw,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Star,
  Terminal,
  Trophy,
  X,
  Zap,
  Download,
} from "lucide-react";
import BadgeEmblem from "../components/badges/BadgeEmblem";
import { downloadBadgePng } from "../components/badges/badgeProgressHelper";
import CyberPathLogo from "../components/common/CyberPathLogo";

const CURRENT_YEAR = new Date().getFullYear();

const PATHS = [
  {
    id: "red-team",
    title: "Red Team",
    subtitle: "Offensive Security",
    icon: Flame,
    color: "blue",
    badge: "Offensive Track",
    description:
      "Learn the attacker mindset to uncover weaknesses before adversaries do. Master ethical reconnaissance, vulnerability assessment, and responsible penetration testing.",
    bullets: [
      "Ethical hacking principles & legal boundaries",
      "Network reconnaissance & service scanning",
      "Hands-on penetration testing workflows",
    ],
    tags: ["Ethical Hacking", "Reconnaissance", "Penetration Testing"],
    level: "Beginner to Intermediate",
    timeCommitment: "~4-6 hrs / week",
  },
  {
    id: "blue-team",
    title: "Blue Team",
    subtitle: "Defensive Security",
    icon: ShieldCheck,
    color: "green",
    badge: "Defensive Track",
    description:
      "Understand how modern systems defend against cyber threats. Learn security operations, continuous log monitoring, anomaly detection, and incident response procedures.",
    bullets: [
      "Security monitoring & telemetry fundamentals",
      "Threat detection & suspicious activity analysis",
      "Structured incident response & triage workflows",
    ],
    tags: ["Security Monitoring", "Threat Detection", "Incident Response"],
    level: "Beginner to Intermediate",
    timeCommitment: "~4-6 hrs / week",
  },
  {
    id: "web-security",
    title: "Web Security",
    subtitle: "Application Security",
    icon: Globe,
    color: "purple",
    badge: "AppSec Track",
    description:
      "Explore how web browsers and servers interact under the hood. Discover critical OWASP vulnerabilities, inspect traffic with proxy tools, and secure web applications.",
    bullets: [
      "HTTP/HTTPS mechanics & browser architecture",
      "OWASP Top 10 vulnerabilities & mitigations",
      "Hands-on proxy interception with Burp Suite",
    ],
    tags: ["HTTP Fundamentals", "OWASP Vulnerabilities", "Web App Testing"],
    level: "Beginner Friendly",
    timeCommitment: "~3-5 hrs / week",
  },
];

const ROADMAP_STEPS = [
  {
    step: "01",
    title: "Linux Fundamentals",
    category: "FOUNDATION",
    icon: Terminal,
    description:
      "Master the command line, filesystem hierarchy, user permissions, and basic bash scripting. Linux is the default operating system for cybersecurity tools.",
    skills: ["Bash CLI", "File Permissions", "Process Monitoring", "Package Managers"],
    labSuggestion: "OverTheWire: Bandit (Levels 0-10)",
  },
  {
    step: "02",
    title: "Computer Networking",
    category: "FOUNDATION",
    icon: Network,
    description:
      "Understand how devices communicate over local networks and the internet. Learn IPv4/IPv6, subnetting, DNS resolution, and TCP/UDP transport handshakes.",
    skills: ["OSI & TCP/IP Model", "IP Addressing & Subnets", "DNS & DHCP", "Wireshark Packet Basics"],
    labSuggestion: "TryHackMe: Network Fundamentals Room",
  },
  {
    step: "03",
    title: "How the Web Works",
    category: "FOUNDATION",
    icon: Globe,
    description:
      "Deconstruct client-server interaction: HTTP requests, response headers, status codes, cookies, session storage, and RESTful API structures.",
    skills: ["HTTP Methods & Headers", "Cookies & Auth Tokens", "Browser DevTools", "URL Structure"],
    labSuggestion: "PortSwigger: Web Basics / Browser DevTools",
  },
  {
    step: "04",
    title: "Reconnaissance Fundamentals",
    category: "BEGINNER",
    icon: Compass,
    description:
      "Learn passive and active information gathering. Discover subdomains, DNS records, public metadata, and map an organization's authorized attack surface.",
    skills: ["OSINT Methodology", "whois & dig", "Subdomain Enumeration", "Attack Surface Mapping"],
    labSuggestion: "TryHackMe: Passive Reconnaissance Room",
  },
  {
    step: "05",
    title: "Nmap Basics",
    category: "BEGINNER",
    icon: Zap,
    description:
      "Use the industry-standard network exploration tool to discover active hosts, identify open ports, detect service versions, and run NSE detection scripts.",
    skills: ["TCP SYN vs Connect Scans", "Port Scanning (-p-)", "Service Detection (-sV)", "Nmap Scripting Engine"],
    labSuggestion: "TryHackMe: Nmap Basics Room",
  },
  {
    step: "06",
    title: "Introduction to Burp Suite",
    category: "BEGINNER",
    icon: LockKeyhole,
    description:
      "Configure an intercepting HTTP proxy to capture, inspect, and modify web requests in real time within safe, authorized sandbox environments.",
    skills: ["Proxy Configuration", "Request Interception", "Burp Repeater", "Analyzing Responses"],
    labSuggestion: "PortSwigger Academy: Proxy Walkthrough",
  },
];

const LEARNING_LOOP_STEPS = [
  {
    number: "01",
    title: "Understand the Concept",
    desc: "Read clear, jargon-free explanations that demystify how protocols, systems, or vulnerabilities actually function.",
    icon: BookOpen,
  },
  {
    number: "02",
    title: "Follow a Guided Lab",
    desc: "Step through structured, step-by-step sandbox exercises where you see theory in action with instant guidance.",
    icon: Laptop,
  },
  {
    number: "03",
    title: "Solve a Challenge",
    desc: "Put away the instructions and solve an unassisted puzzle or CTF-style objective to cement your independent problem solving.",
    icon: Trophy,
  },
  {
    number: "04",
    title: "Review What You Learned",
    desc: "Reflect on findings, write personal notes, and learn how to patch or defend against the demonstrated technique.",
    icon: RefreshCw,
  },
];

const ACHIEVEMENT_BADGES = [
  {
    id: "red-team-specialist",
    title: "Red Team Specialist",
    track: "Offensive Security",
    colorTheme: "silver",
    badgeTier: "Track Specialist",
    cardBorder: "border-white/12 hover:border-white/28",
    cardGlow: "badge-glow-metallic",
    iconColor: "text-white",
    emblemBg: "bg-surface border-white/15",
    pillStyle: "bg-white/[0.06] border-white/15 text-white",
    ringColor: "#ffffff",
    icon: Flame,
    tagline: "Mastery of ethical reconnaissance, vulnerability assessment, and offensive workflows.",
    curriculumRequirement: "12 Lessons · 8 Authorized Labs · 1 Offensive Assessment",
    verificationDetails: "Earned upon completing the full Red Team curriculum: CLI exploitation, Nmap scanning, OSINT, and authorized vulnerability penetration testing.",
  },
  {
    id: "blue-team-defender",
    title: "Blue Team Defender",
    track: "Defensive Security",
    colorTheme: "silver",
    badgeTier: "Track Specialist",
    cardBorder: "border-white/12 hover:border-white/28",
    cardGlow: "badge-glow-metallic",
    iconColor: "text-white",
    emblemBg: "bg-surface border-white/15",
    pillStyle: "bg-white/[0.06] border-white/15 text-white",
    ringColor: "#ffffff",
    icon: ShieldCheck,
    tagline: "Excellence in security telemetry, threat detection, and incident response triage.",
    curriculumRequirement: "12 Lessons · 8 Telemetry Labs · 4 Incident Scenarios",
    verificationDetails: "Earned upon completing the full Blue Team curriculum: SIEM log analysis, network threat monitoring, firewall rules, and structured incident containment.",
  },
  {
    id: "web-security-expert",
    title: "Web Security Expert",
    track: "Application Security",
    colorTheme: "silver",
    badgeTier: "Track Specialist",
    cardBorder: "border-white/12 hover:border-white/28",
    cardGlow: "badge-glow-metallic",
    iconColor: "text-white",
    emblemBg: "bg-surface border-white/15",
    pillStyle: "bg-white/[0.06] border-white/15 text-white",
    ringColor: "#ffffff",
    icon: Globe,
    tagline: "Proficiency in HTTP inspection, OWASP Top 10 flaws, and proxy-based testing.",
    curriculumRequirement: "10 Lessons · 10 Vulnerability Labs · 1 Capstone Audit",
    verificationDetails: "Earned upon completing the full Web Security curriculum: Burp Suite interception, SQL injection, XSS mitigations, and client-server authentication audits.",
  },
  {
    id: "cyberpath-master",
    title: "CyberPath Master",
    track: "Apex Platform Credential",
    colorTheme: "gold",
    badgeTier: "Prestigious Apex",
    isMaster: true,
    cardBorder: "border-[#d29922]/70 hover:border-[#f2cc60]",
    cardGlow: "badge-glow-gold",
    iconColor: "text-gold-bright",
    emblemBg: "bg-gradient-to-b from-[#221c10] to-[#141008] border-[#f2cc60]/60",
    pillStyle: "bg-[#d29922]/25 border-[#f2cc60]/50 text-gold-bright",
    ringColor: "#f2cc60",
    icon: Crown,
    tagline: "The highest honor on CyberPath. Awarded to elite students who conquer all core tracks.",
    curriculumRequirement: "All 3 Tracks (100%) · 30+ Labs · Capstone CTF Victory",
    verificationDetails: "Awarded only after completing Red Team, Blue Team, and Web Security tracks in their entirety, solving 30+ virtual sandbox labs, and capturing flags in the final proctored Capstone CTF.",
  },
];

const EXTERNAL_RESOURCES = [
  {
    name: "TryHackMe",
    url: "https://tryhackme.com/",
    badge: "Guided Rooms",
    tagline: "Hands-on cybersecurity training via browser-based virtual machines.",
    features: ["Bite-sized beginner rooms", "In-browser Linux machines", "Gamified learning streaks"],
    initials: "THM",
    accentColor: "border-white/12 hover:border-white/28",
  },
  {
    name: "PortSwigger Web Security Academy",
    url: "https://portswigger.net/web-security",
    badge: "Web Security",
    tagline: "Free, world-class web security training from the creators of Burp Suite.",
    features: ["Realistic vulnerability labs", "Completely free access", "From SQLi to modern Auth bypass"],
    initials: "PS",
    accentColor: "border-white/12 hover:border-white/28",
  },
  {
    name: "pwn.college",
    url: "https://pwn.college/",
    badge: "Systems & Binary",
    tagline: "Rigorous cybersecurity education and lab challenges built by Arizona State University.",
    features: ["Command-line mechanics", "Linux privilege escalation", "Open educational framework"],
    initials: "PWN",
    accentColor: "border-white/12 hover:border-white/28",
  },
  {
    name: "OverTheWire",
    url: "https://overthewire.org/wargames/",
    badge: "Linux Wargames",
    tagline: "Classic SSH-based wargames that teach Linux commands and security fundamentals.",
    features: ["The renowned Bandit wargame", "Zero fluff, 100% terminal", "Teaches authentic CLI fluency"],
    initials: "OTW",
    accentColor: "border-white/12 hover:border-white/28",
  },
];

export default function LandingPage() {
  const { user, signOut } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedPathId, setSelectedPathId] = useState("red-team");
  const [notSureExpanded, setNotSureExpanded] = useState(false);
  const [activeRoadmapStep, setActiveRoadmapStep] = useState(0);
  const [selectedBadgeId, setSelectedBadgeId] = useState("cyberpath-master");

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [mobileMenuOpen]);

  const selectedPath = PATHS.find((p) => p.id === selectedPathId) || PATHS[0];
  const activeBadge = ACHIEVEMENT_BADGES.find((b) => b.id === selectedBadgeId) || ACHIEVEMENT_BADGES[3];

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await signOut();
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-page text-fg flex flex-col selection:bg-white/20 selection:text-white relative">
      {/* SCROLL-SCRUBBED INTRO OVERLAY — first visit only */}
      <ScrollIntroHero />
      {/* SECTION 1: STICKY NAVIGATION */}
      <header className="sticky top-0 z-50 w-full border-b border-white/12 bg-page/90 backdrop-blur-md transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo & Wordmark */}
          <a
            href="#home"
            className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 rounded-md px-1 py-0.5"
            aria-label="CyberPath Home"
          >
            <CyberPathLogo size="sm" glow className="group-hover:scale-105 transition-transform" />
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-base text-fg flex items-center">
                Cyber<span className="text-blue-400">Path</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#4ade80] ml-1.5 animate-pulse"></span>
              </span>
              <span className="text-[10px] text-zinc-400 font-mono tracking-wider -mt-0.5 hidden sm:block">
                LEARN • PRACTICE • BUILD
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 text-sm text-muted font-medium" aria-label="Main Navigation">
            <a
              href="#how-it-works"
              className="px-3 py-1.5 rounded-md hover:text-white hover:bg-white/[0.06] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              How It Works
            </a>
            <a
              href="#paths"
              className="px-3 py-1.5 rounded-md hover:text-white hover:bg-white/[0.06] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              Learning Paths
            </a>
            <a
              href="#roadmap"
              className="px-3 py-1.5 rounded-md hover:text-white hover:bg-white/[0.06] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              Roadmap
            </a>
            <a
              href="#achievements"
              className="px-3 py-1.5 rounded-md hover:text-white hover:bg-white/[0.06] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              Achievements
            </a>
            <Link
              to="/networking"
              className="px-3 py-1.5 rounded-md text-cyan-400 hover:text-cyan-300 hover:bg-white/[0.06] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 font-medium"
            >
              Networking
            </Link>
            <Link
              to="/explore"
              className="px-3 py-1.5 rounded-md hover:text-white hover:bg-white/[0.06] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              CTF & Labs
            </Link>
            <a
              href="#interactive-grid"
              className="px-3 py-1.5 rounded-md text-white hover:text-white hover:bg-white/[0.06] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 flex items-center gap-1.5 font-medium"
            >
              <span className="w-2 h-2 rounded-full bg-white/70 animate-ping" />
              Ripple Grid
            </a>
          </nav>

          {/* Auth State & Action CTA */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-md bg-white hover:bg-accent-hover text-on-accent transition-all active:scale-[0.98] shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-2 rounded-md text-muted hover:text-[#f87171] hover:bg-white/[0.06] transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-md text-xs font-medium text-muted hover:text-white hover:bg-white/[0.06] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-md bg-white hover:bg-accent-hover text-on-accent transition-all active:scale-[0.98] shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-muted hover:text-white hover:bg-white/[0.06] border border-white/12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              aria-label="Toggle mobile menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-white/12 bg-surface/95 backdrop-blur-lg px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top duration-200">
            <nav className="flex flex-col gap-1.5" aria-label="Mobile Navigation">
              <a
                href="#how-it-works"
                onClick={handleNavClick}
                className="px-3 py-2.5 rounded-md text-fg hover:bg-white/[0.06] text-sm font-medium flex items-center justify-between"
              >
                <span>How It Works</span>
                <ChevronRight className="w-4 h-4 text-muted" />
              </a>
              <a
                href="#paths"
                onClick={handleNavClick}
                className="px-3 py-2.5 rounded-md text-fg hover:bg-white/[0.06] text-sm font-medium flex items-center justify-between"
              >
                <span>Learning Paths</span>
                <ChevronRight className="w-4 h-4 text-muted" />
              </a>
              <a
                href="#roadmap"
                onClick={handleNavClick}
                className="px-3 py-2.5 rounded-md text-fg hover:bg-white/[0.06] text-sm font-medium flex items-center justify-between"
              >
                <span>Beginner Roadmap</span>
                <ChevronRight className="w-4 h-4 text-muted" />
              </a>
              <a
                href="#achievements"
                onClick={handleNavClick}
                className="px-3 py-2.5 rounded-md text-fg hover:bg-white/[0.06] text-sm font-medium flex items-center justify-between"
              >
                <span>Achievements & Badges</span>
                <ChevronRight className="w-4 h-4 text-muted" />
              </a>
              <Link
                to="/networking"
                onClick={handleNavClick}
                className="px-3 py-2.5 rounded-md text-cyan-400 hover:bg-white/[0.06] text-sm font-medium flex items-center justify-between"
              >
                <span>Networking Module</span>
                <ChevronRight className="w-4 h-4 text-muted" />
              </Link>
              <a
                href="#resources"
                onClick={handleNavClick}
                className="px-3 py-2.5 rounded-md text-fg hover:bg-white/[0.06] text-sm font-medium flex items-center justify-between"
              >
                <span>Practice Resources</span>
                <ChevronRight className="w-4 h-4 text-muted" />
              </a>
              <a
                href="#interactive-grid"
                onClick={handleNavClick}
                className="px-3 py-2.5 rounded-md text-white hover:bg-white/[0.06] text-sm font-medium flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-white/70 animate-ping" />
                  <span>Ripple Grid Demo</span>
                </span>
                <ChevronRight className="w-4 h-4 text-muted" />
              </a>

              <div className="pt-3 mt-1 border-t border-white/12 space-y-2">
                {user ? (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={handleNavClick}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-white hover:bg-accent-hover text-on-accent text-sm font-semibold active:scale-[0.98] shadow-md"
                    >
                      <span>Open Student Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-transparent border border-white/12 text-[#f87171] text-xs font-medium hover:bg-white/[0.06]"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/signup"
                      onClick={handleNavClick}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-white hover:bg-accent-hover text-on-accent text-sm font-semibold active:scale-[0.98] shadow-md"
                    >
                      <span>Create Free Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      to="/login"
                      onClick={handleNavClick}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-transparent border border-white/12 text-fg text-xs font-medium hover:bg-white/[0.06]"
                    >
                      <span>Sign In to Existing Account</span>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1 w-full" id="home">
        {/* SECTION 2: HERO SECTION */}
        <section className="relative overflow-hidden pt-12 pb-20 md:py-24 border-b border-white/12 cyber-grid-bg">
          {/* Ambient Lighting Gradients */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-white/[0.04] blur-[130px] rounded-full pointer-events-none -z-10" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Left Column: Headline & Value Proposition */}
              <div className="lg:col-span-7 flex flex-col items-start text-left">
                {/* Eyebrow Pill */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/12 bg-surface text-fg text-xs font-mono font-medium tracking-wide mb-6 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse" />
                  <span>YOUR CYBERSECURITY JOURNEY STARTS HERE</span>
                </div>

                {/* Main Headline */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] mb-6">
                  <DecryptText
                    text="From curious to "
                    speed={40}
                    revealDelay={200}
                    stagger={35}
                    once={true}
                    replay={false}
                    caret={false}
                    glowColor="rgba(255,255,255,0.4)"
                  />
                  <span className="text-white underline decoration-white/30 decoration-2 underline-offset-4 font-black">
                    <DecryptText
                      text="cyber capable."
                      speed={40}
                      revealDelay={500}
                      stagger={35}
                      once={true}
                      replay={false}
                      caret={false}
                      glowColor="rgba(255,255,255,0.4)"
                      useGradient={false}
                    />
                  </span>
                </h1>

                {/* Supporting Text */}
                <p className="text-base sm:text-lg text-muted leading-relaxed max-w-2xl mb-8">
                  Feeling lost between endless tools and confusing tutorials? CyberPath gives beginners a clear,
                  step-by-step roadmap. Learn the fundamentals first, practice in real legal labs, and build genuine
                  practical confidence one milestone at a time.
                </p>

                {/* Call to Actions */}
                <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto mb-10">
                  <Link
                    to={user ? "/dashboard" : "/signup"}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-white hover:bg-accent-hover text-on-accent text-sm font-semibold transition-all shadow-md active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                  >
                    <span>{user ? "Open Your Dashboard" : "Find Your Path"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <a
                    href="#roadmap"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-transparent hover:bg-white/[0.06] text-white border border-white/12 hover:border-white/28 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                  >
                    <Compass className="w-4 h-4 text-white" />
                    <span>Explore Roadmap</span>
                  </a>
                </div>

                {/* Trust & Ethics Badge */}
                <div className="flex items-center gap-3 p-3 rounded-lg border border-white/12 bg-surface text-xs text-muted">
                  <ShieldCheck className="w-4 h-4 text-[#4ade80] shrink-0" />
                  <p>
                    <span className="text-fg font-medium">Beginner-Friendly:</span> 100% legal, hands-on labs,
                    and ethical hacking methodologies. Powered by secure Supabase authentication.
                  </p>
                </div>
              </div>

              {/* Right Column: Custom Terminal-Style Learning Interface */}
              <div className="lg:col-span-5 relative w-full">
                {/* Floating UI Elements */}
                <div className="absolute -top-4 -left-3 sm:-left-6 z-20 hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg border border-white/12 bg-surface text-xs shadow-xl animate-float-slow">
                  <span className="p-1.5 rounded-md bg-white/10 text-white">
                    <GitBranch className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <div className="font-semibold text-fg">Structured Paths</div>
                    <div className="text-[11px] text-muted">No random tutorial hopping</div>
                  </div>
                </div>

                <div className="absolute -bottom-5 -right-2 sm:-right-4 z-20 hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg border border-white/12 bg-surface text-xs shadow-xl animate-float-delayed">
                  <span className="p-1.5 rounded-md bg-white/10 text-white">
                    <Trophy className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <div className="font-semibold text-fg">Learn By Doing</div>
                    <div className="text-[11px] text-muted">Labs & real CTF puzzles</div>
                  </div>
                </div>

                {/* The Terminal Window Card */}
                <div className="rounded-xl border border-white/12 bg-surface shadow-2xl overflow-hidden relative">
                  {/* Terminal Header Bar */}
                  <div className="flex items-center justify-between px-4 py-3 bg-raised border-b border-white/12">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#f87171]/80" />
                      <div className="w-3 h-3 rounded-full bg-[#fbbf24]/80" />
                      <div className="w-3 h-3 rounded-full bg-[#4ade80]/80" />
                    </div>
                    <div className="font-mono text-xs text-muted flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-white" />
                      <span>cyberpath — student_terminal</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <LockKeyhole className="w-3.5 h-3.5 text-[#71717a]" />
                    </div>
                  </div>

                  {/* Terminal Body */}
                  <div className="p-4 sm:p-5 font-mono text-xs leading-relaxed space-y-3 bg-page">
                    <div className="text-[#71717a]"># Welcome to CyberPath Interactive Demo</div>

                    <div>
                      <span className="text-[#4ade80]">student@cyberpath</span>
                      <span className="text-[#71717a]">:</span>
                      <span className="text-white">~</span>
                      <span className="text-fg">$ whoami</span>
                      <div className="text-muted mt-0.5">future_security_analyst</div>
                    </div>

                    <div>
                      <span className="text-[#4ade80]">student@cyberpath</span>
                      <span className="text-[#71717a]">:</span>
                      <span className="text-white">~</span>
                      <span className="text-fg">$ cyberpath status --track</span>
                    </div>

                    {/* Progress Checklist */}
                    <div className="bg-surface p-3 rounded-lg border border-white/12 space-y-2 mt-2">
                      <div className="flex items-center justify-between text-[11px] text-muted font-mono border-b border-white/10 pb-1.5">
                        <span>LEARNING PROGRESSION PREVIEW</span>
                        <span className="text-white font-semibold">2 / 4 COMPLETED</span>
                      </div>

                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center gap-2 text-[#4ade80]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span className="text-fg">01. Linux Fundamentals</span>
                          <span className="ml-auto text-[10px] text-[#4ade80] font-mono">COMPLETE</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#4ade80]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span className="text-fg">02. Computer Networking</span>
                          <span className="ml-auto text-[10px] text-[#4ade80] font-mono">COMPLETE</span>
                        </div>
                        <div className="flex items-center gap-2 text-white">
                          <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin inline-block" />
                          <span className="text-white font-semibold">03. Web Security & OWASP</span>
                          <span className="ml-auto text-[10px] text-[#fbbf24] font-mono">IN PROGRESS</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#71717a]">
                          <div className="w-3.5 h-3.5 rounded-full border border-white/20" />
                          <span className="text-muted">04. First CTF Challenge</span>
                          <span className="ml-auto text-[10px] text-[#71717a] font-mono">NEXT UP</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="pt-2">
                        <div className="w-full bg-raised h-1.5 rounded-full overflow-hidden">
                          <div className="bg-white h-full rounded-full w-1/2 transition-all duration-500" />
                        </div>
                      </div>
                    </div>

                    {/* Active Command Prompt with Blinking Cursor */}
                    <div className="pt-1 flex items-center gap-1 text-fg">
                      <span className="text-[#4ade80]">student@cyberpath</span>
                      <span className="text-[#71717a]">:</span>
                      <span className="text-white">~</span>
                      <span className="text-fg">$ start-lab --level=starter</span>
                      <span className="inline-block w-2 h-4 bg-white ml-1 animate-cursor" />
                    </div>

                    {/* Illustrative Notice */}
                    <div className="pt-2 text-[10px] text-[#71717a] text-center border-t border-white/10">
                      Illustrative simulation preview. No installation required.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: HOW CYBERPATH WORKS */}
        <section className="py-20 border-b border-white/12 bg-page relative" id="how-it-works">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-white uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                HOW CYBERPATH WORKS
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-fg mb-4">
                Structured learning, not random tutorials.
              </h2>
              <p className="text-muted text-base leading-relaxed">
                Most beginners fail because they jump straight into hacking tools without knowing networking or Linux.
                CyberPath organizes your journey into a proven, logical sequence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {/* Feature 1 */}
              <div className="group rounded-xl border border-white/12 bg-surface p-6 lg:p-8 hover:border-white/28 hover:bg-raised transition-all shadow-sm">
                <div className="w-12 h-12 rounded-lg bg-white/[0.06] border border-white/12 flex items-center justify-center text-white mb-6 group-hover:scale-105 transition-transform">
                  <Compass className="w-6 h-6" />
                </div>
                <div className="text-xs font-mono text-muted mb-2 font-medium">STEP 01 — DIRECTION</div>
                <h3 className="text-xl font-bold text-fg mb-3 group-hover:text-white transition-colors">
                  1. Clear learning paths
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  Eliminate confusion. Know exactly what to learn first, what comes next, and how foundational concepts
                  connect to real security careers.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group rounded-xl border border-white/12 bg-surface p-6 lg:p-8 hover:border-white/28 hover:bg-raised transition-all shadow-sm">
                <div className="w-12 h-12 rounded-lg bg-white/[0.06] border border-white/12 flex items-center justify-center text-white mb-6 group-hover:scale-105 transition-transform">
                  <Terminal className="w-6 h-6" />
                </div>
                <div className="text-xs font-mono text-muted mb-2 font-medium">STEP 02 — APPLICATION</div>
                <h3 className="text-xl font-bold text-fg mb-3 group-hover:text-white transition-colors">
                  2. Practice through real labs
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  Watching videos isn't enough. Every topic pairs conceptual explanations with hands-on practice in
                  legal, dedicated virtual training sandboxes.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group rounded-xl border border-white/12 bg-surface p-6 lg:p-8 hover:border-white/28 hover:bg-raised transition-all shadow-sm">
                <div className="w-12 h-12 rounded-lg bg-white/[0.06] border border-white/12 flex items-center justify-center text-white mb-6 group-hover:scale-105 transition-transform">
                  <Trophy className="w-6 h-6" />
                </div>
                <div className="text-xs font-mono text-muted mb-2 font-medium">STEP 03 — MASTERY</div>
                <h3 className="text-xl font-bold text-fg mb-3 group-hover:text-white transition-colors">
                  3. Track meaningful milestones
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  Validate your skills with tangible progress markers and beginner-friendly capture-the-flag (CTF)
                  challenges that reinforce your retention.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: INTERACTIVE RIPPLE GRID COMPONENT SHOWCASE */}
        <section className="py-16 border-b border-white/12 bg-page relative overflow-hidden" id="interactive-grid">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-white/[0.03] blur-[130px] rounded-full pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/12 bg-surface text-white text-xs font-mono font-medium tracking-wide mb-3">
                <Sparkles className="w-3.5 h-3.5 text-white" />
                <span>NEW COMPONENT INTEGRATION</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-fg">
                Interactive Ripple Grid
              </h2>
              <p className="text-muted text-sm sm:text-base mt-2">
                Click any cell in the node matrix below to simulate packet propagation waves and animated ripple pulses.
              </p>
            </div>

            {/* Matrix Frame Container */}
            <div className="rounded-2xl border border-white/12 bg-surface p-6 sm:p-8 flex flex-col items-center justify-center shadow-2xl relative">
              <div className="flex flex-wrap items-center justify-between w-full max-w-2xl mb-6 pb-4 border-b border-white/10 text-xs font-mono text-muted">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#4ade80] animate-pulse"></span>
                  <span className="text-fg">Matrix State: Active</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="hidden sm:inline text-[#71717a]">Click cells to trigger ripple</span>
                  <Link
                    to="/demo"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/[0.06] hover:bg-white/10 text-white border border-white/15 transition-colors font-semibold"
                  >
                    <span>Fullscreen Demo</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Grid Component Render */}
              <div className="overflow-x-auto max-w-full py-4 flex justify-center">
                <RippleGrid
                  size={12}
                  cellSize={44}
                  cellColor="#101012"
                  borderColor="rgba(255,255,255,0.08)"
                  filledCellColor="#27272a"
                  pulseColor="#ffffff"
                  pulseScale={1.14}
                  pulseDuration={300}
                  rippleDelay={80}
                  className="min-h-[460px] !mt-0"
                  filledCells={[
                    { row: 1, col: 1 },
                    { row: 1, col: 10 },
                    { row: 5, col: 5 },
                    { row: 6, col: 6 },
                    { row: 10, col: 1 },
                    { row: 10, col: 10 },
                  ]}
                />
              </div>

              <div className="mt-4 text-center">
                <p className="text-xs text-[#71717a]">
                  Tip: Multiple rapid clicks create cascading interference waves across the nodes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: CHOOSE YOUR LEARNING PATH */}
        <section className="py-20 border-b border-white/12 bg-page relative" id="paths">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-white uppercase tracking-wider mb-2">
                  <GitBranch className="w-3.5 h-3.5" />
                  SPECIALIZATION TRACKS
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-fg">
                  Choose your learning path.
                </h2>
                <p className="text-muted text-sm sm:text-base mt-2 max-w-2xl">
                  Select a domain to inspect its core topics. You can explore and switch between tracks anytime.
                </p>
              </div>

              {/* "Not Sure Yet?" Toggle Button */}
              <div>
                <button
                  type="button"
                  onClick={() => setNotSureExpanded(!notSureExpanded)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/12 bg-surface hover:bg-white/[0.06] text-xs font-medium text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                >
                  <HelpCircle className="w-4 h-4 text-white" />
                  <span>Not sure yet? Click here</span>
                </button>
              </div>
            </div>

            {/* Beginner Guidance Callout for "Not Sure Yet?" */}
            {notSureExpanded && (
              <div className="mb-10 p-5 rounded-xl border border-white/20 bg-surface text-sm leading-relaxed shadow-lg animate-in fade-in duration-200">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white/10 text-white shrink-0 mt-0.5">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-fg text-base mb-1">
                      Advice for Absolute Beginners: Start with Core Foundations
                    </h3>
                    <p className="text-muted mb-3">
                      If you have never touched a terminal or configured a proxy before, do not worry about locking
                      yourself into Red Team or Blue Team yet. Every top practitioner starts with the same three
                      foundations:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-medium">
                      <div className="p-2.5 rounded-md bg-raised border border-white/10 text-fg">
                        <span className="text-white font-bold block mb-1">1. Linux CLI</span>
                        Mastering the terminal removes fear of security tools.
                      </div>
                      <div className="p-2.5 rounded-md bg-raised border border-white/10 text-fg">
                        <span className="text-white font-bold block mb-1">2. Networking</span>
                        Understanding IP, ports, & packets explains how attacks travel.
                      </div>
                      <div className="p-2.5 rounded-md bg-raised border border-white/10 text-fg">
                        <span className="text-white font-bold block mb-1">3. Web Basics</span>
                        Learning HTTP explains modern attack surfaces.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Three Interactive Learning-Path Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-8">
              {PATHS.map((path) => {
                const Icon = path.icon;
                const isSelected = selectedPathId === path.id;

                return (
                  <div
                    key={path.id}
                    onClick={() => setSelectedPathId(path.id)}
                    className={`rounded-2xl p-6 flex flex-col justify-between cursor-pointer transition-all relative card-interactive ${
                      isSelected
                        ? "border border-white/28 bg-white/[0.06] shadow-xl shadow-black/30 ring-1 ring-white/28"
                        : "bg-surface border border-white/12 hover:border-white/20"
                    }`}
                  >
                    {/* Top Row: Icon & Status Badge */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            isSelected
                              ? "bg-white/10 text-white border border-white/20"
                              : "bg-raised text-muted"
                          }`}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                        <span
                          className={`text-xs font-mono px-2.5 py-1 rounded-full border ${
                            isSelected
                              ? "bg-white/10 border-white/20 text-white font-semibold"
                              : "bg-raised border-transparent text-muted"
                          }`}
                        >
                          {isSelected ? "ACTIVE SELECTION" : path.badge}
                        </span>
                      </div>

                      <div className="mb-2">
                        <span className="text-xs font-mono text-[#71717a] uppercase tracking-wider">{path.subtitle}</span>
                        <h3 className="text-2xl font-bold text-fg">{path.title}</h3>
                      </div>

                      <p className="text-muted text-sm leading-relaxed mb-6">{path.description}</p>

                      {/* Path Core Bullets */}
                      <div className="space-y-2 mb-6 text-xs text-fg">
                        {path.bullets.map((bullet, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <CheckCircle2
                              className={`w-3.5 h-3.5 shrink-0 ${
                                isSelected ? "text-[#4ade80]" : "text-[#71717a]"
                              }`}
                            />
                            <span>{bullet}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom: Tags & Selector Action */}
                    <div className="pt-4 border-t border-white/10">
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {path.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[11px] px-2 py-0.5 rounded bg-raised text-muted"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <Link
                        to={user ? "/dashboard" : "/signup"}
                        className={`w-full py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                          isSelected
                            ? "bg-white hover:bg-accent-hover text-on-accent shadow-sm active:scale-[0.98]"
                            : "bg-raised text-muted hover:text-white"
                        }`}
                      >
                        <span>{user ? "View Track in Dashboard" : "Start This Path"}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Dynamic Track Summary Banner */}
            <div className="p-4 rounded-xl border border-white/12 bg-surface flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#4ade80] animate-pulse shrink-0" />
                <div className="text-muted">
                  Currently previewing:{" "}
                  <strong className="text-fg font-semibold">{selectedPath.title}</strong>{" "}
                  <span className="hidden sm:inline font-mono">({selectedPath.level})</span> — Ready to see what to study first?
                </div>
              </div>
              <a
                href="#roadmap"
                className="inline-flex items-center gap-1.5 font-semibold text-white hover:underline transition-colors focus-visible:outline-none"
              >
                <span>Jump to Starter Roadmap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </section>

        {/* SECTION 5: BEGINNER ROADMAP PREVIEW */}
        <section className="py-20 border-b border-white/12 bg-page relative" id="roadmap">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-white uppercase tracking-wider mb-2">
                <Compass className="w-3.5 h-3.5" />
                STARTER ROADMAP PREVIEW
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-fg mb-3">
                Foundations first. Tools second.
              </h2>
              <p className="text-muted text-base leading-relaxed">
                This preview outlines the first six essential milestones every ethical hacker and security analyst
                must master. It is designed to prepare you for deeper specialty curricula without feeling overwhelmed.
              </p>
            </div>

            {/* Vertical Roadmap Timeline */}
            <div className="relative pl-2 sm:pl-4 space-y-6">
              {/* Vertical connector line */}
              <div className="roadmap-timeline-line hidden sm:block" />

              {ROADMAP_STEPS.map((milestone, idx) => {
                const Icon = milestone.icon;
                const isActive = activeRoadmapStep === idx;

                return (
                  <div
                    key={milestone.step}
                    onClick={() => setActiveRoadmapStep(idx)}
                    className={`relative rounded-2xl p-5 sm:p-6 transition-all cursor-pointer card-interactive ${
                      isActive
                        ? "border border-white/28 bg-white/[0.06] shadow-xl shadow-black/20"
                        : "bg-surface border border-white/12 hover:border-white/20"
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      {/* Left side: Icon, Stage badge, Title & Description */}
                      <div className="flex items-start gap-4">
                        {/* Step Marker Icon */}
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                            isActive
                              ? "bg-white text-on-accent shadow-sm"
                              : "bg-raised text-white"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <span className="text-xs font-mono font-semibold text-white">
                              STAGE {milestone.step}
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-raised text-muted">
                              {milestone.category}
                            </span>
                          </div>

                          <h3 className="text-xl font-bold text-fg mb-2">{milestone.title}</h3>
                          <p className="text-sm text-muted leading-relaxed max-w-2xl">{milestone.description}</p>
                        </div>
                      </div>

                      {/* Right side: Skills & Recommended Lab */}
                      <div className="md:w-72 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/10 flex flex-col justify-between">
                        <div className="mb-3">
                          <span className="text-[11px] font-mono text-muted uppercase block mb-1.5">
                            Key Competencies:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {milestone.skills.map((skill) => (
                              <span
                                key={skill}
                                className="text-[10px] px-2 py-0.5 rounded bg-raised text-fg"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="p-2.5 rounded-lg bg-raised text-xs">
                          <span className="text-muted block text-[10px] font-mono">PRACTICE ENVIRONMENT:</span>
                          <span className="text-white font-medium flex items-center gap-1.5 mt-0.5">
                            <Terminal className="w-3.5 h-3.5 text-[#4ade80]" />
                            {milestone.labSuggestion}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Scope boundary reminder badge */}
            <div className="mt-8 p-4 rounded-xl border border-white/12 bg-surface text-xs text-muted flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-[#f87171] shrink-0" />
              <p>
                <strong className="text-fg">Curriculum Note:</strong> This preview showcases the initial starter
                sequence. Full professional penetration testing or SOC engineering requires advanced modules in binary
                exploitation, Active Directory attacks, and malware analysis, which are unlocked in future stages.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 6: THE LEARNING LOOP */}
        <section className="py-20 border-b border-white/12 bg-page relative" id="learning-loop">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#4ade80] uppercase tracking-wider mb-2">
                <RefreshCw className="w-3.5 h-3.5" />
                THE LEARNING LOOP
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-fg mb-3">
                How every topic connects learning with practice.
              </h2>
              <p className="text-muted text-base leading-relaxed">
                Passive reading creates an illusion of competence. CyberPath uses a 4-step loop to turn theory into
                instinctive muscle memory.
              </p>
            </div>

            {/* Compact 4-Step Visual Process */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              {LEARNING_LOOP_STEPS.map((step) => {
                const Icon = step.icon;

                return (
                  <div
                    key={step.number}
                    className="rounded-xl border border-white/12 bg-surface p-6 hover:border-white/28 hover:bg-raised transition-all shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-lg bg-white/[0.06] border border-white/12 flex items-center justify-center text-white">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="font-mono text-xs text-muted font-bold">STAGE {step.number}</span>
                      </div>

                      <h3 className="text-lg font-bold text-fg mb-2">{step.title}</h3>
                      <p className="text-muted text-xs sm:text-sm leading-relaxed">{step.desc}</p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-xs text-white font-medium">
                      <span>Step {step.number} of 04</span>
                      <ChevronRight className="w-4 h-4 text-muted" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION: PATH COMPLETION ACHIEVEMENTS */}
        <section className="py-20 border-b border-white/12 bg-page relative overflow-hidden" id="achievements">
          {/* Subtle Ambient Lighting */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-[#d29922]/5 blur-[140px] rounded-full pointer-events-none -z-10" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-gold-bright uppercase tracking-wider mb-2">
                <Award className="w-4 h-4 text-gold-bright" />
                PATH COMPLETION ACHIEVEMENTS
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-fg mb-3">
                Recognizing genuine practical mastery.
              </h2>
              <p className="text-muted text-base leading-relaxed">
                On CyberPath, badges cannot be earned simply by watching videos. Students unlock official path completion
                emblems only after completing all required lessons, passing assessments, and successfully executing
                authorized practical sandbox labs.
              </p>
            </div>

            {/* 4 Achievement Badges Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {ACHIEVEMENT_BADGES.map((badge) => {
                const isMaster = badge.isMaster;
                const isSelected = selectedBadgeId === badge.id;
                const trackNormalized = isMaster
                  ? "Master"
                  : badge.track.includes("Offensive")
                  ? "Red Team"
                  : badge.track.includes("Defensive")
                  ? "Blue Team"
                  : "Web Security";

                return (
                  <div
                    key={badge.id}
                    onClick={() => setSelectedBadgeId(badge.id)}
                    className={`rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 cursor-pointer relative group ${
                      isMaster
                        ? "bg-surface hover:bg-raised border border-[#d29922]/50 hover:border-[#f2cc60] shadow-lg shadow-[#d29922]/10"
                        : "bg-surface hover:bg-raised border border-white/12 hover:border-white/28"
                    } ${
                      isSelected
                        ? "ring-2 ring-offset-2 ring-offset-[#09090b] " +
                          (isMaster ? "ring-[#f2cc60]" : "ring-white/40")
                        : ""
                    }`}
                  >
                    <div>
                      {/* Top Track & Tier Subtle Label */}
                      <div className="flex items-center justify-between text-[11px] font-mono text-muted mb-3">
                        <span
                          className={`font-semibold uppercase tracking-wider text-[10px] ${
                            isMaster ? "text-gold-bright" : "text-muted"
                          }`}
                        >
                          {badge.track}
                        </span>
                        <span className="text-[10px] text-[#71717a]">
                          {badge.badgeTier}
                        </span>
                      </div>

                      {/* Large Custom Inline-SVG Emblem */}
                      <div className="my-3 flex items-center justify-center">
                        <BadgeEmblem
                          badge={{
                            slug: badge.id,
                            name: badge.title,
                            track: trackNormalized,
                            isMaster: badge.isMaster,
                            icon: badge.icon,
                          }}
                          state="earned"
                          completedSteps={100}
                          totalSteps={100}
                          size={128}
                          showProgressRing={true}
                        />
                      </div>

                      {/* Badge Title */}
                      <div className="text-center mt-3">
                        <h3
                          className={`text-lg font-bold tracking-tight ${
                            isMaster
                              ? "text-transparent bg-clip-text bg-gradient-to-r from-[#fef08a] via-[#fbbf24] to-[#f59e0b]"
                              : "text-fg group-hover:text-white"
                          }`}
                        >
                          {badge.title}
                        </h3>
                        <p className="text-xs text-muted text-center line-clamp-1 px-1 mt-1 leading-normal" title={badge.tagline}>
                          {badge.tagline}
                        </p>
                      </div>
                    </div>

                    {/* Progress Line & Small Status Text */}
                    <div className="pt-4 space-y-2">
                      <div className="w-full bg-raised h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: "100%",
                            backgroundColor: isMaster ? "#f2cc60" : "#ffffff",
                          }}
                        />
                      </div>

                      {/* Small Status Text - NOT a pill */}
                      <div className="flex items-center justify-between text-[11px] font-mono text-muted pt-1">
                        <span className="flex items-center gap-1 text-white">
                          <Sparkles className="w-3 h-3" />
                          Credential Preview
                        </span>
                        <span className="text-[#4ade80] font-semibold">Verified</span>
                      </div>

                      {/* One line requirement text */}
                      <div className="text-[11px] text-[#71717a] truncate pt-1 border-t border-white/10" title={badge.curriculumRequirement}>
                        {badge.curriculumRequirement}
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBadgeId(badge.id);
                        }}
                        className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors mt-2 ${
                          isSelected
                            ? isMaster
                              ? "bg-[#d29922] text-on-accent font-bold shadow-md shadow-[#d29922]/20"
                              : "bg-white text-on-accent shadow-sm hover:bg-accent-hover"
                            : "bg-raised hover:bg-raised text-fg border border-white/12"
                        }`}
                      >
                        <span>{isSelected ? "Inspecting Specs" : "View Credential Specs"}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Interactive Inspector & Credential Specification Drawer */}
            <div className="rounded-2xl border border-white/12 bg-surface p-6 lg:p-8 mb-10 shadow-xl relative overflow-hidden">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
                <div className="flex items-center gap-4">
                  <div className="shrink-0">
                    <BadgeEmblem
                      badge={{
                        slug: activeBadge.id,
                        name: activeBadge.title,
                        track: activeBadge.isMaster
                          ? "Master"
                          : activeBadge.track.includes("Offensive")
                          ? "Red Team"
                          : activeBadge.track.includes("Defensive")
                          ? "Blue Team"
                          : "Web Security",
                        isMaster: activeBadge.isMaster,
                        icon: activeBadge.icon,
                      }}
                      state="earned"
                      completedSteps={100}
                      totalSteps={100}
                      size={72}
                      showProgressRing={false}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${activeBadge.pillStyle}`}>
                        {activeBadge.badgeTier}
                      </span>
                      <span className="text-[11px] font-mono text-muted">OFFICIAL CREDENTIAL SPECS</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-fg">{activeBadge.title}</h3>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      downloadBadgePng(
                        {
                          slug: activeBadge.id,
                          name: activeBadge.title,
                          track: activeBadge.isMaster
                            ? "Master"
                            : activeBadge.track.includes("Offensive")
                            ? "Red Team"
                            : activeBadge.track.includes("Defensive")
                            ? "Blue Team"
                            : "Web Security",
                          description: activeBadge.tagline,
                          isMaster: activeBadge.isMaster,
                        },
                        new Date().toISOString(),
                        user?.email ? user.email.split("@")[0] : "Verified Student"
                      );
                    }}
                    className="py-2 px-3.5 rounded-xl bg-raised hover:bg-raised text-xs font-semibold text-white border border-white/12 flex items-center gap-1.5 transition-colors shadow-sm active:scale-95"
                  >
                    <Download className="w-3.5 h-3.5 text-white" />
                    <span>Download Sample PNG</span>
                  </button>

                  <div className="text-xs text-muted flex items-center gap-2 bg-page px-3 py-2 rounded-lg border border-white/12">
                    <LockKeyhole className="w-3.5 h-3.5 text-white" />
                    <span>Phase 2 Database RLS Security Enabled · Untamperable</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                <div>
                  <span className="text-[11px] font-mono text-muted uppercase block mb-1">Requirements To Earn:</span>
                  <p className="text-xs text-fg leading-relaxed font-medium">
                    {activeBadge.curriculumRequirement}
                  </p>
                </div>
                <div>
                  <span className="text-[11px] font-mono text-muted uppercase block mb-1">Scope & Verification:</span>
                  <p className="text-xs text-muted leading-relaxed">
                    {activeBadge.verificationDetails}
                  </p>
                </div>
                <div>
                  <span className="text-[11px] font-mono text-muted uppercase block mb-1">Earning Policy:</span>
                  <p className="text-xs text-muted leading-relaxed">
                    Requires server-verified lab completion in Supabase. No client-side self-awarding permitted.
                  </p>
                </div>
              </div>
            </div>

            {/* Architecture & Security Notice */}
            <div className="rounded-xl border border-white/12 bg-surface p-5 text-xs text-muted flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <Database className="w-5 h-5 text-white shrink-0 mt-0.5" />
                <div>
                  <strong className="text-fg block mb-0.5">
                    Phase 2 Supabase Verification Architecture
                  </strong>
                  <p className="leading-relaxed">
                    Student profiles and path selections are saved to Supabase PostgreSQL.
                    Row Level Security policies prevent client tampering, ensuring authenticated achievement integrity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 7: PRACTICE RESOURCES */}
        <section className="py-20 border-b border-white/12 bg-page relative" id="resources">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-white uppercase tracking-wider mb-2">
                <ExternalLink className="w-3.5 h-3.5" />
                ESTABLISHED PRACTICE PLATFORMS
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-fg mb-3">
                Where real cybersecurity skills are built.
              </h2>
              <p className="text-muted text-base leading-relaxed">
                Rather than reinventing virtual lab infrastructure, CyberPath organizes and maps your progress to
                industry-standard, trusted practice platforms.
              </p>
            </div>

            {/* 4 External Resource Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-10">
              {EXTERNAL_RESOURCES.map((res) => (
                <div
                  key={res.name}
                  className={`rounded-xl border bg-surface p-6 sm:p-7 flex flex-col justify-between transition-all hover:bg-raised ${res.accentColor}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-raised border border-white/12 font-mono font-bold text-xs flex items-center justify-center text-white">
                          {res.initials}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-fg">{res.name}</h3>
                          <span className="text-xs font-mono text-muted">{res.badge}</span>
                        </div>
                      </div>
                      <a
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-page border border-white/12 text-muted hover:text-white hover:border-white/28 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                        aria-label={`Open ${res.name} in a new tab`}
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </a>
                    </div>

                    <p className="text-sm text-muted mb-5 leading-relaxed">{res.tagline}</p>

                    <div className="space-y-1.5 mb-6 text-xs text-fg">
                      {res.features.map((feature, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#4ade80] shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-raised hover:bg-raised border border-white/12 hover:border-white/28 text-xs font-semibold text-fg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                  >
                    <span>Visit {res.name}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-white" />
                  </a>
                </div>
              ))}
            </div>

            {/* Affiliation Disclaimer */}
            <div className="p-4 rounded-xl border border-white/12 bg-surface text-xs text-muted text-center max-w-4xl mx-auto">
              <strong>Notice:</strong> These are independent third-party educational platforms. CyberPath does not
              claim official partnership, endorsement, or sponsorship by TryHackMe, PortSwigger, pwn.college, or
              OverTheWire. All trademarks belong to their respective owners.
            </div>
          </div>
        </section>

        {/* SECTION 8: FINAL CALL TO ACTION */}
        <section className="py-24 border-b border-white/12 bg-gradient-to-b from-[#09090b] to-[#101012] relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-white uppercase tracking-wider mb-4">
              <Zap className="w-3.5 h-3.5" />
              START TODAY
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-fg mb-6">
              You don&apos;t need to know everything. <br />
              <span className="text-white underline decoration-white/30 decoration-2 underline-offset-4">
                Just start.
              </span>
            </h2>
            <p className="text-base sm:text-lg text-muted leading-relaxed max-w-2xl mx-auto mb-10">
              The best security practitioners in the world all began with a simple command in an empty terminal. Pick
              your starting track, follow the sequence, and begin your journey today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to={user ? "/dashboard" : "/signup"}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-white hover:bg-accent-hover text-on-accent text-base font-semibold shadow-lg active:scale-[0.98] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                <span>{user ? "Open Your Student Dashboard" : "Create Your Free Account"}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#roadmap"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-lg bg-transparent hover:bg-white/[0.06] text-white border border-white/12 hover:border-white/28 text-base font-medium transition-all"
              >
                <span>Review Roadmap Stages</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* SECTION 9: FOOTER */}
      <footer className="w-full border-t border-white/12 bg-page py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/12">
            {/* Brand Logo & Wordmark */}
            <div className="flex items-center gap-3">
              <CyberPathLogo size="md" glow />
              <div className="flex flex-col">
                <span className="font-bold tracking-tight text-lg text-fg">
                  Cyber<span className="text-blue-400">Path</span>
                </span>
                <span className="text-[10px] text-zinc-500 font-mono tracking-wider">
                  LEARN • PRACTICE • BUILD
                </span>
              </div>
            </div>

            {/* Tagline */}
            <div className="text-center md:text-left text-sm text-muted">
              Learn responsibly. Practice ethically. Keep exploring.
            </div>

            {/* Back-to-Top Link */}
            <div>
              <a
                href="#home"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-white hover:underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 px-2 py-1 rounded"
              >
                <span>BACK TO TOP</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-muted gap-4">
            <p>© {CURRENT_YEAR} CyberPath. Built for ethical education.</p>
            <div className="flex items-center gap-4">
              <a href="#how-it-works" className="hover:text-white transition-colors">
                How It Works
              </a>
              <a href="#paths" className="hover:text-white transition-colors">
                Paths
              </a>
              <a href="#roadmap" className="hover:text-white transition-colors">
                Roadmap
              </a>
              <a href="#achievements" className="hover:text-white transition-colors">
                Achievements
              </a>
              <a href="#resources" className="hover:text-white transition-colors">
                Resources
              </a>
              <Link to="/login" className="hover:text-white transition-colors">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
