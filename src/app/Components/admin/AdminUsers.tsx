import { Users, UserCheck, UserX, Shield } from "lucide-react";
import CardWrapper from "../SmallComponents/CardWrapper";

export default function AdminUsers() {
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
          User Management
        </h1>
        <p className="DashboardSubtitle text-white/70">
          Manage user accounts, permissions, and access controls
        </p>
      </div>

      <div className="UsersContent">
        <div className="UsersPlaceholder text-center py-20 rounded-2xl bg-stone-800/30 border border-white/10">
          <div className="w-24 h-24 mx-auto mb-6 bg-stone-700/50 rounded-full flex items-center justify-center">
            <Users className="w-12 h-12 text-white/50" />
          </div>
          <h3 className="text-xl font-medium text-white mb-3">
            User Management Coming Soon
          </h3>
          <p className="text-white/70 max-w-md mx-auto">
            This section will allow administrators to manage user accounts,
            assign roles, and control access permissions throughout the system.
          </p>
        </div>
      </div>
    </CardWrapper>
  );
}
