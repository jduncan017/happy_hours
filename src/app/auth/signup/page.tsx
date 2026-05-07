import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/auth";
import AuthForm from "@/app/Components/auth/AuthForm";
import AnimatedGradientBackground from "@/app/Components/SmallComponents/AnimatedGradientBackground";
import CardWrapper from "@/app/Components/SmallComponents/CardWrapper";
import FeatureList from "@/app/Components/SmallComponents/FeatureList";
import Link from "next/link";
import { MapPin, Star, Bookmark, Bell } from "lucide-react";

const signupFeatures = [
  {
    icon: <MapPin className="w-4 h-4" />,
    title: "Map view",
    description: "See what's running near you, right now.",
  },
  {
    icon: <Star className="w-4 h-4" />,
    title: "Rate spots",
    description: "Share which deals were worth it.",
  },
  {
    icon: <Bookmark className="w-4 h-4" />,
    title: "Save favorites",
    description: "Build your go-to list by neighborhood.",
  },
  {
    icon: <Bell className="w-4 h-4" />,
    title: "Stay current",
    description: "Verified weekly. No stale listings.",
  },
];

export default async function SignupPage() {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);

  // Redirect if already logged in
  if (user) {
    redirect("/");
  }

  return (
    <div className="SignupPage relative flex gap-6 flex-col-reverse pt-[74px] sm:pt-0 sm:flex-row justify-center bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950">
      {/* Animated Background */}
      <AnimatedGradientBackground intensity="medium" speed="normal" />

      {/* Left Side - Features Panel (Desktop 1/3) */}
      <div className="SignupFeaturesPanel w-full max-w-sm">
        {/* Panel variant for sm+ screens */}
        <CardWrapper
          variant="panel-dark"
          padding="lg"
          className="hidden sm:flex flex-col border-r h-full"
        >
          <h2 className="SignupFeaturesTitle text-2xl sm:text-3xl font-serif font-bold leading-tight text-white mb-4">
            Plan your next happy hour.
          </h2>

          <p className="SignupFeaturesText text-white/70 max-w-prose mb-8">
            Save your favorite spots, browse by neighborhood, and skip the
            full-price markup.
          </p>

          {/* Features List */}
          <FeatureList features={signupFeatures} />
        </CardWrapper>
      </div>

      {/* Right Side - Form Content (2/3) */}
      <div className="SignupFormSide w-full flex justify-center items-center p-4 sm:p-10 lg:p-20">
        <CardWrapper
          variant="dark-glass"
          padding="lg"
          rounded="2xl"
          className="w-full max-w-lg shadow-2xl"
        >
          {/* Header */}
          <div className="SignupHeader mb-6">
            <h1 className="SignupTitle text-2xl sm:text-3xl font-serif font-bold text-white">
              Create your account
            </h1>
            <p className="SignupSubtitle mt-1 text-white/70">
              Free, no spam, takes ten seconds.
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
        </CardWrapper>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Join The Hunt - HappyHourHunt Denver",
  description:
    "Create your HappyHourHunt account to discover, rate, and share the best happy hours in Denver.",
};
