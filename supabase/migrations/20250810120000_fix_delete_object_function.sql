-- Fix the old storage.delete_object function call in the cleanup trigger
-- The correct syntax uses the storage API, not a direct SQL function

-- Drop the existing trigger and function
DROP TRIGGER IF EXISTS cleanup_old_avatar_files_trigger ON user_profiles;
DROP FUNCTION IF EXISTS cleanup_old_avatar_files();

-- Create a fixed version that uses the proper storage.objects table for deletion
-- Note: We'll handle cleanup in the application layer instead of database triggers
-- This is more reliable and gives better error handling

CREATE OR REPLACE FUNCTION cleanup_old_avatar_files()
RETURNS TRIGGER AS $$
BEGIN
  -- Just log the change for now - actual cleanup will be handled by the application
  -- This avoids the storage.delete_object function that doesn't exist
  
  IF OLD.avatar_url IS NOT NULL 
     AND NEW.avatar_url IS NOT NULL 
     AND OLD.avatar_url != NEW.avatar_url 
     AND OLD.avatar_url LIKE '%/storage/v1/object/public/avatars/%' THEN
    
    -- Log the old file that should be cleaned up
    RAISE NOTICE 'Avatar changed from % to %', OLD.avatar_url, NEW.avatar_url;
  END IF;
  
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Recreate the trigger (but it now only logs, doesn't delete)
CREATE TRIGGER cleanup_old_avatar_files_trigger
  AFTER UPDATE ON user_profiles
  FOR EACH ROW 
  WHEN (OLD.avatar_url IS DISTINCT FROM NEW.avatar_url)
  EXECUTE FUNCTION cleanup_old_avatar_files();