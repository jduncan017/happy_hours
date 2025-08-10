"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { signIn, signUp } from "@/lib/supabase/auth";
import LoadingSpinner from "@/app/Components/SmallComponents/LoadingSpinner";
import { useRouter } from "next/navigation";
import { User, Lock, Mail } from "lucide-react";
import Link from "next/link";

interface AuthFormProps {
  mode: "login" | "signup";
  onSuccess?: () => void;
}

export default function AuthForm({ mode, onSuccess }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (mode === "signup") {
        const { user, error } = await signUp(supabase, email, password, {
          full_name: fullName || undefined,
        });

        if (error) {
          setError(error.message);
        } else if (user) {
          setSuccess("🎉 Account created! Check your email to confirm.");
          // Reset form
          setEmail("");
          setPassword("");
          setFullName("");
        }
      } else {
        const { user, error } = await signIn(supabase, email, password);

        if (error) {
          setError(error.message);
        } else if (user) {
          setSuccess("🍻 Welcome back! Redirecting...");
          setTimeout(() => {
            if (onSuccess) {
              onSuccess();
            } else {
              router.push("/search");
            }
          }, 1000);
        }
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Auth error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="AuthForm">
      {/* Form Content */}
      <form onSubmit={handleSubmit} className="AuthForm__container space-y-5">
        {error && (
          <div
            className="AuthForm__error bg-red-900/50 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl backdrop-blur-sm"
            role="alert"
            aria-live="polite"
          >
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {error}
            </div>
          </div>
        )}

        {success && (
          <div
            className="AuthForm__success bg-green-900/50 border border-green-500/30 text-green-300 px-4 py-3 rounded-xl backdrop-blur-sm"
            role="alert"
            aria-live="polite"
          >
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {success}
            </div>
          </div>
        )}

        {/* Name Field */}
        {mode === "signup" && (
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm text-white/80 mb-1"
            >
              Full Name
            </label>
            <div className="relative">
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full rounded-xl bg-stone-800/80 border border-white/10 px-4 py-3 pr-10 placeholder:text-white/40 text-white focus:ring-2 focus:ring-po1 focus:outline-none"
              />
              <User className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
            </div>
          </div>
        )}

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm text-white/80 mb-1">
            Email Address
          </label>
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="w-full rounded-xl bg-stone-800/80 border border-white/10 px-4 py-3 pr-10 placeholder:text-white/40 text-white focus:ring-2 focus:ring-po1 focus:outline-none"
            />
            <Mail className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-sm text-white/80 mb-1"
            >
              Password
            </label>
            {mode === "signup" && (
              <span className="text-xs text-white/50">Min 6 chars</span>
            )}
          </div>
          <div className="relative">
            <input
              id="password"
              name="password"
              type="password"
              minLength={6}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl bg-stone-800/80 border border-white/10 px-4 py-3 pr-10 placeholder:text-white/40 text-white focus:ring-2 focus:ring-po1 focus:outline-none"
            />
            <Lock className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
          </div>
        </div>

        {/* Terms Checkbox - Only for Signup */}
        {mode === "signup" && (
          <div className="flex items-start gap-3 text-sm">
            <input
              id="terms"
              type="checkbox"
              required
              className="mt-1 h-4 w-4 rounded border-white/20 bg-stone-800 text-po1 focus:ring-po1"
            />
            <label htmlFor="terms" className="text-white/70">
              I agree to the{" "}
              <Link
                href="/terms"
                className="underline decoration-po1/60 hover:decoration-po1 text-po1"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="underline decoration-po1/60 hover:decoration-po1 text-po1"
              >
                Privacy Policy
              </Link>
              .
            </label>
          </div>
        )}

        <div className="AuthForm__actions pt-4">
          {loading ? (
            <div className="AuthForm__loading bg-stone-800/60 text-white/70 font-semibold py-4 px-6 rounded-xl flex items-center justify-center border border-white/10">
              <LoadingSpinner size="sm" className="mr-3" />
              {mode === "login"
                ? "Signing You In..."
                : "Creating Your Account..."}
            </div>
          ) : (
            <button
              type="submit"
              className="AuthForm__submit w-full rounded-xl bg-gradient-to-r from-po1 to-py1 px-6 py-4 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-po1/50 focus:ring-offset-2 focus:ring-offset-stone-900"
            >
              {mode === "login" ? "Sign In" : "Create Account"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
