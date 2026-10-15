import { LEARNING_PATHS, getAllLessons } from "../../data/curriculumData";

/**
 * Track theme metadata and palettes
 */
export const TRACK_PALETTES = {
  "Red Team": {
    trackKey: "red-team",
    name: "Red Team",
    primary: "#ffffff",
    secondary: "#e4e4e7",
    accent: "#a1a1aa",
    steelLight: "#71717a",
    steelDark: "#27272a",
    plateBg: "#18181b",
    glowColor: "rgba(255, 255, 255, 0.12)",
    glowColorSecondary: "rgba(255, 255, 255, 0.05)",
    ringColor: "#ffffff",
    tagline: "Offensive Security & Ethical Hacking",
    tierName: "Track Specialist",
  },
  "Blue Team": {
    trackKey: "blue-team",
    name: "Blue Team",
    primary: "#ffffff",
    secondary: "#e4e4e7",
    accent: "#a1a1aa",
    steelLight: "#71717a",
    steelDark: "#27272a",
    plateBg: "#18181b",
    glowColor: "rgba(255, 255, 255, 0.12)",
    glowColorSecondary: "rgba(255, 255, 255, 0.05)",
    ringColor: "#ffffff",
    tagline: "Defensive Security & Threat Detection",
    tierName: "Track Specialist",
  },
  "Web Security": {
    trackKey: "web-security",
    name: "Web Security",
    primary: "#ffffff",
    secondary: "#e4e4e7",
    accent: "#a1a1aa",
    steelLight: "#71717a",
    steelDark: "#27272a",
    plateBg: "#18181b",
    glowColor: "rgba(255, 255, 255, 0.12)",
    glowColorSecondary: "rgba(255, 255, 255, 0.05)",
    ringColor: "#ffffff",
    tagline: "Application Security & Flaw Discovery",
    tierName: "Track Specialist",
  },
  Master: {
    trackKey: "master",
    name: "CyberPath Master",
    primary: "#f2cc60",
    secondary: "#d29922",
    accent: "#fef08a",
    steelLight: "#f59e0b",
    steelDark: "#78350f",
    plateBg: "#231805",
    glowColor: "rgba(242, 204, 96, 0.55)",
    glowColorSecondary: "rgba(210, 153, 34, 0.4)",
    ringColor: "#f2cc60",
    tagline: "Apex Platform Credential",
    tierName: "Prestigious Apex",
  },
};

/**
 * Determine track palette for a badge definition
 */
export function getTrackPalette(badge) {
  if (badge?.isMaster || badge?.track === "Apex Credential" || badge?.slug === "cyberpath-master") {
    return TRACK_PALETTES.Master;
  }
  if (badge?.track === "Red Team") return TRACK_PALETTES["Red Team"];
  if (badge?.track === "Blue Team") return TRACK_PALETTES["Blue Team"];
  if (badge?.track === "Web Security") return TRACK_PALETTES["Web Security"];
  return TRACK_PALETTES["Red Team"];
}

/**
 * Calculate progress for a specific badge given completed lessons and quiz attempts
 */
