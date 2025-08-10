import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/auth";
import AnimatedGradientBackground from "@/app/Components/SmallComponents/AnimatedGradientBackground";
import ProfileForm from "@/app/Components/profile/ProfileForm";
import ProfileStats from "@/app/Components/profile/ProfileStats";

export default async function ProfilePage() {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);

  // Redirect if not logged in
  if (!user) {
    redirect("/auth/login");
  }

  // Get user profile from database
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="ProfilePage relative min-h-screen bg-gradient-to-br from-stone-950 via-stone-950 to-stone-900">
      {/* Animated Background */}
      <AnimatedGradientBackground intensity="medium" speed="slow" />
      
      <div className="relative z-10 lg:grid lg:grid-cols-3 gap-10 p-4 lg:p-10 min-h-screen">
        {/* Left Side - Profile Form (2/3) */}
        <div className="ProfileFormSide lg:col-span-2 flex items-start justify-center py-10">
          <div className="ProfileFormContainer w-full max-w-2xl bg-stone-900/70 backdrop-blur rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/5">
            {/* Header */}
            <div className="ProfileHeader mb-8">
              <h1 className="ProfileTitle text-3xl sm:text-4xl font-serif font-bold text-white mb-2">
                Your Profile
              </h1>
              <p className="ProfileSubtitle text-white/70">
                Manage your account information and preferences.
              </p>
            </div>

            {/* Profile Form */}
            <ProfileForm user={user} profile={profile} />
          </div>
        </div>

        {/* Right Side - Stats & Info Panel (Desktop 1/3) */}
        <div className="ProfileStatsPanel hidden lg:block lg:col-span-1">
          <div className="bg-stone-900/60 border border-white/5 shadow-2xl h-full rounded-3xl p-7 sm:p-10 lg:p-12 flex flex-col">
            <div className="ProfileStatsIcon h-12 w-12 rounded-2xl bg-gradient-to-br from-po1 to-py1 grid place-items-center text-stone-900 font-bold text-xl mb-6">
              🎯
            </div>
            
            <h2 className="ProfileStatsTitle text-2xl sm:text-3xl font-serif font-bold leading-tight text-white mb-4">
              Your Happy Hour Journey
            </h2>
            
            <p className="ProfileStatsText text-white/70 max-w-prose mb-8">
              Track your discoveries, reviews, and favorite spots as you explore Denver&apos;s happy hour scene.
            </p>

            {/* Stats Component */}
            <ProfileStats userId={user.id} />
          </div>
        </div>
      </div>

      {/* Mobile Stats Card - Below form */}
      <div className="ProfileMobileStats lg:hidden flex justify-center px-4 pb-4">
        <div className="w-full max-w-2xl bg-stone-900/70 backdrop-blur rounded-3xl p-6 shadow-2xl border border-white/5">
          <div className="text-center mb-6">
            <div className="ProfileStatsIcon h-12 w-12 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-po1 to-py1 grid place-items-center text-stone-900 font-bold text-xl">
              🎯
            </div>
            <h2 className="text-xl font-serif font-bold text-white mb-2">
              Your Happy Hour Journey
            </h2>
            <p className="text-white/70 text-sm">
              Track your discoveries and reviews as you explore Denver.
            </p>
          </div>
          
          {/* Mobile Stats */}
          <ProfileStats userId={user.id} isMobile={true} />
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Your Profile - HappyHourHunt Denver",
  description:
    "Manage your profile, preferences, and track your happy hour discoveries in Denver.",
};