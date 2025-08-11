import { BarChart3, TrendingUp, Users, MapPin } from "lucide-react";
import CardWrapper from "../SmallComponents/CardWrapper";

export default function AdminAnalytics() {
  return (
    <CardWrapper
      variant="dark-glass"
      padding="lg"
      rounded="2xl"
      className="w-full shadow-2xl"
    >
      {/* Dashboard Header */}
      <div className="DashboardHeader mb-8">
        <h1 className="DashboardTitle text-2xl sm:text-3xl font-serif font-bold text-white mb-2">
          Analytics Dashboard
        </h1>
        <p className="DashboardSubtitle text-white/70">
          Monitor system performance and user engagement metrics
        </p>
      </div>

      <div className="AnalyticsContent">
        <div className="AnalyticsPlaceholder text-center py-20 rounded-2xl bg-stone-800/30 border border-white/10">
          <div className="w-24 h-24 mx-auto mb-6 bg-stone-700/50 rounded-full flex items-center justify-center">
            <BarChart3 className="w-12 h-12 text-white/50" />
          </div>
          <h3 className="text-xl font-medium text-white mb-3">
            Analytics Coming Soon
          </h3>
          <p className="text-white/70 max-w-md mx-auto">
            This section will display comprehensive analytics including user
            engagement, restaurant performance metrics, and system usage
            statistics.
          </p>
        </div>
      </div>
    </CardWrapper>
  );
}
