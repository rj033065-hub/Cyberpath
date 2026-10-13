import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

const AuthContext = createContext(null);

const DEMO_USER_KEY = "cyberpath_demo_session";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch student profile from public.profiles table
  const fetchProfile = useCallback(async (userId, fallbackName = "") => {
    if (!userId) return null;

    if (!isSupabaseConfigured) {
      // Demo session profile from localStorage
      const savedDemo = localStorage.getItem(DEMO_USER_KEY);
      if (savedDemo) {
        try {
          const parsed = JSON.parse(savedDemo);
          setProfile(parsed.profile);
          return parsed.profile;
        } catch {
          // ignore
        }
      }
      const demoProfile = {
        id: userId,
        full_name: fallbackName || "Alex Rivera",
        selected_path: "red-team",
        created_at: new Date().toISOString(),
      };
      setProfile(demoProfile);
      return demoProfile;
    }

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error && error.code !== "PGRST116") {
        console.warn("Error fetching profile from Supabase:", error.message);
      }

      if (data) {
        setProfile(data);
        return data;
      }

      // If profile record doesn't exist yet, attempt to initialize it
      const newProfile = {
        id: userId,
        full_name: fallbackName || "Student Researcher",
        selected_path: null,
      };

      const { data: inserted, error: insertError } = await supabase
        .from("profiles")
        .insert([newProfile])
        .select()
        .maybeSingle();

      if (!insertError && inserted) {
        setProfile(inserted);
        return inserted;
      }

      setProfile(newProfile);
      return newProfile;
    } catch (err) {
      console.error("Profile fetch exception:", err);
      const fallback = { id: userId, full_name: fallbackName, selected_path: null };
      setProfile(fallback);
      return fallback;
    }
  }, []);

  const [isRecovery, setIsRecovery] = useState(false);
  const [oauthError, setOauthError] = useState("");

  // Check for OAuth or redirect errors in URL parameters on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const searchParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(
      window.location.hash.startsWith("#") ? window.location.hash.substring(1) : window.location.hash
    );

    const err =
      searchParams.get("error_description") ||
      searchParams.get("error") ||
      hashParams.get("error_description") ||
      hashParams.get("error");

    if (err) {
      setOauthError(decodeURIComponent(err.replace(/\+/g, " ")));
    }
  }, []);

  // Listen to Supabase auth state changes or restore demo session
  useEffect(() => {
    let mounted = true;

    if (!isSupabaseConfigured) {
      // Local demo mode session restoration
      const savedDemo = localStorage.getItem(DEMO_USER_KEY);
      if (savedDemo) {
        try {
          const parsed = JSON.parse(savedDemo);
          if (mounted) {
            setUser(parsed.user);
            setSession(parsed.session);
            setProfile(parsed.profile);
          }
        } catch {
          localStorage.removeItem(DEMO_USER_KEY);
        }
      }
      if (mounted) setLoading(false);
      return () => {
        mounted = false;
      };
    }

    // Check if URL has tokens (PKCE code or OAuth hash) in-flight
    const hasUrlTokens =
      typeof window !== "undefined" &&
      (window.location.search.includes("code=") ||
        window.location.hash.includes("access_token=") ||
        window.location.hash.includes("type=recovery"));

    // Single source of truth: Supabase onAuthStateChange
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!mounted) return;

      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (event === "PASSWORD_RECOVERY") {
        setIsRecovery(true);
      }

      if (newSession?.user) {
        await fetchProfile(
          newSession.user.id,
          newSession.user.user_metadata?.full_name
        );
      } else if (event === "SIGNED_OUT") {
        setProfile(null);
        setIsRecovery(false);
      }

      if (mounted) setLoading(false);
    });

    // Check existing stored session as fallback, but don't prematurely clear loading if URL tokens are resolving
    supabase.auth
      .getSession()
      .then(({ data: { session: initialSession }, error }) => {
        if (!mounted) return;
        if (error) {
          console.warn("Session check warning:", error.message);
        }

        if (initialSession && !user) {
          setSession(initialSession);
          setUser(initialSession.user);
          fetchProfile(
            initialSession.user.id,
            initialSession.user.user_metadata?.full_name
          );
        }

        // If no URL tokens are currently being parsed, it is safe to set loading false
        if (!hasUrlTokens && mounted) {
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Auth session exception:", err);
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [fetchProfile]);

  // Sign up
  const signUp = async ({ email, password, fullName }) => {
    if (!isSupabaseConfigured) {
      // Local demo mode simulation
      const mockId = "demo-" + Math.random().toString(36).substring(2, 9);
      const mockUser = {
        id: mockId,
        email,
        user_metadata: { full_name: fullName },
        created_at: new Date().toISOString(),
      };
      const mockProfile = {
        id: mockId,
        full_name: fullName,
        selected_path: null,
        created_at: new Date().toISOString(),
      };
      const demoData = {
        user: mockUser,
        session: { access_token: "demo-token", user: mockUser },
        profile: mockProfile,
      };
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoData));
      setUser(mockUser);
      setSession(demoData.session);
      setProfile(mockProfile);
      return { data: { user: mockUser, session: demoData.session }, error: null };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) return { data: null, error };

    if (data?.user) {
      await fetchProfile(data.user.id, fullName);
    }

    return { data, error: null };
  };

  // Sign in
  const signIn = async ({ email, password }) => {
    if (!isSupabaseConfigured) {
      const mockId = "demo-user-123";
      const mockUser = {
        id: mockId,
        email,
        user_metadata: { full_name: email.split("@")[0] },
        created_at: new Date().toISOString(),
      };
      const mockProfile = {
        id: mockId,
        full_name: email.split("@")[0],
        selected_path: "red-team",
        created_at: new Date().toISOString(),
      };
      const demoData = {
        user: mockUser,
        session: { access_token: "demo-token", user: mockUser },
        profile: mockProfile,
      };
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoData));
      setUser(mockUser);
      setSession(demoData.session);
      setProfile(mockProfile);
      return { data: { user: mockUser, session: demoData.session }, error: null };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return { data: null, error };

    if (data?.user) {
      await fetchProfile(data.user.id, data.user.user_metadata?.full_name);
    }

    return { data, error: null };
  };

  // Sign in with Google OAuth
  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured) {
      const mockId = "demo-google-user";
      const mockUser = {
        id: mockId,
        email: "student@google.com",
        user_metadata: { full_name: "Google Researcher" },
        created_at: new Date().toISOString(),
      };
      const mockProfile = {
        id: mockId,
        full_name: "Google Researcher",
        selected_path: "web-security",
        created_at: new Date().toISOString(),
      };
      const demoData = {
        user: mockUser,
        session: { access_token: "demo-google-token", user: mockUser },
        profile: mockProfile,
      };
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoData));
      setUser(mockUser);
      setSession(demoData.session);
      setProfile(mockProfile);
      return { data: { user: mockUser, session: demoData.session }, error: null };
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    return { data, error };
  };

  // Resend signup verification email
  const resendVerificationEmail = async (email) => {
    if (!isSupabaseConfigured) {
      return { data: {}, error: null };
    }

    return await supabase.auth.resend({
      type: "signup",
      email,
    });
  };

  // Sign out
  const signOut = async () => {
    if (!isSupabaseConfigured) {
      localStorage.removeItem(DEMO_USER_KEY);
      setUser(null);
      setSession(null);
      setProfile(null);
      return { error: null };
    }

    const { error } = await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    return { error };
  };

  // Request password reset email
  const resetPasswordForEmail = async (email) => {
    if (!isSupabaseConfigured) {
      return { data: {}, error: null };
    }

    const redirectTo = `${window.location.origin}/reset-password`;
    return await supabase.auth.resetPasswordForEmail(email, { redirectTo });
  };

  // Update password
  const updatePassword = async (newPassword) => {
    if (!isSupabaseConfigured) {
      return { data: {}, error: null };
    }

    return await supabase.auth.updateUser({ password: newPassword });
  };

  // Update selected learning path
  const updateProfileSelectedPath = async (pathSlug) => {
    if (!user) return { error: new Error("No authenticated user") };

    // Update in-memory profile immediately for instant UI feedback
    setProfile((prev) => (prev ? { ...prev, selected_path: pathSlug } : prev));

    if (!isSupabaseConfigured) {
      const savedDemo = localStorage.getItem(DEMO_USER_KEY);
      if (savedDemo) {
        try {
          const parsed = JSON.parse(savedDemo);
          parsed.profile.selected_path = pathSlug;
          localStorage.setItem(DEMO_USER_KEY, JSON.stringify(parsed));
        } catch {
          // ignore
        }
      }
      return { error: null };
    }

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          selected_path: pathSlug,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) {
        console.error("Error updating profile in Supabase:", error.message);
        return { error };
      }

      return { error: null };
    } catch (err) {
      return { error: err };
    }
  };

  const value = {
    user,
    session,
    profile,
    loading,
    isRecovery,
    oauthError,
    isConfigured: isSupabaseConfigured,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resendVerificationEmail,
    resetPasswordForEmail,
    updatePassword,
    updateProfileSelectedPath,
    refreshProfile: () => fetchProfile(user?.id),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
