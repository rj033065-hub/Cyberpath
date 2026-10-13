"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
  const router = useRouter();
  const { signUp, signInWithGoogle, user } = useAuth();
  const shouldReduceMotion = useReducedMotion();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [authError, setAuthError] = useState("");
  const [isSuccessMessage, setIsSuccessMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  React.useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (authError) setAuthError("");
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setAuthError("");

    try {
      const { data, error } = await signUp({
        email: formData.email.trim(),
        password: formData.password,
        fullName: formData.fullName.trim(),
      });

      if (error) {
        setAuthError(error.message || "Could not complete registration");
        setIsLoading(false);
      } else {
        if (data?.user && !data?.session) {
          setIsSuccessMessage(true);
          setIsLoading(false);
        } else {
          router.push("/dashboard");
        }
      }
    } catch (err: any) {
      setAuthError(err.message || "An unexpected error occurred during signup.");
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setAuthError("");
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        setAuthError(error.message || "Could not sign in with Google.");
        setIsGoogleLoading(false);
      }
    } catch (err: any) {
      setAuthError(err.message || "Failed to initialize Google login.");
      setIsGoogleLoading(false);
    }
  };

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
      quote="Start your journey today."
      author="EaseMize UI"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full flex flex-col items-center"
      >
        <motion.h1
          variants={itemVariants}
          className="text-[28px] sm:text-[30px] font-bold text-white tracking-tight text-center"
        >
          Create your account
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-zinc-400 text-sm text-center mt-2 mb-8 select-none"
        >
          Enter your details below to get started
        </motion.p>

        {isSuccessMessage ? (
          <motion.div
            variants={itemVariants}
            className="w-full p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm flex flex-col items-center text-center gap-3 my-4"
          >
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            <p className="font-semibold text-white text-base">Check your inbox</p>
            <p className="text-zinc-400 text-xs leading-relaxed">
              We&apos;ve sent a verification link to{" "}
              <span className="text-white font-medium">{formData.email}</span>. Click the link to activate your security clearance.
            </p>
            <Link
              href="/login"
              className="mt-2 text-xs font-semibold text-white underline hover:text-zinc-200"
            >
              Return to Sign In
            </Link>
          </motion.div>
        ) : (
          <>
            {authError && (
              <motion.div
                variants={itemVariants}
                className="w-full mb-6 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs sm:text-sm flex items-start gap-2.5"
              >
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="w-full space-y-4">
              <motion.div variants={itemVariants} className="w-full text-left">
                <label
                  htmlFor="fullName"
                  className="block text-sm font-semibold text-white mb-2"
                >
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Alex Rivera"
                  autoComplete="name"
                  disabled={isLoading || isGoogleLoading}
                  className={`w-full h-12 rounded-2xl bg-[#0a0a0a] border ${
                    errors.fullName
                      ? "border-rose-500/80 ring-1 ring-rose-500/20"
                      : "border-white/10"
                  } text-white placeholder:text-zinc-500 text-sm px-4 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/10 transition-all duration-200 disabled:opacity-50`}
                />
                {errors.fullName && (
                  <p className="text-rose-400 text-xs mt-1.5 ml-1">
                    {errors.fullName}
                  </p>
                )}
              </motion.div>

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
                  <p className="text-rose-400 text-xs mt-1.5 ml-1">
                    {errors.email}
                  </p>
                )}
              </motion.div>

              <motion.div variants={itemVariants}>
                <PasswordInput
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password (min. 8 characters)"
                  label="Password"
                  autoComplete="new-password"
                  error={errors.password}
                  disabled={isLoading || isGoogleLoading}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <PasswordInput
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  label="Confirm Password"
                  autoComplete="new-password"
                  error={errors.confirmPassword}
                  disabled={isLoading || isGoogleLoading}
                />
              </motion.div>

              <motion.div variants={itemVariants} className="pt-2">
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
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <span>Create Account</span>
                  )}
                </motion.button>
              </motion.div>
            </form>

            <motion.div
              variants={itemVariants}
              className="text-center text-sm text-zinc-400 mt-6 select-none"
            >
              <span>Already have an account? </span>
              <Link
                href="/login"
                className="text-white font-semibold hover:underline ml-1"
              >
                Sign in
              </Link>
            </motion.div>

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
          </>
        )}
      </motion.div>
    </AuthLayout>
  );
}
