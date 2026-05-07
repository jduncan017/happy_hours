"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/contexts/UserContext";

const FAVORITES_KEY = ["favorites"] as const;

interface FavoriteRow {
  restaurant_id: string;
  created_at: string;
}

type FavoriteAction = "add" | "remove";
interface ToggleVariables {
  restaurantId: string;
  action: FavoriteAction;
}

export function useFavorites() {
  const { user } = useUser();
  const supabase = useMemo(() => createClient(), []);

  const query = useQuery({
    queryKey: [...FAVORITES_KEY, user?.id ?? "anon"],
    enabled: !!user,
    queryFn: async (): Promise<FavoriteRow[]> => {
      const { data, error } = await supabase
        .from("restaurant_favorites")
        .select("restaurant_id, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const ids = useMemo(
    () => new Set((query.data ?? []).map((r) => r.restaurant_id)),
    [query.data],
  );

  return {
    favoriteIds: ids,
    favorites: query.data ?? [],
    isLoading: query.isLoading,
    isSignedIn: !!user,
  };
}

/**
 * Toggle a restaurant favorite. Caller must pass the desired action — we
 * don't infer it from cache because `onMutate` already updates the cache
 * before `mutationFn` runs.
 */
export function useToggleFavorite() {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const supabase = useMemo(() => createClient(), []);

  return useMutation({
    mutationFn: async ({ restaurantId, action }: ToggleVariables) => {
      if (!user) throw new Error("Not signed in");

      if (action === "add") {
        const { error } = await supabase
          .from("restaurant_favorites")
          .insert({ user_id: user.id, restaurant_id: restaurantId });
        // Ignore unique violation — duplicate insert means already favorited.
        if (error && error.code !== "23505") throw error;
      } else {
        const { error } = await supabase
          .from("restaurant_favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("restaurant_id", restaurantId);
        if (error) throw error;
      }
      return { restaurantId, action };
    },
    onMutate: async ({ restaurantId, action }: ToggleVariables) => {
      if (!user) return;
      const cacheKey = [...FAVORITES_KEY, user.id];
      await queryClient.cancelQueries({ queryKey: cacheKey });
      const previous = queryClient.getQueryData<FavoriteRow[]>(cacheKey) ?? [];
      const next =
        action === "remove"
          ? previous.filter((r) => r.restaurant_id !== restaurantId)
          : previous.some((r) => r.restaurant_id === restaurantId)
            ? previous
            : [
                {
                  restaurant_id: restaurantId,
                  created_at: new Date().toISOString(),
                },
                ...previous,
              ];
      queryClient.setQueryData(cacheKey, next);
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (!user || !context) return;
      queryClient.setQueryData(
        [...FAVORITES_KEY, user.id],
        context.previous,
      );
    },
    onSettled: () => {
      if (!user) return;
      queryClient.invalidateQueries({
        queryKey: [...FAVORITES_KEY, user.id],
      });
    },
  });
}
