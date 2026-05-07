import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/auth";
import WelcomeFlow from "@/app/Components/onboarding/WelcomeFlow";
import AnimatedGradientBackground from "@/app/Components/SmallComponents/AnimatedGradientBackground";

export const metadata = {
  title: "Welcome to HappyHourHunt",
  description: "Set up your account in under a minute.",
};

const PICK_POOL = 60; // shuffle pool size; user pages through these in batches

export default async function WelcomePage() {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("full_name, onboarding_completed_at")
    .eq("id", user.id)
    .single();

  if (profile?.onboarding_completed_at) {
    redirect("/search");
  }

  // Only show rows that have a real stored image — looks more polished than
  // a grid of "no image" placeholders. Verified first, then JS-shuffle.
  const { data: candidates } = await supabase
    .from("restaurants")
    .select("id, name, area, address, hero_image")
    .like("hero_image", "%/storage/v1/object/public/restaurant-images/%")
    .order("verified", { ascending: false })
    .limit(PICK_POOL);

  const pickRestaurants = (candidates ?? [])
    .map((r) => ({ r, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ r }) => r);

  return (
    <div className="WelcomePage relative min-h-screen flex justify-center bg-gradient-to-br from-stone-950 via-stone-950 to-stone-900 overflow-hidden">
      <AnimatedGradientBackground intensity="medium" speed="slow" />
      <div className="relative z-10 w-full max-w-3xl px-4 py-10 sm:px-8 sm:py-16">
        <WelcomeFlow
          initialFullName={profile?.full_name ?? ""}
          pickRestaurants={pickRestaurants}
        />
      </div>
    </div>
  );
}
