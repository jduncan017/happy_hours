import { Settings, Cog, Database, Shield } from "lucide-react";
import CardWrapper from "../SmallComponents/CardWrapper";

export default function AdminSettings() {
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
          System Settings
        </h1>
        <p className="DashboardSubtitle text-white/70">
          Configure system preferences and administrative options
        </p>
      </div>

      <div className="SettingsContent">
        <div className="SettingsPlaceholder text-center py-20 rounded-2xl bg-stone-800/30 border border-white/10">
          <div className="w-24 h-24 mx-auto mb-6 bg-stone-700/50 rounded-full flex items-center justify-center">
            <Settings className="w-12 h-12 text-white/50" />
          </div>
          <h3 className="text-xl font-medium text-white mb-3">
            System Settings Coming Soon
          </h3>
          <p className="text-white/70 max-w-md mx-auto">
            This section will provide configuration options for system
            preferences, database settings, and administrative controls.
          </p>
        </div>
      </div>
    </CardWrapper>
  );
}
