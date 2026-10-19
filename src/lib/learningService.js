import { supabase, isSupabaseConfigured } from "./supabase.js";
import {
  LEARNING_PATHS,
  BADGES_DEFINITION,
  getAllLessons,
  getPathBySlug,
  getLessonBySlug,
} from "../data/curriculumData.js";
import { getPersonalizedRecommendation } from "./recommendationEngine.js";
import { getUserXpProfile, awardLocalXp, XP_CONFIG } from "./xpService.js";
import { getUserStreakData, recordDailyActivity } from "./streakService.js";

const LOCAL_PROGRESS_PREFIX = "cyberpath_progress_";
const LOCAL_QUIZ_PREFIX = "cyberpath_quizzes_";
const LOCAL_BADGES_PREFIX = "cyberpath_badges_";

/**
 * Returns local storage key tailored to current user
 */
function getUserKey(prefix, userId) {
  const uid = userId || "guest_student";
  return `${prefix}${uid}`;
}

/**
 * Get all completed lesson slugs for a user
 */
export async function getCompletedLessonSlugs(userId) {
  if (!userId) return [];

  // Try fetching from Supabase first if configured
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("student_lesson_progress")
        .select("lessons(slug), status")
        .eq("user_id", userId)
        .eq("status", "completed");

      if (!error && data && data.length > 0) {
        const remoteSlugs = data
          .map((row) => row.lessons?.slug)
          .filter(Boolean);

        // Sync to local cache
        const key = getUserKey(LOCAL_PROGRESS_PREFIX, userId);
        const existing = JSON.parse(localStorage.getItem(key) || "[]");
        const merged = Array.from(new Set([...existing, ...remoteSlugs]));
        localStorage.setItem(key, JSON.stringify(merged));

        return merged;
      }
    } catch {
      // Fallback to local storage
    }
  }

  // Fallback to local cache
  const key = getUserKey(LOCAL_PROGRESS_PREFIX, userId);
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

/**
 * Mark a lesson as completed
 * Awards XP, updates streaks, and evaluates badges.
 */
