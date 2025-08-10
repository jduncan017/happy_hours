"use client";

import { createContext, useContext, useEffect, useState, useCallback, useMemo, ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import { getCurrentUser, getUserRole } from "@/lib/supabase/auth";
import { User } from "@supabase/supabase-js";

interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'user' | 'admin' | 'restaurant_owner';
  location: string | null;
  preferences: Record<string, any>;
  created_at: string;
  updated_at: string;
}

interface UserContextType {
  user: User | null;
  userRole: string | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  refreshProfile: () => Promise<boolean>;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Create supabase client once to avoid recreation on every render
  const supabase = useMemo(() => createClient(), []);

  const refreshProfile = async (): Promise<boolean> => {
    if (!user) return false;
    
    try {
      console.log("UserContext: Refreshing profile for user:", user.id);
      const { data: profile, error: profileError } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      
      if (profileError) {
        console.error("UserContext: Profile fetch error:", profileError);
        setError(profileError.message);
        return false;
      } else {
        console.log("UserContext: Profile refreshed successfully:", profile);
        // Force a state update by creating a new object reference
        setUserProfile({ ...profile });
        setError(null);
        return true;
      }
    } catch (err: any) {
      console.error("UserContext: Error refreshing profile:", err);
      setError(err.message);
      return false;
    }
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (userProfile) {
      setUserProfile({ ...userProfile, ...updates });
    }
  };

  const loadUserData = useCallback(async () => {
    console.log("🔄 UserContext: Starting loadUserData");
    
    // Always set loading to false after a maximum time to prevent infinite loading
    const maxLoadTime = setTimeout(() => {
      console.warn("⚠️ UserContext: Max load time reached, forcing loading=false");
      setLoading(false);
      // Set reasonable defaults if we timeout
      setUser(null);
      setUserRole(null);
      setUserProfile(null);
    }, 2000); // Reduced from 5s to 2s
    
    try {
      setLoading(true);
      setError(null);
      console.log("🔄 UserContext: Set loading=true, error=null");

      // Get current session first - with timeout since it can be slow
      console.log("🔄 UserContext: Getting session...");
      
      const sessionPromise = supabase.auth.getSession();
      const sessionTimeout = new Promise((resolve) => 
        setTimeout(() => resolve({ data: { session: null }, error: { message: 'Session timeout' } }), 1500)
      );
      
      const result = await Promise.race([sessionPromise, sessionTimeout]) as any;
      const { data: { session }, error: sessionError } = result;
      
      if (sessionError) {
        console.error("❌ UserContext: Session error:", sessionError);
        setUser(null);
        setUserRole(null);
        setUserProfile(null);
        return;
      }

      console.log("✅ UserContext: Session check complete:", { 
        hasSession: !!session,
        hasUser: !!session?.user,
        userId: session?.user?.id
      });

      const currentUser = session?.user || null;
      setUser(currentUser);

      if (currentUser) {
        console.log("🔄 UserContext: User exists, setting default role and trying to load profile...");
        setUserRole('user'); // Set default immediately
        
        // Try to load profile but don't let it block the UI
        const profilePromise = supabase
          .from("user_profiles")
          .select("*")
          .eq("id", currentUser.id)
          .single();

        const profileTimeout = new Promise((resolve) => 
          setTimeout(() => resolve({ data: null, error: { message: 'Profile timeout' } }), 3000)
        );

        try {
          const result = await Promise.race([profilePromise, profileTimeout]) as any;
          const { data: profile, error: profileError } = result;
          
          if (profileError || !profile) {
            console.warn("⚠️ UserContext: Profile issue (using defaults):", profileError?.message);
            setUserProfile(null);
            // Keep default 'user' role
          } else {
            console.log("✅ UserContext: Profile loaded successfully:", profile);
            setUserProfile(profile);
            setUserRole(profile.role || 'user');
          }
        } catch (profileError) {
          console.error("❌ UserContext: Profile load error:", profileError);
          setUserProfile(null);
          // Keep default 'user' role
        }
      } else {
        console.log("ℹ️ UserContext: No user, clearing all state");
        setUserRole(null);
        setUserProfile(null);
      }
    } catch (err: any) {
      console.error("❌ UserContext: Critical error in loadUserData:", err);
      setError(err.message);
      setUser(null);
      setUserRole(null);
      setUserProfile(null);
    } finally {
      clearTimeout(maxLoadTime);
      console.log("🏁 UserContext: Setting loading=false");
      setLoading(false);
    }
  }, [supabase]);

  // Initial load effect
  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  // Separate effect for auth state changes
  useEffect(() => {
    console.log("🔄 UserContext: Setting up auth subscription");
    
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("🔔 UserContext: Auth state changed:", { 
        event, 
        hasUser: !!session?.user,
        userId: session?.user?.id 
      });
      
      if (event === 'SIGNED_OUT') {
        console.log("🚪 UserContext: User signed out, clearing state");
        setUser(null);
        setUserRole(null);
        setUserProfile(null);
        setError(null);
        setLoading(false);
      } else if (event === 'SIGNED_IN' && session?.user) {
        console.log("🔑 UserContext: User signed in - using session data directly to avoid slow getSession");
        
        // Use the session we already have instead of calling loadUserData which uses slow getSession
        setUser(session.user);
        setUserRole('user'); // Set default immediately
        setLoading(false); // Stop loading immediately
        
        // Load profile in background without blocking
        setTimeout(async () => {
          try {
            const { data: profile } = await supabase
              .from("user_profiles")
              .select("*")
              .eq("id", session.user.id)
              .single();
            
            if (profile) {
              console.log("✅ UserContext: Profile loaded in background:", profile);
              setUserProfile(profile);
              setUserRole(profile.role || 'user');
            }
          } catch (err) {
            console.warn("⚠️ UserContext: Background profile load failed:", err);
          }
        }, 100);
        
      } else if (event === 'TOKEN_REFRESHED') {
        console.log("🔄 UserContext: Token refreshed, updating user");
        setUser(session?.user || null);
      } else {
        console.log("ℹ️ UserContext: Other auth event:", event);
      }
    });

    return () => {
      console.log("🧹 UserContext: Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, [supabase]);

  const value: UserContextType = {
    user,
    userRole,
    userProfile,
    loading,
    error,
    refreshProfile,
    updateProfile,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextType {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

// Convenience hooks for common use cases
export function useUserProfile() {
  const { userProfile, loading, refreshProfile, updateProfile } = useUser();
  return { userProfile, loading, refreshProfile, updateProfile };
}

export function useUserRole() {
  const { userRole, loading } = useUser();
  return { userRole, loading };
}

export function useAuth() {
  const { user, loading } = useUser();
  return { user, loading, isAuthenticated: !!user };
}