import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/auth";
import Image from "next/image";
import AuthForm from "@/app/Components/auth/AuthForm";
import AnimatedGradientBackground from "@/app/Components/SmallComponents/AnimatedGradientBackground";
import Link from "next/link";

export default async function SignupPage() {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);

  // Redirect if already logged in
  if (user) {
    redirect("/");
  }

  return (
    <div className="SignupPage relative min-h-90vh bg-gradient-to-br from-stone-950 via-stone-950 to-stone-900">
      {/* Animated Background for entire page */}
      <AnimatedGradientBackground intensity="medium" speed="slow" />
      
      <div className="relative z-10 lg:grid lg:grid-cols-3 gap-10 p-4 lg:p-10 min-h-90vh">
        {/* Left Side - Form Content (2/3) */}
        <div className="SignupFormSide lg:col-span-2 flex items-center justify-center">
          <div className="SignupFormContainer w-full max-w-md bg-stone-900/70 backdrop-blur rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/5">
            {/* Header */}
            <div className="SignupHeader mb-6">
              <h1 className="SignupTitle text-2xl sm:text-3xl font-serif font-bold text-white">
                Join the Hunt
              </h1>
              <p className="SignupSubtitle mt-1 text-white/70">
                Discover Denver&apos;s best happy hours.
              </p>
            </div>

            {/* Auth Form */}
            <div className="SignupFormWrapper">
              <AuthForm mode="signup" />
            </div>

            {/* Footer Links */}
            <div className="SignupFooter text-center mt-6">
              <p className="text-sm text-white/70">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="text-po1 hover:underline font-semibold"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Welcome Panel (Desktop 1/3) */}
        <div className="SignupWelcomePanel hidden lg:block lg:col-span-1">
          <div className="bg-stone-900/60 border border-white/5 shadow-2xl h-full rounded-3xl p-7 sm:p-10 lg:p-12 flex flex-col justify-center">
            <div className="SignupWelcomeIcon h-12 w-12 rounded-2xl bg-gradient-to-br from-po1 to-py1 grid place-items-center text-stone-900 font-bold text-xl mb-6">
              🍸
            </div>
            
            <h2 className="SignupWelcomeTitle text-2xl sm:text-3xl font-serif font-bold leading-tight text-white mb-4">
              Welcome to Denver&apos;s Happy Hour Scene
            </h2>
            
            <p className="SignupWelcomeText text-white/70 max-w-prose mb-8">
              Join locals discovering the best dates, deals, and late-afternoon steals. Save favorites, rate spots, and get alerts before specials end.
            </p>

            {/* Benefits List */}
            <div className="SignupBenefits grid gap-4">
              <div className="BenefitItem rounded-2xl bg-stone-800/70 border border-white/5 p-4 sm:p-5 hover:bg-stone-800/90 transition">
                <div className="flex items-start gap-4">
                  <div className="BenefitIcon h-9 w-9 shrink-0 rounded-xl bg-po1/20 grid place-items-center text-py1">
                    📍
                  </div>
                  <div>
                    <p className="BenefitTitle font-semibold text-white">Find Nearby Deals</p>
                    <p className="BenefitText text-sm text-white/70">Instant map of happy hours around you.</p>
                  </div>
                </div>
              </div>

              <div className="BenefitItem rounded-2xl bg-stone-800/70 border border-white/5 p-4 sm:p-5 hover:bg-stone-800/90 transition">
                <div className="flex items-start gap-4">
                  <div className="BenefitIcon h-9 w-9 shrink-0 rounded-xl bg-po1/20 grid place-items-center text-py1">
                    ⭐
                  </div>
                  <div>
                    <p className="BenefitTitle font-semibold text-white">Rate & Review</p>
                    <p className="BenefitText text-sm text-white/70">Share experiences with the community.</p>
                  </div>
                </div>
              </div>

              <div className="BenefitItem rounded-2xl bg-stone-800/70 border border-white/5 p-4 sm:p-5 hover:bg-stone-800/90 transition">
                <div className="flex items-start gap-4">
                  <div className="BenefitIcon h-9 w-9 shrink-0 rounded-xl bg-po1/20 grid place-items-center text-py1">
                    📒
                  </div>
                  <div>
                    <p className="BenefitTitle font-semibold text-white">Save Favorites</p>
                    <p className="BenefitText text-sm text-white/70">Build your go‑to list for any neighborhood.</p>
                  </div>
                </div>
              </div>

              <div className="BenefitItem rounded-2xl bg-stone-800/70 border border-white/5 p-4 sm:p-5 hover:bg-stone-800/90 transition">
                <div className="flex items-start gap-4">
                  <div className="BenefitIcon h-9 w-9 shrink-0 rounded-xl bg-po1/20 grid place-items-center text-py1">
                    🔔
                  </div>
                  <div>
                    <p className="BenefitTitle font-semibold text-white">Get Updates</p>
                    <p className="BenefitText text-sm text-white/70">Never miss a limited‑time special.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Welcome Card - Below form */}
      <div className="SignupMobileWelcome lg:hidden flex justify-center px-4 pb-4">
        <div className="w-full max-w-md bg-stone-900/70 backdrop-blur rounded-3xl p-6 shadow-2xl border border-white/5">
          <div className="text-center mb-6">
            <div className="SignupWelcomeIcon h-12 w-12 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-po1 to-py1 grid place-items-center text-stone-900 font-bold text-xl">
              🍸
            </div>
            <h2 className="text-xl font-serif font-bold text-white mb-2">
              Welcome to Denver&apos;s Happy Hour Scene
            </h2>
            <p className="text-white/70 text-sm">
              Join locals discovering the best dates, deals, and late-afternoon steals. Save favorites, rate spots, and get alerts before specials end.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="BenefitItem rounded-2xl bg-stone-800/70 border border-white/5 p-4 hover:bg-stone-800/90 transition">
              <div className="text-center">
                <div className="BenefitIcon h-9 w-9 mx-auto mb-2 rounded-xl bg-po1/20 grid place-items-center text-py1">
                  📍
                </div>
                <p className="BenefitTitle text-xs font-semibold text-white mb-1">Find Nearby Deals</p>
                <p className="BenefitText text-xs text-white/70">Instant map</p>
              </div>
            </div>
            
            <div className="BenefitItem rounded-2xl bg-stone-800/70 border border-white/5 p-4 hover:bg-stone-800/90 transition">
              <div className="text-center">
                <div className="BenefitIcon h-9 w-9 mx-auto mb-2 rounded-xl bg-po1/20 grid place-items-center text-py1">
                  ⭐
                </div>
                <p className="BenefitTitle text-xs font-semibold text-white mb-1">Rate & Review</p>
                <p className="BenefitText text-xs text-white/70">Share experiences</p>
              </div>
            </div>
            
            <div className="BenefitItem rounded-2xl bg-stone-800/70 border border-white/5 p-4 hover:bg-stone-800/90 transition">
              <div className="text-center">
                <div className="BenefitIcon h-9 w-9 mx-auto mb-2 rounded-xl bg-po1/20 grid place-items-center text-py1">
                  📒
                </div>
                <p className="BenefitTitle text-xs font-semibold text-white mb-1">Save Favorites</p>
                <p className="BenefitText text-xs text-white/70">Build lists</p>
              </div>
            </div>
            
            <div className="BenefitItem rounded-2xl bg-stone-800/70 border border-white/5 p-4 hover:bg-stone-800/90 transition">
              <div className="text-center">
                <div className="BenefitIcon h-9 w-9 mx-auto mb-2 rounded-xl bg-po1/20 grid place-items-center text-py1">
                  🔔
                </div>
                <p className="BenefitTitle text-xs font-semibold text-white mb-1">Get Updates</p>
                <p className="BenefitText text-xs text-white/70">Never miss deals</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Join The Hunt - HappyHourHunt Denver",
  description:
    "Create your HappyHourHunt account to discover, rate, and share the best happy hours in Denver.",
};