import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AuthIllustration from "./AuthIllustration";
import TypingQuote from "./TypingQuote";

export function AuthLayout({
  children,
  quote = "Welcome Back! The journey continues.",
  author = "EaseMize UI",
}) {
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);
  const [activeWorkspace, setActiveWorkspace] = useState("DemoOne");
  const dropdownRef = useRef(null);

  const workspaces = [
    { id: "DemoOne", name: "DemoOne", type: "Default Workspace" },
    { id: "CyberPath", name: "CyberPath Pro", type: "Security Lab" },
    { id: "DevTeam", name: "Red Team Ops", type: "Offensive Ops" },
  ];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setWorkspaceMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white flex flex-col justify-between overflow-x-hidden relative selection:bg-white/20">
      {/* Top-Left Pill Button: Workspace / Theme Switcher */}
      <div className="absolute top-5 left-5 sm:top-6 sm:left-6 z-50" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setWorkspaceMenuOpen((prev) => !prev)}
          className="group rounded-full border border-white/15 bg-black/60 hover:bg-white/5 backdrop-blur-md px-3.5 py-1.5 text-xs sm:text-sm font-medium text-white/90 hover:text-white flex items-center gap-1.5 transition-all duration-200 cursor-pointer shadow-lg shadow-black/40"
          aria-expanded={workspaceMenuOpen}
          aria-label="Workspace and theme selector"
        >
          <span>{activeWorkspace}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-transform duration-200 ${
              workspaceMenuOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {workspaceMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute left-0 mt-2 w-56 rounded-2xl bg-[#0c0c10] border border-white/10 p-1.5 shadow-2xl backdrop-blur-xl z-50 text-left"
            >
              <div className="px-3 py-2 text-[11px] font-semibold tracking-wider uppercase text-zinc-500 border-b border-white/5">
                Workspaces
              </div>
              <div className="py-1">
                {workspaces.map((ws) => (
                  <button
                    key={ws.id}
                    type="button"
                    onClick={() => {
                      setActiveWorkspace(ws.name);
                      setWorkspaceMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl hover:bg-white/5 text-zinc-300 hover:text-white transition-colors"
                  >
                    <div>
                      <p className="font-medium text-white">{ws.name}</p>
                      <p className="text-[10px] text-zinc-500">{ws.type}</p>
                    </div>
                    {activeWorkspace === ws.name && (
                      <Check className="w-3.5 h-3.5 text-blue-400" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main 50/50 Split Grid */}
      <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2 p-3 sm:p-5 lg:p-6 gap-6 items-stretch">
        {/* LEFT COLUMN: Vertically & Horizontally Centered Form */}
        <div className="flex flex-col items-center justify-center w-full min-h-[calc(100vh-2rem)] py-12 px-4 sm:px-6 z-10">
          <div className="w-full max-w-[440px] flex flex-col justify-center">
            {children}
          </div>
        </div>

        {/* RIGHT COLUMN: Illustration Panel with Rounded Corners (Desktop Only) */}
        <div className="hidden lg:flex flex-col h-full w-full min-h-[calc(100vh-3rem)]">
          <div className="relative w-full h-full rounded-[28px] sm:rounded-[32px] overflow-hidden bg-[#07070a] border border-white/[0.08] shadow-2xl flex flex-col justify-between p-6">
            {/* Top decorative accent / badge */}
            <div className="w-full flex justify-end z-20">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-[11px] text-zinc-400">
                <Sparkles className="w-3 h-3 text-yellow-400" />
                <span>CyberPath Portal</span>
              </div>
            </div>

            {/* Centered Space Astronaut Illustration */}
            <div className="flex-1 w-full flex items-center justify-center my-auto">
              <AuthIllustration />
            </div>

            {/* Bottom Quote with Typing Effect and Attribution */}
            <div className="w-full pb-6 z-20">
              <TypingQuote quote={quote} author={author} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
