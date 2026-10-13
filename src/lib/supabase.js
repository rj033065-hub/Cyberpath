import { createClient } from "@supabase/supabase-js";

const envUrl =
  (typeof import.meta !== "undefined" && import.meta?.env?.VITE_SUPABASE_URL) ||
  (typeof process !== "undefined" && process?.env?.VITE_SUPABASE_URL) ||
  "";
const envKey =
  (typeof import.meta !== "undefined" &&
    (import.meta?.env?.VITE_SUPABASE_PUBLISHABLE_KEY ||
      import.meta?.env?.VITE_SUPABASE_ANON_KEY)) ||
  (typeof process !== "undefined" &&
    (process?.env?.VITE_SUPABASE_PUBLISHABLE_KEY ||
      process?.env?.VITE_SUPABASE_ANON_KEY)) ||
  "";

// Check if credentials are real and not placeholder
export const isSupabaseConfigured = Boolean(
  envUrl &&
    envKey &&
    !envUrl.includes("placeholder") &&
    !envUrl.includes("your-project-ref") &&
    !envKey.includes("placeholder")
);

// Fallback placeholder credentials to prevent createClient from crashing if unconfigured
const supabaseUrl = isSupabaseConfigured
  ? envUrl
  : "https://mock-cyberpath-supabase.supabase.co";
const supabaseAnonKey = isSupabaseConfigured
  ? envKey
  : "mock-anon-key-cyberpath-phase2";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