export function getBadgeProgress(badge, completedLessonSlugs = [], quizAttemptsMap = {}, earnedBadges = []) {
  const earnedRecord = earnedBadges.find((b) => b.slug === badge.slug);
  const isEarned = Boolean(earnedRecord);

  // Fallback safe lists
  const completed = Array.isArray(completedLessonSlugs) ? completedLessonSlugs : [];
  const quizzes = quizAttemptsMap || {};

  let totalSteps = 1;
  let completedSteps = 0;
  let requirementText = badge.description;
  let pathSlug = "red-team";

  const redLessons = LEARNING_PATHS.find((p) => p.slug === "red-team")?.modules?.flatMap((m) => m.lessons) || [];
  const blueLessons = LEARNING_PATHS.find((p) => p.slug === "blue-team")?.modules?.flatMap((m) => m.lessons) || [];
  const webLessons = LEARNING_PATHS.find((p) => p.slug === "web-security")?.modules?.flatMap((m) => m.lessons) || [];
  const allLessons = getAllLessons();

  switch (badge.slug) {
    case "linux-explorer": {
      totalSteps = 2; // lesson + quiz
      const hasLesson = completed.includes("linux-fundamentals");
      const hasQuiz = Boolean(quizzes["quiz-linux"]?.some((a) => a.passed));
      completedSteps = (hasLesson ? 1 : 0) + (hasQuiz ? 1 : 0);
      requirementText = "Complete Linux fundamentals and pass knowledge assessment";
      pathSlug = "red-team";
      break;
    }
    case "network-navigator": {
      totalSteps = 2;
      const hasLesson = completed.includes("networking-fundamentals");
      const hasQuiz = Boolean(quizzes["quiz-networking"]?.some((a) => a.passed));
      completedSteps = (hasLesson ? 1 : 0) + (hasQuiz ? 1 : 0);
      requirementText = "Complete networking fundamentals and pass protocol assessment";
      pathSlug = "red-team";
      break;
    }
    case "recon-specialist": {
      totalSteps = 2;
      const hasLesson = completed.includes("nmap-fundamentals");
      const hasQuiz = Boolean(quizzes["quiz-nmap"]?.some((a) => a.passed));
      completedSteps = (hasLesson ? 1 : 0) + (hasQuiz ? 1 : 0);
      requirementText = "Complete reconnaissance and Nmap scanning assessment";
      pathSlug = "red-team";
      break;
    }
    case "web-apprentice": {
      totalSteps = 2;
      const hasLesson = completed.includes("how-websites-work");
      const hasQuiz = Boolean(quizzes["quiz-auth-sessions"]?.some((a) => a.passed));
      completedSteps = (hasLesson ? 1 : 0) + (hasQuiz ? 1 : 0);
      requirementText = "Complete web basics and pass HTTP protocol assessment";
      pathSlug = "web-security";
      break;
    }
    case "red-team-specialist": {
      totalSteps = redLessons.length || 12;
      completedSteps = redLessons.filter((l) => completed.includes(l.slug)).length;
      requirementText = `12 Lessons · 8 Authorized Labs · Red Team Path`;
      pathSlug = "red-team";
      break;
    }
    case "blue-team-defender": {
      totalSteps = blueLessons.length || 9;
      completedSteps = blueLessons.filter((l) => completed.includes(l.slug)).length;
      requirementText = `9 Lessons · 8 Telemetry Labs · Blue Team Path`;
      pathSlug = "blue-team";
      break;
    }
    case "web-security-expert": {
      totalSteps = webLessons.length || 10;
      completedSteps = webLessons.filter((l) => completed.includes(l.slug)).length;
      requirementText = `10 Lessons · 10 Vulnerability Labs · Web Security Path`;
      pathSlug = "web-security";
      break;
    }
    case "cyberpath-master": {
      totalSteps = allLessons.length || 31;
      completedSteps = allLessons.filter((l) => completed.includes(l.slug)).length;
      requirementText = `All 3 Tracks (31 Lessons) · Capstone Mastery`;
      pathSlug = "all";
      break;
    }
    default: {
      totalSteps = 1;
      completedSteps = isEarned ? 1 : 0;
      break;
    }
  }

  if (isEarned) {
    completedSteps = totalSteps;
  }

  const percent = totalSteps > 0 ? Math.min(100, Math.round((completedSteps / totalSteps) * 100)) : 0;
  const remainingSteps = Math.max(0, totalSteps - completedSteps);

  let state = "locked";
  if (isEarned) {
    state = "earned";
  } else if (completedSteps > 0) {
    state = "in_progress";
  }

  return {
    badge,
    isEarned,
    state,
    totalSteps,
    completedSteps,
    remainingSteps,
    percent,
    requirementText,
    pathSlug,
    earnedAt: earnedRecord?.earnedAt || null,
  };
}

/**
 * Determine the closest next badge to unlock
 */
