import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/supabase/auth";
import AdminDashboard from "@/app/Components/admin/AdminDashboard";
import Link from "next/link";
import { Home, Settings } from "lucide-react";

export default async function AdminPage() {
  const supabase = await createClient();
  const userIsAdmin = await isAdmin(supabase);

  if (!userIsAdmin) {
    redirect("/auth/login");
  }

  // Fetch restaurant count and other basic stats
  const { data: restaurants, count: restaurantCount } = await supabase
    .from("restaurants")
    .select("*", { count: "exact" });

  const { count: pendingSubmissions } = await supabase
    .from("restaurant_submissions")
    .select("*", { count: "exact" })
    .eq("status", "pending");

  const stats = {
    totalRestaurants: restaurantCount || 0,
    pendingSubmissions: pendingSubmissions || 0,
    verifiedRestaurants: restaurants?.filter((r) => r.verified).length || 0,
  };

  return (
    <div className="AdminPage min-h-screen bg-stone-400">
      {/* Header Section */}
      <div className="AdminPage__header bg-gradient-to-r from-po1 to-py1 px-8 py-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="AdminPageTitle text-4xl font-serif text-white font-bold mb-2 uppercase tracking-wide flex items-center">
                <Settings className="w-10 h-10 mr-4" />
                Admin Command Center
              </h1>
              <p className="AdminPagesubtitle text-white font-medium text-xl">
                Manage Denver&apos;s happy hour ecosystem 🍻
              </p>
            </div>

            {/* Quick Actions */}
            <div className="AdminPageActions flex items-center space-x-4">
              <Link
                href="/"
                className="BackToSiteButton group flex items-center gap-2 bg-white hover:bg-n2 text-gray-800 px-4 py-2 rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <Home className="w-5 h-5 group-hover:text-po1 transition-colors" />
                <span className="hidden sm:inline">Back to Site</span>
              </Link>
              
              <div className="SystemStatus bg-white rounded-lg px-4 py-2 shadow-lg">
                <div className="text-black text-sm font-bold uppercase tracking-wide">
                  System Status
                </div>
                <div className="text-gray-600 font-medium flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  All Systems Go
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="AdminPage__content max-w-7xl mx-auto px-6 py-8">
        <AdminDashboard restaurants={restaurants || []} stats={stats} />
      </div>
    </div>
  );
}

export const metadata = {
  title: "Admin Command Center - HappyHourHunt Denver",
  description:
    "Administrative dashboard for managing restaurants, submissions, and site content.",
};
