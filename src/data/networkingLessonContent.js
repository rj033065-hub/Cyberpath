/**
 * CyberPath — Dedicated Networking Curriculum Content
 *
 * Full curriculum content for all 6 levels (12 comprehensive lessons).
 * Includes detailed theory, real-world analogies, diagrams, worked examples,
 * key terms, common misconceptions, cybersecurity relevance, knowledge check quizzes,
 * and associated interactive simulations & games.
 */

export const NETWORKING_LESSONS_CONTENT = {
  // ─────────────────────────────────────────────────────────────
  // LEVEL 1: NETWORKING FUNDAMENTALS
  // ─────────────────────────────────────────────────────────────
  "lan-wan-client-server": {
    slug: "lan-wan-client-server",
    title: "LAN, WAN & The Client/Server Architecture",
    levelNumber: 1,
    levelTitle: "Level 1 — Networking Fundamentals",
    estimatedMinutes: 25,
    prerequisites: ["None — Beginner Friendly"],
    objectives: [
      "Differentiate between Local Area Networks (LAN) and Wide Area Networks (WAN)",
      "Understand the client-server paradigm versus peer-to-peer relationships",
      "Identify edge devices, end hosts, and intermediary network infrastructure",
      "Recognize standard network topologies: star, mesh, bus, and hybrid"
    ],
    summary: "Networks connect computers to share data and services. Learn how local home or office networks (LANs) connect through edge infrastructure to the global Internet (WAN).",
    analogy: {
      title: "The Office Intercom vs The International Postal System",
      text: "Think of a Local Area Network (LAN) like an intercom system inside a single building: any room can buzz another room directly with zero postage and near-instant speed. A Wide Area Network (WAN), by contrast, is like the global postal and courier service: to send a package to another country, your parcel must pass through regional sorting hubs, international cargo planes, and local couriers."
    },
    theory: `### What Is a Computer Network?

At its core, a **computer network** is two or more computing devices connected by physical mediums (copper Ethernet cables, fiber optic glass lines) or wireless frequencies (Wi-Fi, cellular 5G, satellite) to exchange data and share resources.

---

### Local Area Networks (LAN) vs Wide Area Networks (WAN)

| Characteristic | Local Area Network (LAN) | Wide Area Network (WAN) |
|---|---|---|
| **Geographic Scope** | Single room, home, office floor, or campus | Across cities, countries, or the globe |
| **Ownership & Control** | Owned and operated by you or your organization | Owned by Telecoms & Internet Service Providers (ISPs) |
| **Speed & Bandwidth** | Very high (typically 1 Gbps to 10 Gbps) | Variable depending on ISP link and distance |
| **Latency (Delay)** | Extremely low (often < 1 millisecond) | Higher (typically 10 ms to 150+ ms across oceans) |
| **Typical Medium** | Cat6 Ethernet cables, Wi-Fi 6 | Undersea fiber optic cables, satellite links, carrier backbones |

---

### The Client / Server Architecture

Most Internet communication operates on the **Client/Server model**:

1. **The Client**: An end-user device (your laptop, smartphone, or browser) that initiates requests for resources, pages, or data.
2. **The Server**: A high-availability computer or cloud instance that continuously listens for incoming requests, processes them, and returns responses (e.g. web servers, database servers, email servers).

In contrast, in **Peer-to-Peer (P2P)** networks (like BitTorrent or blockchain nodes), devices act simultaneously as both clients and servers, requesting files from each other directly without a central host.

---

### Network Topologies

How devices are interconnected defines their **topology**:
- **Star Topology**: All devices connect to a central hub or switch. If one cable fails, only that device disconnects. This is the dominant standard in modern Ethernet LANs.
- **Mesh Topology**: Every device connects to multiple other devices for redundancy. Used in mission-critical networks and the core Internet backbone.
- **Bus Topology**: Legacy architecture where all computers shared a single coaxial backbone cable. A single break disconnected everyone.`,
    workedExample: {
      title: "Loading a Webpage From Home",
      scenario: "You sit at your laptop (Client) connected to your home Wi-Fi and open `https://cyberpath.dev`.",
      steps: [
        "Your laptop packages an HTTP GET request into wireless radio waves (Wi-Fi).",
        "Your home Wi-Fi router receives the radio wave, converts it to an electrical or optical signal, and forwards it to your Internet Service Provider (ISP).",
        "The ISP routes the request through regional peering exchanges and fiber backbones across the WAN.",
        "The request arrives at the data center server hosting CyberPath.",
        "The server processes the request, loads HTML/CSS/JS, and packages an HTTP 200 OK response back along the reverse path to your browser."
      ]
    },
    keyTerms: [
      { term: "LAN (Local Area Network)", definition: "A network interconnecting devices in a limited geographical area such as a home, school, or office." },
      { term: "WAN (Wide Area Network)", definition: "A telecommunications network spanning large geographic distances, composed of interconnected LANs." },
      { term: "Client", definition: "A hardware device or software program that initiates contact with a server to request data or services." },
      { term: "Server", definition: "A computer program or device that provides functionality and resources for other devices (clients)." },
      { term: "Latency", definition: "The time delay (usually measured in milliseconds) it takes for data to travel from source to destination." },
      { term: "Bandwidth", definition: "The maximum rate of data transfer across a given network path (measured in Mbps or Gbps)." }
    ],
    commonMisconceptions: [
      "Misconception: 'The Internet' and 'The World Wide Web' are identical. Reality: The Internet is the global network infrastructure (cables, routers, servers); the Web (HTTP/HTTPS websites) is merely one application running on top of it, alongside email, gaming, and file transfer.",
      "Misconception: 'Wi-Fi' is the Internet. Reality: Wi-Fi is simply a wireless local cable replacement between your phone and your router. If your ISP modem is unplugged, your Wi-Fi signal remains 100% full, but you have no Internet WAN access."
    ],
    cybersecurityRelevance: `Why does this matter for security?
- **Perimeter Boundaries:** Organizations place firewalls and intrusion prevention systems at the border between their internal LAN and the untrusted WAN.
- **Single Points of Failure:** Understanding topology enables security engineers to eliminate single points of failure so DDoS attacks cannot sever an entire enterprise.
- **Attack Surface:** Every exposed server listening on the WAN is a target for external threat actors.`,
    simulationId: "packet-journey",
    gameId: "build-network",
    quiz: {
      id: "quiz-lan-wan",
      title: "Knowledge Check — LAN, WAN & Architecture",
      passingScore: 75,
      questions: [
        {
          id: "q1",
          questionText: "Which of the following best describes a Local Area Network (LAN)?",
          options: [
            { id: "a", text: "A global network owned and operated by telecommunication providers" },
            { id: "b", text: "A network contained within a small geographic area such as a home or office" },
            { id: "c", text: "A software application used exclusively to browse websites" },
            { id: "d", text: "A protocol used to encrypt hard drive storage" }
          ],
          correctOptionId: "b",
          explanation: "LANs are confined to a localized geographic area (home, office, campus) and are managed by the local owner rather than public ISPs."
        },
        {
          id: "q2",
          questionText: "In the client/server model, what role does a client play?",
          options: [
            { id: "a", text: "It initiates requests for services or resources from a server" },
            { id: "b", text: "It permanently stores the master database for all users" },
            { id: "c", text: "It routes packets between autonomous internet backbones" },
            { id: "d", text: "It assigns public IP addresses to internet service providers" }
          ],
          correctOptionId: "a",
          explanation: "Clients (e.g. web browsers or mobile apps) initiate requests, while servers listen, process, and respond with resources."
        },
        {
          id: "q3",
          questionText: "Which topology connects all devices to a central switch, preventing a single severed cable from disabling the entire network?",
          options: [
            { id: "a", text: "Bus topology" },
            { id: "b", text: "Ring topology" },
            { id: "c", text: "Star topology" },
            { id: "d", text: "Linear cable topology" }
          ],
          correctOptionId: "c",
          explanation: "In a star topology, all devices connect directly to a central switch. If one cable fails, only that single host is disconnected."
        }
      ]
    }
  },

  "switches-routers-mac-ip": {
    slug: "switches-routers-mac-ip",
    title: "Switches, Routers, MAC & IP Addresses",
    levelNumber: 1,
    levelTitle: "Level 1 — Networking Fundamentals",
    estimatedMinutes: 35,
    prerequisites: ["LAN, WAN & The Client/Server Architecture"],
    objectives: [
      "Understand why Layer 2 switches use MAC addresses within a local network",
      "Learn how Layer 3 routers use IP addresses to navigate across multiple networks",
      "Contrast physical burned-in hardware addresses (MAC) with logical routable addresses (IP)",
      "Explore port numbers (0-65535) and how they direct traffic to specific applications"
    ],
    summary: "Switches direct local network traffic using hardware MAC addresses, while routers connect different networks using logical IP addresses. Learn how ports deliver packets to the correct application.",
    analogy: {
      title: "Your Social Security Number vs Your Current Mailing Address",
      text: "A **MAC address** is like your government-issued Social Security Number or fingerprint: it is uniquely assigned to your network card at the factory and stays with that hardware wherever it goes. An **IP address** is like your postal street address: it changes whenever you move from your home Wi-Fi to a coffee shop or airport, telling the global postal system where to deliver your letters right now."
    },
    theory: `### Layer 2: Network Switches & MAC Addresses

A **network switch** operates at Layer 2 (Data Link) of the network. It maintains an internal **MAC Address Table** (CAM table) that maps each physical cable port to the hardware MAC address of the device plugged into that port.

- **MAC Address Format**: 48-bit hexadecimal number, usually displayed as six pairs of hex characters separated by colons or dashes: \`00:1A:2B:3C:4D:5E\`.
- **First 3 Octets (24 bits)**: Organizationally Unique Identifier (OUI) assigned to the hardware manufacturer (e.g., Intel, Apple, Cisco).
- **Last 3 Octets (24 bits)**: Unique serial number assigned to that specific network interface card (NIC).

When Computer A wants to send data to Computer B on the same switch, the switch inspects the destination MAC address and forwards the frame **only** to the port where Computer B is plugged in, preventing collisions.

---

### Layer 3: Routers & IP Addresses

A **router** operates at Layer 3 (Network). Routers are the gateways connecting different networks together (such as your home LAN to your ISP's WAN).

- Switches **do not** route between different networks; they only forward within their local broadcast domain.
- Routers inspect the destination **IP address** (e.g. \`192.168.1.1\` or \`142.250.190.46\`) and consult their **Routing Table** to decide which outbound network interface leads closer to the destination.

---

### Ports: Delivering to the Right Application

An IP address gets a packet to the correct computer, but that computer might be running 20 different programs at once (Discord, Spotify, a web browser, a database). **Port numbers** (0 to 65,535) specify which exact application receives the data.

| Port Number | Protocol | Common Purpose | Security Relevance |
|---|---|---|---|
| **21** | FTP | File Transfer Protocol | Plaintext credentials, unencrypted |
| **22** | SSH | Secure Shell | Encrypted remote terminal administration |
| **25** | SMTP | Simple Mail Transfer | Email transmission between servers |
| **53** | DNS | Domain Name System | Resolves names to IPs; target for poisoning |
| **80** | HTTP | HyperText Transfer Protocol | Cleartext web traffic; vulnerable to sniffing |
| **443** | HTTPS | HTTP Secure (over TLS) | Encrypted web traffic; standard across modern web |
| **3389** | RDP | Remote Desktop Protocol | Windows remote management; frequent brute-force target |`,
    workedExample: {
      title: "Addressing a Packet from End to End",
      scenario: "You send a message to a web server at `203.0.113.50:443`.",
      steps: [
        "Your operating system looks at the destination IP: `203.0.113.50`. Since this is outside your local network, it prepares to send it to your **Default Gateway** (router).",
        "It wraps the data with Layer 4 Port `443` (HTTPS) and Layer 3 IP `203.0.113.50`.",
        "At Layer 2, it sets the destination MAC address to the **Router's MAC address**, because the switch needs to deliver the physical frame to the router.",
        "The router receives the frame, removes the Layer 2 MAC header, inspects the Layer 3 IP, and forwards it across the WAN toward `203.0.113.50`."
      ]
    },
    keyTerms: [
      { term: "MAC Address", definition: "Media Access Control address; a 48-bit unique physical hardware identifier burned into a Network Interface Card (NIC)." },
      { term: "IP Address", definition: "Internet Protocol address; a logical numerical label assigned to each device connected to a computer network." },
      { term: "Switch", definition: "A Layer 2 networking device that forwards data frames between devices on the same local network using MAC addresses." },
      { term: "Router", definition: "A Layer 3 networking device that forwards data packets between different computer networks using IP addresses." },
      { term: "Port Number", definition: "A 16-bit number (0-65535) used by transport protocols (TCP/UDP) to identify specific application processes on a host." }
    ],
    commonMisconceptions: [
      "Misconception: 'Switches and routers do the same job.' Reality: Switches connect devices to create a single local network (LAN) using MAC addresses. Routers connect separate networks together (LAN to WAN) using IP addresses.",
      "Misconception: 'A MAC address cannot be changed because it is burned in.' Reality: While physically burned in by the manufacturer, operating systems can easily spoof or override the transmitted MAC address in software."
    ],
    cybersecurityRelevance: `Why this matters for cybersecurity:
- **Port Scanning:** Ethical hackers and adversaries use scanners like Nmap to probe ports 0-65535 to discover what services and versions are listening.
- **MAC Flooding:** An attacker floods a switch with bogus MAC addresses until the switch's CAM table overflows and it starts broadcasting all traffic to all ports (fail-open), allowing traffic sniffing.
- **Default Credentials:** Exposed routers and management ports (SSH 22, Telnet 23, RDP 3389) are top targets for brute-force credential stuffing.`,
    simulationId: "packet-journey",
    gameId: "build-network",
    quiz: {
      id: "quiz-switches-routers",
      title: "Knowledge Check — Switches, Routers & Addresses",
      passingScore: 75,
      questions: [
        {
          id: "q1",
          questionText: "Which type of address does a Layer 2 switch use to forward frames between devices on the same local network?",
          options: [
            { id: "a", text: "IPv6 address" },
            { id: "b", text: "MAC address" },
            { id: "c", text: "URL / Domain name" },
            { id: "d", text: "TCP port number" }
          ],
          correctOptionId: "b",
          explanation: "Switches maintain a CAM table mapping switch ports to physical MAC addresses to deliver local Layer 2 frames."
        },
        {
          id: "q2",
          questionText: "What is the primary role of a router in a computer network?",
          options: [
            { id: "a", text: "Forwarding packets between different networks based on logical IP addresses" },
            { id: "b", text: "Assigning monitor refresh rates to graphic cards" },
            { id: "c", text: "Translating human speech into binary code" },
            { id: "d", text: "Replacing physical cables with Wi-Fi passwords" }
          ],
          correctOptionId: "a",
          explanation: "Routers operate at Layer 3 to connect separate networks (such as a private home LAN and the public Internet WAN) using IP routing tables."
        },
        {
          id: "q3",
          questionText: "Which well-known port is standard for secure, encrypted web traffic (HTTPS)?",
          options: [
            { id: "a", text: "Port 21" },
            { id: "b", text: "Port 25" },
            { id: "c", text: "Port 80" },
            { id: "d", text: "Port 443" }
          ],
          correctOptionId: "d",
          explanation: "Port 443 is reserved for HTTPS (HTTP over TLS), while port 80 is unencrypted plaintext HTTP."
        }
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────
  // LEVEL 2: OSI & TCP/IP MODELS
  // ─────────────────────────────────────────────────────────────
  "the-7-osi-layers-and-tcpip": {
    slug: "the-7-osi-layers-and-tcpip",
    title: "The 7 OSI Layers & The TCP/IP Suite",
    levelNumber: 2,
    levelTitle: "Level 2 — OSI & TCP/IP Models",
    estimatedMinutes: 35,
    prerequisites: ["Switches, Routers, MAC & IP Addresses"],
    objectives: [
      "Memorize and explain all 7 layers of the OSI reference model (Physical to Application)",
      "Compare the 7-layer OSI conceptual model with the practical 4-layer TCP/IP suite",
      "Trace how user data travels down the sender's stack and up the receiver's stack"
    ],
    summary: "The Open Systems Interconnection (OSI) 7-layer model provides the universal architectural framework for understanding network communication and isolating security vulnerabilities.",
    analogy: {
      title: "Shipping an International Commercial Order",
      text: "Imagine ordering custom goods from Tokyo: The creator drafts the product concept (Application), translates the manual into English (Presentation), opens a commercial invoice contract (Session), packs parts into numbered crates with arrival checks (Transport), addresses crates with country and postal codes (Network), places crates inside intermodal shipping containers (Data Link), and loads containers onto a cargo ship crossing the physical ocean (Physical)."
    },
    theory: `### The 7 Layers of the OSI Model

Mnemonic to remember from Layer 7 down to Layer 1:  
**A**ll **P**eople **S**eem **T**o **N**eed **D**ata **P**rocessing  
*(Application, Presentation, Session, Transport, Network, Data Link, Physical)*

Mnemonic from Layer 1 up to Layer 7:  
**P**lease **D**o **N**ot **T**hrow **S**ausage **P**izza **A**way!

| # | Layer Name | Protocol Data Unit (PDU) | Primary Function | Example Protocols / Devices |
|---|---|---|---|---|
| **7** | **Application** | Data | User-facing network services & APIs | HTTP, HTTPS, DNS, SSH, FTP, SMTP |
| **6** | **Presentation** | Data | Data formatting, encryption, compression | TLS/SSL, ASCII, JPEG, JSON |
| **5** | **Session** | Data | Establishes, manages, and terminates sessions | RPC, NetBIOS, SOCKS |
| **4** | **Transport** | Segment (TCP) / Datagram (UDP) | End-to-end reliability, flow control, ports | TCP, UDP |
| **3** | **Network** | Packet | Logical addressing (IP) & path routing | IPv4, IPv6, ICMP, Routers |
| **2** | **Data Link** | Frame | Physical addressing (MAC), error detection | Ethernet, Wi-Fi (802.11), Switches |
| **1** | **Physical** | Bits (1s and 0s) | Electrical signals, radio waves, light pulses | Cables (Cat6, Fiber), Hubs, Radio |

---

### The Real-World TCP/IP Model

While the OSI model is an invaluable conceptual reference, the real Internet runs on the **TCP/IP Model (DoD Model)**, which consolidates the upper three layers:

\`\`\`
   OSI 7-Layer Model              TCP/IP 4-Layer Model
┌─────────────────────────┐     ┌─────────────────────────┐
│ Layer 7: Application   │ ──┐  │                         │
│ Layer 6: Presentation  │ ──┼─ │ Layer 4: Application    │
│ Layer 5: Session       │ ──┘  │ (HTTP, DNS, SSH, TLS)   │
├─────────────────────────┤     ├─────────────────────────┤
│ Layer 4: Transport     │ ───> │ Layer 3: Transport      │
│                         │     │ (TCP, UDP)              │
├─────────────────────────┤     ├─────────────────────────┤
│ Layer 3: Network       │ ───> │ Layer 2: Internet       │
│                         │     │ (IPv4, IPv6, ICMP)      │
├─────────────────────────┤     ├─────────────────────────┤
│ Layer 2: Data Link     │ ──┐  │ Layer 1: Network Access │
│ Layer 1: Physical      │ ──┴─ │ (Ethernet, Wi-Fi, MAC)  │
└─────────────────────────┘     └─────────────────────────┘
\`\`\``,
    workedExample: {
      title: "Layer Troubleshooting Methodology",
      scenario: "A user submits a helpdesk ticket: 'I cannot open any websites on my computer.'",
      steps: [
        "**Layer 1 (Physical):** Is the Ethernet cable plugged in? Is the Wi-Fi card enabled? Is the link light blinking?",
        "**Layer 2 (Data Link):** Is the computer getting a valid MAC link with the switch? Any frame errors?",
        "**Layer 3 (Network):** Does the computer have a valid IP address and can it ping its Default Gateway router?",
        "**Layer 4 (Transport):** Can a TCP connection to port 443 be established?",
        "**Layer 7 (Application):** Is DNS properly resolving `google.com` to an IP, and is the web server returning HTTP responses?"
      ]
    },
    keyTerms: [
      { term: "OSI Reference Model", definition: "A 7-layer conceptual framework developed by ISO that standardizes network telecommunications functions." },
      { term: "TCP/IP Model", definition: "A 4-layer practical protocol architecture that powers the global Internet." },
      { term: "PDU (Protocol Data Unit)", definition: "The specific name for a unit of data processed at a particular layer (Data, Segment, Packet, Frame, Bits)." },
      { term: "Layer 7 (Application)", definition: "The top layer interfacing with software applications to provide communication services." },
      { term: "Layer 3 (Network)", definition: "The layer responsible for logical host addressing and routing packets across multiple networks." },
      { term: "Layer 2 (Data Link)", definition: "The layer responsible for hop-to-hop frame transfer across a single physical network segment using MAC addresses." }
    ],
    commonMisconceptions: [
      "Misconception: 'The web browser software is Layer 7.' Reality: The web browser application itself (Chrome, Firefox) is an operating system user program; Layer 7 refers to the communication protocol it uses (HTTP/HTTPS) and the network APIs it calls.",
      "Misconception: 'The Internet strictly implements the OSI model.' Reality: The Internet was designed and implemented using the TCP/IP stack; the OSI model is a theoretical pedagogical reference."
    ],
    cybersecurityRelevance: `Mapping Cybersecurity Attacks to OSI Layers:
- **Layer 7:** SQL Injection, Cross-Site Scripting (XSS), CSRF, API abuse.
- **Layer 6:** SSL/TLS downgrade attacks, certificate forgery.
- **Layer 4:** SYN flood DoS, port scans, TCP session hijacking.
- **Layer 3:** IP address spoofing, Ping of Death, ICMP floods.
- **Layer 2:** ARP poisoning, MAC flooding, VLAN hopping.
- **Layer 1:** Physical cable tapping, Wi-Fi jamming, rogue hardware keyloggers.`,
    simulationId: "osi-encapsulation",
    gameId: "packet-sorting",
    quiz: {
      id: "quiz-osi-model",
      title: "Knowledge Check — OSI & TCP/IP Models",
      passingScore: 75,
      questions: [
        {
          id: "q1",
          questionText: "What is the correct PDU (Protocol Data Unit) name for data at Layer 3 (Network layer)?",
          options: [
            { id: "a", text: "Frame" },
            { id: "b", text: "Packet" },
            { id: "c", text: "Segment" },
            { id: "d", text: "Bit" }
          ],
          correctOptionId: "b",
          explanation: "At Layer 3 (Network), the PDU is called a **Packet**. At Layer 4 it is a Segment, at Layer 2 a Frame, and at Layer 1 Bits."
        },
        {
          id: "q2",
          questionText: "Which layer of the OSI model is responsible for end-to-end flow control, reliability, and port multiplexing?",
          options: [
            { id: "a", text: "Layer 2 — Data Link" },
            { id: "b", text: "Layer 4 — Transport" },
            { id: "c", text: "Layer 1 — Physical" },
            { id: "d", text: "Layer 3 — Network" }
          ],
          correctOptionId: "b",
          explanation: "Layer 4 (Transport), dominated by TCP and UDP, provides port-based multiplexing, segmentation, and reliability."
        },
        {
          id: "q3",
          questionText: "How does the TCP/IP 4-layer model consolidate the 7 OSI layers?",
          options: [
            { id: "a", text: "It combines OSI Layers 5, 6, and 7 into a single Application layer" },
            { id: "b", text: "It removes the Transport layer completely" },
            { id: "c", text: "It splits the Network layer into 4 separate layers" },
            { id: "d", text: "It does not include any physical or hardware transmission" }
          ],
          correctOptionId: "a",
          explanation: "The TCP/IP model merges OSI Session (5), Presentation (6), and Application (7) into one unified Application layer."
        }
      ]
    }
  },

  "encapsulation-pdu-tcp-vs-udp": {
    slug: "encapsulation-pdu-tcp-vs-udp",
    title: "Encapsulation, PDUs & TCP vs UDP",
    levelNumber: 2,
    levelTitle: "Level 2 — OSI & TCP/IP Models",
    estimatedMinutes: 35,
    prerequisites: ["The 7 OSI Layers & The TCP/IP Suite"],
    objectives: [
      "Understand how headers are wrapped around data: Data -> Segment -> Packet -> Frame -> Bits",
      "Explain the reverse process: decapsulation as data ascends the receiver's stack",
      "Contrast connection-oriented reliable TCP with connectionless lightweight UDP",
      "Identify real-world use cases for TCP (web, file transfer) versus UDP (voice, streaming, DNS)"
    ],
    summary: "As data moves down the network stack, each layer wraps it with specialized metadata headers. At Layer 4, learn the crucial trade-offs between reliable TCP and lightning-fast UDP.",
    analogy: {
      title: "Russian Nesting Dolls & Certified Mail vs Postcards",
      text: "**Encapsulation** is like Russian nesting dolls (Matryoshka): your application data sits in the innermost doll. Layer 4 wraps it in a Segment doll; Layer 3 wraps that inside an IP Packet doll; Layer 2 wraps that inside an Ethernet Frame doll.  \n**TCP vs UDP**: TCP is like sending certified legal mail where the carrier requires a signature, tracks every checkpoint, and re-sends if lost. UDP is like a live radio broadcast or shouting news out a window: fast and lightweight, but if you blink, the words are gone."
    },
    theory: `### The Encapsulation Journey

When an application transmits data, it descends through the layers in a process called **Encapsulation**:

1. **Application Layer (Layer 7)** creates the raw payload (e.g., HTTP \`GET /index.html\`).
2. **Transport Layer (Layer 4)** adds a **TCP or UDP header** containing source and destination port numbers. PDU = **Segment**.
3. **Network Layer (Layer 3)** adds an **IP header** containing source and destination IP addresses. PDU = **Packet**.
4. **Data Link Layer (Layer 2)** adds an **Ethernet header** (source & destination MAC addresses) and a **Frame Check Sequence (FCS)** trailer at the end for error checking. PDU = **Frame**.
5. **Physical Layer (Layer 1)** converts the entire frame into a stream of electrical voltages, radio pulses, or light flashes (**Bits**).

When the receiving host picks up the bits, it performs **Decapsulation** in reverse, stripping off headers layer by layer until the pure application payload reaches the recipient software.

---

### TCP vs UDP Comparison

| Feature | TCP (Transmission Control Protocol) | UDP (User Datagram Protocol) |
|---|---|---|
| **Connection State** | **Connection-oriented** (requires 3-way handshake) | **Connectionless** (fire and forget) |
| **Reliability** | **Guaranteed delivery** (acknowledgments & retransmissions) | **Best-effort** (dropped packets are NOT retransmitted) |
| **Ordering** | **Guaranteed in-order** using Sequence numbers | Packets may arrive out of order |
| **Header Size** | Larger (20–60 bytes) | Minimal (strictly 8 bytes) |
| **Speed & Overhead** | Higher latency and processing overhead | Minimal latency, maximum throughput |
| **Flow & Congestion Control**| Built-in dynamic windowing adjusts to network speed | None; sends at whatever rate the application dictates |
| **Typical Use Cases** | Web (HTTP/S), Email (SMTP), File Transfer (FTP), SSH | DNS queries, VoIP calls, Online Gaming, Video streaming |`,
    workedExample: {
      title: "Why Online Games Choose UDP",
      scenario: "In a multiplayer first-person shooter, your character's position is updated 60 times per second.",
      steps: [
        "If the game used **TCP**: Packet #14 (your coordinate 15 milliseconds ago) gets dropped due to Wi-Fi jitter.",
        "TCP stops the entire stream, waits for a timeout, retransmits Packet #14, and buffers subsequent packets.",
        "Your character freezes, and then teleports backward in time (rubber-banding).",
        "Because the game uses **UDP**: When Packet #14 is dropped, it is simply ignored because Packet #15 (your current position right now) is already arriving!",
        "Real-time relevance always beats historical retransmission in live audio and fast gaming."
      ]
    },
    keyTerms: [
      { term: "Encapsulation", definition: "The process where each lower layer wraps protocol-specific headers around higher-layer data units." },
      { term: "Decapsulation", definition: "The reverse process performed by the recipient, stripping away headers to extract the payload." },
      { term: "TCP", definition: "A connection-oriented transport protocol providing reliable, ordered, and error-checked data stream delivery." },
      { term: "UDP", definition: "A lightweight, connectionless transport protocol prioritizing speed and low overhead without delivery guarantees." },
      { term: "Header", definition: "Metadata prepended to a data payload containing addressing, flags, and protocol control instructions." }
    ],
    commonMisconceptions: [
      "Misconception: 'UDP is a broken or inferior protocol because it drops data.' Reality: UDP is deliberately designed to be lightweight. For live video conferencing (Zoom) or DNS, a tiny speed gain is worth an occasional lost frame.",
      "Misconception: 'Packets and frames can be used interchangeably.' Reality: A packet is Layer 3 (contains IP headers). A frame is Layer 2 (contains MAC headers and checksum trailer)."
    ],
    cybersecurityRelevance: `Cybersecurity implications:
- **TCP SYN Floods:** Exploits TCP's connection state memory by sending thousands of SYN requests without completing the handshake.
- **UDP Amplification & Spoofing:** Because UDP is connectionless and doesn't verify identity, attackers spoof the victim's IP in requests to open DNS/NTP servers, bouncing massive responses at the victim.
- **Deep Packet Inspection (DPI):** Security firewalls unpack the encapsulation layers to inspect whether a TCP stream on port 80 contains legitimate HTTP or malicious malware beacons.`,
    simulationId: "osi-encapsulation",
    gameId: "follow-packet",
    quiz: {
      id: "quiz-encapsulation-tcp-udp",
      title: "Knowledge Check — Encapsulation & Transport",
      passingScore: 75,
      questions: [
        {
          id: "q1",
          questionText: "What is the process of adding headers and trailers to data as it moves down through the network layers called?",
          options: [
            { id: "a", text: "Decapsulation" },
            { id: "b", text: "Fragmentation" },
            { id: "c", text: "Encapsulation" },
            { id: "d", text: "Subnetting" }
          ],
          correctOptionId: "c",
          explanation: "Encapsulation is the sequential addition of layer-specific headers (and Layer 2 trailers) as data descends the stack."
        },
        {
          id: "q2",
          questionText: "Why is UDP preferred over TCP for live voice communications and online multiplayer gaming?",
          options: [
            { id: "a", text: "UDP guarantees 100% of packets will be received without any loss" },
            { id: "b", text: "UDP has lower overhead and avoids stalling for retransmissions of obsolete data" },
            { id: "c", text: "UDP encrypts all transmissions automatically with 256-bit AES" },
            { id: "d", text: "UDP uses MAC addresses instead of IP addresses" }
          ],
          correctOptionId: "b",
          explanation: "UDP's minimal 8-byte header and lack of retransmission delays make it ideal for real-time applications where immediate data matters more than replaying dropped packets."
        },
        {
          id: "q3",
          questionText: "What header is attached at Layer 3 (Network Layer) during encapsulation?",
          options: [
            { id: "a", text: "Ethernet MAC Header" },
            { id: "b", text: "TCP Header" },
            { id: "c", text: "IP Header" },
            { id: "d", text: "HTTP Header" }
          ],
          correctOptionId: "c",
          explanation: "Layer 3 attaches the IP Header (containing source and destination IP addresses) to create an IP packet."
        }
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────
  // LEVEL 3: IP ADDRESSING & SUBNETTING
  // ─────────────────────────────────────────────────────────────
  "ipv4-binary-and-cidr": {
    slug: "ipv4-binary-and-cidr",
    title: "IPv4 Architecture, Octets & CIDR Notation",
    levelNumber: 3,
    levelTitle: "Level 3 — IP Addressing & Subnetting",
    estimatedMinutes: 40,
    prerequisites: ["Encapsulation, PDUs & TCP vs UDP"],
    objectives: [
      "Understand the 32-bit architecture of IPv4 addresses and convert octets to binary",
      "Interpret subnet masks and Classless Inter-Domain Routing (CIDR) slash notation",
      "Calculate the total and usable host count for any CIDR prefix using 2^(32-N) - 2"
    ],
    summary: "IPv4 addresses are 32-bit numbers divided into four 8-bit octets. Learn how subnet masks and CIDR slash notation divide networks into manageable, efficient sub-networks.",
    analogy: {
      title: "Telephone Area Codes & Apartment Room Numbers",
      text: "Consider a telephone number like `+1 (415) 555-0199`. The country code `+1` and area code `415` tell the telephone exchange which city you are calling (the **Network portion**). The remaining digits identify your specific handset (the **Host portion**). A subnet mask is simply the dividing line that tells the router where the city code ends and the personal telephone line begins."
    },
    theory: `### Anatomy of an IPv4 Address

An **IPv4 address** is exactly **32 bits (4 bytes)** long, expressed as four decimal numbers separated by dots (dotted-decimal notation):  
\`192.168.1.10\`

Each number is an **octet** representing 8 binary bits (values 0 through 255):

\`\`\`
Decimal:      192    .    168    .     1     .     10
Binary:    11000000  .  10101000 .  00000001 .  00001010
\`\`\`

With 32 bits, the absolute maximum theoretical IPv4 address space is:  
$2^{32} = 4,294,967,296$ (~4.3 billion addresses).

---

### Subnet Masks & CIDR Notation

Every IP address is split into two parts:
1. **Network ID**: Identifies the specific network or subnet.
2. **Host ID**: Identifies the specific device on that network.

The **Subnet Mask** uses contiguous binary \`1\`s to designate the network bits, and contiguous \`0\`s for the host bits:
- Mask: \`255.255.255.0\`
- In Binary: \`11111111.11111111.11111111.00000000\` (24 ones, 8 zeros).

In **CIDR notation** (Classless Inter-Domain Routing), we represent this simply as a slash followed by the number of ones: **/24**.

---

### The Host Calculation Formula

To calculate how many devices can fit on any subnet:
$$\\text{Total IP Addresses} = 2^{(32 - \\text{CIDR})}$$
$$\\text{Usable Hosts} = 2^{(32 - \\text{CIDR})} - 2$$

*(Why subtract 2? Because the very first address is reserved as the **Network ID**, and the very last address is reserved as the **Broadcast address**!)*

| CIDR Prefix | Subnet Mask | Total Addresses | Usable Hosts | Typical Deployment |
|---|---|---|---|---|
| **/24** | \`255.255.255.0\` | 256 | **254** | Standard small office or home LAN |
| **/25** | \`255.255.255.128\`| 128 | **126** | Departmental subnet (Engineering vs HR) |
| **/26** | \`255.255.255.192\`| 64 | **62** | Server farm or branch lab |
| **/28** | \`255.255.255.240\`| 16 | **14** | Demilitarized Zone (DMZ) |
| **/30** | \`255.255.255.252\`| 4 | **2** | Point-to-point router uplink |
| **/32** | \`255.255.255.255\`| 1 | **1** | A single host address (firewall rule) |`,
    workedExample: {
      title: "Calculating a /28 Subnet",
      scenario: "Your team creates a DMZ subnet for public web servers: `192.168.10.0/28`.",
      steps: [
        "1. Host bits remaining: $32 - 28 = 4$ host bits.",
        "2. Total IP addresses: $2^4 = 16$.",
        "3. Network ID (first address): `192.168.10.0`.",
        "4. Broadcast address (last address): `192.168.10.15`.",
        "5. Usable host range: `192.168.10.1` through `192.168.10.14` (exactly 14 usable servers)."
      ]
    },
    keyTerms: [
      { term: "Octet", definition: "A group of 8 binary bits; IPv4 addresses consist of four octets totaling 32 bits." },
      { term: "Subnet Mask", definition: "A 32-bit mask used to divide an IP address into network and host portions." },
      { term: "CIDR Notation", definition: "Classless Inter-Domain Routing; compact slash notation indicating the number of network bits (e.g. /24)." },
      { term: "Usable Hosts", definition: "The assignable IP addresses in a subnet, equal to 2^(host bits) - 2." }
    ],
    commonMisconceptions: [
      "Misconception: 'A higher CIDR number (/28 vs /24) means a bigger network.' Reality: The CIDR number counts network bits. Higher numbers leave FEWER host bits, making the subnet smaller! /24 has 254 hosts; /28 has only 14 hosts.",
      "Misconception: 'You can assign the first and last IP of any subnet to a computer.' Reality: The first is always the Network identifier, and the last is the Broadcast address. Assigning either to an interface causes an OS error."
    ],
    cybersecurityRelevance: `Subnetting in Cybersecurity:
- **Network Segmentation:** Dividing an enterprise into subnets (e.g. Finance /26, Guest Wi-Fi /24, Database /28) prevents an attacker who compromises a guest laptop from accessing payroll servers.
- **Firewall Rulesets:** Security analysts define ACLs using CIDR: e.g. \`ALLOW 10.0.1.0/24 TO 192.168.5.10:3306\`.
- **Target Scoping:** When conducting authorized penetration testing, clients provide scope documents formatted in CIDR blocks (e.g. "Scope: \`203.0.113.0/28\`"). Scanning outside that block violates laws.`,
    simulationId: "subnet-visualizer",
    gameId: "subnet-challenge",
    quiz: {
      id: "quiz-ipv4-cidr",
      title: "Knowledge Check — IPv4 & CIDR Notation",
      passingScore: 75,
      questions: [
        {
          id: "q1",
          questionText: "How many total bits make up an IPv4 address?",
          options: [
            { id: "a", text: "16 bits" },
            { id: "b", text: "32 bits" },
            { id: "c", text: "64 bits" },
            { id: "d", text: "128 bits" }
          ],
          correctOptionId: "b",
          explanation: "IPv4 addresses consist of 32 bits, grouped into four 8-bit octets."
        },
        {
          id: "q2",
          questionText: "How many usable host IP addresses are available in a /24 IPv4 subnet?",
          options: [
            { id: "a", text: "256" },
            { id: "b", text: "254" },
            { id: "c", text: "128" },
            { id: "d", text: "512" }
          ],
          correctOptionId: "b",
          explanation: "A /24 subnet has 8 host bits: 2^8 = 256 total addresses. Subtracting Network and Broadcast yields 254 usable host addresses."
        },
        {
          id: "q3",
          questionText: "Why must 2 addresses always be subtracted when calculating usable hosts for a standard subnet?",
          options: [
            { id: "a", text: "One is reserved for the switch and one for the firewall" },
            { id: "b", text: "The first is the Network ID and the last is the Broadcast address" },
            { id: "c", text: "One is reserved for DNS and one for DHCP" },
            { id: "d", text: "To account for wireless interference" }
          ],
          correctOptionId: "b",
          explanation: "The first address in any block identifies the network itself, and the last is used to broadcast to all nodes in that subnet; neither can be assigned to a host interface."
        }
      ]
    }
  },

  "network-broadcast-and-gateways": {
    slug: "network-broadcast-and-gateways",
    title: "Network Bounds, Private RFC 1918 & Default Gateways",
    levelNumber: 3,
    levelTitle: "Level 3 — IP Addressing & Subnetting",
    estimatedMinutes: 40,
    prerequisites: ["IPv4 Architecture, Octets & CIDR Notation"],
    objectives: [
      "Determine the exact Network ID and Broadcast address for any given subnet",
      "Recognize private RFC 1918 address ranges (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16)",
      "Explain the crucial role of the Default Gateway in routing packets off the local network"
    ],
    summary: "Discover how devices decide whether a destination is on the local floor or requires the Default Gateway router, and why RFC 1918 private IP addresses power modern enterprise networks.",
    analogy: {
      title: "Local Intercom vs The Airport Security Exit",
      text: "When you want to speak with someone in your home, you speak directly across the room without passing through security. But if you want to travel to another country, you MUST pass through the airport international gate (**Default Gateway**). The **Default Gateway** is the single doorway every computer uses whenever it needs to send a packet to an address outside its own subnet."
    },
    theory: `### Private IP Addresses (RFC 1918)

Because IPv4's 4.3 billion address space was depleting rapidly, the Internet Engineering Task Force (IETF) reserved three dedicated blocks for **private internal networks**. These addresses are **non-routable** on the public Internet:

| Class | RFC 1918 Range | CIDR Prefix | Total Addresses | Typical Use Case |
|---|---|---|---|---|
| **Class A** | \`10.0.0.0\` – \`10.255.255.255\` | \`10.0.0.0/8\` | ~16.7 million | Large corporations, cloud VPCs, data centers |
| **Class B** | \`172.16.0.0\` – \`172.31.255.255\`| \`172.16.0.0/12\` | ~1.04 million | Universities, medium enterprises |
| **Class C** | \`192.168.0.0\` – \`192.168.255.255\`| \`192.168.0.0/16\`| 65,536 | Home Wi-Fi routers, small branch offices |

Any packet with a destination IP in these ranges will be immediately dropped by Internet backbone routers. Devices use **NAT (Network Address Translation)** on their border router to share a single public IP address when accessing the Internet.

---

### Special IPv4 Addresses

- **Loopback Address**: \`127.0.0.1\` (or any in \`127.0.0.0/8\`). Points back to the local machine's own TCP/IP stack. Used for local testing and internal inter-process communication.
- **APIPA (Automatic Private IP Addressing)**: \`169.254.0.0/16\`. If a computer is set to DHCP but receives no response from a DHCP server, the OS automatically assigns itself a link-local \`169.254.x.x\` address (a classic red flag that DHCP is broken!).

---

### The Routing Decision: Local vs Remote

When Computer A (\`192.168.1.50/24\`) sends a packet to an IP address:
1. It compares the destination IP against its own subnet mask (\`255.255.255.0\`).
2. **If destination is in \`192.168.1.0/24\`**: "It is local!" Computer A sends an **ARP request** directly to find the destination computer's MAC address and sends the frame via the local switch.
3. **If destination is NOT in \`192.168.1.0/24\`** (e.g. \`8.8.8.8\`): "It is remote!" Computer A sends the frame to its **Default Gateway** (e.g. \`192.168.1.1\`), trusting the router to navigate across external networks.`,
    workedExample: {
      title: "Troubleshooting a 'No Internet' Incident",
      scenario: "A laptop cannot load web pages. You run `ipconfig` or `ifconfig` in terminal.",
      steps: [
        "Case 1: IP is `169.254.12.88`. Diagnosis: APIPA address! The laptop failed to get a DHCP response from the router. Check the Ethernet cable or DHCP service.",
        "Case 2: IP is `192.168.1.150`, Subnet Mask is `255.255.255.0`, but Default Gateway is blank or `0.0.0.0`. Diagnosis: The computer can talk to local computers on the switch, but cannot reach the outside world because it has no gateway configured!",
        "Fix: Assign Default Gateway `192.168.1.1`. The computer immediately routes external traffic out."
      ]
    },
    keyTerms: [
      { term: "Default Gateway", definition: "The node (usually a router) on a computer network that serves as an access point to another network." },
      { term: "RFC 1918", definition: "The technical specification defining the private non-routable IPv4 address ranges (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16)." },
      { term: "Loopback (127.0.0.1)", definition: "A reserved IP address routing back to the local host itself for testing and local services." },
      { term: "APIPA (169.254.x.x)", definition: "Automatic Private IP Addressing assigned by an OS when DHCP negotiation fails." }
    ],
    commonMisconceptions: [
      "Misconception: 'My home IP is 192.168.1.15, so someone in another country can hack into my laptop directly by typing 192.168.1.15.' Reality: Millions of homes simultaneously use 192.168.1.15! Private IPs are unroutable on the Internet; external attackers only see your router's public WAN IP.",
      "Misconception: 'If you have an IP address, you can access the Internet.' Reality: If your Default Gateway is wrong or missing, you are trapped inside your local LAN and cannot reach any external server."
    ],
    cybersecurityRelevance: `Defensive Relevance:
- **Default Gateway Hijacking:** Attackers use ARP spoofing to trick local machines into believing the attacker's machine is the Default Gateway, capturing all outbound Internet traffic (Man-in-the-Middle).
- **Network Pivoting:** When penetration testers compromise a public-facing server, they discover internal private RFC 1918 interfaces (e.g. \`10.10.20.0/24\`) and pivot inward to exploit unprotected internal databases.`,
    simulationId: "subnet-visualizer",
    gameId: "subnet-challenge",
    quiz: {
      id: "quiz-bounds-gateways",
      title: "Knowledge Check — Private IPs & Gateways",
      passingScore: 75,
      questions: [
        {
          id: "q1",
          questionText: "Which of the following is a private IPv4 address block defined under RFC 1918?",
          options: [
            { id: "a", text: "8.8.8.0/24" },
            { id: "b", text: "10.0.0.0/8" },
            { id: "c", text: "1.1.1.0/24" },
            { id: "d", text: "128.0.0.0/16" }
          ],
          correctOptionId: "b",
          explanation: "RFC 1918 reserves 10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16 for private internal use."
        },
        {
          id: "q2",
          questionText: "If a computer's network interface displays an IP address starting with 169.254.x.x, what does this indicate?",
          options: [
            { id: "a", text: "The computer has connected directly to Google DNS" },
            { id: "b", text: "The computer failed to obtain an IP lease from a DHCP server (APIPA fallback)" },
            { id: "c", text: "The network card is infected with ransomware" },
            { id: "d", text: "The computer is operating on a high-speed fiber link" }
          ],
          correctOptionId: "b",
          explanation: "169.254.x.x is an APIPA (Automatic Private IP Addressing) address assigned automatically by the OS when DHCP fails to respond."
        },
        {
          id: "q3",
          questionText: "What is the primary function of a host's configured Default Gateway?",
          options: [
            { id: "a", text: "To encrypt hard drive files during sleep mode" },
            { id: "b", text: "To forward packets destined for external networks outside the local subnet" },
            { id: "c", text: "To convert optical signals into audio waves" },
            { id: "d", text: "To assign unique MAC addresses to network cards" }
          ],
          correctOptionId: "b",
          explanation: "When a host determines that a destination IP is outside its local subnet, it forwards the packet to its Default Gateway router."
        }
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────
  // LEVEL 4: CORE NETWORK PROTOCOLS
  // ─────────────────────────────────────────────────────────────
  "arp-dns-dhcp-icmp": {
    slug: "arp-dns-dhcp-icmp",
    title: "Address Resolution, DHCP & DNS Lookup",
    levelNumber: 4,
    levelTitle: "Level 4 — Core Network Protocols",
    estimatedMinutes: 45,
    prerequisites: ["Network Bounds, Private RFC 1918 & Default Gateways"],
    objectives: [
      "Trace how ARP maps known Layer 3 IPs to unknown Layer 2 MAC addresses via broadcasts",
      "Follow the 4-step DHCP lease process (DORA: Discover, Offer, Request, Acknowledge)",
      "Step through hierarchical DNS queries across Root, TLD, and Authoritative servers",
      "Understand how ICMP Echo Requests and Replies diagnose connectivity and latency"
    ],
    summary: "Discover the unsung heroes of the protocol suite: ARP finds hardware MACs, DHCP configures network settings automatically, DNS translates names to numbers, and ICMP tests reachability.",
    analogy: {
      title: "The Hotel Check-In & The Concierge",
      text: "- **DHCP** is checking into a luxury hotel: the receptionist hands you a keycard with your room number (IP), a map of the premises (Subnet Mask & Default Gateway), and the phone number for reception (DNS Server).\n- **ARP** is shouting in the hotel lobby: 'Who is Mr. Watson? Please step forward so I can hand you this envelope!'\n- **DNS** is the hotel concierge: you ask, 'Where is the Eiffel Tower?', and the concierge provides the exact street address and coordinates."
    },
    theory: `### 1. ARP (Address Resolution Protocol)

An IP address gets a packet through routers, but within a local Ethernet segment, switches only forward based on **MAC addresses**.
When Host A wants to talk to Host B (\`192.168.1.20\`) for the first time:
1. **ARP Request (Broadcast)**: Host A sends a broadcast frame to destination MAC \`FF:FF:FF:FF:FF:FF\`: *"Who has 192.168.1.20? Tell 192.168.1.10!"* Every device on the switch receives this frame.
2. **ARP Reply (Unicast)**: Only Host B responds back directly to Host A: *"192.168.1.20 is at MAC 00:1A:2B:3C:4D:5E"*.
3. Host A stores this in its **ARP Cache** for future communication.

---

### 2. DHCP (Dynamic Host Configuration Protocol)

Instead of manually typing an IP, subnet mask, gateway, and DNS on every phone and laptop, **DHCP** automates this via the **DORA** handshake:
1. **D - Discover**: Client broadcasts: *"Are there any DHCP servers available?"*
2. **O - Offer**: DHCP server responds: *"I can lease you IP 192.168.1.105 for 24 hours."*
3. **R - Request**: Client replies: *"Yes, please! I accept the lease for 192.168.1.105."*
4. **A - Acknowledge**: Server confirms: *"Lease confirmed. Your Gateway is 192.168.1.1, DNS is 1.1.1.1."*

---

### 3. DNS (Domain Name System)

Humans remember names (\`cyberpath.dev\`); routers require numbers (\`142.250.190.46\`).
When you query a domain:
1. **Local Cache / Hosts file**: Checks if recently resolved.
2. **Recursive Resolver (e.g. 1.1.1.1 or ISP)**: Does the legwork.
3. **Root Nameservers (.)**: 13 global root server clusters direct the resolver to the **Top-Level Domain (TLD)** server.
4. **TLD Server (.dev / .com)**: Points to the **Authoritative Nameserver** for that specific domain.
5. **Authoritative Nameserver**: Returns the actual **A Record** (IPv4) or **AAAA Record** (IPv6).

---

### 4. ICMP (Internet Control Message Protocol)

Used for diagnostics and error reporting. Does not carry application user data.
- **Type 8 / Code 0**: Echo Request (Ping outgoing).
- **Type 0 / Code 0**: Echo Reply (Ping response).
- **Type 3**: Destination Unreachable (Port, Host, or Network).
- **Type 11**: Time Exceeded (TTL expired, used by Traceroute).`,
    workedExample: {
      title: "Stepping Through an ARP Cache Inspection",
      scenario: "You want to inspect your own machine's ARP cache in the command line.",
      steps: [
        "Open a terminal and type: `arp -a`.",
        "You will see a table of Internet Addresses (IPs) mapped directly to Physical Addresses (MACs).",
        "Notice the entry for your Default Gateway (e.g. `192.168.1.1 -> a4:91:b1:2c:3d:4e`).",
        "If you see multiple different IP addresses pointing to the *exact same* MAC address unexpectedly, that can be a warning sign of an ongoing ARP poisoning attack!"
      ]
    },
    keyTerms: [
      { term: "ARP", definition: "Address Resolution Protocol; maps a known IP address to an unknown physical MAC address on a local network." },
      { term: "DHCP", definition: "Dynamic Host Configuration Protocol; automatically assigns IP addresses, subnet masks, and DNS servers to network clients." },
      { term: "DNS", definition: "Domain Name System; the hierarchical distributed database that translates human-friendly domain names to numerical IP addresses." },
      { term: "ICMP", definition: "Internet Control Message Protocol; network-layer protocol used for diagnostics, error messaging, and reachability tests (Ping)." },
      { term: "A Record", definition: "A DNS record that maps a domain name directly to an IPv4 address." }
    ],
    commonMisconceptions: [
      "Misconception: 'ARP works across the entire Internet.' Reality: ARP uses Layer 2 broadcasts (`FF:FF:FF:FF:FF:FF`), which are blocked by routers. ARP only operates within a single local broadcast domain.",
      "Misconception: 'DNS servers store web pages.' Reality: DNS is only an address phonebook. It returns an IP address; your browser then connects to that IP using HTTP/HTTPS to download the actual webpage."
    ],
    cybersecurityRelevance: `Vulnerabilities in Core Protocols:
- **ARP Poisoning / Spoofing:** Because ARP has zero authentication, any device on the Wi-Fi can send fake ARP replies claiming *"I am the Default Gateway!"*, intercepting all traffic.
- **DNS Cache Poisoning:** An attacker injects false DNS records into a recursive resolver, redirecting users visiting \`bank.com\` to a malicious clone.
- **DHCP Starvation:** An attacker exhausts all available IPs in a DHCP pool using spoofed MACs, then deploys a rogue DHCP server providing malicious DNS settings.`,
    simulationId: "dns-resolution",
    gameId: "follow-packet",
    quiz: {
      id: "quiz-core-protocols",
      title: "Knowledge Check — ARP, DHCP, DNS & ICMP",
      passingScore: 75,
      questions: [
        {
          id: "q1",
          questionText: "What are the four sequential steps of the DHCP client configuration handshake?",
          options: [
            { id: "a", text: "SYN, SYN-ACK, ACK, FIN" },
            { id: "b", text: "Discover, Offer, Request, Acknowledge (DORA)" },
            { id: "c", text: "Ping, Echo, Reply, Close" },
            { id: "d", text: "Query, Cache, Resolve, Forward" }
          ],
          correctOptionId: "b",
          explanation: "DHCP follows the DORA sequence: Discover (broadcast), Offer (from server), Request (from client), and Acknowledge (lease confirmed)."
        },
        {
          id: "q2",
          questionText: "What is the primary role of the Address Resolution Protocol (ARP)?",
          options: [
            { id: "a", text: "Translating domain names like google.com into IP addresses" },
            { id: "b", text: "Mapping a known local IP address to an unknown physical MAC address" },
            { id: "c", text: "Encrypting web traffic using TLS certificates" },
            { id: "d", text: "Compressing video streams for streaming platforms" }
          ],
          correctOptionId: "b",
          explanation: "ARP resolves Layer 3 IP addresses to Layer 2 physical MAC addresses within a local network."
        },
        {
          id: "q3",
          questionText: "Which DNS record type is responsible for returning an IPv4 address for a queried domain name?",
          options: [
            { id: "a", text: "MX record" },
            { id: "b", text: "TXT record" },
            { id: "c", text: "A record" },
            { id: "d", text: "CNAME record" }
          ],
          correctOptionId: "c",
          explanation: "An 'A' (Address) record maps a domain name to an IPv4 address, whereas 'AAAA' maps to IPv6."
        }
      ]
    }
  },

  "tcp-handshake-http-tls": {
    slug: "tcp-handshake-http-tls",
    title: "The TCP 3-Way Handshake, HTTP/HTTPS & TLS",
    levelNumber: 4,
    levelTitle: "Level 4 — Core Network Protocols",
    estimatedMinutes: 40,
    prerequisites: ["Address Resolution, DHCP & DNS Lookup"],
    objectives: [
      "Master the SYN -> SYN-ACK -> ACK three-way handshake sequence and state machine",
      "Examine HTTP methods, headers, and response status codes",
      "Understand how TLS uses asymmetric public-key cryptography to negotiate symmetric session keys"
    ],
    summary: "Witness the exact protocol sequence that establishes reliable communication across the Internet, and discover how TLS encrypts web traffic to guarantee confidentiality and authentication.",
    analogy: {
      title: "The Walkie-Talkie Protocol & The Diplomatic Pouch",
      text: "**The TCP 3-Way Handshake** is like professional radio communication:  \n- You: 'Alpha, this is Bravo, do you copy? Over (SYN)'  \n- Alpha: 'Bravo, this is Alpha, I copy loud and clear! Do you copy me? Over (SYN-ACK)'  \n- You: 'Alpha, I copy you loud and clear. Ready to begin transmission! (ACK)'  \n**HTTP vs HTTPS**: HTTP is sending a postcard where anyone handling the mail can read your words. HTTPS/TLS is placing your letter inside a tamper-evident diplomatic pouch with cryptographic seals that only the embassy recipient can unlock."
    },
    theory: `### The TCP 3-Way Handshake

Before a single byte of application data (like a webpage) can be sent over TCP, both parties must synchronize sequence numbers and establish an active connection:

\`\`\`
   Client                                  Server
     │                                        │
     │ ────── 1. SYN (Seq = X) ─────────────> │ [Server receives request]
     │                                        │
     │ <───── 2. SYN-ACK (Seq=Y, Ack=X+1) ─── │ [Server acknowledges and replies]
     │                                        │
     │ ────── 3. ACK (Seq = X+1, Ack=Y+1) ──> │ [Connection ESTABLISHED]
     │                                        │
     │ ═══════ APPLICATION DATA (HTTP) ══════>│
\`\`\`

- **SYN (Synchronize)**: Client tells the server, *"I want to connect, and my starting Sequence number is X."*
- **SYN-ACK (Synchronize-Acknowledge)**: Server confirms, *"I acknowledge your number (Ack = X+1), and my starting Sequence number is Y."*
- **ACK (Acknowledge)**: Client confirms, *"I acknowledge your number (Ack = Y+1). Connection established!"*

When finishing, a 4-way termination handshake occurs using **FIN (Finish)** flags.

---

### HTTP: The HyperText Transfer Protocol

Once the TCP connection is established, the client sends an **HTTP Request**:
- **Methods**: \`GET\` (retrieve resource), \`POST\` (submit data), \`PUT\` (update resource), \`DELETE\` (remove).
- **Status Codes**:
  - \`200 OK\`: Request succeeded.
  - \`301 / 302\`: Redirection.
  - \`400 Bad Request\`: Malformed syntax.
  - \`401 / 403\`: Unauthorized / Forbidden.
  - \`404 Not Found\`: Resource does not exist.
  - \`500 Internal Server Error\`: Server-side code crashed.

---

### TLS (Transport Layer Security) & HTTPS

In plain HTTP, all headers, cookies, and passwords are sent in clear text. Anyone on your local Wi-Fi can read them. **HTTPS** runs HTTP over an encrypted **TLS tunnel**:

1. **Certificate Verification**: Server sends its X.509 Digital Certificate signed by a trusted Certificate Authority (CA) to prove its identity.
2. **Key Exchange (Asymmetric)**: Using public-key cryptography (e.g. ECDHE or RSA), client and server negotiate a shared secret without ever sending the secret across the wire.
3. **Symmetric Encryption**: Once negotiated, both sides use fast AES encryption with the shared session key to encrypt all subsequent HTTP data.`,
    workedExample: {
      title: "Analyzing a Wireshark Packet Trace of a Handshake",
      scenario: "You capture packets when connecting to `https://example.com`.",
      steps: [
        "Frame 1: `TCP 54321 -> 443 [SYN] Seq=0` (Client initiates with relative sequence 0).",
        "Frame 2: `TCP 443 -> 54321 [SYN, ACK] Seq=0 Ack=1` (Server acknowledges and sends its own sequence 0).",
        "Frame 3: `TCP 54321 -> 443 [ACK] Seq=1 Ack=1` (Client confirms. Connection is now ESTABLISHED).",
        "Frame 4: `TLS Client Hello` (Negotiation of cryptographic cipher suites begins)."
      ]
    },
    keyTerms: [
      { term: "SYN / ACK Flags", definition: "TCP header control bits used to synchronize sequence numbers and acknowledge received bytes." },
      { term: "3-Way Handshake", definition: "The three-step process (SYN, SYN-ACK, ACK) used by TCP to establish a reliable connection before data transfer." },
      { term: "HTTP", definition: "HyperText Transfer Protocol; the application protocol used for transmitting web resources in plaintext." },
      { term: "TLS", definition: "Transport Layer Security; cryptographic protocol providing data confidentiality, integrity, and server authentication." },
      { term: "Certificate Authority (CA)", definition: "A trusted entity that issues digital certificates verifying the identity of websites and servers." }
    ],
    commonMisconceptions: [
      "Misconception: 'The padlock icon in the browser (HTTPS) means a website is 100% safe and not a scam.' Reality: The padlock only means your connection to that server is encrypted. Phishing websites can easily acquire free TLS certificates to trick victims!",
      "Misconception: 'TCP sends an ACK for every single packet individually.' Reality: Modern TCP uses sliding windows and cumulative ACKs to acknowledge multiple packets in batches for performance."
    ],
    cybersecurityRelevance: `Security Relevance:
- **SYN Flood Attack:** An attacker sends thousands of SYN packets with spoofed source IPs and never sends the final ACK. The server exhausts its half-open connection memory (backlog queue) and crashes.
- **SSL Stripping:** An attacker on a public Wi-Fi intercepts the initial unencrypted HTTP redirect and prevents the user from upgrading to HTTPS, harvesting credentials.
- **Session Hijacking:** If an attacker predicts the TCP Sequence numbers or steals the session cookie from cleartext HTTP, they can hijack an authenticated user's session.`,
    simulationId: "tcp-handshake",
    gameId: "follow-packet",
    quiz: {
      id: "quiz-handshake-tls",
      title: "Knowledge Check — Handshake, HTTP & TLS",
      passingScore: 75,
      questions: [
        {
          id: "q1",
          questionText: "What is the second packet sent during the standard TCP 3-way handshake?",
          options: [
            { id: "a", text: "ACK" },
            { id: "b", text: "SYN" },
            { id: "c", text: "SYN-ACK" },
            { id: "d", text: "FIN" }
          ],
          correctOptionId: "c",
          explanation: "The TCP 3-way handshake sequence is 1. SYN (client to server), 2. SYN-ACK (server to client), and 3. ACK (client to server)."
        },
        {
          id: "q2",
          questionText: "What HTTP response code signifies that the requested resource was not found on the server?",
          options: [
            { id: "a", text: "200 OK" },
            { id: "b", text: "301 Moved Permanently" },
            { id: "c", text: "404 Not Found" },
            { id: "d", text: "500 Internal Server Error" }
          ],
          correctOptionId: "c",
          explanation: "HTTP 404 indicates that the server cannot locate the requested URI resource."
        },
        {
          id: "q3",
          questionText: "How does TLS protect web traffic between a user and a website?",
          options: [
            { id: "a", text: "By blocking all incoming UDP packets" },
            { id: "b", text: "By encrypting traffic to provide confidentiality, integrity, and server authentication" },
            { id: "c", text: "By disabling all JavaScript on the web page" },
            { id: "d", text: "By assigning new MAC addresses to the router" }
          ],
          correctOptionId: "b",
          explanation: "TLS encrypts communications to ensure confidentiality, prevent tampering (integrity), and authenticate the server's identity."
        }
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────
  // LEVEL 5: NETWORKING FOR CYBERSECURITY
  // ─────────────────────────────────────────────────────────────
  "firewalls-nat-vpn-segmentation": {
    slug: "firewalls-nat-vpn-segmentation",
    title: "Firewalls, NAT, VPNs & Network Segmentation",
    levelNumber: 5,
    levelTitle: "Level 5 — Networking for Cybersecurity",
    estimatedMinutes: 45,
    prerequisites: ["The TCP 3-Way Handshake, HTTP/HTTPS & TLS"],
    objectives: [
      "Compare stateless vs stateful packet inspection firewalls and access control lists (ACLs)",
      "Understand Network Address Translation (NAT) and Port Address Translation (PAT)",
      "Explain how Virtual Private Networks (VPNs) securely tunnel private traffic over untrusted public links",
      "Discover how VLANs and network segmentation isolate compromised hosts and limit blast radius"
    ],
    summary: "Architecting a secure network requires layered defensive boundaries: stateful firewalls to inspect traffic, NAT to mask internal hosts, VPNs to encrypt remote links, and segmentation to contain attacks.",
    analogy: {
      title: "Building Security, Receptionists & Armored Tunnels",
      text: "- **Firewall**: The security guard at the building lobby with a visitor registry: if your name or appointment is not on the list, you cannot enter.\n- **NAT**: The company switchboard receptionist: when an employee calls an external client, caller ID shows only the main corporate phone number, hiding the employee's personal desk extension.\n- **VPN**: An underground armored tunnel connecting two bank branches across a busy city: guards can transport cash safely without exposing it to street-level traffic.\n- **Segmentation**: Water-tight compartmentalized bulkheads in a submarine: if one section is punctured by an iceberg, closing the steel doors prevents the entire ship from flooding."
    },
    theory: `### 1. Firewalls & Access Control Lists (ACLs)

A **firewall** monitors and controls incoming and outgoing network traffic based on predetermined security rules:
- **Stateless Inspection**: Evaluates each packet in complete isolation based strictly on source IP, destination IP, port, and protocol. Fast, but blind to connection state.
- **Stateful Inspection**: Tracks active connections (e.g. established TCP streams). It automatically allows return response traffic for an outbound request initiated by an internal user, while blocking unsolicited incoming packets from the Internet.
- **Next-Generation Firewalls (NGFW)**: Inspects Layer 7 application payloads, blocking specific malware signatures, malicious URLs, and unauthorized file downloads even over port 443.

---

### 2. Network Address Translation (NAT)

Because internal RFC 1918 private IPs (\`192.168.1.x\`) cannot route across the Internet, your border router performs **NAT / PAT (Port Address Translation)**:
1. When your laptop (\`192.168.1.15:52140\`) requests a webpage, the router rewrites the source IP to its single **Public WAN IP** (e.g. \`203.0.113.88:61001\`).
2. The router records this mapping in its internal **NAT State Table**.
3. When the web server replies to \`203.0.113.88:61001\`, the router looks up the port in its state table and translates it back to \`192.168.1.15:52140\`.
4. As a side benefit, NAT acts as a basic shield because outside computers cannot initiate connections to internal private IPs directly.

---

### 3. Virtual Private Networks (VPNs)

A **VPN** creates an encrypted virtual tunnel across an untrusted public network (like the Internet or public Wi-Fi):
- Encapsulates the user's private packets inside a new encrypted IP packet (e.g. IPsec, WireGuard, OpenVPN).
- Allows remote employees to securely access internal company servers as if their laptop were physically plugged into the office LAN switch.

---

### 4. Network Segmentation & VLANs

In a **flat network**, every device (CEO laptop, public guest Wi-Fi, HVAC smart thermostat, patient medical records database) sits in the same subnet. If a smart lightbulb is compromised, the attacker can scan and exploit the database directly!
- **Network Segmentation** splits the network into isolated zones using **VLANs (Virtual LANs)** and internal firewalls.
- Traffic between VLANs must pass through a router or firewall where strict rules apply: e.g. Guest Wi-Fi VLAN *cannot* initiate connections to the Server VLAN.`,
    workedExample: {
      title: "Configuring a Standard Firewall Egress Rule",
      scenario: "Hardening an enterprise workstation subnet against malware command-and-control (C2).",
      steps: [
        "Default policy: **DROP ALL** unsolicited inbound and outbound traffic.",
        "Rule 1 (Inbound): ALLOW ESTABLISHED, RELATED (permits replies to internal requests).",
        "Rule 2 (Outbound): ALLOW Workstation Subnet (`10.0.5.0/24`) to Port `53` (DNS) ONLY on internal DNS server `10.0.1.5`.",
        "Rule 3 (Outbound): ALLOW Workstation Subnet to Port `443` (HTTPS) through web proxy.",
        "Result: If malware infects a workstation and tries to call home to a hacker server on port 4444 or arbitrary IP, the firewall drops the packet and triggers an alert!"
      ]
    },
    keyTerms: [
      { term: "Stateful Firewall", definition: "A firewall that keeps track of the state of network connections and allows return traffic for established outbound streams." },
      { term: "NAT (Network Address Translation)", definition: "A method of mapping multiple local private addresses to a single public IP address before forwarding packets." },
      { term: "VPN (Virtual Private Network)", definition: "An encrypted tunnel extending a private network across an untrusted public network." },
      { term: "VLAN (Virtual LAN)", definition: "A logical subnetwork that groups together devices sharing a physical switch into isolated broadcast domains." },
      { term: "Blast Radius", definition: "The maximum scope of damage or lateral movement an attacker can achieve after compromising a single host." }
    ],
    commonMisconceptions: [
      "Misconception: 'NAT is a firewall.' Reality: NAT was designed to conserve IPv4 addresses, not for security. While NAT prevents unsolicited inbound connections by default, it does not inspect packet contents or filter traffic.",
      "Misconception: 'A commercial consumer VPN makes you completely anonymous on the dark web.' Reality: The VPN provider still sees your IP address and traffic destinations, and application tracking (cookies, browser fingerprinting) still identifies you."
    ],
    cybersecurityRelevance: `Defensive Architecture Principles:
- **Zero Trust Network Access (ZTNA):** Never trust any device simply because it is physically connected to the internal office network.
- **Micro-segmentation:** Isolating individual workloads in data centers so that compromising one web server container does not allow lateral movement to the database container.
- **Egress Filtering:** Monitoring outbound traffic leaving the organization to detect data exfiltration and active malware beacons.`,
    simulationId: "packet-journey",
    gameId: "packet-detective",
    quiz: {
      id: "quiz-firewalls-segmentation",
      title: "Knowledge Check — Firewalls, NAT & Segmentation",
      passingScore: 75,
      questions: [
        {
          id: "q1",
          questionText: "What key advantage does a stateful firewall have over a stateless firewall?",
          options: [
            { id: "a", text: "It runs without requiring any CPU or memory" },
            { id: "b", text: "It tracks active connections and automatically permits return traffic for authorized outbound requests" },
            { id: "c", text: "It physically unplugs disconnected network cables" },
            { id: "d", text: "It assigns public IP addresses to internet service providers" }
          ],
          correctOptionId: "b",
          explanation: "Stateful firewalls maintain a state table of established connections, allowing return traffic automatically while blocking unexpected inbound connections."
        },
        {
          id: "q2",
          questionText: "Why do security architects implement VLANs and network segmentation instead of a single flat network?",
          options: [
            { id: "a", text: "To make network cables glow different colors" },
            { id: "b", text: "To limit the blast radius and prevent attackers from moving laterally between compromised zones" },
            { id: "c", text: "To eliminate the need for any firewalls" },
            { id: "d", text: "To allow all devices to read each other's traffic" }
          ],
          correctOptionId: "b",
          explanation: "Network segmentation isolates sensitive assets (like database servers) from less secure zones (like guest Wi-Fi), restricting lateral movement."
        },
        {
          id: "q3",
          questionText: "What is the primary technical function of Network Address Translation (NAT)?",
          options: [
            { id: "a", text: "Translating human domain names into IP addresses" },
            { id: "b", text: "Remapping private internal IP addresses to a public routable IP address at the network border" },
            { id: "c", text: "Encrypting hard drives using BitLocker" },
            { id: "d", text: "Generating digital TLS certificates" }
          ],
          correctOptionId: "b",
          explanation: "NAT rewrites private non-routable RFC 1918 addresses into a routable public IP address (and vice versa) across the border router."
        }
      ]
    }
  },

  "network-attacks-and-monitoring": {
    slug: "network-attacks-and-monitoring",
    title: "Network Attacks: ARP Poisoning, SYN Floods & Sniffing",
    levelNumber: 5,
    levelTitle: "Level 5 — Networking for Cybersecurity",
    estimatedMinutes: 45,
    prerequisites: ["Firewalls, NAT, VPNs & Network Segmentation"],
    objectives: [
      "Deconstruct how Man-in-the-Middle (MitM) positioning works via ARP cache poisoning",
      "Analyze Denial of Service (DoS) mechanisms including TCP SYN floods and amplification attacks",
      "Understand promiscuous mode sniffing and how attackers capture unencrypted credentials",
      "Explore defensive mitigations: Dynamic ARP Inspection (DAI), SYN cookies, and SIEM monitoring"
    ],
    summary: "By understanding the exact protocol weaknesses exploited by adversaries—unauthenticated ARP broadcasts, TCP backlog queues, and cleartext traffic—you will learn how to detect attacks and configure robust defenses.",
    analogy: {
      title: "The Impersonator in the Mailroom & The Fake Phone Orders",
      text: "**ARP Poisoning** is like a con artist walking into an office mailroom wearing a fake badge saying, 'Attention mailroom: the CEO has moved to Desk 4 (my desk). Deliver all their letters to me!' The mailroom clerk updates their notepad without checking ID, and begins delivering the CEO's confidential correspondence straight to the con artist.  \n**SYN Flood** is like an adversary dialing a restaurant's phone line 10,000 times a second, saying 'I'd like to place an order, hold on...', and hanging on the line without ever ordering, completely preventing real hungry customers from calling in."
    },
    theory: `### 1. ARP Poisoning / Spoofing (Man-in-the-Middle)

ARP was designed in 1982 with **zero authentication**. Any host on a LAN can send an unsolicited (gratuitous) ARP reply:
- Attacker sends an ARP reply to Victim: *"192.168.1.1 (Gateway) is at Attacker's MAC!"*
- Attacker sends an ARP reply to Gateway: *"192.168.1.50 (Victim) is at Attacker's MAC!"*
- Both Victim and Gateway update their ARP caches.
- Now, all traffic sent by the victim to the Internet flows directly through the attacker's machine, enabling full **Man-in-the-Middle (MitM)** inspection, alteration, or credential theft before forwarding it to the real gateway.

**Defenses:**
- **Dynamic ARP Inspection (DAI)** on managed enterprise switches: Switch cross-references ARP replies against a trusted DHCP snooping database and drops forged replies.
- **Static ARP entries** on critical infrastructure.
- **End-to-end TLS encryption**: Even if MitM occurs, the attacker only sees encrypted ciphertext.

---

### 2. TCP SYN Flood (Denial of Service)

Exploits the TCP 3-way handshake state machine:
1. Attacker sends a flood of TCP SYN packets with randomized, spoofed source IP addresses.
2. The target server reserves memory in its **SYN Backlog Queue** and replies with SYN-ACK to the spoofed IPs.
3. Because the spoofed IPs don't exist or didn't request a connection, no final ACK is ever returned.
4. The server's backlog queue fills completely with half-open connections.
5. Legitimate users attempting to connect receive connection timeouts or refused errors.

**Defenses:**
- **SYN Cookies**: The server does not allocate memory for half-open connections. Instead, it encodes the connection state inside the initial Sequence number ($Y$). Only when the client returns the final ACK ($Y+1$) does the server verify the cookie and allocate memory!
- **Rate limiting & Cloud DDoS scrubbing** (Cloudflare, AWS Shield).

---

### 3. Packet Sniffing & Promiscuous Mode

Normally, a network card drops any frame whose destination MAC address does not match its own.
- In **Promiscuous Mode**, the network interface passes every single frame traversing the physical wire or Wi-Fi channel directly to the OS kernel.
- If protocols transmit data in cleartext (HTTP, Telnet 23, FTP 21, POP3 110), an attacker running a packet sniffer (like Wireshark or tcpdump) extracts passwords, session cookies, and sensitive documents effortlessly.`,
    workedExample: {
      title: "Detecting an ARP Poisoning Attack in Terminal",
      scenario: "A security analyst suspects a rogue device on the office subnet `192.168.1.0/24`.",
      steps: [
        "1. Open terminal on victim workstation and run: `arp -a`.",
        "2. Review table entries:",
        "   `192.168.1.1   00-0c-29-88-11-22   dynamic` (Default Gateway)",
        "   `192.168.1.105 00-0c-29-88-11-22   dynamic` (Suspicious Laptop)",
        "3. **Alert!** Two distinct IP addresses share the EXACT SAME MAC address (`00-0c-29-88-11-22`).",
        "4. This confirms the device at `192.168.1.105` is poisoning the ARP cache to impersonate the gateway."
      ]
    },
    keyTerms: [
      { term: "ARP Poisoning", definition: "An attack where forged ARP messages are sent onto a LAN to link an attacker's MAC address with the IP of a legitimate node." },
      { term: "Man-in-the-Middle (MitM)", definition: "An attack where the adversary secretly relays and possibly alters communications between two parties who believe they are communicating directly." },
      { term: "SYN Flood", definition: "A Denial of Service attack exploiting the TCP handshake by exhausting the target server's half-open connection backlog queue." },
      { term: "SYN Cookies", definition: "A cryptographic defense against SYN floods where the server encodes connection parameters into the initial sequence number without storing state." },
      { term: "Promiscuous Mode", definition: "A mode for a network interface controller that causes it to pass all traffic it receives to the CPU rather than only frames addressed to it." }
    ],
    commonMisconceptions: [
      "Misconception: 'HTTPS completely stops ARP poisoning.' Reality: HTTPS does not prevent the attacker from poisoning the ARP table and becoming the man-in-the-middle! However, HTTPS ensures the attacker cannot read or tamper with the encrypted payload without triggering a severe browser certificate warning.",
      "Misconception: 'Only servers can be targets of DoS attacks.' Reality: An attacker on a local network can easily DoS individual client workstations or the default gateway router."
    ],
    cybersecurityRelevance: `Security Operations (SOC) Relevance:
- **SIEM Telemetry:** Security Information and Event Management systems aggregate network flow data (NetFlow/IPFIX) and alert when a host suddenly generates anomalous spikes in outbound SYN packets.
- **Port Security:** Network engineers configure managed switches to allow only 1 authorized MAC address per physical wall jack (sticky MAC), instantly disabling the switch port if a rogue device is plugged in.`,
    simulationId: "arp-discovery",
    gameId: "packet-detective",
    quiz: {
      id: "quiz-network-attacks",
      title: "Knowledge Check — Network Attacks & Mitigations",
      passingScore: 75,
      questions: [
        {
          id: "q1",
          questionText: "What fundamental vulnerability in the ARP protocol enables ARP cache poisoning?",
          options: [
            { id: "a", text: "ARP packets are encrypted with weak 56-bit DES keys" },
            { id: "b", text: "ARP has no authentication mechanism and hosts accept unsolicited replies" },
            { id: "c", text: "ARP only functions over wireless 5GHz frequencies" },
            { id: "d", text: "ARP requires root administrative access to ping servers" }
          ],
          correctOptionId: "b",
          explanation: "ARP lacks any cryptographic authentication or verification; devices willingly update their ARP cache when presented with unsolicited ARP replies."
        },
        {
          id: "q2",
          questionText: "Which server-side defense prevents TCP SYN floods from exhausting connection memory without needing to allocate state for incomplete handshakes?",
          options: [
            { id: "a", text: "MAC address rotation" },
            { id: "b", text: "SYN Cookies" },
            { id: "c", text: "Disabling the network interface card" },
            { id: "d", text: "Switching from IPv4 to IPv6" }
          ],
          correctOptionId: "b",
          explanation: "SYN cookies encode connection details into the server's initial sequence number, eliminating the need to store state in memory until the client returns the final ACK."
        },
        {
          id: "q3",
          questionText: "What mode must a network interface card (NIC) be placed into to capture all frames traversing a network segment, regardless of destination MAC?",
          options: [
            { id: "a", text: "Broadcast-only mode" },
            { id: "b", text: "Stealth mode" },
            { id: "c", text: "Promiscuous mode" },
            { id: "d", text: "Safe mode" }
          ],
          correctOptionId: "c",
          explanation: "In promiscuous mode, the NIC passes all observed network frames directly to the packet capture software without filtering by destination MAC."
        }
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────
  // LEVEL 6: PRACTICAL NETWORK LAB & TROUBLESHOOTING
  // ─────────────────────────────────────────────────────────────
  "cli-diagnostics-ping-traceroute-dns": {
    slug: "cli-diagnostics-ping-traceroute-dns",
    title: "Diagnostic Tooling: Ping, Traceroute, Nslookup & Dig",
    levelNumber: 6,
    levelTitle: "Level 6 — Practical Network Lab",
    estimatedMinutes: 45,
    prerequisites: ["Network Attacks: ARP Poisoning, SYN Floods & Sniffing"],
    objectives: [
      "Use Ping to measure round-trip latency, packet loss, and reachability",
      "Understand how Traceroute manipulates IP TTL (Time-To-Live) fields to discover intermediary hops",
      "Execute DNS lookups and record investigations using nslookup and dig commands",
      "Apply a systematic bottom-up (Layer 1 to Layer 7) troubleshooting methodology to resolve network outages"
    ],
    summary: "When connectivity fails, random guessing wastes precious hours. Master the core command-line diagnostic tools used daily by sysadmins, security analysts, and penetration testers.",
    analogy: {
      title: "The Sonar Ping & The Trail of Breadcrumbs",
      text: "**Ping** is submarine sonar: send an audio ping into the dark ocean and measure how many milliseconds it takes for the echo to bounce back. If nothing returns, either the target isn't there or an underwater cliff (firewall) absorbed the sound.  \n**Traceroute** is dropping breadcrumbs along a hiking trail: you deliberately send packets with expiration timers of 1 step, 2 steps, 3 steps... forcing each router along the journey to send back an apology postcard identifying who they are and where they stand."
    },
    theory: `### 1. Ping (ICMP Echo)

The first tool any engineer runs to test reachability:
\`\`\`bash
$ ping -c 4 8.8.8.8
PING 8.8.8.8 (8.8.8.8): 56 data bytes
64 bytes from 8.8.8.8: icmp_seq=0 ttl=118 time=14.2 ms
64 bytes from 8.8.8.8: icmp_seq=1 ttl=118 time=13.8 ms
64 bytes from 8.8.8.8: icmp_seq=2 ttl=118 time=14.5 ms
64 bytes from 8.8.8.8: icmp_seq=3 ttl=118 time=13.9 ms

--- 8.8.8.8 ping statistics ---
4 packets transmitted, 4 packets received, 0.0% packet loss
round-trip min/avg/max = 13.8/14.1/14.5 ms
\`\`\`
- **0% packet loss**: Reliable connection.
- **RTT (round-trip time)**: How fast the round trip took (~14 ms).
- **Caveat**: Many modern firewalls block incoming ICMP Echo Requests by policy; a failed ping does not 100% guarantee a server is down.

---

### 2. Traceroute (tracert on Windows)

Discovers every router (hop) between you and the destination by manipulating the **IP TTL (Time-To-Live)** field:
- **How it works:**
  1. Sends packet with \`TTL = 1\`. First router decrements TTL to 0, drops it, and replies with ICMP Type 11 (*Time Exceeded*). We now know Router #1!
  2. Sends packet with \`TTL = 2\`. Second router drops it and replies. We know Router #2!
  3. Increments TTL until the destination itself replies.
- **Output:** Reveals which ISP or internal router is dropping packets or causing extreme latency spikes.

---

### 3. DNS Lookup: nslookup & dig

When you suspect a DNS issue:
\`\`\`bash
# Query the A record for a domain:
$ nslookup cyberpath.dev

# Or use dig for detailed DNS telemetry:
$ dig cyberpath.dev A +noall +answer
cyberpath.dev.    300    IN    A    76.76.21.21

# Query a specific DNS server directly (bypassing local DNS):
$ dig @1.1.1.1 cyberpath.dev
\`\`\`

---

### 4. The 5-Step Bottom-Up Troubleshooting Sequence

When a user complains *"The network is down!"*, follow this strict sequence:
1. **Ping \`127.0.0.1\`**: Tests the computer's own TCP/IP stack software.
2. **Ping your local IP (e.g. \`192.168.1.50\`)**: Tests your physical Network Interface Card (NIC).
3. **Ping your Default Gateway (e.g. \`192.168.1.1\`)**: Tests physical cable, switch, and local LAN reachability.
4. **Ping an external public IP (e.g. \`8.8.8.8\`)**: Tests your router WAN uplink and ISP routing (bypassing DNS).
5. **Ping by hostname (e.g. \`ping google.com\`)**: Tests DNS resolution.`,
    workedExample: {
      title: "Real-World Outage Resolution",
      scenario: "An office reports no one can open internal company tools.",
      steps: [
        "Step 1: Admin pings Default Gateway (`192.168.1.1`) -> Replies in 1 ms (Local LAN healthy).",
        "Step 2: Admin pings external IP `1.1.1.1` -> Replies in 12 ms (Internet uplink healthy!).",
        "Step 3: Admin pings `intranet.corp.local` -> Error: `cannot resolve intranet.corp.local: Unknown host`.",
        "Step 4: Admin runs `nslookup intranet.corp.local` -> Server: `192.168.1.1`, Response: `NXDOMAIN`.",
        "Diagnosis: The internal primary DNS server crashed, and devices fell back to public router DNS which knows nothing about internal .local domains! Admin restarts internal DNS service; problem resolved."
      ]
    },
    keyTerms: [
      { term: "Ping", definition: "A diagnostic tool that sends ICMP Echo Requests to verify network connectivity and measure round-trip latency." },
      { term: "Traceroute", definition: "A utility that records the route (gateway hops) through the Internet between your computer and a specified destination host." },
      { term: "TTL (Time To Live)", definition: "An 8-bit field in an IP header that limits the lifespan of a packet to prevent infinite routing loops." },
      { term: "Dig / Nslookup", definition: "Command-line tools used to query Domain Name System (DNS) servers for specific resource records." }
    ],
    commonMisconceptions: [
      "Misconception: 'If traceroute shows asterisks (* * *), the server is broken.' Reality: Many core Internet routers drop ICMP Time Exceeded packets or deprioritize diagnostic probes to protect their CPU. If subsequent hops reply normally, the connection is working fine.",
      "Misconception: 'TTL is measured in seconds.' Reality: Despite the name 'Time To Live', in modern IP routing it represents the maximum number of **hop counts** (decremented by 1 at each router), not seconds."
    ],
    cybersecurityRelevance: `Security Relevance:
- **Network Reconnaissance:** Attackers run traceroute to map out an organization's upstream transit providers, firewall perimeter IPs, and internal routing structures.
- **DNS Zone Transfers:** Adversaries run \`dig axfr @nameserver domain.com\` to see if misconfigured DNS servers will leak their entire internal network hostname directory.
- **Covert Channels:** Malware can encode exfiltrated data inside the payload section of ICMP Echo packets (ICMP tunneling) to bypass firewalls that only monitor TCP.`,
    simulationId: "packet-journey",
    gameId: "network-troubleshooter",
    quiz: {
      id: "quiz-diagnostics",
      title: "Knowledge Check — Network Diagnostics",
      passingScore: 75,
      questions: [
        {
          id: "q1",
          questionText: "What IP header field does the traceroute command intentionally increment to discover intermediary router hops?",
          options: [
            { id: "a", text: "Checksum" },
            { id: "b", text: "Time To Live (TTL)" },
            { id: "c", text: "Source Port" },
            { id: "d", text: "Window Size" }
          ],
          correctOptionId: "b",
          explanation: "Traceroute sends packets starting with TTL=1, TTL=2, etc., causing each successive router to drop the packet and return an ICMP Time Exceeded message revealing its IP."
        },
        {
          id: "q2",
          questionText: "If you can ping 8.8.8.8 successfully but cannot load google.com in your web browser, what is the most probable point of failure?",
          options: [
            { id: "a", text: "Your physical Ethernet cable is unplugged" },
            { id: "b", text: "DNS resolution failure" },
            { id: "c", text: "Your Default Gateway router is offline" },
            { id: "d", text: "Your computer's network interface card is defective" }
          ],
          correctOptionId: "b",
          explanation: "Since pinging an external IP (8.8.8.8) succeeds, the physical layer, local LAN, default gateway, and Internet routing are all functional. The inability to reach domain names indicates DNS resolution failure."
        },
        {
          id: "q3",
          questionText: "Which command-line utility is specifically designed to query DNS servers for detailed record types like A, MX, or TXT?",
          options: [
            { id: "a", text: "arp" },
            { id: "b", text: "netstat" },
            { id: "c", text: "dig (or nslookup)" },
            { id: "d", text: "tracert" }
          ],
          correctOptionId: "c",
          explanation: "`dig` (Domain Information Groper) and `nslookup` are specialized utilities for interrogating DNS name servers."
        }
      ]
    }
  },

  "wireshark-nmap-and-troubleshooting": {
    slug: "wireshark-nmap-and-troubleshooting",
    title: "Wireshark Packet Analysis & Nmap Reconnaissance",
    levelNumber: 6,
    levelTitle: "Level 6 — Practical Network Lab",
    estimatedMinutes: 45,
    prerequisites: ["Diagnostic Tooling: Ping, Traceroute, Nslookup & Dig"],
    objectives: [
      "Navigate the Wireshark packet capture interface and apply essential display filters",
      "Inspect protocol headers and reconstruct application streams (Follow TCP Stream)",
      "Understand the mechanics of Nmap port scanning (SYN stealth scans vs full connect scans)",
      "Differentiate between open, closed, and filtered port responses during security audits"
    ],
    summary: "Wireshark provides an X-ray view into every packet crossing the wire, while Nmap identifies open doors and running services. Learn how security professionals use these tools to investigate incidents and audit security posture.",
    analogy: {
      title: "The Electron Microscope & The Security Building Inspector",
      text: "**Wireshark** is an electron microscope for your network: it freezes live traffic in time, allowing you to dissect every single layer—down to the exact hexadecimal byte of a TCP header or plaintext password.  \n**Nmap** is a building security auditor walking down a hallway with 65,535 locked doors: it knocks on each door, listens to the sound of the lock, and writes down which rooms are occupied, what locks they use, and which windows are unlatched."
    },
    theory: `### 1. Wireshark Packet Analysis

**Wireshark** is the industry-standard GUI packet analyzer. It reads packet capture files (**.pcap / .pcapng**).
The interface is structured in three panes:
1. **Packet List Pane** (Top): Summary of packets (Number, Time, Source, Destination, Protocol, Length, Info).
2. **Packet Details Pane** (Middle): Collapsible tree decomposing the packet layer by layer (Frame -> Ethernet II -> IPv4 -> TCP -> HTTP).
3. **Packet Bytes Pane** (Bottom): The raw raw hexadecimal and ASCII representation.

#### Indispensable Wireshark Display Filters:
- \`ip.addr == 192.168.1.50\`: Show only traffic involving this specific IP.
- \`tcp.port == 443\`: Show traffic on HTTPS port.
- \`http.request.method == "POST"\`: Locate submitted forms and credentials.
- \`dns\`: Filter for all DNS queries and replies.
- \`tcp.flags.syn == 1 && tcp.flags.ack == 0\`: Show only initial connection requests.
- **Right Click -> "Follow TCP Stream"**: Automatically filters and reconstructs the complete plain English dialogue between client and server!

---

### 2. Nmap (Network Mapper) Reconnaissance

**Nmap** is the premier tool for network discovery and vulnerability scanning.
*Reminder: Always obtain written authorization before scanning any network!*

#### Core Scan Types:
- **SYN Stealth Scan (\`-sS\`)** *(Default with root/admin)*:
  - Sends a TCP SYN packet.
  - If target responds with **SYN-ACK**: Port is **OPEN**! (Nmap immediately sends a **RST** packet to tear down the connection before it completes, avoiding logging on some legacy servers).
  - If target responds with **RST**: Port is **CLOSED**.
  - If target returns no response or ICMP unreachable: Port is **FILTERED** (blocked by a firewall).
- **TCP Connect Scan (\`-sT\`)**: Completes the full 3-way handshake (used when run without administrator privileges).
- **Service Version Detection (\`-sV\`)**: Probes open ports to identify the exact software name and version (e.g. \`Apache 2.4.49\`).
- **OS Fingerprinting (\`-O\`)**: Analyzes subtle TCP/IP stack idiosyncrasies (window size, TCP options, TTL) to deduce the operating system (e.g. Linux 5.4 vs Windows 11).

\`\`\`bash
# Standard ethical reconnaissance scan:
$ nmap -sS -sV -p 1-1000 192.168.1.10
Starting Nmap 7.94 ...
PORT    STATE SERVICE VERSION
22/tcp  open  ssh     OpenSSH 8.9p1 Ubuntu
80/tcp  open  http    nginx 1.18.0
443/tcp open  ssl/http nginx 1.18.0
\`\`\``,
    workedExample: {
      title: "Investigating a Suspicious PCAP in Wireshark",
      scenario: "A network intrusion alert flagged suspicious outbound HTTP traffic on an employee machine.",
      steps: [
        "1. Open the captured `.pcap` in Wireshark.",
        "2. Apply filter: `http.request.method == 'POST'`.",
        "3. You see an HTTP POST request to an unknown IP `198.51.100.22/upload.php`.",
        "4. Right-click the packet and select **Follow -> TCP Stream**.",
        "5. Wireshark displays the reconstructed conversation:",
        "   `POST /upload.php HTTP/1.1`",
        "   `User-Agent: Powershell/7.2`",
        "   `Content-Type: application/octet-stream`",
        "   `[base64-encoded employee password database dump]`",
        "6. Finding: Confirmed active data exfiltration by malware via unencrypted HTTP POST!"
      ]
    },
    keyTerms: [
      { term: "Wireshark", definition: "A free, open-source packet analyzer used for network troubleshooting, protocol analysis, and software development." },
      { term: "PCAP", definition: "Packet Capture; an application programming interface and file format for capturing network traffic data." },
      { term: "Follow TCP Stream", definition: "A Wireshark feature that reconstructs and displays application-layer data from an entire TCP session in readable order." },
      { term: "Nmap", definition: "Network Mapper; an open-source network scanner used for host discovery, port scanning, and vulnerability reconnaissance." },
      { term: "Filtered Port", definition: "An Nmap scan result indicating that a firewall, filter, or router is blocking probes from reaching the target port." }
    ],
    commonMisconceptions: [
      "Misconception: 'Wireshark can decrypt any HTTPS traffic across the Internet automatically.' Reality: Wireshark cannot decrypt TLS traffic unless you provide the private server key or the client browser's session pre-master secret log file (SSLKEYLOGFILE).",
      "Misconception: 'An Nmap stealth scan (-sS) makes you completely invisible to firewalls.' Reality: Modern Intrusion Detection Systems (Snort, Suricata) easily detect and log SYN scans within milliseconds."
    ],
    cybersecurityRelevance: `Applied Defensive & Offensive Skills:
- **Malware Analysis:** Detonating an unknown executable in an isolated sandbox while capturing packets with Wireshark reveals its Command & Control (C2) domains, IP addresses, and communication protocols.
- **Attack Surface Management:** Defenders run continuous automated Nmap scans against their own public IP ranges to verify that no employee inadvertently opened remote desktop (RDP 3389) or database ports (MySQL 3306) to the public Internet.`,
    simulationId: "tcp-handshake",
    gameId: "network-troubleshooter",
    quiz: {
      id: "quiz-wireshark-nmap",
      title: "Knowledge Check — Wireshark & Nmap",
      passingScore: 75,
      questions: [
        {
          id: "q1",
          questionText: "In Nmap, what does a port state of 'FILTERED' signify?",
          options: [
            { id: "a", text: "A service is actively running and accepted the connection" },
            { id: "b", text: "The target host returned a TCP RST packet confirming no service is listening" },
            { id: "c", text: "A firewall or packet filter blocked the probe and Nmap cannot determine if the port is open or closed" },
            { id: "d", text: "The IP address does not exist on the Internet" }
          ],
          correctOptionId: "c",
          explanation: "In Nmap, 'Filtered' means a firewall or filter prevented probe packets from reaching the port or dropped the replies, concealing the port's true status."
        },
        {
          id: "q2",
          questionText: "Which Wireshark feature allows an analyst to reconstruct an entire application-layer conversation (such as an HTTP exchange) in chronological text order?",
          options: [
            { id: "a", text: "Follow TCP Stream" },
            { id: "b", text: "Mergecap" },
            { id: "c", text: "Packet Length Graph" },
            { id: "d", text: "Checksum Verification" }
          ],
          correctOptionId: "a",
          explanation: "'Follow TCP Stream' reassembles all payload segments in sequence and displays the full conversation in a clean dialogue window."
        },
        {
          id: "q3",
          questionText: "What packet does Nmap send immediately upon receiving a SYN-ACK during a SYN stealth scan (-sS) to prevent completing the full handshake?",
          options: [
            { id: "a", text: "ACK" },
            { id: "b", text: "FIN" },
            { id: "c", text: "RST (Reset)" },
            { id: "d", text: "URG" }
          ],
          correctOptionId: "c",
          explanation: "During a SYN stealth scan, Nmap sends a RST packet immediately after receiving SYN-ACK to tear down the half-open connection before an application session is established."
        }
      ]
    }
  }
};

export function getDetailedNetworkingLesson(slug) {
  return NETWORKING_LESSONS_CONTENT[slug] || null;
}
