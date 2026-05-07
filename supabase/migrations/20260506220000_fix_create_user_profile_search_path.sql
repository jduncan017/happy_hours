-- Trigger fired with no search_path so unqualified `user_profiles` lookup
-- failed with "relation does not exist", killing every new signup with
-- a 500 "Database error saving new user".
CREATE OR REPLACE FUNCTION public.create_user_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, role, created_at, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'user',
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$;
