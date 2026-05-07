-- Allow `auth.users` deletes to succeed by relaxing FK constraints on
-- community-contributed tables. Content survives, attribution is dropped.

-- 1. restaurants.created_by — column is already nullable
ALTER TABLE public.restaurants
  DROP CONSTRAINT IF EXISTS restaurants_created_by_fkey;

ALTER TABLE public.restaurants
  ADD CONSTRAINT restaurants_created_by_fkey
  FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;

-- 2. restaurant_submissions.submitted_by — relax NOT NULL, then re-add FK
ALTER TABLE public.restaurant_submissions
  ALTER COLUMN submitted_by DROP NOT NULL;

ALTER TABLE public.restaurant_submissions
  DROP CONSTRAINT IF EXISTS restaurant_submissions_submitted_by_fkey;

ALTER TABLE public.restaurant_submissions
  ADD CONSTRAINT restaurant_submissions_submitted_by_fkey
  FOREIGN KEY (submitted_by) REFERENCES auth.users(id) ON DELETE SET NULL;

-- 3. edit_suggestions.suggested_by — relax NOT NULL, then re-add FK
ALTER TABLE public.edit_suggestions
  ALTER COLUMN suggested_by DROP NOT NULL;

ALTER TABLE public.edit_suggestions
  DROP CONSTRAINT IF EXISTS edit_suggestions_suggested_by_fkey;

ALTER TABLE public.edit_suggestions
  ADD CONSTRAINT edit_suggestions_suggested_by_fkey
  FOREIGN KEY (suggested_by) REFERENCES auth.users(id) ON DELETE SET NULL;
