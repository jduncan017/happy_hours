"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getCurrentUser, isAdmin } from "@/lib/supabase/auth";
import LoadingSpinner from "../SmallComponents/LoadingSpinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  requireAdmin = false, 
  redirectTo = "/auth/login" 
}: ProtectedRouteProps) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const user = await getCurrentUser(supabase);

      if (!user) {
        router.push(redirectTo);
        return;
      }

      if (requireAdmin) {
        const userIsAdmin = await isAdmin(supabase);
        if (!userIsAdmin) {
          router.push("/"); // Redirect non-admins to home
          return;
        }
      }

      setIsAuthorized(true);
    };

    checkAuth();
  }, [router, requireAdmin, redirectTo]);

  if (isAuthorized === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-white/70 mt-4">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Router.push will handle redirect
  }

  return <>{children}</>;
}