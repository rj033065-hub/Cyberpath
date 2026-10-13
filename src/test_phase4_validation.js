/**
 * CyberPath — Phase 4 Comprehensive Automated Logic Verification Script
 *
 * Verifies:
 * 1. Deterministic Recommendation Engine (new students, prerequisites, review on failed quiz, path completion, apex master).
 * 2. XP Ledger & Idempotency (prevent duplicate awards, derive levels, calculate tier progress).
 * 3. Daily Streak Tracking (consecutive days, missed days, at-risk status, longest historical streak).
 * 4. Resource Catalog schema and official platform URLs.
 */

import { getPersonalizedRecommendation } from "./lib/recommendationEngine.js";
import { calculateLevelFromXp, awardLocalXp, XP_CONFIG } from "./lib/xpService.js";
import { calculateStreaksFromDates, formatLocalDate } from "./lib/streakService.js";
import { CURATED_RESOURCES, RESOURCE_PLATFORMS } from "./data/resourceCatalogData.js";
import { getPathBySlug } from "./data/curriculumData.js";

console.log("===============================================================");
console.log("CYBERPATH PHASE 4: AUTOMATED VERIFICATION SUITE");
console.log("===============================================================\n");

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName) {
  totalTests++;
  if (condition) {
    console.log(`✓ PASS: ${testName}`);
    passedTests++;
  } else {
    console.error(`✗ FAIL: ${testName}`);
  }
}

// ---------------------------------------------------------------------------
// TEST SUITE 1: Recommendation Engine
// ---------------------------------------------------------------------------
console.log("--- 1. Testing Deterministic Recommendation Engine ---");

// Test 1.1: Brand new student with 0 progress
const recNew = getPersonalizedRecommendation({
  selectedPathSlug: "red-team",
  completedLessonSlugs: [],
  quizAttemptsMap: {},
});
assert(
  recNew.type === "lesson" &&
  recNew.lessonSlug === "cybersecurity-fundamentals-and-ethics" &&
  recNew.actionLabel === "Begin First Lesson",
  "New student receives first foundational lesson with introductory reason"
);

// Test 1.2: Student progressing sequentially
const recStep2 = getPersonalizedRecommendation({
  selectedPathSlug: "red-team",
  completedLessonSlugs: ["cybersecurity-fundamentals-and-ethics"],
  quizAttemptsMap: {},
});
assert(
  recStep2.type === "lesson" &&
  recStep2.lessonSlug === "linux-fundamentals",
  "Progressing student receives next sequential lesson whose prerequisites are met"
);

// Test 1.3: Failed assessment review recovery (highest priority)
const recFailedQuiz = getPersonalizedRecommendation({
  selectedPathSlug: "red-team",
  completedLessonSlugs: ["cybersecurity-fundamentals-and-ethics", "linux-fundamentals"],
  quizAttemptsMap: {
    "quiz-linux": [
      { score: 50, passed: false, passingThreshold: 75, createdAt: new Date().toISOString() },
    ],
  },
});
assert(
  recFailedQuiz.type === "review" &&
  recFailedQuiz.isRetryRecommendation === true &&
  recFailedQuiz.lessonSlug === "linux-fundamentals" &&
  recFailedQuiz.reason.includes("50%"),
  "Failed assessment triggers targeted lesson review before recommending forward lessons"
);

// Test 1.4: Completed track redirects to next incomplete track
const redPath = getPathBySlug("red-team");
const allRedLessons = redPath.modules.flatMap((m) => m.lessons.map((l) => l.slug));

const recTrackComplete = getPersonalizedRecommendation({
  selectedPathSlug: "red-team",
  completedLessonSlugs: allRedLessons,
  quizAttemptsMap: {},
});
assert(
  recTrackComplete.type === "next_path" &&
  recTrackComplete.pathSlug === "blue-team",
  "100% completed track recommends advancing to the next specialization track"
);

// Test 1.5: Apex Master (all 31 lessons completed across all 3 tracks)
const bluePath = getPathBySlug("blue-team");
const webPath = getPathBySlug("web-security");
const allLessons = [
  ...allRedLessons,
  ...bluePath.modules.flatMap((m) => m.lessons.map((l) => l.slug)),
  ...webPath.modules.flatMap((m) => m.lessons.map((l) => l.slug)),
];

const recAllComplete = getPersonalizedRecommendation({
  selectedPathSlug: "red-team",
  completedLessonSlugs: allLessons,
  quizAttemptsMap: {},
});
assert(
  recAllComplete.type === "explore" &&
  recAllComplete.targetUrl === "/explore",
  "Apex graduate with all tracks complete is directed to CTF & Lab Explorer"
);

// ---------------------------------------------------------------------------
// TEST SUITE 2: XP Ledger & Levels System
// ---------------------------------------------------------------------------
console.log("\n--- 2. Testing XP Ledger & Leveling Calculations ---");

// Test 2.1: Level 1 Novice calculations
const lvl0 = calculateLevelFromXp(0);
assert(
  lvl0.level === 1 && lvl0.title === "Novice Explorer" && lvl0.progressPercent === 0,
  "0 XP maps to Level 1 Novice Explorer with 0% progress"
);

