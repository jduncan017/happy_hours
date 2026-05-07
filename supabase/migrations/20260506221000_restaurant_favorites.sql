CREATE TABLE IF NOT EXISTS public.restaurant_favorites (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, restaurant_id)
);

CREATE INDEX IF NOT EXISTS idx_favorites_user
  ON public.restaurant_favorites(user_id);

CREATE INDEX IF NOT EXISTS idx_favorites_restaurant
  ON public.restaurant_favorites(restaurant_id);

ALTER TABLE public.restaurant_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own favorites"
  ON public.restaurant_favorites
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add their own favorites"
  ON public.restaurant_favorites
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own favorites"
  ON public.restaurant_favorites
  FOR DELETE
  USING (auth.uid() = user_id);

COMMENT ON TABLE public.restaurant_favorites IS
  'User-favorited restaurants. Composite PK prevents duplicates per (user, restaurant).';
