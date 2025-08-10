"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { signOut } from "@/lib/supabase/auth";
import { useRouter } from "next/navigation";
import { User2, Settings, LogOut, ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import SiteButton from "../SmallComponents/siteButton";
import { useUser } from "@/contexts/UserContext";

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const supabase = createClient();
  const { user, userRole, userProfile, loading } = useUser();

  useEffect(() => {
    // Close menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut(supabase);
    setIsOpen(false);
    router.push("/");
  };

  if (loading) {
    return (
      <div className="UserMenu__loading w-8 h-8 bg-n3 rounded-full animate-pulse" />
    );
  }

  if (!user) {
    return (
      <div className="UserMenu__auth flex items-center gap-3">
        <Link href="/auth/login">
          <SiteButton text="Sign In" rounded={true} variant="white" size="sm" />
        </Link>
        <Link href="/auth/signup">
          <SiteButton text="Sign Up" rounded={true} variant="white" size="sm" />
        </Link>
      </div>
    );
  }

  return (
    <div className="UserMenu relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="UserMenuTrigger flex items-center gap-2 p-2 rounded-xl hover:bg-white hover:shadow-md transition-all duration-300"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        {userProfile?.avatar_url ? (
          <Image
            src={userProfile.avatar_url}
            alt="Profile avatar"
            width={32}
            height={32}
            className="UserAvatar w-8 h-8 rounded-full object-cover shadow-lg border border-white/20"
            key={userProfile.avatar_url}
          />
        ) : (
          <div className="UserAvatar w-8 h-8 bg-po1 text-white rounded-full flex items-center justify-center font-bold shadow-lg">
            {(userProfile?.full_name || user.user_metadata?.full_name || user.email)?.[0]?.toUpperCase() || "U"}
          </div>
        )}
        <div className="UserInfo hidden sm:block text-left">
          <div className="UserName text-sm font-medium text-white">
            {userProfile?.full_name || user.user_metadata?.full_name || "User"}
          </div>
          {userRole === "admin" && (
            <div className="UserRole text-xs text-py1 font-bold uppercase">
              Admin
            </div>
          )}
        </div>
        <ChevronDown
          className={`UserChevron w-4 h-4 text-white transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="UserDropdown absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-n3 py-3 z-50">
          {/* User Info Header */}
          <div className="UserDropdownHeader px-4 py-3 border-b border-n3">
            <div className="flex items-center gap-3">
              {userProfile?.avatar_url ? (
                <Image
                  src={userProfile.avatar_url}
                  alt="Profile avatar"
                  width={40}
                  height={40}
                  className="UserAvatarLarge w-10 h-10 rounded-full object-cover border border-gray-200"
                  key={userProfile.avatar_url}
                />
              ) : (
                <div className="UserAvatarLarge w-10 h-10 bg-po1 text-white rounded-full flex items-center justify-center font-bold">
                  {(userProfile?.full_name || user.user_metadata?.full_name || user.email)?.[0]?.toUpperCase() || "U"}
                </div>
              )}
              <div>
                <div className="UserNameLarge text-sm font-bold text-gray-800">
                  {userProfile?.full_name || user.user_metadata?.full_name || "User"}
                </div>
                <div className="UserEmailLarge text-xs text-gray-600 truncate">
                  {user.email}
                </div>
              </div>
              {userRole === "admin" && (
                <div className="AdminBadge bg-po1 text-white text-xs px-2 py-1 rounded-full font-bold">
                  Admin
                </div>
              )}
            </div>
          </div>

          {/* Menu Items */}
          <div className="UserDropdownItems py-2">
            <a
              href="/profile"
              className="UserMenuItem flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-n3 transition-colors group"
              onClick={() => setIsOpen(false)}
            >
              <User2 className="MenuItemIcon w-5 h-5 mr-3 text-gray-500 group-hover:text-po1" />
              <span className="font-medium">Profile Settings</span>
            </a>

            {userRole === "admin" && (
              <a
                href="/admin"
                className="UserMenuItem flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-po1/10 transition-colors group"
                onClick={() => setIsOpen(false)}
              >
                <Settings className="MenuItemIcon w-5 h-5 mr-3 text-po1" />
                <span className="font-medium text-po1">Admin Dashboard</span>
              </a>
            )}

            {/* Logout Section */}
            <div className="LogoutSection border-t border-n3 mt-2 pt-2">
              <button
                onClick={handleSignOut}
                className="LogoutButton w-full flex items-center px-4 py-3 text-sm text-pr1 hover:bg-pr1/10 transition-colors group font-medium"
              >
                <LogOut className="LogoutIcon w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                <span>Sign Out</span>
                <div className="ml-auto text-xs text-gray-500 group-hover:text-pr1">
                  ⌘Q
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