// Test 2.2: Level 2 Apprentice transition
const lvl100 = calculateLevelFromXp(100);
assert(
  lvl100.level === 2 && lvl100.title === "Security Apprentice",
  "100 XP transitions to Level 2 Security Apprentice"
);

// Test 2.3: XP progression within level
const lvl175 = calculateLevelFromXp(175);
assert(
  lvl175.level === 2 && lvl175.xpInLevel === 75 && lvl175.progressPercent === 50,
  "175 XP correctly calculates 50% progression inside Level 2 (100-249 range)"
);

// Test 2.4: Simulated XP award idempotency
const mockUserId = `test-user-${Date.now()}`;
const firstAward = awardLocalXp({
  userId: mockUserId,
  actionType: "lesson_completed",
  referenceId: "nmap-fundamentals",
  amount: XP_CONFIG.LESSON_COMPLETION,
  description: "Completed Nmap scanning",
});
assert(firstAward.awarded === true, "First milestone completion successfully awards 10 XP");

const duplicateAward = awardLocalXp({
  userId: mockUserId,
  actionType: "lesson_completed",
  referenceId: "nmap-fundamentals",
  amount: XP_CONFIG.LESSON_COMPLETION,
  description: "Completed Nmap scanning",
});
assert(
  duplicateAward.awarded === false,
  "Duplicate award for same user and milestone is strictly rejected (idempotency)"
);

// ---------------------------------------------------------------------------
// TEST SUITE 3: Daily Learning Streak Engine
// ---------------------------------------------------------------------------
console.log("\n--- 3. Testing Daily Learning Streak Engine ---");

const today = new Date();
const todayStr = formatLocalDate(today);

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
const yesterdayStr = formatLocalDate(yesterday);

const twoDaysAgo = new Date();
twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
const twoDaysAgoStr = formatLocalDate(twoDaysAgo);

const fourDaysAgo = new Date();
fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);
const fourDaysAgoStr = formatLocalDate(fourDaysAgo);

// Test 3.1: Active today + yesterday + 2 days ago = 3 day streak
const streak3 = calculateStreaksFromDates([todayStr, yesterdayStr, twoDaysAgoStr]);
assert(
  streak3.currentStreak === 3 && streak3.streakStatus === "active_today",
  "Consecutive activity including today yields 3-day active streak"
);

// Test 3.2: Active yesterday but not yet today = 2 day streak "at_risk"
const streakAtRisk = calculateStreaksFromDates([yesterdayStr, twoDaysAgoStr]);
assert(
  streakAtRisk.currentStreak === 2 && streakAtRisk.streakStatus === "at_risk",
  "Activity yesterday preserves streak with 'at_risk' status encouraging activity today"
);

// Test 3.3: Missed yesterday and today = 0 streak
const streakMissed = calculateStreaksFromDates([twoDaysAgoStr, fourDaysAgoStr]);
assert(
  streakMissed.currentStreak === 0 && streakMissed.streakStatus === "inactive",
  "Missing yesterday and today resets current streak to 0"
);

// Test 3.4: Longest streak historical retention
const historicalDates = [
  todayStr,
  // gap
  "2026-09-01",
  "2026-09-02",
  "2026-09-03",
  "2026-09-04",
  "2026-09-05", // 5 day contiguous streak
];
const streakHist = calculateStreaksFromDates(historicalDates);
assert(
  streakHist.longestStreak === 5 && streakHist.currentStreak === 1,
  "Historical longest streak (5 days) is preserved even when current streak is 1"
);

// ---------------------------------------------------------------------------
// TEST SUITE 4: CTF & Lab Explorer Catalog
// ---------------------------------------------------------------------------
console.log("\n--- 4. Testing Resource Catalog Integrity ---");

assert(CURATED_RESOURCES.length >= 15, `Curated catalog contains ${CURATED_RESOURCES.length} verified resources`);

const hasOfficialTryHackMe = CURATED_RESOURCES.some((r) => r.platform.includes("TryHackMe"));
const hasOfficialPortSwigger = CURATED_RESOURCES.some((r) => r.platform.includes("PortSwigger"));
const hasOfficialOverTheWire = CURATED_RESOURCES.some((r) => r.platform.includes("OverTheWire"));
const hasOfficialHTB = CURATED_RESOURCES.some((r) => r.platform.includes("Hack The Box"));
const hasOfficialPwnCollege = CURATED_RESOURCES.some((r) => r.platform.includes("pwn.college"));

assert(
  hasOfficialTryHackMe && hasOfficialPortSwigger && hasOfficialOverTheWire && hasOfficialHTB && hasOfficialPwnCollege,
  "Catalog includes verified entries from TryHackMe, PortSwigger, OverTheWire, HTB, and pwn.college"
);

const allHaveValidUrls = CURATED_RESOURCES.every((r) => r.url.startsWith("https://"));
assert(allHaveValidUrls, "All curated resources link to secure HTTPS official URLs");

console.log("\n===============================================================");
console.log(`TEST RESULTS: ${passedTests} / ${totalTests} TESTS PASSED`);
console.log("===============================================================\n");

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}