export async function markLessonComplete(userId, pathSlug, lessonSlug) {
  if (!userId) return { success: false, error: "Authentication required" };

  // 1. Check if first-time completion
  const key = getUserKey(LOCAL_PROGRESS_PREFIX, userId);
  const currentCompleted = JSON.parse(localStorage.getItem(key) || "[]");
  const isFirstCompletion = !currentCompleted.includes(lessonSlug);

  if (isFirstCompletion) {
    currentCompleted.push(lessonSlug);
    localStorage.setItem(key, JSON.stringify(currentCompleted));
  }

  let newlyAwardedBadges = [];
  let xpAwarded = 0;

  // 2. Try Supabase persistence & secure RPC
  if (isSupabaseConfigured) {
    try {
      const { data: lessonRecord } = await supabase
        .from("lessons")
        .select("id")
        .eq("slug", lessonSlug)
        .maybeSingle();

      if (lessonRecord?.id) {
        const { data: rpcResult, error: rpcError } = await supabase.rpc(
          "complete_lesson",
          { p_lesson_id: lessonRecord.id }
        );

        if (!rpcError && rpcResult) {
          if (rpcResult.new_badges_awarded) {
            newlyAwardedBadges = rpcResult.new_badges_awarded;
          }
          if (rpcResult.xp_awarded) {
            xpAwarded = rpcResult.xp_awarded;
          }
        } else {
          // Fallback direct upsert
          await supabase.from("student_lesson_progress").upsert({
            user_id: userId,
            lesson_id: lessonRecord.id,
            status: "completed",
            completed_at: new Date().toISOString(),
          });
        }
      }
    } catch {
      // Handled gracefully
    }
  }

  // 3. XP & Streak Rewards (applied if first completion or local fallback)
  if (isFirstCompletion) {
    // A. Lesson completion reward (10 XP)
    const lessonXpRes = awardLocalXp({
      userId,
      actionType: "lesson_completed",
      referenceId: lessonSlug,
      amount: XP_CONFIG.LESSON_COMPLETION,
      description: `Completed lesson: ${lessonSlug}`,
    });
    if (lessonXpRes.awarded) xpAwarded += XP_CONFIG.LESSON_COMPLETION;

    // B. Record daily learning activity for streak
    await recordDailyActivity(userId, "lesson_completed");

    // C. Check module completion milestone (50 XP)
    const path = getPathBySlug(pathSlug);
    if (path) {
      const targetModule = path.modules.find((m) =>
        m.lessons.some((l) => l.slug === lessonSlug)
      );
      if (targetModule) {
        const allModLessonsCompleted = targetModule.lessons.every((l) =>
          currentCompleted.includes(l.slug)
        );
        if (allModLessonsCompleted) {
          const modXpRes = awardLocalXp({
            userId,
            actionType: "module_completed",
            referenceId: targetModule.id,
            amount: XP_CONFIG.MODULE_COMPLETION,
            description: `Mastered module: ${targetModule.title}`,
          });
          if (modXpRes.awarded) xpAwarded += XP_CONFIG.MODULE_COMPLETION;
        }
      }

      // D. Check full path completion milestone (200 XP)
      const allPathLessons = path.modules.flatMap((m) => m.lessons.map((l) => l.slug));
      const isPathFullyCompleted = allPathLessons.every((slug) =>
        currentCompleted.includes(slug)
      );
      if (isPathFullyCompleted) {
        const pathXpRes = awardLocalXp({
          userId,
          actionType: "path_completed",
          referenceId: pathSlug,
          amount: XP_CONFIG.PATH_COMPLETION,
          description: `Conquered entire learning path: ${path.title}`,
        });
        if (pathXpRes.awarded) xpAwarded += XP_CONFIG.PATH_COMPLETION;
      }
    }
  }

  // 4. Evaluate local badges check
  const localBadges = evaluateLocalBadges(userId);
  if (localBadges.newlyUnlocked.length > 0) {
    newlyAwardedBadges = Array.from(
      new Set([...newlyAwardedBadges, ...localBadges.newlyUnlocked])
    );
  }

  return {
    success: true,
    completedSlugs: currentCompleted,
    newlyAwardedBadges,
    xpAwarded,
  };
}

/**
 * Get assessment attempt history for a specific quiz
 */
export async function getQuizAttempts(userId, quizSlug) {
  if (!userId) return [];

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("assessment_attempts")
        .select("*, assessments!inner(slug)")
        .eq("user_id", userId)
        .eq("assessments.slug", quizSlug)
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data;
      }
    } catch {
      // fallback
    }
  }

  const key = getUserKey(LOCAL_QUIZ_PREFIX, userId);
  try {
    const all = JSON.parse(localStorage.getItem(key) || "{}");
    return all[quizSlug] || [];
  } catch {
    return [];
  }
}

/**
 * Get all assessment attempts across all quizzes for a user
 */
export async function getAllQuizAttempts(userId) {
  if (!userId) return {};

  const key = getUserKey(LOCAL_QUIZ_PREFIX, userId);
  let localMap = {};
  try {
    localMap = JSON.parse(localStorage.getItem(key) || "{}");
  } catch {
    localMap = {};
  }

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("assessment_attempts")
        .select("*, assessments(slug)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (!error && data) {
        const remoteMap = {};
        for (const item of data) {
          const s = item.assessments?.slug;
          if (s) {
            if (!remoteMap[s]) remoteMap[s] = [];
            remoteMap[s].push(item);
          }
        }
        // merge with local
        return { ...localMap, ...remoteMap };
      }
    } catch {
      // fallback
    }
  }

  return localMap;
}

/**
 * Submit quiz answers securely
 * Awards XP for first passing score, records streaks, and evaluates badges.
 */
