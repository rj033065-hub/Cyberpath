/**
 * CyberPath — Lab Progress Service
 *
 * Persists lab progress to localStorage (demo mode) or Supabase (live mode).
 * XP is awarded via the existing awardLocalXp utility (idempotent).
 * Lab completion is PRACTICE-ONLY — no authoritative server-side badge issuance
 * until a trusted backend function is implemented.
 *
 * Security rules:
 * - isSupabaseConfigured is always respected.
 * - Demo mode writes ONLY to localStorage and never claims Supabase success.
 * - Students can read/update only their own records (enforced by RLS).
 * - XP amounts are never trusted from the browser; they are derived from XP_CONFIG constants.
 */

import { supabase, isSupabaseConfigured } from "./supabase.js";
import { awardLocalXp, XP_CONFIG } from "./xpService.js";

export const LAB_XP = {
  LAB_COMPLETION: 30, // practice-only, local
};

const LOCAL_LAB_PREFIX = "cyberpath_labs_";

function getLabKey(userId) {
  return `${LOCAL_LAB_PREFIX}${userId || "guest_student"}`;
}

/**
 * Returns lab progress map for a user.
 * Shape: { [labSlug]: { status, startedAt, completedAt, hintsUsed, attempts } }
 */
export async function getLabProgress(userId) {
  if (!userId) return {};

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("user_lab_progress")
        .select("*")
        .eq("user_id", userId);

      if (!error && data && data.length > 0) {
        const map = {};
        for (const row of data) {
          map[row.lab_slug] = {
            status: row.status,
            startedAt: row.started_at,
            completedAt: row.completed_at,
            hintsUsed: row.hints_used ?? 0,
            attempts: row.attempts ?? 0,
          };
        }
        // Sync to local cache
        localStorage.setItem(getLabKey(userId), JSON.stringify(map));
        return map;
      }
    } catch {
      // Fallback to local
    }
  }

  // Fallback / demo mode: localStorage
  try {
    const raw = localStorage.getItem(getLabKey(userId));
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Mark a lab as started (first visit).
 * Idempotent — does nothing if already started or completed.
 */
export async function markLabStarted(userId, labSlug) {
  if (!userId || !labSlug) return { success: false };

  const existing = await getLabProgress(userId);
  if (existing[labSlug]) return { success: true }; // already tracked

  const entry = {
    status: "in_progress",
    startedAt: new Date().toISOString(),
    completedAt: null,
    hintsUsed: 0,
    attempts: 0,
  };

  // Write locally always (for instant UI feedback + demo mode)
  const updated = { ...existing, [labSlug]: entry };
  localStorage.setItem(getLabKey(userId), JSON.stringify(updated));

  if (isSupabaseConfigured) {
    try {
      await supabase.from("user_lab_progress").upsert(
        {
          user_id: userId,
          lab_slug: labSlug,
          status: "in_progress",
          started_at: entry.startedAt,
          hints_used: 0,
          attempts: 0,
        },
        { onConflict: "user_id,lab_slug", ignoreDuplicates: true }
      );
    } catch {
      // non-fatal — local cache is source of truth
    }
  }

  return { success: true };
}

/**
 * Mark a lab as completed.
 * Awards LOCAL practice XP (idempotent via awardLocalXp).
 * Returns { success, xpAwarded, newTotalXp, alreadyCompleted }.
 *
 * Security note: XP amount is taken from XP_CONFIG constant, NOT from any
 * browser-submitted value. Authoritative badge awarding requires a server function.
 */
export async function markLabComplete(userId, labSlug) {
  if (!userId || !labSlug) return { success: false };

  const existing = await getLabProgress(userId);
  const alreadyCompleted = existing[labSlug]?.status === "completed";

  const entry = {
    ...(existing[labSlug] || {}),
    status: "completed",
    startedAt: existing[labSlug]?.startedAt || new Date().toISOString(),
    completedAt: new Date().toISOString(),
    hintsUsed: existing[labSlug]?.hintsUsed ?? 0,
    attempts: (existing[labSlug]?.attempts ?? 0) + 1,
  };

  // Update local cache
  const updated = { ...existing, [labSlug]: entry };
  localStorage.setItem(getLabKey(userId), JSON.stringify(updated));

  // Award local practice XP (idempotent: unique key userId+lab_completed+labSlug)
  let xpResult = { awarded: false };
  if (!alreadyCompleted) {
    xpResult = awardLocalXp({
      userId,
      actionType: "lab_completed",
      referenceId: labSlug,
      amount: LAB_XP.LAB_COMPLETION,
      description: `Completed lab: ${labSlug}`,
    });
  }

  if (isSupabaseConfigured) {
    try {
      await supabase.from("user_lab_progress").upsert(
        {
          user_id: userId,
          lab_slug: labSlug,
          status: "completed",
          started_at: entry.startedAt,
          completed_at: entry.completedAt,
          hints_used: entry.hintsUsed,
          attempts: entry.attempts,
        },
        { onConflict: "user_id,lab_slug" }
      );
    } catch {
      // non-fatal
    }
  }

  return {
    success: true,
    xpAwarded: xpResult.awarded ? LAB_XP.LAB_COMPLETION : 0,
    newTotalXp: xpResult.newTotalXp,
    alreadyCompleted,
  };
}

/**
 * Increment hint usage count for a lab.
 */
export async function recordHintUsed(userId, labSlug) {
  if (!userId || !labSlug) return;

  const existing = await getLabProgress(userId);
  const cur = existing[labSlug] || { status: "in_progress", hintsUsed: 0, attempts: 0 };
  const updated = { ...existing, [labSlug]: { ...cur, hintsUsed: (cur.hintsUsed || 0) + 1 } };
  localStorage.setItem(getLabKey(userId), JSON.stringify(updated));

  if (isSupabaseConfigured) {
    try {
      await supabase
        .from("user_lab_progress")
        .update({ hints_used: (cur.hintsUsed || 0) + 1 })
        .eq("user_id", userId)
        .eq("lab_slug", labSlug);
    } catch {
      // non-fatal
    }
  }
}
