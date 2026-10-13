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
    <div className="min-h-screen bg-[#0d1117] text-[#f0f6fc] flex flex-col justify-between cyber-grid-bg relative selection:bg-[#2f81f7]/30 selection:text-white">
      {/* Background ambient light */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#2f81f7]/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      {/* Header bar */}
      <header className="w-full border-b border-[#21262d] bg-[#0d1117]/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2f81f7] to-[#111821] border border-[#2f81f7]/40 flex items-center justify-center text-[#f0f6fc] group-hover:border-[#58a6ff] transition-colors shadow-sm shadow-[#2f81f7]/20">
            <Shield className="w-4 h-4 text-[#58a6ff]" strokeWidth={2.4} />
          </div>
          <span className="font-bold tracking-tight text-base text-[#f0f6fc]">
            Cyber<span className="text-[#58a6ff]">Path</span>
          </span>
        </Link>
        <Link
          to="/login"
          className="text-xs text-[#8b98a8] hover:text-[#f0f6fc] transition-colors font-medium"
        >
          ← Back to Sign In
        </Link>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-[#21262d] bg-[#111821] p-8 shadow-2xl relative">
            <div className="mb-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#2f81f7]/15 border border-[#2f81f7]/30 text-[#58a6ff] mb-3">
                <LockKeyhole className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-[#f0f6fc]">
                Create new password
              </h1>
              <p className="text-xs text-[#8b98a8] mt-1.5">
                Choose a strong new password for your CyberPath account
              </p>
            </div>

            {errorMsg && (
              <div className="mb-5 p-3 rounded-lg border border-[#fa7970]/40 bg-[#fa7970]/10 text-xs text-[#fa7970] flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {loading ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 text-[#58a6ff] animate-spin mx-auto mb-3" />
                <p className="text-xs text-[#8b98a8]">Verifying password reset credentials...</p>
              </div>
            ) : !user && !isRecovery && !hasRecoveryToken ? (
              <div className="text-center py-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#fa7970]/15 text-[#fa7970] mb-3">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">Reset Link Expired or Missing</h3>
                <p className="text-xs text-[#8b98a8] leading-relaxed mb-6">
                  Password reset links can only be used once and expire shortly after delivery. Please request a new link.
                </p>
                <Link
                  to="/forgot-password"
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-[#2f81f7] hover:bg-[#2069cc] text-white text-xs font-semibold shadow-md transition-colors"
                >
                  <span>Request New Reset Link</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : successMsg ? (
              <div className="text-center py-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#3fb950]/15 text-[#3fb950] mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#f0f6fc] mb-2">Password Updated!</h3>
                <p className="text-xs text-[#8b98a8] mb-4">
                  Your password has been successfully reset. Redirecting to your dashboard...
                </p>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-[#2f81f7] hover:bg-[#2069cc] text-white text-xs font-semibold"
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
                    className="block text-xs font-medium text-[#8b98a8] mb-1.5"
                  >
                    New Password (min. 6 characters)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8b98a8]">
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
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#0d1117] border border-[#21262d] focus:border-[#2f81f7] focus:ring-1 focus:ring-[#2f81f7] text-[#f0f6fc] placeholder-[#8b98a8]/50 text-sm outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirmNewPassword"
                    className="block text-xs font-medium text-[#8b98a8] mb-1.5"
                  >
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8b98a8]">
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
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#0d1117] border border-[#21262d] focus:border-[#2f81f7] focus:ring-1 focus:ring-[#2f81f7] text-[#f0f6fc] placeholder-[#8b98a8]/50 text-sm outline-none transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 px-4 rounded-lg bg-[#2f81f7] hover:bg-[#2069cc] disabled:opacity-60 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-md shadow-[#2f81f7]/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2f81f7]"
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
      <footer className="w-full py-4 border-t border-[#21262d] text-center text-xs text-[#8b98a8]">
        CyberPath Secure Authentication · Ethical Cybersecurity Education
      </footer>
    </div>
  );
}
