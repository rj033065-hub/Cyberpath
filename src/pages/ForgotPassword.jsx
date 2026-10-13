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
                <KeyRound className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-[#f0f6fc]">
                Reset your password
              </h1>
              <p className="text-xs text-[#8b98a8] mt-1.5">
                Enter your account email to receive a secure password reset link
              </p>
            </div>

            {errorMsg && (
              <div className="mb-5 p-3 rounded-lg border border-[#fa7970]/40 bg-[#fa7970]/10 text-xs text-[#fa7970] flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg ? (
              <div className="text-center py-2">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#3fb950]/15 text-[#3fb950] mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#f0f6fc] mb-2">Check your email</h3>
                <p className="text-xs text-[#8b98a8] leading-relaxed mb-6">
                  If an account exists for <strong className="text-[#f0f6fc]">{email}</strong>, you will receive an email containing a link to reset your password.
                </p>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-[#0d1117] hover:bg-[#16202e] border border-[#21262d] text-xs font-semibold text-[#f0f6fc] transition-colors"
                >
                  <span>Return to Sign In</span>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="resetEmail"
                    className="block text-xs font-medium text-[#8b98a8] mb-1.5"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8b98a8]">
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
                    className="text-xs text-[#8b98a8] hover:text-[#f0f6fc] transition-colors"
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
      <footer className="w-full py-4 border-t border-[#21262d] text-center text-xs text-[#8b98a8]">
        CyberPath Secure Authentication · Ethical Cybersecurity Education
      </footer>
    </div>
  );
}
