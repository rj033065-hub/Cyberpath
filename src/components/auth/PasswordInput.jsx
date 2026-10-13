import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function PasswordInput({
  id = "password",
  name = "password",
  value,
  onChange,
  placeholder = "Password",
  label = "Password",
  error,
  required = false,
  autoComplete = "current-password",
  disabled = false,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full text-left">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-semibold text-white mb-2"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          name={name}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          className={`w-full h-12 rounded-2xl bg-[#0a0a0a] border ${
            error ? "border-rose-500/80 ring-1 ring-rose-500/20" : "border-white/10"
          } text-white placeholder:text-zinc-500 text-sm px-4 pr-11 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/10 transition-all duration-200 disabled:opacity-50`}
          {...props}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors p-0.5 focus:outline-none"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4 text-zinc-400 hover:text-zinc-200 transition-colors" />
          ) : (
            <Eye className="w-4 h-4 text-zinc-400 hover:text-zinc-200 transition-colors" />
          )}
        </button>
      </div>
      {error && <p className="text-rose-400 text-xs mt-1.5 ml-1">{error}</p>}
    </div>
  );
}

export default PasswordInput;
