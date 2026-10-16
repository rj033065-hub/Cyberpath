import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Shield, ArrowRight, LockKeyhole, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

export default function ResetPassword() {
  const { user, loading, isRecovery, updatePassword } = useAuth();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const hasRecoveryToken =
    typeof window !== "undefined" &&
    (window.location.hash.includes("type=recovery") ||
      window.location.hash.includes("access_token=") ||
      window.location.search.includes("code="));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (password.length < 6) {
      setErrorMsg("New password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await updatePassword(password);
      if (error) {
        setErrorMsg(error.message || "Failed to update password. Your reset link may have expired.");
      } else {
        setSuccessMsg(true);
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      }
    } catch (err) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-page text-fg flex flex-col justify-between cyber-grid-bg relative selection:bg-white/20 selection:text-white">
      {/* Background ambient light */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-white/[0.04] blur-[130px] rounded-full pointer-events-none -z-10" />

      {/* Header bar */}
      <header className="w-full border-b border-white/12 bg-page/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-raised border border-white/28 flex items-center justify-center text-fg group-hover:border-white/40 transition-colors shadow-sm">
            <Shield className="w-4 h-4 text-accent" strokeWidth={2.4} />
          </div>
          <span className="font-bold tracking-tight text-base text-fg">
            Cyber<span className="text-accent">Path</span>
          </span>
        </Link>
        <Link
          to="/login"
          className="text-xs text-muted hover:text-fg transition-colors font-medium"
        >
          ← Back to Sign In
        </Link>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-white/12 bg-surface p-8 shadow-2xl relative">
            <div className="mb-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/[0.06] border border-white/12 text-accent mb-3">
                <LockKeyhole className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-fg">
                Create new password
              </h1>
              <p className="text-xs text-muted mt-1.5">
                Choose a strong new password for your CyberPath account
              </p>
            </div>

            {errorMsg && (
              <div className="mb-5 p-3 rounded-lg border border-danger/40 bg-white/[0.04] text-xs text-danger flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {loading ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 text-accent animate-spin mx-auto mb-3" />
                <p className="text-xs text-muted">Verifying password reset credentials...</p>
              </div>
            ) : !user && !isRecovery && !hasRecoveryToken ? (
              <div className="text-center py-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/[0.06] text-danger mb-3">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">Reset Link Expired or Missing</h3>
                <p className="text-xs text-muted leading-relaxed mb-6">
                  Password reset links can only be used once and expire shortly after delivery. Please request a new link.
                </p>
                <Link
                  to="/forgot-password"
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-accent hover:bg-accent-hover text-on-accent text-xs font-semibold shadow-md transition-colors"
                >
                  <span>Request New Reset Link</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : successMsg ? (
              <div className="text-center py-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/[0.06] text-success mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-fg mb-2">Password Updated!</h3>
                <p className="text-xs text-muted mb-4">
                  Your password has been successfully reset. Redirecting to your dashboard...
                </p>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-accent hover:bg-accent-hover text-on-accent text-xs font-semibold"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-xs font-medium text-muted mb-1.5"
                  >
                    New Password (min. 6 characters)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
                      <LockKeyhole className="w-4 h-4" />
                    </div>
                    <input
                      id="newPassword"
                      type="password"
                      required
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-page border border-white/12 focus:border-white/40 focus:ring-1 focus:ring-white/40 text-fg placeholder:text-muted/50 text-sm outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirmNewPassword"
                    className="block text-xs font-medium text-muted mb-1.5"
                  >
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
                      <LockKeyhole className="w-4 h-4" />
                    </div>
                    <input
                      id="confirmNewPassword"
                      type="password"
                      required
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-page border border-white/12 focus:border-white/40 focus:ring-1 focus:ring-white/40 text-fg placeholder:text-muted/50 text-sm outline-none transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 px-4 rounded-lg bg-accent hover:bg-accent-hover text-on-accent disabled:opacity-60 text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Updating password...</span>
                    </>
                  ) : (
                    <>
                      <span>Set New Password</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 border-t border-white/12 text-center text-xs text-muted">
        CyberPath Secure Authentication · Ethical Cybersecurity Education
      </footer>
    </div>
  );
}
