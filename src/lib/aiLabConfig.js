// src/lib/aiLabConfig.js
/**
 * Configuration and metadata for CyberPath AI Lab Mentor.
 * Maps lab IDs to platform metadata and defines tutoring modes and starter quick actions.
 */

export const AI_LAB_CONFIG = {
  "sqli-basics": {
    id: "sqli-basics",
    title: "SQL Injection Fundamentals",
    category: "Web Security & Injection",
    shortName: "SQLi",
    quickActions: [
      { mode: "hint", label: "Get a Hint", prompt: "Can you give me a small hint for this step without giving away the answer?" },
      { mode: "explain", label: "Explain Concept", prompt: "Explain how SQL injection works and why string concatenation is dangerous." },
      { mode: "debug", label: "Debug My Reasoning", prompt: "I am trying to reason through this query. How should I analyze what the SQL engine does?" },
      { mode: "remediation", label: "Explain the Defense", prompt: "How do parameterized queries / prepared statements stop this vulnerability?" },
    ],
  },
  "xss-playground": {
    id: "xss-playground",
    title: "Cross-Site Scripting Playground",
    category: "Web Security & Injection",
    shortName: "XSS",
    quickActions: [
      { mode: "hint", label: "Get a Hint", prompt: "What should I look for in the DOM sink to find the vulnerability?" },
      { mode: "explain", label: "Explain Concept", prompt: "What is the difference between Reflected, Stored, and DOM XSS?" },
      { mode: "debug", label: "Debug My Reasoning", prompt: "Why does my payload not execute or what makes an HTML sink vulnerable?" },
      { mode: "remediation", label: "Explain the Defense", prompt: "What are the recommended defenses against XSS (encoding, sanitization, CSP)?" },
    ],
  },
  "idor-investigation": {
    id: "idor-investigation",
    title: "IDOR Investigation",
    category: "Access Control",
    shortName: "IDOR",
    quickActions: [
      { mode: "hint", label: "Get a Hint", prompt: "Can you give me a hint on identifying the object reference and owner ID?" },
      { mode: "explain", label: "Explain Concept", prompt: "Explain Insecure Direct Object References in plain beginner language." },
      { mode: "debug", label: "Debug My Reasoning", prompt: "Why is knowing a record ID not the same as having authorization to view it?" },
      { mode: "remediation", label: "Explain the Defense", prompt: "How should a backend enforce object-level authorization properly?" },
    ],
  },
  "auth-checkpoint": {
    id: "auth-checkpoint",
    title: "Authentication Checkpoint",
    category: "Authentication & Session Management",
    shortName: "Auth",
    quickActions: [
      { mode: "hint", label: "Get a Hint", prompt: "Can you give me a hint on what control is missing in this authentication scenario?" },
      { mode: "explain", label: "Explain Concept", prompt: "Explain why rate limiting and password hashing are critical for authentication." },
      { mode: "debug", label: "Debug My Reasoning", prompt: "Help me analyze why client-side authorization checks fail to protect sensitive routes." },
      { mode: "remediation", label: "Explain the Defense", prompt: "What is the proper way to handle session invalidation and rate limiting?" },
    ],
  },
};

