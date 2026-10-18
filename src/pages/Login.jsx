import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/auth/AuthLayout";
import PasswordInput from "../components/auth/PasswordInput";
import CyberPathLogo from "../components/common/CyberPathLogo";

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signInWithGoogle, resendVerificationEmail, user, oauthError } = useAuth();
  const shouldReduceMotion = useReducedMotion();

  // Form states
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState("");
  const [resendStatus, setResendStatus] = useState(""); // idle | sending | sent | error
  const [resendMessage, setResendMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // If redirected with an OAuth or external error, capture it
  React.useEffect(() => {
    const errorFromState = location.state?.error;
    if (errorFromState) {
      setAuthError(errorFromState);
    } else if (oauthError) {
      setAuthError(oauthError);
    }
  }, [location.state, oauthError]);

  // If already logged in, redirect to destination or dashboard
  React.useEffect(() => {
    if (user) {
      const destination = location.state?.from?.pathname || "/dashboard";
      navigate(destination, { replace: true });
    }
  }, [user, navigate, location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (authError) setAuthError("");
    if (resendMessage) setResendMessage("");
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setAuthError("");
    setResendMessage("");

    try {
      const { error } = await signIn({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (error) {
        if (error.message?.toLowerCase().includes("email not confirmed")) {
          setAuthError("Email not confirmed. Please check your inbox for the verification link.");
        } else if (error.message?.toLowerCase().includes("invalid login credentials")) {
          setAuthError("Invalid email or password. Please verify your credentials.");
        } else {
          setAuthError(error.message || "Invalid email or password.");
        }
        setIsLoading(false);
      } else {
        const destination = location.state?.from?.pathname || "/dashboard";
        navigate(destination, { replace: true });
      }
    } catch (err) {
      setAuthError(err.message || "An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!formData.email.trim()) {
      setResendMessage("Please enter your email above first.");
      return;
    }
    setResendStatus("sending");
    try {
      const { error } = await resendVerificationEmail(formData.email.trim());
      if (error) {
        if (error.message?.includes("rate limit")) {
          setResendMessage("Rate limit exceeded (Supabase Free Tier allows 3 emails/hr). Please wait a few minutes.");
        } else {
          setResendMessage(error.message || "Failed to resend verification email.");
        }
        setResendStatus("error");
      } else {
        setResendMessage("Verification email resent! Please check your inbox and spam folder.");
        setResendStatus("sent");
      }
    } catch (err) {
      setResendMessage(err.message || "Could not resend email.");
      setResendStatus("error");
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setAuthError("");
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        if (error.message?.includes("not enabled") || error.message?.includes("validation_failed")) {
          setAuthError("Google Sign-In is not enabled yet in your Supabase project. Enable Google in Supabase Dashboard > Authentication > Providers.");
        } else {
          setAuthError(error.message || "Could not sign in with Google.");
        }
        setIsGoogleLoading(false);
      }
    } catch (err) {
      setAuthError(err.message || "Failed to initialize Google login.");
      setIsGoogleLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: "easeOut" },
    },
  };

  return (
    <AuthLayout
      quote="Welcome Back! The journey continues."
      author="EaseMize UI"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full flex flex-col items-center"
      >
        {/* Brand Logo */}
        <motion.div variants={itemVariants} className="mb-4">
          <Link to="/" title="CyberPath Home">
            <CyberPathLogo size="lg" glow className="hover:scale-105 transition-transform" />
          </Link>
        </motion.div>

        {/* 1. Heading */}
        <motion.h1
          variants={itemVariants}
          className="text-[28px] sm:text-[30px] font-bold text-white tracking-tight text-center"
        >
          Sign in to your account
        </motion.h1>

        {/* 2. Subtext */}
        <motion.p
          variants={itemVariants}
          className="text-zinc-400 text-sm text-center mt-2 mb-8 select-none"
        >
          Enter your email below to sign in
        </motion.p>

        {/* Error banner if authentication fails */}
        {authError && (
          <motion.div
            variants={itemVariants}
            className="w-full mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs sm:text-sm flex flex-col gap-2.5"
          >
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{authError}</span>
            </div>

            {authError.toLowerCase().includes("email not confirmed") && (
              <div className="mt-1 pt-2 border-t border-rose-500/20 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={resendStatus === "sending"}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-white font-medium text-xs transition-colors self-start"
                >
                  {resendStatus === "sending" ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Resending...</span>
                    </>
                  ) : (
                    <span>Resend verification email</span>
                  )}
                </button>
                {resendMessage && (
                  <p
                    className={`text-xs ${
                      resendStatus === "sent" ? "text-emerald-400" : "text-amber-300"
                    }`}
                  >
                    {resendMessage}
                  </p>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          {/* 3. Email Field */}
          <motion.div variants={itemVariants} className="w-full text-left">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-white mb-2"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="m@example.com"
              autoComplete="email"
              disabled={isLoading || isGoogleLoading}
              className={`w-full h-12 rounded-2xl bg-[#0a0a0a] border ${
                errors.email
                  ? "border-rose-500/80 ring-1 ring-rose-500/20"
                  : "border-white/10"
              } text-white placeholder:text-zinc-500 text-sm px-4 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/10 transition-all duration-200 disabled:opacity-50`}
            />
            {errors.email && (
              <p className="text-rose-400 text-xs mt-1.5 ml-1">{errors.email}</p>
            )}
          </motion.div>

          {/* 4. Password Field */}
          <motion.div variants={itemVariants}>
            <PasswordInput
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              label="Password"
              error={errors.password}
              disabled={isLoading || isGoogleLoading}
            />
          </motion.div>

          {/* Forgot password link */}
          <motion.div variants={itemVariants} className="w-full flex justify-end">
            <Link
              to="/forgot-password"
              className="text-xs text-zinc-400 hover:text-white transition-colors"
            >
              Forgot password?
            </Link>
          </motion.div>

          {/* 5. Sign In Button */}
          <motion.div variants={itemVariants} className="pt-1">
            <motion.button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              whileHover={shouldReduceMotion ? {} : { scale: 1.01 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
              className="w-full h-12 rounded-2xl border border-white/15 bg-transparent hover:bg-white/5 hover:border-white/30 text-white font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-zinc-300" />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </motion.button>
          </motion.div>
        </form>

        {/* 6. Switch to Sign Up */}
        <motion.div
          variants={itemVariants}
          className="text-center text-sm text-zinc-400 mt-6 select-none"
        >
          <span>Don&apos;t have an account? </span>
          <Link
            to="/signup"
            className="text-white font-semibold hover:underline ml-1"
          >
            Sign up
          </Link>
        </motion.div>

        {/* 7. Divider */}
        <motion.div
          variants={itemVariants}
          className="w-full flex items-center my-6 select-none"
        >
          <div className="flex-1 border-t border-white/10" />
          <span className="px-3 text-xs text-zinc-500 uppercase tracking-wider font-medium">
            Or continue with
          </span>
          <div className="flex-1 border-t border-white/10" />
        </motion.div>

        {/* 8. Continue with Google Button */}
        <motion.div variants={itemVariants} className="w-full">
          <motion.button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading || isGoogleLoading}
            whileHover={shouldReduceMotion ? {} : { scale: 1.01 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
            className="w-full h-12 rounded-2xl border border-white/15 bg-transparent hover:bg-white/5 hover:border-white/30 text-white font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {isGoogleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-zinc-300" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
            )}
            <span>Continue with Google</span>
          </motion.button>
        </motion.div>
      </motion.div>
    </AuthLayout>
  );
}

export default Login;
