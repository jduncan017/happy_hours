ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMPTZ;

COMMENT ON COLUMN public.user_profiles.onboarding_completed_at IS
  'Timestamp when user finished the welcome flow. NULL = needs onboarding.';
