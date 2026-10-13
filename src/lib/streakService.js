/**
 * CyberPath — Phase 4.3 Genuine Daily Learning Streak Engine
 *
 * Requirements & Policy:
 * 1. Qualifying activity is recorded ONLY after meaningful verified actions
 *    (completing a lesson or passing a knowledge check assessment).
 * 2. Timezone policy: Activity dates are stored and normalized as local calendar dates (YYYY-MM-DD)
 *    to align with the student's actual physical day.
 * 3. Idempotent: Multiple activities on the same day increment count but never fabricate extra streak days.
 * 4. Consecutive & missed day rules:
 *    - Active today: Streak increments.
 *    - Active yesterday (pending today): Streak is maintained ("At Risk" badge, encouraging activity).
 *    - Missed yesterday and today: Streak resets to 0.
 * 5. Longest streak is computed mathematically across the entire historical activity ledger.
 */

import { supabase, isSupabaseConfigured } from "./supabase.js";

const LOCAL_ACTIVITY_PREFIX = "cyberpath_daily_activity_";

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

function getActivityKey(userId) {
  return `${LOCAL_ACTIVITY_PREFIX}${userId || "guest_student"}`;
}

/**
 * Formats a Date object as YYYY-MM-DD in local time
 */
export function formatLocalDate(date = new Date()) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Returns a date shifted by `offsetDays`
 */
function getDateOffset(baseDate, offsetDays) {
  const d = new Date(baseDate);
  d.setDate(d.getDate() + offsetDays);
  return d;
}

/**
 * Records a verified learning activity for the current day.
 */
export async function recordDailyActivity(userId, activityType = "lesson_completed") {
  if (!userId) return { success: false };

  const todayStr = formatLocalDate(new Date());

  // 1. Try Supabase if configured
  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase.rpc("record_daily_activity", {
        p_user_id: userId,
        p_activity_type: activityType,
      });
      if (!error) {
        // sync to local
        recordLocalActivity(userId, todayStr, activityType);
        return { success: true, date: todayStr };
      }
    } catch {
      // fallback
    }
  }

  // 2. Fallback to local storage
  recordLocalActivity(userId, todayStr, activityType);
  return { success: true, date: todayStr };
}

/**
 * Stores activity record in local storage cache
 */
function recordLocalActivity(userId, dateStr, activityType) {
  const key = getActivityKey(userId);
  let map = {};
  try {
    map = JSON.parse(safeStorage.getItem(key) || "{}");
  } catch {
    map = {};
  }

  if (!map[dateStr]) {
    map[dateStr] = {
      date: dateStr,
      count: 1,
      lastActivity: activityType,
      updatedAt: new Date().toISOString(),
    };
  } else {
    map[dateStr].count += 1;
    map[dateStr].lastActivity = activityType;
    map[dateStr].updatedAt = new Date().toISOString();
  }

  safeStorage.setItem(key, JSON.stringify(map));
}

/**
 * Fetches user's recorded activity days and computes current & longest streaks
 */