export async function submitQuizAnswers(userId, quizData, selectedAnswers) {
  if (!userId) return { error: "Authentication required" };

  const totalQuestions = quizData.questions.length;
  let correctCount = 0;
  const feedback = [];

  for (const q of quizData.questions) {
    const chosen = selectedAnswers[q.id];
    const isCorrect = chosen === q.correctOptionId;
    if (isCorrect) correctCount++;

    feedback.push({
      questionId: q.id,
      isCorrect,
      explanation: q.explanation,
    });
  }

  const score = Math.round((correctCount / totalQuestions) * 100);
  const passed = score >= quizData.passingScore;

  // Retrieve previous attempts to prevent duplicate XP for retries
  const key = getUserKey(LOCAL_QUIZ_PREFIX, userId);
  const allAttempts = JSON.parse(localStorage.getItem(key) || "{}");
  const pastAttemptsForQuiz = allAttempts[quizData.slug] || [];
  const hadPassedPreviously = pastAttemptsForQuiz.some((a) => a.passed === true);

  const attemptRecord = {
    quizSlug: quizData.slug,
    score,
    passed,
    passingThreshold: quizData.passingScore,
    answers: selectedAnswers,
    feedback,
    createdAt: new Date().toISOString(),
  };

  if (!allAttempts[quizData.slug]) {
    allAttempts[quizData.slug] = [];
  }
  allAttempts[quizData.slug].unshift(attemptRecord);
  localStorage.setItem(key, JSON.stringify(allAttempts));

  let newlyAwardedBadges = [];
  let xpAwarded = 0;

  // Try Supabase RPC
  if (isSupabaseConfigured) {
    try {
      const { data: assessmentRecord } = await supabase
        .from("assessments")
        .select("id")
        .eq("slug", quizData.slug)
        .maybeSingle();

      if (assessmentRecord?.id) {
        const { data: rpcData, error: rpcError } = await supabase.rpc(
          "submit_assessment",
          {
            p_assessment_id: assessmentRecord.id,
            p_answers: selectedAnswers,
          }
        );

        if (!rpcError && rpcData) {
          if (rpcData.new_badges_awarded) {
            newlyAwardedBadges = rpcData.new_badges_awarded;
          }
          if (rpcData.xp_awarded) {
            xpAwarded = rpcData.xp_awarded;
          }
        }
      }
    } catch {
      // local fallback handled
    }
  }

  // If passed for the very first time, award 25 XP and record daily streak activity
  if (passed && !hadPassedPreviously) {
    const xpRes = awardLocalXp({
      userId,
      actionType: "assessment_passed",
      referenceId: quizData.slug,
      amount: XP_CONFIG.ASSESSMENT_PASS,
      description: `Passed assessment: ${quizData.title} (${score}%)`,
    });
    if (xpRes.awarded) {
      xpAwarded += XP_CONFIG.ASSESSMENT_PASS;
    }
    await recordDailyActivity(userId, "assessment_passed");
  }

  // Also check local badge unlocks
  const localBadges = evaluateLocalBadges(userId);
  if (localBadges.newlyUnlocked.length > 0) {
    newlyAwardedBadges = Array.from(
      new Set([...newlyAwardedBadges, ...localBadges.newlyUnlocked])
    );
  }

  return {
    score,
    passed,
    passingScore: quizData.passingScore,
    feedback,
    newlyAwardedBadges,
    xpAwarded,
  };
}

/**
 * Evaluate badges locally based on earned progress & quiz attempts
 */
