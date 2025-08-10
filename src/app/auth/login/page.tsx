import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/auth";
import AuthForm from "@/app/Components/auth/AuthForm";
import AnimatedGradientBackground from "@/app/Components/SmallComponents/AnimatedGradientBackground";
import Link from "next/link";

export default async function LoginPage() {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);

  // Redirect if already logged in
  if (user) {
    redirect("/");
  }

  return (
    <div className="LoginPage relative min-h-90vh bg-gradient-to-br from-stone-950 via-stone-950 to-stone-900">
      {/* Animated Background for entire page */}
      <AnimatedGradientBackground intensity="medium" speed="slow" />
      
      <div className="relative z-10 lg:grid lg:grid-cols-3 gap-10 p-4 lg:p-10 min-h-90vh">
        {/* Left Side - Form Content (2/3) */}
        <div className="LoginFormSide lg:col-span-2 flex items-center justify-center">
          <div className="LoginFormContainer w-full max-w-md bg-stone-900/70 backdrop-blur rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/5">
            {/* Header */}
            <div className="LoginHeader mb-6">
              <h1 className="LoginTitle text-2xl sm:text-3xl font-serif font-bold text-white">
                Welcome Back, Hunter
              </h1>
              <p className="LoginSubtitle mt-1 text-white/70">
                Your Denver happy hour adventure continues.
              </p>
            </div>

            {/* Auth Form */}
            <div className="LoginFormWrapper">
              <AuthForm mode="login" />
            </div>

            {/* Footer Links */}
            <div className="LoginFooter text-center mt-6 space-y-3">
              <p className="text-sm text-white/70">
                Don&apos;t have an account?{" "}
                <Link
                  href="/auth/signup"
                  className="text-po1 hover:underline font-semibold"
                >
                  Join the hunt
                </Link>
              </p>
              <p className="text-xs text-white/50">
                <Link
                  href="/auth/forgot-password"
                  className="hover:text-po1 transition-colors underline"
                >
                  Forgot your password?
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Features Panel (Desktop 1/3) */}
        <div className="LoginFeaturesPanel hidden lg:block lg:col-span-1">
          <div className="bg-stone-900/60 border border-white/5 shadow-2xl h-full rounded-3xl p-7 sm:p-10 lg:p-12 flex flex-col justify-center">
            <div className="LoginFeaturesIcon h-12 w-12 rounded-2xl bg-gradient-to-br from-po1 to-py1 grid place-items-center text-stone-900 font-bold text-xl mb-6">
              🍻
            </div>
            
            <h2 className="LoginFeaturesTitle text-2xl sm:text-3xl font-serif font-bold leading-tight text-white mb-4">
              Ready for Your Next Adventure?
            </h2>
            
            <p className="LoginFeaturesText text-white/70 max-w-prose mb-8">
              Welcome back! Your saved spots, reviews, and personalized recommendations are waiting. Let&apos;s discover what&apos;s happening in Denver today.
            </p>

            {/* Features List */}
            <div className="LoginFeatures grid gap-4">
              <div className="FeatureItem rounded-2xl bg-stone-800/70 border border-white/5 p-4 sm:p-5 hover:bg-stone-800/90 transition">
                <div className="flex items-start gap-4">
                  <div className="FeatureIcon h-9 w-9 shrink-0 rounded-xl bg-po1/20 grid place-items-center text-py1">
                    ❤️
                  </div>
                  <div>
                    <p className="FeatureTitle font-semibold text-white">Your Saved Spots</p>
                    <p className="FeatureText text-sm text-white/70">Access your favorite happy hour locations.</p>
                  </div>
                </div>
              </div>

              <div className="FeatureItem rounded-2xl bg-stone-800/70 border border-white/5 p-4 sm:p-5 hover:bg-stone-800/90 transition">
                <div className="flex items-start gap-4">
                  <div className="FeatureIcon h-9 w-9 shrink-0 rounded-xl bg-po1/20 grid place-items-center text-py1">
                    ⚡
                  </div>
                  <div>
                    <p className="FeatureTitle font-semibold text-white">Live Updates</p>
                    <p className="FeatureText text-sm text-white/70">Real-time deals and new restaurant alerts.</p>
                  </div>
                </div>
              </div>

              <div className="FeatureItem rounded-2xl bg-stone-800/70 border border-white/5 p-4 sm:p-5 hover:bg-stone-800/90 transition">
                <div className="flex items-start gap-4">
                  <div className="FeatureIcon h-9 w-9 shrink-0 rounded-xl bg-po1/20 grid place-items-center text-py1">
                    🎯
                  </div>
                  <div>
                    <p className="FeatureTitle font-semibold text-white">Personalized Picks</p>
                    <p className="FeatureText text-sm text-white/70">Recommendations based on your preferences.</p>
                  </div>
                </div>
              </div>

              <div className="FeatureItem rounded-2xl bg-stone-800/70 border border-white/5 p-4 sm:p-5 hover:bg-stone-800/90 transition">
                <div className="flex items-start gap-4">
                  <div className="FeatureIcon h-9 w-9 shrink-0 rounded-xl bg-po1/20 grid place-items-center text-py1">
                    📊
                  </div>
                  <div>
                    <p className="FeatureTitle font-semibold text-white">Your Reviews</p>
                    <p className="FeatureText text-sm text-white/70">Track your experiences and share insights.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Features Card - Below form */}
      <div className="LoginMobileFeatures lg:hidden flex justify-center px-4 pb-4">
        <div className="w-full max-w-md bg-stone-900/70 backdrop-blur rounded-3xl p-6 shadow-2xl border border-white/5">
          <div className="text-center mb-6">
            <div className="LoginFeaturesIcon h-12 w-12 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-po1 to-py1 grid place-items-center text-stone-900 font-bold text-xl">
              🍻
            </div>
            <h2 className="text-xl font-serif font-bold text-white mb-2">
              Ready for Your Next Adventure?
            </h2>
            <p className="text-white/70 text-sm">
              Welcome back! Your saved spots, reviews, and personalized recommendations are waiting.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="FeatureItem rounded-2xl bg-stone-800/70 border border-white/5 p-4 hover:bg-stone-800/90 transition">
              <div className="text-center">
                <div className="FeatureIcon h-9 w-9 mx-auto mb-2 rounded-xl bg-po1/20 grid place-items-center text-py1">
                  ❤️
                </div>
                <p className="FeatureTitle text-xs font-semibold text-white mb-1">Your Saved Spots</p>
                <p className="FeatureText text-xs text-white/70">Favorite locations</p>
              </div>
            </div>
            
            <div className="FeatureItem rounded-2xl bg-stone-800/70 border border-white/5 p-4 hover:bg-stone-800/90 transition">
              <div className="text-center">
                <div className="FeatureIcon h-9 w-9 mx-auto mb-2 rounded-xl bg-po1/20 grid place-items-center text-py1">
                  ⚡
                </div>
                <p className="FeatureTitle text-xs font-semibold text-white mb-1">Live Updates</p>
                <p className="FeatureText text-xs text-white/70">Real-time deals</p>
              </div>
            </div>
            
            <div className="FeatureItem rounded-2xl bg-stone-800/70 border border-white/5 p-4 hover:bg-stone-800/90 transition">
              <div className="text-center">
                <div className="FeatureIcon h-9 w-9 mx-auto mb-2 rounded-xl bg-po1/20 grid place-items-center text-py1">
                  🎯
                </div>
                <p className="FeatureTitle text-xs font-semibold text-white mb-1">Personal Picks</p>
                <p className="FeatureText text-xs text-white/70">Custom recommendations</p>
              </div>
            </div>
            
            <div className="FeatureItem rounded-2xl bg-stone-800/70 border border-white/5 p-4 hover:bg-stone-800/90 transition">
              <div className="text-center">
                <div className="FeatureIcon h-9 w-9 mx-auto mb-2 rounded-xl bg-po1/20 grid place-items-center text-py1">
                  📊
                </div>
                <p className="FeatureTitle text-xs font-semibold text-white mb-1">Your Reviews</p>
                <p className="FeatureText text-xs text-white/70">Track experiences</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Welcome Back - HappyHourHunt Denver",
  description:
    "Sign in to your HappyHourHunt account to continue discovering the best happy hours in Denver.",
};