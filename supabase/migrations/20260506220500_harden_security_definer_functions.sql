-- All SECURITY DEFINER functions need an explicit search_path so they
-- behave the same regardless of the caller's session settings. Without it,
-- unqualified table references can resolve to the wrong schema (or none at
-- all, as the auth signup trigger discovered).

-- 1. is_admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = user_id AND role = 'admin'
  );
END;
$$;

-- 2. is_restaurant_owner
CREATE OR REPLACE FUNCTION public.is_restaurant_owner(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = user_id AND role IN ('restaurant_owner', 'admin')
  );
END;
$$;

-- 3. promote_user_to_admin (needs auth schema for users lookup)
CREATE OR REPLACE FUNCTION public.promote_user_to_admin(target_user_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  target_user_id UUID;
BEGIN
  SELECT id INTO target_user_id
  FROM auth.users
  WHERE email = target_user_email;

  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'User not found with email: %', target_user_email;
  END IF;

  UPDATE public.user_profiles
  SET role = 'admin', updated_at = NOW()
  WHERE id = target_user_id;

  RETURN TRUE;
END;
$$;

-- 4. get_avatar_url
CREATE OR REPLACE FUNCTION public.get_avatar_url(user_id UUID, size TEXT DEFAULT 'original')
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN (
    SELECT avatar_url
    FROM public.user_profiles
    WHERE id = user_id
  );
END;
$$;

-- 5. validate_file_upload (touches storage schema)
CREATE OR REPLACE FUNCTION public.validate_file_upload(
  bucket_name TEXT,
  file_name TEXT,
  file_size BIGINT,
  mime_type TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, storage
AS $$
DECLARE
  bucket_config RECORD;
BEGIN
  SELECT * INTO bucket_config
  FROM storage.buckets
  WHERE id = bucket_name;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Bucket % does not exist', bucket_name;
  END IF;

  IF file_size > bucket_config.file_size_limit THEN
    RAISE EXCEPTION 'File size % exceeds bucket limit of %',
      file_size, bucket_config.file_size_limit;
  END IF;

  IF bucket_config.allowed_mime_types IS NOT NULL
     AND NOT (mime_type = ANY(bucket_config.allowed_mime_types)) THEN
    RAISE EXCEPTION 'MIME type % not allowed for bucket %',
      mime_type, bucket_name;
  END IF;

  RETURN TRUE;
END;
$$;

-- 6. cleanup_old_avatar_files (trigger on user_profiles)
CREATE OR REPLACE FUNCTION public.cleanup_old_avatar_files()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.avatar_url IS NOT NULL
     AND NEW.avatar_url IS NOT NULL
     AND OLD.avatar_url != NEW.avatar_url
     AND OLD.avatar_url LIKE '%/storage/v1/object/public/avatars/%' THEN
    RAISE NOTICE 'Avatar changed from % to %', OLD.avatar_url, NEW.avatar_url;
  END IF;
  RETURN NEW;
END;
$$;