export function evaluateLocalBadges(userId) {
  if (!userId) return { earned: [], newlyUnlocked: [] };

  const progressKey = getUserKey(LOCAL_PROGRESS_PREFIX, userId);
  const completedLessons = JSON.parse(
    localStorage.getItem(progressKey) || "[]"
  );

  const quizKey = getUserKey(LOCAL_QUIZ_PREFIX, userId);
  const quizMap = JSON.parse(localStorage.getItem(quizKey) || "{}");
  const isQuizPassed = (slug) => {
    const attempts = quizMap[slug] || [];
    return attempts.some((a) => a.passed);
  };

  const badgeKey = getUserKey(LOCAL_BADGES_PREFIX, userId);
  const currentlyEarned = JSON.parse(localStorage.getItem(badgeKey) || "[]");
  const currentlyEarnedSlugs = currentlyEarned.map((b) => b.slug);

  const newlyUnlocked = [];

  for (const badge of BADGES_DEFINITION) {
    if (currentlyEarnedSlugs.includes(badge.slug)) continue;

    let qualifies = false;

    if (badge.slug === "linux-explorer") {
      qualifies =
        completedLessons.includes("linux-fundamentals") &&
        isQuizPassed("quiz-linux");
    } else if (badge.slug === "network-navigator") {
      qualifies =
        (completedLessons.includes("networking-fundamentals") && isQuizPassed("quiz-networking")) ||
        (completedLessons.includes("lan-wan-client-server") && (isQuizPassed("quiz-lan-wan") || isQuizPassed("quiz-switches-routers") || completedLessons.includes("switches-routers-mac-ip")));
    } else if (badge.slug === "web-apprentice") {
      qualifies =
        completedLessons.includes("how-websites-work") &&
        isQuizPassed("quiz-auth-sessions");
    } else if (badge.slug === "recon-specialist") {
      qualifies =
        completedLessons.includes("nmap-fundamentals") &&
        isQuizPassed("quiz-nmap");
    } else if (badge.slug === "red-team-specialist") {
      const redPath = getPathBySlug("red-team");
      const redLessons = redPath.modules.flatMap((m) =>
        m.lessons.map((l) => l.slug)
      );
      qualifies = redLessons.every((slug) => completedLessons.includes(slug));
    } else if (badge.slug === "blue-team-defender") {
      const bluePath = getPathBySlug("blue-team");
      const blueLessons = bluePath.modules.flatMap((m) =>
        m.lessons.map((l) => l.slug)
      );
      qualifies = blueLessons.every((slug) => completedLessons.includes(slug));
    } else if (badge.slug === "web-security-expert") {
      const webPath = getPathBySlug("web-security");
      const webLessons = webPath.modules.flatMap((m) =>
        m.lessons.map((l) => l.slug)
      );
      qualifies = webLessons.every((slug) => completedLessons.includes(slug));
    } else if (badge.slug === "cyberpath-master") {
      const all = getAllLessons().map((l) => l.slug);
      qualifies = all.every((slug) => completedLessons.includes(slug));
    }

    if (qualifies) {
      const newAward = {
        slug: badge.slug,
        name: badge.name,
        description: badge.description,
        badgeType: badge.badgeType,
        earnedAt: new Date().toISOString(),
      };
      currentlyEarned.push(newAward);
      newlyUnlocked.push(badge);
    }
  }

  if (newlyUnlocked.length > 0) {
    localStorage.setItem(badgeKey, JSON.stringify(currentlyEarned));
  }

  return { earned: currentlyEarned, newlyUnlocked };
}

/**
 * Fetch all earned badges for a user
 */
export async function getStudentBadges(userId) {
  if (!userId) return [];

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("student_badges")
        .select("earned_at, badges(slug, name, description, badge_type)")
        .eq("user_id", userId);

      if (!error && data && data.length > 0) {
        const badges = data.map((b) => ({
          slug: b.badges?.slug,
          name: b.badges?.name,
          description: b.badges?.description,
          badgeType: b.badges?.badge_type,
          earnedAt: b.earned_at,
        }));

        // Merge with local storage
        const badgeKey = getUserKey(LOCAL_BADGES_PREFIX, userId);
        localStorage.setItem(badgeKey, JSON.stringify(badges));
        return badges;
      }
    } catch {
      // fallback
    }
  }

  const local = evaluateLocalBadges(userId);
  return local.earned;
}

