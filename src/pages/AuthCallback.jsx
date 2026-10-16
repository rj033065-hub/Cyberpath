import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Shield, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // 1. Check for URL error parameters from OAuth provider
    const searchParams = new URLSearchParams(location.search);
    const hashParams = new URLSearchParams(
      location.hash.startsWith("#") ? location.hash.substring(1) : location.hash
    );

    const error =
      searchParams.get("error_description") ||
      searchParams.get("error") ||
      hashParams.get("error_description") ||
      hashParams.get("error");

    if (error) {
      console.warn("OAuth redirect error received:", error);
      setErrorMsg(decodeURIComponent(error.replace(/\+/g, " ")));
      return;
    }

    // 2. Once user session is detected, navigate to dashboard
    if (!loading && user) {
      // Small tick to ensure smooth transition
      const timer = setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 300);
      return () => clearTimeout(timer);
    }

    // 3. Timeout fallback: if no session resolves after 6s
    const timeout = setTimeout(() => {
      if (!user) {
        setErrorMsg(
          "Authentication timed out or no active session was returned. Please try signing in again."
        );
      }
    }, 6000);

    return () => clearTimeout(timeout);
  }, [user, loading, navigate, location]);

  return (
    <div className="min-h-screen bg-page text-fg flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md p-8 rounded-2xl bg-page border border-white/12 shadow-2xl flex flex-col items-center text-center">
        {errorMsg ? (
          <>
            <div className="w-14 h-14 rounded-2xl bg-white/[0.06] border border-danger/40 flex items-center justify-center text-danger mb-4">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              Authentication Failed
            </h2>
            <p className="text-xs text-muted leading-relaxed mb-6">
              {errorMsg}
            </p>
            <button
              type="button"
              onClick={() => navigate("/login", { replace: true })}
              className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-accent-hover text-on-accent text-xs font-semibold transition-all shadow-sm active:scale-95"
            >
              Return to Sign In
            </button>
          </>
        ) : (
          <>
            <div className="relative mb-5">
              <div className="w-14 h-14 rounded-2xl bg-raised border border-white/20 flex items-center justify-center text-white shadow-lg shadow-white/5">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-surface border border-white/20 flex items-center justify-center">
                <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
              </div>
            </div>
            <h2 className="text-lg font-bold text-white mb-1.5">
              Authenticating Security Session
            </h2>
            <p className="text-xs text-muted font-mono leading-relaxed">
              Verifying token credentials and establishing secure session...
            </p>
          </>
        )}
      </div>
    </div>
  );
}
