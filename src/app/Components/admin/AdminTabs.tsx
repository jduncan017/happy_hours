import { Database, Users, Settings, BarChart3 } from "lucide-react";

export type AdminTab = "directory" | "analytics" | "users" | "settings";

interface AdminTabsProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
}

export default function AdminTabs({ activeTab, onTabChange }: AdminTabsProps) {
  const tabs = [
    {
      id: "directory" as AdminTab,
      label: "Restaurant Directory",
      icon: Database,
    },
    {
      id: "analytics" as AdminTab,
      label: "Analytics",
      icon: BarChart3,
    },
    {
      id: "users" as AdminTab,
      label: "User Management",
      icon: Users,
    },
    {
      id: "settings" as AdminTab,
      label: "System Settings",
      icon: Settings,
    },
  ];

  return (
    <div className="AdminTabsContainer">
      <div className="AdminTabsGrid grid grid-cols-1 gap-3">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`AdminTabButton group w-full px-4 py-2 rounded-lg border transition-all ${
                isActive
                  ? "bg-po1/20 border-po1/30 text-po1"
                  : "bg-stone-800/50 border-white/10 text-white/70 hover:bg-stone-800/70 hover:text-white hover:border-white/20"
              }`}
            >
              <div className="AdminTabContent flex items-center gap-4 cursor-pointer">
                <div
                  className={`AdminTabIcon h-8 w-8 rounded-xl grid place-items-center transition-colors ${
                    isActive
                      ? "bg-po1/20 text-po1"
                      : "bg-white/10 text-white/50 group-hover:bg-white/20 group-hover:text-white"
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                </div>
                <div className="AdminTabInfo flex-1 text-left">
                  <p
                    className={`AdminTabLabel font-bold text-xs transition-colors ${
                      isActive ? "text-po1" : "text-white"
                    }`}
                  >
                    {tab.label}
                  </p>
                </div>
                {isActive && (
                  <div className="AdminTabActiveIndicator w-2 h-2 rounded-full bg-po1"></div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