/**
 * Get assessment performance summary for user profile
 */
export async function getStudentAssessmentSummary(userId) {
  const quizMap = await getAllQuizAttempts(userId);
  const allAttempts = Object.values(quizMap).flat();

  const totalAttempts = allAttempts.length;
  const passedQuizzes = Object.keys(quizMap).filter((slug) =>
    quizMap[slug].some((a) => a.passed)
  );

  const averageScore =
    totalAttempts > 0
      ? Math.round(
          allAttempts.reduce((acc, a) => acc + (a.score || 0), 0) / totalAttempts
        )
      : 0;

  const passedAttemptsCount = allAttempts.filter((a) => a.passed).length;
  const passRate =
    totalAttempts > 0
      ? Math.round((passedAttemptsCount / totalAttempts) * 100)
      : 0;

  return {
    totalAttempts,
    passedQuizzesCount: passedQuizzes.length,
    averageScore,
    passRate,
    allAttempts,
    quizMap,
  };
}

/**
 * Calculates complete student dashboard metrics from real persisted data
 */
export async function getStudentDashboardMetrics(userId, selectedPathSlug) {
  const activePathSlug = selectedPathSlug || "red-team";
  const path = getPathBySlug(activePathSlug) || LEARNING_PATHS[0];

  const [completedLessonSlugs, earnedBadges, xpProfile, streakData, quizAttemptsMap] =
    await Promise.all([
      getCompletedLessonSlugs(userId),
      getStudentBadges(userId),
      getUserXpProfile(userId),
      getUserStreakData(userId),
      getAllQuizAttempts(userId),
    ]);

  // Path-specific lessons
  const pathLessons = path.modules.flatMap((m) => m.lessons);
  const totalPathLessons = pathLessons.length;
  const completedPathLessons = pathLessons.filter((l) =>
    completedLessonSlugs.includes(l.slug)
  );

  const percentComplete =
    totalPathLessons > 0
      ? Math.round((completedPathLessons.length / totalPathLessons) * 100)
      : 0;

  // Next recommended lesson via old sequential lookup (kept for fallback compatibility)
  const nextLesson =
    pathLessons.find((l) => !completedLessonSlugs.includes(l.slug)) ||
    pathLessons[0];

  // Current module
  const currentModule =
    path.modules.find((m) =>
      m.lessons.some((l) => !completedLessonSlugs.includes(l.slug))
    ) || path.modules[path.modules.length - 1];

  // Modules summary
  const moduleSummaries = path.modules.map((m) => {
    const totalInMod = m.lessons.length;
    const completedInMod = m.lessons.filter((l) =>
      completedLessonSlugs.includes(l.slug)
    ).length;
    return {
      id: m.id,
      title: m.title,
      total: totalInMod,
      completed: completedInMod,
      isFinished: totalInMod > 0 && completedInMod >= totalInMod,
    };
  });

  // Global counts across all tracks
  const allLessons = getAllLessons();
  const totalGlobalCompleted = allLessons.filter((l) =>
    completedLessonSlugs.includes(l.slug)
  ).length;

  // Deterministic Personalized Recommendation (Phase 4.1)
  const recommendation = getPersonalizedRecommendation({
    selectedPathSlug: activePathSlug,
    completedLessonSlugs,
    quizAttemptsMap,
  });

  return {
    path,
    percentComplete,
    totalPathLessons,
    completedCount: completedPathLessons.length,
    remainingCount: totalPathLessons - completedPathLessons.length,
    nextLesson,
    currentModule,
    moduleSummaries,
    completedLessonSlugs,
    earnedBadges,
    totalGlobalCompleted,
    totalGlobalLessons: allLessons.length,
    // Phase 4 Gamification & Recommendation Engine Additions:
    recommendation,
    xpProfile,
    streakData,
    quizAttemptsMap,
  };
}
