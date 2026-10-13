/**
 * CyberPath — Phase 4.2 Configurable XP Ledger & Levels System
 *
 * Configurable Reward Values:
 * - Lesson Completion: 10 XP (first verified completion)
 * - Assessment Pass: 25 XP (first passing result)
 * - Module Completion: 50 XP (all lessons in module completed)
 * - Path Completion: 200 XP (all lessons in learning path completed)
 *
 * Rules:
 * - Idempotency guaranteed: Each reward is uniquely keyed by (userId, actionType, referenceId).
 * - Zero repeated rewards for page clicks or multiple quiz attempts.
 * - Supports authoritative Supabase DB ledger with transparent offline/demo-mode fallback.
 */

import { supabase, isSupabaseConfigured } from "./supabase.js";

export const XP_CONFIG = {
  LESSON_COMPLETION: 10,
  ASSESSMENT_PASS: 25,
  MODULE_COMPLETION: 50,
  PATH_COMPLETION: 200,
};

/**
 * Level Tiers Configuration
 */
export const LEVEL_TIERS = [
  { level: 1, title: "Novice Explorer", minXp: 0, maxXp: 99 },
  { level: 2, title: "Security Apprentice", minXp: 100, maxXp: 249 },
  { level: 3, title: "Junior Operator", minXp: 250, maxXp: 499 },
  { level: 4, title: "Security Analyst", minXp: 500, maxXp: 849 },
  { level: 5, title: "Penetration Tester / Defender", minXp: 850, maxXp: 1299 },
  { level: 6, title: "Senior Specialist", minXp: 1300, maxXp: 1849 },
  { level: 7, title: "CyberPath Master", minXp: 1850, maxXp: 2499 },
  { level: 8, title: "Principal Cyber Operator", minXp: 2500, maxXp: 99999 },
];

const LOCAL_XP_LEDGER_PREFIX = "cyberpath_xp_ledger_";

const safeStorage = {
  getItem: (key) => {
    if (typeof localStorage !== "undefined") {
      return localStorage.getItem(key);
    }
    return globalThis.__mockStorage?.[key] || null;
  },
  setItem: (key, val) => {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(key, val);
    } else {
      if (!globalThis.__mockStorage) globalThis.__mockStorage = {};
      globalThis.__mockStorage[key] = val;
    }
  },
};

function getLedgerKey(userId) {
  return `${LOCAL_XP_LEDGER_PREFIX}${userId || "guest_student"}`;
}

/**
 * Calculates level details from total verified XP
 */
export function calculateLevelFromXp(totalXp = 0) {
  const xp = Math.max(0, Number(totalXp) || 0);

  let currentTier = LEVEL_TIERS[0];
  for (let i = LEVEL_TIERS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_TIERS[i].minXp) {
      currentTier = LEVEL_TIERS[i];
      break;
    }
  }

  const isMaxLevel = currentTier.level >= LEVEL_TIERS.length;
  const xpInLevel = xp - currentTier.minXp;
  const levelSpan = isMaxLevel ? 1000 : currentTier.maxXp - currentTier.minXp + 1;
  const progressPercent = isMaxLevel
    ? 100
    : Math.min(100, Math.round((xpInLevel / levelSpan) * 100));
  const xpToNextLevel = isMaxLevel ? 0 : currentTier.maxXp + 1 - xp;

  return {
    level: currentTier.level,
    title: currentTier.title,
    totalXp: xp,
    xpInLevel,
    levelSpan,
    progressPercent,
    xpToNextLevel,
    minXp: currentTier.minXp,
    maxXp: currentTier.maxXp,
    isMaxLevel,
  };
}

/**
 * Fetches the user's verified XP ledger records and derived total XP
 */
export async function getUserXpProfile(userId) {
  if (!userId) {
    return {
      totalXp: 0,
      levelInfo: calculateLevelFromXp(0),
      ledger: [],
    };
  }

  // 1. Try fetching from Supabase user_xp_ledger table if configured
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("user_xp_ledger")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (!error && data) {
        const totalXp = data.reduce((acc, row) => acc + (row.xp_amount || 0), 0);
        // Sync to local storage
        safeStorage.setItem(getLedgerKey(userId), JSON.stringify(data));

        return {
          totalXp,
          levelInfo: calculateLevelFromXp(totalXp),
          ledger: data,
        };
      }
    } catch {
      // fallback to local storage
    }
  }

  // 2. Fallback to local storage ledger
  try {
    const raw = safeStorage.getItem(getLedgerKey(userId));
    const ledger = raw ? JSON.parse(raw) : [];
    const totalXp = ledger.reduce((acc, row) => acc + (row.xp_amount || 0), 0);

    return {
      totalXp,
      levelInfo: calculateLevelFromXp(totalXp),
      ledger,
    };
  } catch {
    return {
      totalXp: 0,
      levelInfo: calculateLevelFromXp(0),
      ledger: [],
    };
  }
}

/**
 * Awards XP in local fallback mode (used during offline / demo mode)
 * strictly enforcing uniqueness (userId + actionType + referenceId).
 */
export function awardLocalXp({
  userId,
  actionType,
  referenceId,
  amount,
  description,
}) {
  if (!userId || !actionType || !referenceId) return { awarded: false };

  const key = getLedgerKey(userId);
  let ledger = [];
  try {
    ledger = JSON.parse(safeStorage.getItem(key) || "[]");
  } catch {
    ledger = [];
  }

  // Check if unique constraint is already met
  const exists = ledger.some(
    (item) => item.action_type === actionType && item.reference_id === referenceId
  );

  if (exists) {
    return { awarded: false, reason: "Milestone XP already awarded" };
  }

  const newEntry = {
    id: `local-xp-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    user_id: userId,
    action_type: actionType,
    reference_id: referenceId,
    xp_amount: amount,
    description: description || `Awarded ${amount} XP for ${actionType}`,
    created_at: new Date().toISOString(),
  };

  ledger.unshift(newEntry);
  safeStorage.setItem(key, JSON.stringify(ledger));

  const newTotal = ledger.reduce((acc, r) => acc + r.xp_amount, 0);

  return {
    awarded: true,
    entry: newEntry,
    newTotalXp: newTotal,
    levelInfo: calculateLevelFromXp(newTotal),
  };
}
