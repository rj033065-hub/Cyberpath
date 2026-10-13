/**
 * CyberPath — Phase 4 CTF & Lab Explorer Curated Resources Catalog
 *
 * Curated, verified cybersecurity training resources from official platforms:
 * - TryHackMe (https://tryhackme.com/)
 * - Hack The Box Academy (https://academy.hackthebox.com/)
 * - PortSwigger Web Security Academy (https://portswigger.net/web-security)
 * - OverTheWire (https://overthewire.org/wargames/)
 * - pwn.college (https://pwn.college/)
 *
 * Transparent Educational Disclosure:
 * All external resources link directly to their official platform sites.
 * CyberPath provides curated alignment with our curriculum and does not claim
 * unauthorized account synchronization without official API credentials.
 */

export const RESOURCE_PLATFORMS = [
  { id: "tryhackme", name: "TryHackMe", url: "https://tryhackme.com/" },
  { id: "htb", name: "Hack The Box Academy", url: "https://academy.hackthebox.com/" },
  { id: "portswigger", name: "PortSwigger Web Security Academy", url: "https://portswigger.net/web-security" },
  { id: "overthewire", name: "OverTheWire Wargames", url: "https://overthewire.org/wargames/" },
  { id: "pwncollege", name: "pwn.college", url: "https://pwn.college/" }
];

export const RESOURCE_TYPES = [
  "Guided Lab",
  "CTF Challenge",
  "Tutorial",
  "Documentation"
];

export const RESOURCE_DIFFICULTIES = [
  "Beginner",
  "Intermediate",
  "Advanced"
];

export const RESOURCE_TOPICS = [
  "Linux & Shell",
  "Networking",
  "Reconnaissance & Nmap",
  "Web Security & OWASP",
  "Authentication & Sessions",
  "Defensive Ops & SIEM",
  "Forensics & Log Analysis",
  "Privilege Escalation",
  "Binary Exploitation & Reverse Engineering",
  "Cryptography"
];