export async function getUserStreakData(userId) {
  if (!userId) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalActiveDays: 0,
      streakStatus: "inactive",
      recentCalendar: generateRecentCalendar([]),
      recordedDates: [],
    };
  }

  let activityDates = [];

  // 1. Try Supabase user_daily_activity
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("user_daily_activity")
        .select("activity_date, activity_count")
        .eq("user_id", userId)
        .order("activity_date", { ascending: false });

      if (!error && data && data.length > 0) {
        activityDates = data.map((r) => r.activity_date);
      }
    } catch {
      // fallback
    }
  }

  // 2. Fallback to local activity cache if empty
  if (activityDates.length === 0) {
    try {
      const key = getActivityKey(userId);
      const raw = safeStorage.getItem(key);
      if (raw) {
        const map = JSON.parse(raw);
        activityDates = Object.keys(map).sort().reverse();
      }
    } catch {
      activityDates = [];
    }
  }

  // Also cross-reference with completed lessons and quiz timestamps in case activity table was empty
  if (activityDates.length === 0) {
    try {
      const progressKey = `cyberpath_progress_${userId}`;
      const quizKey = `cyberpath_quizzes_${userId}`;
      const quizes = JSON.parse(safeStorage.getItem(quizKey) || "{}");
      const quizDates = Object.values(quizes)
        .flat()
        .filter((a) => a.passed && a.createdAt)
        .map((a) => formatLocalDate(new Date(a.createdAt)));

      const merged = Array.from(new Set(quizDates));
      if (merged.length > 0) {
        activityDates = merged.sort().reverse();
      }
    } catch {
      // ignore
    }
  }

  // Compute streaks
  const streakMetrics = calculateStreaksFromDates(activityDates);

  return {
    ...streakMetrics,
    totalActiveDays: activityDates.length,
    recordedDates: activityDates,
    recentCalendar: generateRecentCalendar(activityDates),
  };
}

/**
 * Calculates current streak, longest streak, and status from unique sorted date strings (YYYY-MM-DD)
 */
export function calculateStreaksFromDates(dateStrings = []) {
  if (!dateStrings || dateStrings.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      streakStatus: "inactive",
    };
  }

  // Ensure unique sorted set descending
  const uniqueDatesDesc = Array.from(new Set(dateStrings)).sort().reverse();
  const dateSet = new Set(uniqueDatesDesc);

  const today = new Date();
  const todayStr = formatLocalDate(today);
  const yesterdayStr = formatLocalDate(getDateOffset(today, -1));

  let currentStreak = 0;
  let streakStatus = "inactive";

  const hasActivityToday = dateSet.has(todayStr);
  const hasActivityYesterday = dateSet.has(yesterdayStr);

  if (hasActivityToday) {
    streakStatus = "active_today";
    // Count consecutive days backward starting today
    let checkDate = today;
    while (dateSet.has(formatLocalDate(checkDate))) {
      currentStreak += 1;
      checkDate = getDateOffset(checkDate, -1);
    }
  } else if (hasActivityYesterday) {
    streakStatus = "at_risk";
    // Count consecutive days backward starting yesterday
    let checkDate = getDateOffset(today, -1);
    while (dateSet.has(formatLocalDate(checkDate))) {
      currentStreak += 1;
      checkDate = getDateOffset(checkDate, -1);
    }
  } else {
    currentStreak = 0;
    streakStatus = "inactive";
  }

  // Calculate longest streak historically
  let longestStreak = currentStreak;
  if (uniqueDatesDesc.length > 0) {
    // Sort ascending for historical traversal
    const ascending = [...uniqueDatesDesc].sort();
    let tempStreak = 1;

    for (let i = 1; i < ascending.length; i++) {
      const prevDate = new Date(ascending[i - 1] + "T00:00:00");
      const expectedNext = formatLocalDate(getDateOffset(prevDate, 1));

      if (ascending[i] === expectedNext) {
        tempStreak += 1;
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
      } else {
        tempStreak = 1;
      }
    }
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }
  }

  return {
    currentStreak,
    longestStreak,
    streakStatus,
  };
}

/**
 * Generates the last 14 days activity calendar array for visualization
 */
export function generateRecentCalendar(activeDates = [], daysCount = 14) {
  const activeSet = new Set(activeDates);
  const today = new Date();
  const calendar = [];

  for (let i = daysCount - 1; i >= 0; i--) {
    const targetDate = getDateOffset(today, -i);
    const dateStr = formatLocalDate(targetDate);
    const isToday = i === 0;

    const dayName = targetDate.toLocaleDateString("en-US", { weekday: "narrow" });
    const dayNumber = targetDate.getDate();

    calendar.push({
      dateStr,
      dayName,
      dayNumber,
      isToday,
      hasActivity: activeSet.has(dateStr),
    });
  }

  return calendar;
}