export function getNextBadgeToUnlock(badgesList, completedLessonSlugs = [], quizAttemptsMap = {}, earnedBadges = [], currentPath = "red-team") {
  const unearned = badgesList
    .map((badge) => getBadgeProgress(badge, completedLessonSlugs, quizAttemptsMap, earnedBadges))
    .filter((item) => !item.isEarned);

  if (unearned.length === 0) return null;

  // Sort by:
  // 1. In progress (highest completion percentage)
  // 2. Fewest remaining steps
  // 3. Matching current path
  return unearned.sort((a, b) => {
    if (a.percent !== b.percent) {
      return b.percent - a.percent;
    }
    if (a.remainingSteps !== b.remainingSteps) {
      return a.remainingSteps - b.remainingSteps;
    }
    const aMatches = a.pathSlug === currentPath ? 1 : 0;
    const bMatches = b.pathSlug === currentPath ? 1 : 0;
    return bMatches - aMatches;
  })[0];
}

/**
 * Generate and trigger download of a high-resolution PNG credential
 */
export function downloadBadgePng(badge, earnedDate, studentName = "CyberPath Student") {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const width = 800;
  const height = 800;
  canvas.width = width;
  canvas.height = height;

  const palette = getTrackPalette(badge);
  const isMaster = badge.isMaster || badge.slug === "cyberpath-master";

  // 1. Dark futuristic card backdrop
  const bgGrad = ctx.createRadialGradient(400, 320, 40, 400, 400, 480);
  bgGrad.addColorStop(0, palette.plateBg);
  bgGrad.addColorStop(0.7, "#0f172a");
  bgGrad.addColorStop(1, "#090d16");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Cyber grid dots
  ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
  for (let x = 20; x < width; x += 30) {
    for (let y = 20; y < height; y += 30) {
      ctx.fillRect(x, y, 2, 2);
    }
  }

  // 3. Outer cyber border
  ctx.strokeStyle = palette.primary;
  ctx.lineWidth = 3;
  ctx.strokeRect(30, 30, width - 60, height - 60);

  ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
  ctx.lineWidth = 1;
  ctx.strokeRect(40, 40, width - 80, height - 80);

  // Decorative corner brackets
  ctx.strokeStyle = palette.primary;
  ctx.lineWidth = 6;
  const cornerLen = 28;
  // Top-left
  ctx.beginPath();
  ctx.moveTo(30, 30 + cornerLen);
  ctx.lineTo(30, 30);
  ctx.lineTo(30 + cornerLen, 30);
  ctx.stroke();
  // Top-right
  ctx.beginPath();
  ctx.moveTo(width - 30 - cornerLen, 30);
  ctx.lineTo(width - 30, 30);
  ctx.lineTo(width - 30, 30 + cornerLen);
  ctx.stroke();
  // Bottom-left
  ctx.beginPath();
  ctx.moveTo(30, height - 30 - cornerLen);
  ctx.lineTo(30, height - 30);
  ctx.lineTo(30 + cornerLen, height - 30);
  ctx.stroke();
  // Bottom-right
  ctx.beginPath();
  ctx.moveTo(width - 30 - cornerLen, height - 30);
  ctx.lineTo(width - 30, height - 30);
  ctx.lineTo(width - 30, height - 30 - cornerLen);
  ctx.stroke();

  // 4. Header title
  ctx.textAlign = "center";
  ctx.font = "bold 14px 'Courier New', monospace";
  ctx.fillStyle = palette.primary;
  ctx.fillText("CYBERPATH VERIFIED CREDENTIAL · AUTHENTICATED EMBLM", 400, 85);

  // 5. Draw Shield / Hexagon Emblem on Canvas
  const cx = 400;
  const cy = 290;
  const rad = 130;

  // Outer glowing aura
  const aura = ctx.createRadialGradient(cx, cy, 30, cx, cy, rad + 40);
  aura.addColorStop(0, palette.glowColor);
  aura.addColorStop(1, "transparent");
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(cx, cy, rad + 40, 0, Math.PI * 2);
  ctx.fill();

  // Shield Geometry
  function createShieldPath(scale = 1.0) {
    const p = new Path2D();
    const w = 90 * scale;
    const topY = cy - 100 * scale;
    const midY = cy + 20 * scale;
    const botY = cy + 120 * scale;

    p.moveTo(cx - w + 20 * scale, topY);
    p.lineTo(cx + w - 20 * scale, topY);
    p.lineTo(cx + w, topY + 25 * scale);
    p.lineTo(cx + w, midY);
    p.lineTo(cx, botY);
    p.lineTo(cx - w, midY);
    p.lineTo(cx - w, topY + 25 * scale);
    p.closePath();
    return p;
  }

  // Outer rim
  const rimPath = createShieldPath(1.12);
  const rimGrad = ctx.createLinearGradient(cx - 100, cy - 100, cx + 100, cy + 100);
  rimGrad.addColorStop(0, isMaster ? "#fef08a" : palette.steelLight);
  rimGrad.addColorStop(0.5, isMaster ? "#d97706" : palette.primary);
  rimGrad.addColorStop(1, isMaster ? "#fbbf24" : palette.steelDark);
  ctx.fillStyle = rimGrad;
  ctx.fill(rimPath);

  // Inner plate
  const platePath = createShieldPath(0.96);
  const plateGrad = ctx.createRadialGradient(cx, cy - 20, 10, cx, cy, 110);
  plateGrad.addColorStop(0, isMaster ? "#2a1c06" : palette.plateBg);
  plateGrad.addColorStop(1, "#0d1117");
  ctx.fillStyle = plateGrad;
  ctx.fill(platePath);

  // Bevel border
  ctx.strokeStyle = isMaster ? "#fef08a" : palette.accent;
  ctx.lineWidth = 2.5;
  ctx.stroke(platePath);

  // Center Emblem Graphic / Stars
  if (isMaster) {
    // 3 Gold Stars
    ctx.fillStyle = "#fef08a";
    ctx.font = "24px sans-serif";
    ctx.fillText("★   ★   ★", cx, cy - 35);
  }

  // Center Emblem Text / Title
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 34px sans-serif";
  ctx.fillText(badge.name, 400, 480);

  // Track Pill
  ctx.font = "bold 15px 'Courier New', monospace";
  ctx.fillStyle = palette.primary;
  ctx.fillText(`TRACK: ${badge.track.toUpperCase()} · ${palette.tierName.toUpperCase()}`, 400, 520);

  // Description / requirement
  ctx.font = "14px sans-serif";
  ctx.fillStyle = "#8b98a8";
  ctx.fillText(badge.description, 400, 555);

  // Divider
  ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(150, 600);
  ctx.lineTo(650, 600);
  ctx.stroke();

  // Student and Date details
  ctx.textAlign = "left";
  ctx.font = "14px sans-serif";
  ctx.fillStyle = "#8b98a8";
  ctx.fillText("AWARDED TO:", 150, 640);
  ctx.fillText("DATE VERIFIED:", 150, 675);
  ctx.fillText("INTEGRITY STATUS:", 150, 710);

  ctx.textAlign = "right";
  ctx.fillStyle = "#f0f6fc";
  ctx.font = "bold 15px sans-serif";
  ctx.fillText(studentName, 650, 640);

  ctx.fillStyle = palette.primary;
  ctx.font = "bold 14px 'Courier New', monospace";
  const dateStr = earnedDate ? new Date(earnedDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : new Date().toLocaleDateString();
  ctx.fillText(dateStr, 650, 675);

  ctx.fillStyle = "#3fb950";
  ctx.font = "bold 13px 'Courier New', monospace";
  ctx.fillText("CRYPTOGRAPHICALLY VERIFIED ✓", 650, 710);

  // Export and download
  const link = document.createElement("a");
  link.download = `CyberPath-Credential-${badge.slug}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}