export const CURATED_RESOURCES = [
  // --- OverTheWire ---
  {
    id: "otw-bandit",
    title: "OverTheWire: Bandit Wargame",
    description: "The gold standard hands-on command-line wargame for beginners. Learn Linux directory traversal, permissions, file analysis, SSH tunneling, and shell automation level by level.",
    platform: "OverTheWire",
    platformUrl: "https://overthewire.org/wargames/bandit/",
    url: "https://overthewire.org/wargames/bandit/",
    difficulty: "Beginner",
    resourceType: "CTF Challenge",
    paths: ["red-team", "blue-team", "web-security"],
    topics: ["Linux & Shell"],
    estimatedHours: "4 - 8 hrs",
    isRecommended: true
  },
  {
    id: "otw-natas",
    title: "OverTheWire: Natas Web Security",
    description: "Hands-on wargame teaching server-side web security flaws including source code inspection, client-side validation bypass, SQL injection, session hijacking, and PHP execution.",
    platform: "OverTheWire",
    platformUrl: "https://overthewire.org/wargames/natas/",
    url: "https://overthewire.org/wargames/natas/",
    difficulty: "Intermediate",
    resourceType: "CTF Challenge",
    paths: ["web-security", "red-team"],
    topics: ["Web Security & OWASP", "Authentication & Sessions"],
    estimatedHours: "6 - 12 hrs",
    isRecommended: true
  },
  {
    id: "otw-leviathan",
    title: "OverTheWire: Leviathan Wargame",
    description: "Intermediate privilege escalation wargame focusing on Linux binary auditing, ltrace inspection, binary permissions, and shell escape vectors.",
    platform: "OverTheWire",
    platformUrl: "https://overthewire.org/wargames/leviathan/",
    url: "https://overthewire.org/wargames/leviathan/",
    difficulty: "Intermediate",
    resourceType: "CTF Challenge",
    paths: ["red-team"],
    topics: ["Linux & Shell", "Privilege Escalation"],
    estimatedHours: "3 - 5 hrs",
    isRecommended: false
  },

  // --- TryHackMe ---
  {
    id: "thm-intro-cyber",
    title: "TryHackMe: Intro to Cyber Security",
    description: "Interactive browser-based module introducing offensive security, defensive security, web application security fundamentals, and ethical responsibilities.",
    platform: "TryHackMe",
    platformUrl: "https://tryhackme.com/",
    url: "https://tryhackme.com/module/intro-to-cyber-security",
    difficulty: "Beginner",
    resourceType: "Guided Lab",
    paths: ["red-team", "blue-team", "web-security"],
    topics: ["Linux & Shell", "Networking"],
    estimatedHours: "3 hrs",
    isRecommended: true
  },
  {
    id: "thm-linux-fundamentals",
    title: "TryHackMe: Linux Fundamentals Part 1-3",
    description: "Step-by-step interactive Linux terminal rooms covering filesystem navigation, user groups, package management, cron automation, and shell redirection.",
    platform: "TryHackMe",
    platformUrl: "https://tryhackme.com/",
    url: "https://tryhackme.com/module/linux-fundamentals",
    difficulty: "Beginner",
    resourceType: "Guided Lab",
    paths: ["red-team", "blue-team"],
    topics: ["Linux & Shell"],
    estimatedHours: "4 hrs",
    isRecommended: true
  },
  {
    id: "thm-nmap",
    title: "TryHackMe: Nmap Network Scanning",
    description: "Dedicated practical laboratory covering port scanning techniques, TCP handshake flags, SYN stealth scans, NSE vulnerability scripts, and output parsing.",
    platform: "TryHackMe",
    platformUrl: "https://tryhackme.com/",
    url: "https://tryhackme.com/room/furthernmap",
    difficulty: "Beginner",
    resourceType: "Guided Lab",
    paths: ["red-team", "blue-team"],
    topics: ["Networking", "Reconnaissance & Nmap"],
    estimatedHours: "2 hrs",
    isRecommended: true
  },
  {
    id: "thm-jr-pentester",
    title: "TryHackMe: Jr Penetration Tester Pathway",
    description: "Complete curated training path covering web application penetration testing, network security, vulnerability research, and privilege escalation methodologies.",
    platform: "TryHackMe",
    platformUrl: "https://tryhackme.com/",
    url: "https://tryhackme.com/path/outline/jrpenetrationtester",
    difficulty: "Intermediate",
    resourceType: "Guided Lab",
    paths: ["red-team"],
    topics: ["Reconnaissance & Nmap", "Web Security & OWASP", "Privilege Escalation"],
    estimatedHours: "40 hrs",
    isRecommended: true
  },
  {
    id: "thm-soc-level1",
    title: "TryHackMe: SOC Level 1 Pathway",
    description: "Comprehensive blue team pathway covering cyber defense frameworks, traffic analysis with Wireshark, endpoint investigation, and SIEM event correlation.",
    platform: "TryHackMe",
    platformUrl: "https://tryhackme.com/",
    url: "https://tryhackme.com/path/outline/soclevel1",
    difficulty: "Intermediate",
    resourceType: "Guided Lab",
    paths: ["blue-team"],
    topics: ["Defensive Ops & SIEM", "Forensics & Log Analysis", "Networking"],
    estimatedHours: "50 hrs",
    isRecommended: true
  },
  {
    id: "thm-wireshark",
    title: "TryHackMe: Wireshark Packet Analysis",
    description: "Hands-on packet inspection room: examine PCAP captures, filter TCP streams, analyze ARP floods, and detect unencrypted credentials across protocols.",
    platform: "TryHackMe",
    platformUrl: "https://tryhackme.com/",
    url: "https://tryhackme.com/room/wiresharkthebasics",
    difficulty: "Beginner",
    resourceType: "Guided Lab",
    paths: ["blue-team", "red-team"],
    topics: ["Networking", "Forensics & Log Analysis"],
    estimatedHours: "2.5 hrs",
    isRecommended: true
  },

  // --- PortSwigger Web Security Academy ---
  {
    id: "portswigger-sql-injection",
    title: "PortSwigger Academy: SQL Injection Labs",
    description: "World-class interactive web labs from the makers of Burp Suite. Practice UNION attacks, error-based injection, blind SQLi with conditional delays, and mitigation strategies.",
    platform: "PortSwigger Web Security Academy",
    platformUrl: "https://portswigger.net/web-security",
    url: "https://portswigger.net/web-security/sql-injection",
    difficulty: "Beginner",
    resourceType: "Guided Lab",
    paths: ["web-security", "red-team"],
    topics: ["Web Security & OWASP"],
    estimatedHours: "5 hrs",
    isRecommended: true
  },
  {
    id: "portswigger-xss",
    title: "PortSwigger Academy: Cross-Site Scripting (XSS)",
    description: "In-depth labs detailing Reflected, Stored, and DOM-based Cross-Site Scripting vulnerabilities, CSP evaluation, and secure context-aware output encoding.",
    platform: "PortSwigger Web Security Academy",
    platformUrl: "https://portswigger.net/web-security",
    url: "https://portswigger.net/web-security/cross-site-scripting",
    difficulty: "Intermediate",
    resourceType: "Guided Lab",
    paths: ["web-security"],
    topics: ["Web Security & OWASP"],
    estimatedHours: "6 hrs",
    isRecommended: true
  },
  {
    id: "portswigger-authentication",
    title: "PortSwigger Academy: Authentication Vulnerabilities",
    description: "Practice finding authentication flaws: brute-force mitigation bypasses, 2FA logic flaws, password reset vulnerabilities, and session hijacking mechanisms.",
    platform: "PortSwigger Web Security Academy",
    platformUrl: "https://portswigger.net/web-security",
    url: "https://portswigger.net/web-security/authentication",
    difficulty: "Intermediate",
    resourceType: "Guided Lab",
    paths: ["web-security"],
    topics: ["Authentication & Sessions", "Web Security & OWASP"],
    estimatedHours: "4 hrs",
    isRecommended: true
  },
  {
    id: "portswigger-path-traversal",
    title: "PortSwigger Academy: Path Traversal Labs",
    description: "Examine directory traversal flaws that allow attackers to read arbitrary server files such as /etc/passwd and web application source code.",
    platform: "PortSwigger Web Security Academy",
    platformUrl: "https://portswigger.net/web-security",
    url: "https://portswigger.net/web-security/file-path-traversal",
    difficulty: "Beginner",
    resourceType: "Guided Lab",
    paths: ["web-security", "red-team"],
    topics: ["Web Security & OWASP"],
    estimatedHours: "2 hrs",
    isRecommended: true
  },

  // --- Hack The Box Academy ---
  {
    id: "htb-linux-fundamentals",
    title: "HTB Academy: Linux Fundamentals",
    description: "Deep dive into Linux architecture, process hierarchies, file system hierarchy standards (FHS), permission bitmasks, and package management.",
    platform: "Hack The Box Academy",
    platformUrl: "https://academy.hackthebox.com/",
    url: "https://academy.hackthebox.com/module/details/18",
    difficulty: "Beginner",
    resourceType: "Tutorial",
    paths: ["red-team", "blue-team"],
    topics: ["Linux & Shell"],
    estimatedHours: "6 hrs",
    isRecommended: false
  },
  {
    id: "htb-network-enumeration-nmap",
    title: "HTB Academy: Network Enumeration with Nmap",
    description: "Industrial-grade training on hostile environment port scanning, evasion techniques, firewall bypassing, and custom NSE scripting for vulnerability verification.",
    platform: "Hack The Box Academy",
    platformUrl: "https://academy.hackthebox.com/",
    url: "https://academy.hackthebox.com/module/details/19",
    difficulty: "Intermediate",
    resourceType: "Guided Lab",
    paths: ["red-team"],
    topics: ["Networking", "Reconnaissance & Nmap"],
    estimatedHours: "8 hrs",
    isRecommended: true
  },
  {
    id: "htb-web-requests",
    title: "HTB Academy: Web Requests & HTTP Protocols",
    description: "Comprehensive guide to HTTP headers, methods, status codes, cookies, and proxy manipulation with curl and Burp Suite Repeater.",
    platform: "Hack The Box Academy",
    platformUrl: "https://academy.hackthebox.com/",
    url: "https://academy.hackthebox.com/module/details/35",
    difficulty: "Beginner",
    resourceType: "Tutorial",
    paths: ["web-security", "red-team"],
    topics: ["Web Security & OWASP", "Networking"],
    estimatedHours: "4 hrs",
    isRecommended: true
  },
  {
    id: "htb-siem-splunk",
    title: "HTB Academy: Incident Handling & SIEM",
    description: "Learn defensive triage, querying Splunk search processing language (SPL), detecting beaconing behavior, and constructing defensive detection rules.",
    platform: "Hack The Box Academy",
    platformUrl: "https://academy.hackthebox.com/",
    url: "https://academy.hackthebox.com/module/details/125",
    difficulty: "Advanced",
    resourceType: "Guided Lab",
    paths: ["blue-team"],
    topics: ["Defensive Ops & SIEM", "Forensics & Log Analysis"],
    estimatedHours: "10 hrs",
    isRecommended: true
  },

  // --- pwn.college ---
  {
    id: "pwncollege-luminarium",
    title: "pwn.college: Linux Luminarium",
    description: "Educational initiative by Arizona State University. Solve dozens of interactive Linux environment challenges designed to teach mastery of standard input, file redirection, and pipes.",
    platform: "pwn.college",
    platformUrl: "https://pwn.college/",
    url: "https://pwn.college/linux-luminarium/",
    difficulty: "Beginner",
    resourceType: "CTF Challenge",
    paths: ["red-team", "blue-team", "web-security"],
    topics: ["Linux & Shell"],
    estimatedHours: "12 hrs",
    isRecommended: true
  },
  {
    id: "pwncollege-program-misuse",
    title: "pwn.college: Program Misuse & SUID Privilege Escalation",
    description: "Learn how standard Linux administrative utilities (e.g., find, vim, awk, systemctl) can be abused when SUID bits are configured improperly.",
    platform: "pwn.college",
    platformUrl: "https://pwn.college/",
    url: "https://pwn.college/program-misuse/",
    difficulty: "Intermediate",
    resourceType: "CTF Challenge",
    paths: ["red-team"],
    topics: ["Linux & Shell", "Privilege Escalation"],
    estimatedHours: "8 hrs",
    isRecommended: true
  },
  {
    id: "pwncollege-web-security",
    title: "pwn.college: Web Security Architecture",
    description: "Hands-on academic modules exploring HTTP parsers, cookie state machines, and modern browser isolation policies.",
    platform: "pwn.college",
    platformUrl: "https://pwn.college/",
    url: "https://pwn.college/web-security/",
    difficulty: "Intermediate",
    resourceType: "CTF Challenge",
    paths: ["web-security"],
    topics: ["Web Security & OWASP", "Authentication & Sessions"],
    estimatedHours: "10 hrs",
    isRecommended: false
  },

  // --- Official Documentation & Standards ---
  {
    id: "owasp-top-10",
    title: "OWASP Top 10 Official Documentation",
    description: "The authoritative industry consensus on the most critical security risks to web applications. Essential reading for every security professional.",
    platform: "OWASP",
    platformUrl: "https://owasp.org/www-project-top-ten/",
    url: "https://owasp.org/www-project-top-ten/",
    difficulty: "Beginner",
    resourceType: "Documentation",
    paths: ["web-security", "red-team", "blue-team"],
    topics: ["Web Security & OWASP"],
    estimatedHours: "3 hrs",
    isRecommended: true
  },
  {
    id: "nist-incident-handling",
    title: "NIST SP 800-61 Rev. 2: Computer Security Incident Handling Guide",
    description: "The benchmark standard for establishing incident response capabilities, structuring triage lifecycles, and managing enterprise forensic investigations.",
    platform: "NIST",
    platformUrl: "https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final",
    url: "https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final",
    difficulty: "Intermediate",
    resourceType: "Documentation",
    paths: ["blue-team"],
    topics: ["Defensive Ops & SIEM", "Forensics & Log Analysis"],
    estimatedHours: "4 hrs",
    isRecommended: false
  }
];