export const PAGE_CONTEXT_CONFIG = {
  home: {
    id: "home",
    title: "CyberPath Overview & Orientation",
    shortName: "Home",
    badge: "Orientation",
    description: "Guidance on CyberPath features, getting started, and platform navigation.",
    quickActions: [
      { mode: "chat", label: "What is CyberPath?", prompt: "What is CyberPath and how does it help me learn cybersecurity?" },
      { mode: "chat", label: "Where to start?", prompt: "I am an absolute beginner in cybersecurity. Where should I start on CyberPath?" },
      { mode: "chat", label: "Career Paths", prompt: "What cybersecurity career paths and learning roadmaps does CyberPath offer?" },
      { mode: "chat", label: "Practice Labs", prompt: "How do the interactive hands-on labs work on CyberPath?" },
    ],
  },
  roadmaps: {
    id: "roadmaps",
    title: "Curriculum & Learning Roadmaps",
    shortName: "Roadmaps",
    badge: "Roadmap",
    description: "Explaining Red Team, Blue Team, and Web Security learning tracks.",
    quickActions: [
      { mode: "explain", label: "Red vs Blue Team", prompt: "What is the difference between Red Team (offensive) and Blue Team (defensive) security?" },
      { mode: "explain", label: "Web Security Path", prompt: "What will I learn in the Web Application Security path?" },
      { mode: "explain", label: "Beginner Choice", prompt: "Which path is best suited for someone with no prior coding or networking experience?" },
      { mode: "explain", label: "Certifications", prompt: "How do these learning paths map to industry certifications like Security+ or CEH?" },
    ],
  },
  lessons: {
    id: "lessons",
    title: "CyberPath Interactive Lesson",
    shortName: "Lesson",
    badge: "Lesson",
    description: "Clarifying cybersecurity concepts, terminology, and study strategies.",
    quickActions: [
      { mode: "explain", label: "Explain Concept", prompt: "Can you explain the main concept of this lesson in simple terms with an analogy?" },
      { mode: "explain", label: "Real-World Example", prompt: "What is a real-world incident or attack that demonstrates this vulnerability or concept?" },
      { mode: "debug", label: "Check Understanding", prompt: "Ask me a quick question to test if I understand the key takeaway of this lesson." },
      { mode: "remediation", label: "Best Practices", prompt: "What are the industry best practices to prevent or defend against this issue?" },
    ],
  },
  dashboard: {
    id: "dashboard",
    title: "Student Progress & Dashboard",
    shortName: "Dashboard",
    badge: "Dashboard",
    description: "Understanding XP, streaks, level progression, and badge criteria.",
    quickActions: [
      { mode: "chat", label: "How XP Works", prompt: "How do XP, level progression, and daily streaks work on CyberPath?" },
      { mode: "chat", label: "Earning Badges", prompt: "How do I earn security badges and showcase my progress on my profile?" },
      { mode: "chat", label: "Recommended Next", prompt: "What is the recommended next step to keep my daily learning streak going?" },
      { mode: "chat", label: "Track Progress", prompt: "How does CyberPath track lesson and lab completions?" },
    ],
  },
  resources: {
    id: "resources",
    title: "Security Resources & CTFs",
    shortName: "Resources",
    badge: "CTFs & Tools",
    description: "Navigating CTF challenges, external tools, documentation, and practice.",
    quickActions: [
      { mode: "explain", label: "CTF Strategy", prompt: "How should a beginner approach Capture The Flag (CTF) challenges without feeling overwhelmed?" },
      { mode: "explain", label: "Essential Tools", prompt: "What essential free tools (e.g. Wireshark, Burp Suite, Nmap) should I learn first?" },
      { mode: "explain", label: "Practice Sites", prompt: "What are the best external platforms to practice alongside CyberPath?" },
      { mode: "explain", label: "How to Take Notes", prompt: "How should I organize my cybersecurity study notes and writeups?" },
    ],
  },
  profile: {
    id: "profile",
    title: "Profile & Achievements",
    shortName: "Profile",
    badge: "Profile",
    description: "Viewing achievements, activity history, and student account details.",
    quickActions: [
      { mode: "chat", label: "Profile Summary", prompt: "How can I build an impressive cybersecurity portfolio using my CyberPath achievements?" },
      { mode: "chat", label: "Next Milestone", prompt: "What learning milestones should I aim for next to level up my profile?" },
    ],
  },
  general: {
    id: "general",
    title: "CyberPath AI Assistant",
    shortName: "Assistant",
    badge: "Global",
    description: "General cybersecurity learning assistant, definitions, and platform guide.",
    quickActions: [
      { mode: "chat", label: "What is Ethical Hacking?", prompt: "What is ethical hacking and what are the rules of engagement?" },
      { mode: "chat", label: "CIA Triad", prompt: "Explain the CIA Triad (Confidentiality, Integrity, Availability) in simple terms." },
      { mode: "chat", label: "Common Attacks", prompt: "What are the most common web application vulnerabilities today?" },
      { mode: "chat", label: "Career Advice", prompt: "What entry-level roles can I pursue in cybersecurity and how do I prepare?" },
    ],
  },
  networking: {
    id: "networking",
    title: "Networking for Cybersecurity",
    shortName: "Networking",
    badge: "Interactive Module",
    description: "Foundational and practical networking concepts: OSI & TCP/IP models, packet encapsulation, CIDR subnetting, ARP, DNS, firewalls, and troubleshooting.",
    quickActions: [
      { mode: "explain", label: "Packet vs Frame", prompt: "What is the difference between a Layer 3 packet and a Layer 2 frame?" },
      { mode: "explain", label: "TCP Handshake", prompt: "Explain the SYN, SYN-ACK, and ACK 3-way handshake in simple terms." },
      { mode: "explain", label: "Subnetting /24 vs /26", prompt: "How do I calculate usable host addresses in a /26 subnet compared to /24?" },
      { mode: "explain", label: "DNS Resolution", prompt: "Walk me through how a DNS query travels from client to root, TLD, and authoritative nameservers." },
    ],
  },
};

/**
 * Resolves a URL pathname to trusted page context metadata.
 *
 * @param {string} pathname - e.g. "/dashboard", "/learn/web-security", "/explore", etc.
 * @returns {object} The resolved PAGE_CONTEXT_CONFIG object.
 */
export function resolvePageContext(pathname = "") {
  const path = (pathname || "").toLowerCase().replace(/\/+$/, "");

  if (!path || path === "") return PAGE_CONTEXT_CONFIG.home;
  if (path === "/dashboard") return PAGE_CONTEXT_CONFIG.dashboard;
  if (path === "/explore") return PAGE_CONTEXT_CONFIG.resources;
  if (path === "/profile") return PAGE_CONTEXT_CONFIG.profile;
  if (path.startsWith("/networking") || path.startsWith("/learn/networking")) {
    return PAGE_CONTEXT_CONFIG.networking;
  }
  if (path.startsWith("/learn")) {
    const parts = path.split("/").filter(Boolean);
    if (parts.length >= 3) {
      return PAGE_CONTEXT_CONFIG.lessons; // /learn/:pathSlug/:lessonSlug
    }
    return PAGE_CONTEXT_CONFIG.roadmaps; // /learn/:pathSlug
  }
  if (path === "/labs") return PAGE_CONTEXT_CONFIG.resources;

  return PAGE_CONTEXT_CONFIG.general;
}

// Aliases for route slugs or legacy abbreviations
export const LAB_SLUG_ALIASES = {
  "sqli": "sqli-basics",
  "sqli-basics": "sqli-basics",
  "xss": "xss-playground",
  "xss-playground": "xss-playground",
  "idor": "idor-investigation",
  "idor-investigation": "idor-investigation",
  "auth": "auth-checkpoint",
  "auth-checkpoint": "auth-checkpoint",
};

/**
 * Resolves a route slug or lab name to a verified lab configuration.
 */
export function resolveLabConfig(slugOrId) {
  if (!slugOrId) return null;
  const canonicalId = LAB_SLUG_ALIASES[slugOrId] || slugOrId;
  return AI_LAB_CONFIG[canonicalId] || null;
}

/**
 * Helper to resolve the current route slug to the mentor labId.
 */
export function resolveLabIdFromSlug(slug) {
  const cfg = resolveLabConfig(slug);
  return cfg ? cfg.id : undefined;
}
