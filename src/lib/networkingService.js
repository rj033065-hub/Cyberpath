/**
 * CyberPath — Dedicated Networking Module Service
 *
 * Handles:
 * - Lesson progress persistence and synchronization with learningService
 * - Mini-game score persistence and XP rewards
 * - Simulation completion tracking
 * - Safe guest vs authenticated isolation
 */

import { supabase, isSupabaseConfigured } from "./supabase";
import { awardLocalXp } from "./xpService";
import { getCompletedLessonSlugs, markLessonComplete } from "./learningService";
import { getAllNetworkingLessons } from "../data/networkingCurriculumData";

const LOCAL_NETWORKING_GAMES_PREFIX = "cyberpath_net_games_";
const LOCAL_NETWORKING_SIMS_PREFIX = "cyberpath_net_sims_";

function getGameKey(userId) {
  return `${LOCAL_NETWORKING_GAMES_PREFIX}${userId || "guest_student"}`;
}

function getSimKey(userId) {
  return `${LOCAL_NETWORKING_SIMS_PREFIX}${userId || "guest_student"}`;
}

/**
 * Get all completed networking lesson slugs for user
 */
export async function getNetworkingCompletedLessons(userId) {
  const allCompleted = await getCompletedLessonSlugs(userId);
  const netLessons = getAllNetworkingLessons().map((l) => l.slug);
  return allCompleted.filter((slug) => netLessons.includes(slug));
}

/**
 * Record a game score and award XP (idempotently keyed by userId + gameId)
 */
export function recordNetworkingGameScore(userId, gameId, score) {
  const key = getGameKey(userId);
  let saved = {};
  try {
    saved = JSON.parse(localStorage.getItem(key) || "{}");
  } catch {
    saved = {};
  }

  const existingBest = saved[gameId]?.bestScore || 0;
  const isNewBest = score > existingBest;
  const isFirstCompletion = !saved[gameId];

  saved[gameId] = {
    bestScore: Math.max(existingBest, score),
    lastPlayedAt: new Date().toISOString(),
    completed: true,
  };

  localStorage.setItem(key, JSON.stringify(saved));

  let xpAwarded = 0;
  // Award XP only on the first verified completion (no infinite replay XP)
  if (isFirstCompletion && userId) {
    const xpRes = awardLocalXp({
      userId,
      actionType: "game_completed",
      referenceId: `net-game-${gameId}`,
      amount: 30,
      description: `Completed Networking mini-game: ${gameId}`
    });
    if (xpRes.awarded) {
      xpAwarded = 30;
    }
  }

  return {
    success: true,
    isFirstCompletion,
    isNewBest,
    xpAwarded,
    allGameStats: saved
  };
}

/**
 * Fetch all game stats for a user
 */
export function getNetworkingGameStats(userId) {
  const key = getGameKey(userId);
  try {
    return JSON.parse(localStorage.getItem(key) || "{}");
  } catch {
    return {};
  }
}

/**
 * Record simulation completion/interaction
 */
export function recordSimulationVisit(userId, simId) {
  const key = getSimKey(userId);
  let saved = [];
  try {
    saved = JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    saved = [];
  }

  if (!saved.includes(simId)) {
    saved.push(simId);
    localStorage.setItem(key, JSON.stringify(saved));
  }
  return saved;
}

export function getCompletedSimulations(userId) {
  const key = getSimKey(userId);
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}
