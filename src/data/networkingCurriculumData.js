/**
 * CyberPath Networking Curriculum Data — 6 Progressive Levels
 *
 * Level 1: Networking Fundamentals (LAN, WAN, Client/Server, Switches, Routers, MAC, IP, Ports, Topology)
 * Level 2: OSI and TCP/IP Models (7 Layers, Encapsulation, PDU, Packets, Frames, Segments, TCP vs UDP)
 * Level 3: IP Addressing and Subnetting (IPv4, Binary, Subnet Masks, CIDR, Network/Broadcast, Gateways, Routing)
 * Level 4: Network Protocols (ARP, DNS, DHCP, ICMP, TCP Handshake, HTTP/HTTPS, TLS)
 * Level 5: Networking for Cybersecurity (Firewalls, NAT, VPNs, Segmentation, Packet Capture, Attacks, Hardening)
 * Level 6: Practical Network Lab (Ping, Traceroute, Nslookup/Dig, Wireshark, Nmap Basics, Troubleshooting)
 */

export const NETWORKING_MODULE_METADATA = {
  slug: "networking",
  title: "Networking for Cybersecurity",
  subtitle: "From First Packet to Defensive Monitoring",
  description: "A comprehensive, beginner-friendly interactive curriculum designed to build rock-solid foundational networking knowledge essential for both offensive and defensive cybersecurity.",
  badgeAward: "Network Navigator",
  badgeSlug: "network-navigator",
  colorTheme: "cyan",
  estimatedHours: 8,
  totalLevels: 6,
};

