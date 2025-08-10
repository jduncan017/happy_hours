import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/auth";
import AuthForm from "@/app/Components/auth/AuthForm";
import AnimatedGradientBackground from "@/app/Components/SmallComponents/AnimatedGradientBackground";
import CardWrapper from "@/app/Components/SmallComponents/CardWrapper";
import FeatureList from "@/app/Components/SmallComponents/FeatureList";
import Link from "next/link";

// Features data for login page
const loginFeatures = [
  {
    icon: "❤️",
    title: "Your Saved Spots",
    description: "Access your favorite happy hour locations.",
  },
  {
    icon: "⚡",
    title: "Live Updates",
    description: "Real-time deals and new restaurant alerts.",
  },
  {
    icon: "🎯",
    title: "Personalized Picks",
    description: "Recommendations based on your preferences.",
  },
  {
    icon: "📊",
    title: "Your Reviews",
    description: "Track your experiences and share insights.",
  },
];

export default async function LoginPage() {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);

  // Redirect if already logged in
  if (user) {
    redirect("/");
  }

  return (
    <div className="LoginPage relative flex gap-6 flex-col-reverse pt-[74px] sm:pt-0 sm:flex-row justify-center bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950">
      {/* Animated Background */}
      <AnimatedGradientBackground intensity="medium" speed="normal" />

      {/* Left Side - Features Panel (Desktop 1/3) */}
      <div className="LoginFeaturesPanel w-full max-w-sm">
        {/* Panel variant for sm+ screens */}
        <CardWrapper
          variant="panel-dark"
          padding="lg"
          className="hidden sm:flex flex-col border-r h-full"
        >
          <h2 className="LoginFeaturesTitle text-2xl sm:text-3xl font-serif font-bold leading-tight text-white mb-4">
            Ready for Your Next Adventure?
          </h2>

          <p className="LoginFeaturesText text-white/70 max-w-prose mb-8">
            Welcome back! Your saved spots, reviews, and personalized
            recommendations are waiting. Let&apos;s discover what&apos;s
            happening in Denver today.
          </p>

          {/* Features List */}
          <FeatureList features={loginFeatures} />
        </CardWrapper>
      </div>

      {/* Right Side - Form Content (2/3) */}
      <div className="LoginFormSide w-full flex justify-center items-center p-4 sm:p-10 lg:p-20">
        <CardWrapper
          variant="dark-glass"
          padding="lg"
          rounded="2xl"
          className="w-full max-w-lg shadow-2xl"
        >
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
        </CardWrapper>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Welcome Back - HappyHourHunt Denver",
  description:
    "Sign in to your HappyHourHunt account to continue discovering the best happy hours in Denver.",
};
