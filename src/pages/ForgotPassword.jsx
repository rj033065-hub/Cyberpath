import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Shield, ArrowRight, Mail, AlertCircle, CheckCircle2, Loader2, KeyRound } from "lucide-react";

export default function ForgotPassword() {
  const { resetPasswordForEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email.trim()) {
      setErrorMsg("Please enter your registered email address.");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await resetPasswordForEmail(email.trim());
      if (error) {
        if (error.message?.includes("rate limit") || error.code === "over_email_send_rate_limit") {
          setErrorMsg(
            "Email rate limit exceeded (Supabase Free Tier allows 3 emails/hr). Please wait a few minutes before requesting another reset link."
          );
        } else {
          setErrorMsg(error.message || "Could not send reset link. Please check the email address.");
        }
      } else {
        setSuccessMsg(true);
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
                <KeyRound className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-fg">
                Reset your password
              </h1>
              <p className="text-xs text-muted mt-1.5">
                Enter your account email to receive a secure password reset link
              </p>
            </div>

            {errorMsg && (
              <div className="mb-5 p-3 rounded-lg border border-danger/40 bg-white/[0.04] text-xs text-danger flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg ? (
              <div className="text-center py-2">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/[0.06] text-success mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-fg mb-2">Check your email</h3>
                <p className="text-xs text-muted leading-relaxed mb-6">
                  If an account exists for <strong className="text-fg">{email}</strong>, you will receive an email containing a link to reset your password.
                </p>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-page hover:bg-raised border border-white/12 text-xs font-semibold text-fg transition-colors"
                >
                  <span>Return to Sign In</span>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="resetEmail"
                    className="block text-xs font-medium text-muted mb-1.5"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="resetEmail"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@example.com"
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
                      <span>Sending reset email...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Reset Link</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="text-center pt-2">
                  <Link
                    to="/login"
                    className="text-xs text-muted hover:text-fg transition-colors"
                  >
                    Remember your password? Sign in
                  </Link>
                </div>
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