export const NETWORKING_LEVELS = [
  {
    level: 1,
    id: "net-lvl-1",
    slug: "networking-fundamentals",
    title: "Level 1 — Networking Fundamentals",
    shortTitle: "Fundamentals",
    subtitle: "How computers talk to each other across cables and radio waves",
    description: "Explore the physical and logical foundations of networks: LANs, WANs, switches, routers, MAC vs IP addresses, port numbers, and network topologies.",
    estimatedMinutes: 60,
    icon: "Network",
    color: "#38bdf8", // Sky blue
    prerequisites: ["None — Beginner Friendly"],
    lessons: [
      {
        slug: "lan-wan-client-server",
        title: "LAN, WAN & The Client/Server Architecture",
        sequenceOrder: 1,
        estimatedMinutes: 25,
        objectives: [
          "Differentiate between Local Area Networks (LAN) and Wide Area Networks (WAN)",
          "Understand the client-server paradigm and peer-to-peer relationships",
          "Identify edge devices, end hosts, and intermediary network infrastructure"
        ],
        summary: "Before diving into packets and protocols, understand how devices connect physically and logically across personal rooms, corporate offices, and the global Internet.",
        simulationId: "packet-journey",
        gameId: "build-network"
      },
      {
        slug: "switches-routers-mac-ip",
        title: "Switches, Routers, MAC & IP Addresses",
        sequenceOrder: 2,
        estimatedMinutes: 35,
        objectives: [
          "Learn why Layer 2 switches use MAC addresses within a local broadcast domain",
          "Understand how Layer 3 routers use IP addresses to navigate across networks",
          "Contrast physical burned-in hardware addresses (MAC) with logical routable addresses (IP)",
          "Explore network topologies: star, mesh, bus, and hybrid designs"
        ],
        summary: "Discover why switches are the traffic officers of local rooms while routers are the postal navigators connecting whole neighborhoods.",
        simulationId: "packet-journey",
        gameId: "build-network"
      }
    ]
  },
  {
    level: 2,
    id: "net-lvl-2",
    slug: "osi-and-tcp-ip",
    title: "Level 2 — OSI & TCP/IP Models",
    shortTitle: "OSI & TCP/IP",
    subtitle: "The architectural blueprints that power the digital world",
    description: "Master the 7-layer OSI conceptual reference model and the 4-layer TCP/IP production suite. Understand encapsulation, protocol data units (PDUs), and TCP vs UDP.",
    estimatedMinutes: 70,
    icon: "Layers",
    color: "#60a5fa", // Blue
    prerequisites: ["Level 1: Networking Fundamentals"],
    lessons: [
      {
        slug: "the-7-osi-layers-and-tcpip",
        title: "The 7 OSI Layers & The TCP/IP Suite",
        sequenceOrder: 1,
        estimatedMinutes: 35,
        objectives: [
          "Memorize and apply all 7 layers of the OSI reference model (Physical to Application)",
          "Compare the OSI conceptual framework with the real-world 4-layer TCP/IP model",
          "Trace how application payloads travel down and back up the protocol stack"
        ],
        summary: "The OSI model provides an indispensable mental map for debugging connectivity issues and analyzing where cyber attacks target systems.",
        simulationId: "osi-encapsulation",
        gameId: "packet-sorting"
      },
      {
        slug: "encapsulation-pdu-tcp-vs-udp",
        title: "Encapsulation, PDUs & TCP vs UDP",
        sequenceOrder: 2,
        estimatedMinutes: 35,
        objectives: [
          "Understand how headers are wrapped around data: Data -> Segment -> Packet -> Frame -> Bits",
          "Contrast connection-oriented reliable TCP with connectionless lightweight UDP",
          "Identify which real-world applications demand TCP (web, email) vs UDP (gaming, DNS, streaming)"
        ],
        summary: "Learn how data gets boxed like nesting Russian dolls and why TCP takes the time to verify every arrival while UDP prioritizes pure speed.",
        simulationId: "osi-encapsulation",
        gameId: "follow-packet"
      }
    ]
  },
  {
    level: 3,
    id: "net-lvl-3",
    slug: "ip-addressing-and-subnetting",
    title: "Level 3 — IP Addressing & Subnetting",
    shortTitle: "Subnetting",
    subtitle: "Binary math, CIDR notation, and network division made simple",
    description: "Demystify IPv4 addresses, octets, subnet masks, slash notation (/24, /28), network and broadcast bounds, private RFC 1918 ranges, and default gateways.",
    estimatedMinutes: 80,
    icon: "Hash",
    color: "#34d399", // Emerald
    prerequisites: ["Level 2: OSI & TCP/IP Models"],
    lessons: [
      {
        slug: "ipv4-binary-and-cidr",
        title: "IPv4 Architecture, Octets & CIDR Notation",
        sequenceOrder: 1,
        estimatedMinutes: 40,
        objectives: [
          "Convert simple 8-bit octets between decimal and binary",
          "Understand why IPv4 has 32 bits (4 octets of 8 bits) and 4.3 billion possible addresses",
          "Decode Classless Inter-Domain Routing (CIDR) slash notation such as /24, /16, and /30",
          "Calculate the number of assignable host addresses using the 2^(32-N) - 2 formula"
        ],
        summary: "Subnetting is often feared by beginners, but when broken down into binary boundaries and postal codes, it becomes clear and intuitive.",
        simulationId: "subnet-visualizer",
        gameId: "subnet-challenge"
      },
      {
        slug: "network-broadcast-and-gateways",
        title: "Network Bounds, Private RFC 1918 & Default Gateways",
        sequenceOrder: 2,
        estimatedMinutes: 40,
        objectives: [
          "Determine the exact Network ID and Broadcast address for any given IPv4 subnet",
          "Recognize private RFC 1918 address spaces (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16)",
          "Understand the critical role of the Default Gateway in routing packets off the local network"
        ],
        summary: "Every device needs to know if its neighbor is on the same floor or across the world. Discover how network boundaries and default gateways make that choice instant.",
        simulationId: "subnet-visualizer",
        gameId: "subnet-challenge"
      }
    ]
  },
  {
    level: 4,
    id: "net-lvl-4",
    slug: "network-protocols",
    title: "Level 4 — Core Network Protocols",
    shortTitle: "Protocols",
    subtitle: "The languages of the Internet: ARP, DNS, DHCP, ICMP, TCP, HTTP & TLS",
    description: "Uncover how machines discover neighbors (ARP), obtain configuration automatically (DHCP), translate human names to numbers (DNS), diagnose reachability (ICMP), and establish secure connections (TLS).",
    estimatedMinutes: 85,
    icon: "Zap",
    color: "#a78bfa", // Purple
    prerequisites: ["Level 3: IP Addressing & Subnetting"],
    lessons: [
      {
        slug: "arp-dns-dhcp-icmp",
        title: "Address Resolution, DHCP & DNS Lookup",
        sequenceOrder: 1,
        estimatedMinutes: 45,
        objectives: [
          "Trace how ARP maps known Layer 3 IPs to unknown Layer 2 MAC addresses via broadcasts",
          "Follow the 4-step DHCP lease handshake (DORA: Discover, Offer, Request, Acknowledge)",
          "Step through iterative vs recursive DNS queries across Root, TLD, and Authoritative servers",
          "Understand how ICMP Echo Requests and Echo Replies power network diagnosis"
        ],
        summary: "Before any web page loads, a quiet orchestra of background protocols configures your device, resolves human names, and maps local hardware addresses.",
        simulationId: "dns-resolution",
        gameId: "follow-packet"
      },
      {
        slug: "tcp-handshake-http-tls",
        title: "The TCP 3-Way Handshake, HTTP/HTTPS & TLS",
        sequenceOrder: 2,
        estimatedMinutes: 40,
        objectives: [
          "Master the SYN -> SYN-ACK -> ACK three-way handshake and state machine",
          "Examine HTTP request/response methods, status codes, and plaintext headers",
          "Understand how TLS encrypts web traffic using asymmetric key exchange and symmetric ciphers"
        ],
        summary: "Witness the exact moment a computer agrees to communicate reliably, and learn why transitioning the Internet from HTTP to HTTPS was a monumental security upgrade.",
        simulationId: "tcp-handshake",
        gameId: "follow-packet"
      }
    ]
  },
  {
    level: 5,
    id: "net-lvl-5",
    slug: "networking-for-cybersecurity",
    title: "Level 5 — Networking for Cybersecurity",
    shortTitle: "Cybersecurity",
    subtitle: "Defenses, perimeters, and common network attacks",
    description: "Apply networking to cyber defense and attack analysis: packet filtering firewalls, NAT, VPN tunnels, VLAN segmentation, ARP spoofing, SYN floods, and traffic monitoring.",
    estimatedMinutes: 90,
    icon: "ShieldAlert",
    color: "#f43f5e", // Rose
    prerequisites: ["Level 4: Core Network Protocols"],
    lessons: [
      {
        slug: "firewalls-nat-vpn-segmentation",
        title: "Firewalls, NAT, VPNs & Network Segmentation",
        sequenceOrder: 1,
        estimatedMinutes: 45,
        objectives: [
          "Analyze stateless vs stateful packet inspection firewalls and access control lists (ACLs)",
          "Understand Network Address Translation (NAT) and Port Address Translation (PAT)",
          "Learn how encrypted Virtual Private Networks (VPNs) securely extend private networks over untrusted links",
          "Discover how VLANs and network segmentation isolate compromised hosts and prevent lateral movement"
        ],
        summary: "Network security begins with architectural isolation. Learn how modern security engineers build layered defensive perimeters to trap intruders.",
        simulationId: "packet-journey",
        gameId: "packet-detective"
      },
      {
        slug: "network-attacks-and-monitoring",
        title: "Network Attacks: ARP Poisoning, SYN Floods & Sniffing",
        sequenceOrder: 2,
        estimatedMinutes: 45,
        objectives: [
          "Deconstruct Man-in-the-Middle (MitM) via ARP cache poisoning",
          "Analyze Denial of Service (DoS) mechanisms including TCP SYN floods and amplification attacks",
          "Understand rogue DHCP servers, DNS spoofing, and port scanning techniques",
          "Learn the fundamentals of Security Information and Event Management (SIEM) and network telemetry"
        ],
        summary: "By understanding exactly how protocols fail when manipulated by adversaries, you will know how to inspect alerts and configure defensive monitors.",
        simulationId: "arp-discovery",
        gameId: "packet-detective"
      }
    ]
  },
  {
    level: 6,
    id: "net-lvl-6",
    slug: "practical-network-lab",
    title: "Level 6 — Practical Network Lab & Troubleshooting",
    shortTitle: "Practical Lab",
    subtitle: "Hands-on tools: Ping, Traceroute, Nslookup, Nmap & Wireshark",
    description: "Put theory into hands-on practice: run diagnostics using ping and traceroute, analyze packet captures with Wireshark principles, perform authorized port discovery, and troubleshoot connectivity faults.",
    estimatedMinutes: 90,
    icon: "Terminal",
    color: "#38bdf8", // Cyan
    prerequisites: ["Level 5: Networking for Cybersecurity"],
    lessons: [
      {
        slug: "cli-diagnostics-ping-traceroute-dns",
        title: "Diagnostic Tooling: Ping, Traceroute, Nslookup & Dig",
        sequenceOrder: 1,
        estimatedMinutes: 45,
        objectives: [
          "Use Ping to measure round-trip latency and identify packet drops",
          "Understand how Traceroute manipulates IP TTL (Time-To-Live) fields to map hop-by-hop routers",
          "Perform forward and reverse DNS queries using nslookup and dig commands",
          "Follow a structured step-by-step methodology to troubleshoot network faults from Layer 1 to Layer 7"
        ],
        summary: "When a server is down, what do you check first? Master the essential command-line tools used daily by sysadmins, security analysts, and penetration testers.",
        simulationId: "packet-journey",
        gameId: "network-troubleshooter"
      },
      {
        slug: "wireshark-nmap-and-troubleshooting",
        title: "Wireshark Packet Analysis & Nmap Reconnaissance",
        sequenceOrder: 2,
        estimatedMinutes: 45,
        objectives: [
          "Understand packet capture (PCAP) mechanics and Wireshark display filters (e.g. http, tcp.port == 80, ip.addr)",
          "Inspect real packet stream headers to spot unencrypted credentials and anomalies",
          "Learn how Nmap identifies open ports, operating systems, and services via TCP flags",
          "Diagnose common network failure scenarios: bad gateways, DNS misconfigurations, and firewall blocks"
        ],
        summary: "Wireshark is an X-ray machine for the network. Combine packet inspection with service scanning to solve realistic troubleshooting scenarios.",
        simulationId: "tcp-handshake",
        gameId: "network-troubleshooter"
      }
    ]
  }
];

export function getAllNetworkingLessons() {
  const lessons = [];
  for (const lvl of NETWORKING_LEVELS) {
    for (const lesson of lvl.lessons) {
      lessons.push({
        ...lesson,
        levelNumber: lvl.level,
        levelId: lvl.id,
        levelSlug: lvl.slug,
        levelTitle: lvl.title,
        levelShortTitle: lvl.shortTitle,
        levelColor: lvl.color,
      });
    }
  }
  return lessons;
}

export function getNetworkingLessonBySlug(lessonSlug) {
  const all = getAllNetworkingLessons();
  const index = all.findIndex((l) => l.slug === lessonSlug);
  if (index === -1) return null;
  return {
    lesson: all[index],
    prevLesson: index > 0 ? all[index - 1] : null,
    nextLesson: index < all.length - 1 ? all[index + 1] : null,
    currentIndex: index + 1,
    totalLessons: all.length,
  };
}

export function getNetworkingLevelByNumber(num) {
  return NETWORKING_LEVELS.find((l) => l.level === Number(num)) || null;
}
