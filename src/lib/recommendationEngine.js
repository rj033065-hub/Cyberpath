/**
 * CyberPath — Phase 4.1 Deterministic Personalized Learning Engine
 *
 * Recommends the next high-impact learning step using real student progress:
 * 1. Prioritizes review if a recent assessment attempt was failed.
 * 2. Enforces strict prerequisite verification before suggesting new material.
 * 3. Adapts to new students with zero prior progress.
 * 4. Guides students to alternative specialization tracks when a path is completed.
 * 5. Directs all-track graduates to the CTF & Lab Explorer.
 *
 * Modular architecture: structured so an AI-driven model can cleanly interface
 * or augment this deterministic engine in the future.
 */

import {
  LEARNING_PATHS,
  getAllLessons,
  getPathBySlug,
} from "../data/curriculumData.js";

/**
 * Generates a primary personalized recommendation for the student.
 *
 * @param {Object} params
 * @param {string} params.selectedPathSlug - Currently active path (e.g. 'red-team')
 * @param {Array<string>} params.completedLessonSlugs - Slugs of completed lessons
 * @param {Object} params.quizAttemptsMap - Map of quizSlug -> Array of attempt records
 * @returns {Object} Deterministic recommendation payload
 */
export function getPersonalizedRecommendation({
  selectedPathSlug = "red-team",
  completedLessonSlugs = [],
  quizAttemptsMap = {},
}) {
  const completedSet = new Set(completedLessonSlugs || []);
  const allCurriculumLessons = getAllLessons();

  // --------------------------------------------------------------------------
  // Rule 1: Assessment Failure Recovery (Priority #1)
  // If student failed an assessment and hasn't yet passed it, recommend review
  // --------------------------------------------------------------------------
  for (const [quizSlug, attempts] of Object.entries(quizAttemptsMap || {})) {
    if (!attempts || attempts.length === 0) continue;

    // Check if user has eventually passed this quiz
    const hasPassed = attempts.some((a) => a.passed === true);
    if (!hasPassed) {
      // Find the most recent failed attempt
      const latestAttempt = attempts[0]; // ordered desc

      // Find the lesson associated with this quiz
      const associatedLesson = allCurriculumLessons.find(
        (l) => l.quiz && l.quiz.slug === quizSlug
      );

      if (associatedLesson) {
        return {
          type: "review",
          isRetryRecommendation: true,
          lesson: associatedLesson,
          title: `Review: ${associatedLesson.title}`,
          subtitle: `Knowledge Check Improvement Required`,
          pathSlug: associatedLesson.pathSlug,
          lessonSlug: associatedLesson.slug,
          targetUrl: `/learn/${associatedLesson.pathSlug}/${associatedLesson.slug}`,
          actionLabel: "Review Lesson & Retry Assessment",
          estimatedMinutes: associatedLesson.estimatedMinutes || 25,
          score: latestAttempt.score,
          threshold: latestAttempt.passingThreshold || associatedLesson.quiz.passingScore || 75,
          reason: `You scored ${latestAttempt.score}% on the "${associatedLesson.quiz.title}" assessment (passing threshold: ${associatedLesson.quiz.passingScore}%). Reviewing the lesson materials and practical labs will strengthen your understanding before retrying.`,
          badgeSlug: associatedLesson.quiz.slug,
        };
      }
    }
  }

  // --------------------------------------------------------------------------
  // Rule 2: Active Track Sequential Progression
  // Check student's selected learning path for the next incomplete lesson
  // whose prerequisites have been verified.
  // --------------------------------------------------------------------------
  const activePath = getPathBySlug(selectedPathSlug) || LEARNING_PATHS[0];
  const pathLessons = activePath.modules.flatMap((m) =>
    m.lessons.map((l) => ({ ...l, moduleTitle: m.title, moduleId: m.id }))
  );

  for (let i = 0; i < pathLessons.length; i++) {
    const currentLesson = pathLessons[i];

    // If lesson is not yet completed
    if (!completedSet.has(currentLesson.slug)) {
      // Verify prerequisites: all previous lessons in this track must be completed
      const priorLessons = pathLessons.slice(0, i);
      const prerequisitesMet = priorLessons.every((p) => completedSet.has(p.slug));

      if (prerequisitesMet) {
        // Case 2A: Brand new student (0 completed lessons in this track)
        if (completedSet.size === 0) {
          return {
            type: "lesson",
            isRetryRecommendation: false,
            lesson: currentLesson,
            title: currentLesson.title,
            subtitle: `First Foundational Milestone in ${activePath.title}`,
            pathSlug: activePath.slug,
            lessonSlug: currentLesson.slug,
            targetUrl: `/learn/${activePath.slug}/${currentLesson.slug}`,
            actionLabel: "Begin First Lesson",
            estimatedMinutes: currentLesson.estimatedMinutes || 30,
            moduleTitle: currentLesson.moduleTitle,
            reason: `Welcome to CyberPath! Every cybersecurity practitioner starts here. This foundational lesson establishes core ethics, legal boundaries, and essential security models.`,
          };
        }

        // Case 2B: Advancing to a new module
        const isFirstInModule =
          i === 0 || pathLessons[i - 1].moduleId !== currentLesson.moduleId;

        if (isFirstInModule) {
          return {
            type: "lesson",
            isRetryRecommendation: false,
            lesson: currentLesson,
            title: currentLesson.title,
            subtitle: `New Module: ${currentLesson.moduleTitle}`,
            pathSlug: activePath.slug,
            lessonSlug: currentLesson.slug,
            targetUrl: `/learn/${activePath.slug}/${currentLesson.slug}`,
            actionLabel: "Start Next Module",
            estimatedMinutes: currentLesson.estimatedMinutes || 30,
            moduleTitle: currentLesson.moduleTitle,
            reason: `All prerequisites for this stage are satisfied. Advance into ${currentLesson.moduleTitle} with hands-on concepts and guided labs.`,
          };
        }

        // Case 2C: Sequential continuation within current module
        const prevCompleted = pathLessons[i - 1];
        return {
          type: "lesson",
          isRetryRecommendation: false,
          lesson: currentLesson,
          title: currentLesson.title,
          subtitle: `Next Milestone in ${currentLesson.moduleTitle}`,
          pathSlug: activePath.slug,
          lessonSlug: currentLesson.slug,
          targetUrl: `/learn/${activePath.slug}/${currentLesson.slug}`,
          actionLabel: "Continue Learning",
          estimatedMinutes: currentLesson.estimatedMinutes || 30,
          moduleTitle: currentLesson.moduleTitle,
          reason: `Building directly upon your verified completion of "${prevCompleted.title}", this lesson dives into ${currentLesson.objectives?.[0] || currentLesson.summary || "practical technical workflows"}.`,
        };
      }
    }
  }

  // --------------------------------------------------------------------------
  // Rule 3: Active Path Complete — Cross-Track Recommendation
  // If active track is 100% complete, recommend next unfinished track
  // --------------------------------------------------------------------------
  for (const altPath of LEARNING_PATHS) {
    if (altPath.slug === activePath.slug) continue;

    const altLessons = altPath.modules.flatMap((m) => m.lessons);
    const incompleteAlt = altLessons.find((l) => !completedSet.has(l.slug));

    if (incompleteAlt) {
      return {
        type: "next_path",
        isRetryRecommendation: false,
        title: `Begin ${altPath.title} Specialization`,
        subtitle: `${activePath.title} Track Conquered (100%)`,
        pathSlug: altPath.slug,
        lessonSlug: incompleteAlt.slug,
        targetUrl: `/learn/${altPath.slug}/${incompleteAlt.slug}`,
        actionLabel: `Switch to ${altPath.title}`,
        estimatedMinutes: incompleteAlt.estimatedMinutes || 30,
        moduleTitle: altPath.modules[0].title,
        reason: `Outstanding work! You have conquered 100% of the ${activePath.title} track. To become a versatile practitioner and progress toward the apex CyberPath Master credential, start the ${altPath.title} curriculum.`,
      };
    }
  }

  // --------------------------------------------------------------------------
  // Rule 4: Apex Mastery Conquered (All 31 lessons complete)
  // Direct student to advanced external labs and CTFs in Resource Explorer
  // --------------------------------------------------------------------------
  return {
    type: "explore",
    isRetryRecommendation: false,
    title: "Apex Master: Explore Live CTFs & Guided Labs",
    subtitle: "All 31 Core Curriculum Milestones Completed!",
    targetUrl: "/explore",
    actionLabel: "Open CTF & Lab Explorer",
    estimatedMinutes: 60,
    moduleTitle: "External Challenge Explorer",
    reason: `You have completed all 31 verified curriculum lessons and unlocked the CyberPath Master credential. Put your practical offensive and defensive capabilities to the test against live CTFs on TryHackMe, PortSwigger, and OverTheWire.`,
  };
}
