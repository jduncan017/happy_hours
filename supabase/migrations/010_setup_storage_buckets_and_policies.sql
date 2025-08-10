-- =====================================================
-- SUPABASE STORAGE SETUP - ORGANIZED BUCKETS (OPTION 2)
-- =====================================================
-- 
-- This migration sets up organized storage buckets for different content types.
-- 
-- NOTE: For production (Option 3), we'll eventually need to add:
-- - CDN integration  
-- - Image transformation API (Supabase Pro)
-- - Background thumbnail processing
-- - Webhook cleanup for deleted users
-- - Advanced caching strategies
--
-- =====================================================

-- Create storage buckets for organized content
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) VALUES 
-- Avatars bucket - User profile pictures (WebP preferred, JPEG fallback)
('avatars', 'avatars', true, 5242880, ARRAY['image/webp', 'image/jpeg', 'image/png', 'image/gif']),
-- Restaurant images bucket - Restaurant photos, menus, etc.
('restaurant-images', 'restaurant-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- ROW LEVEL SECURITY POLICIES FOR AVATARS BUCKET
-- =====================================================

-- Allow users to upload their own avatar to their folder
CREATE POLICY "Users can upload their own avatar" ON storage.objects
  FOR INSERT 
  WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow users to update their own avatar files
CREATE POLICY "Users can update their own avatar" ON storage.objects
  FOR UPDATE 
  USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow users to delete their own avatar files
CREATE POLICY "Users can delete their own avatar" ON storage.objects
  FOR DELETE 
  USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow public read access to all avatars (for displaying profile pics)
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
  FOR SELECT 
  USING (bucket_id = 'avatars');

-- =====================================================
-- ROW LEVEL SECURITY POLICIES FOR RESTAURANT IMAGES BUCKET
-- =====================================================

-- Allow admins and restaurant owners to upload restaurant images
CREATE POLICY "Admins and restaurant owners can upload restaurant images" ON storage.objects
  FOR INSERT 
  WITH CHECK (
    bucket_id = 'restaurant-images' 
    AND (
      is_admin(auth.uid()) 
      OR is_restaurant_owner(auth.uid())
    )
  );

-- Allow admins and restaurant owners to update restaurant images
CREATE POLICY "Admins and restaurant owners can update restaurant images" ON storage.objects
  FOR UPDATE 
  USING (
    bucket_id = 'restaurant-images' 
    AND (
      is_admin(auth.uid()) 
      OR is_restaurant_owner(auth.uid())
    )
  );

-- Allow admins and restaurant owners to delete restaurant images  
CREATE POLICY "Admins and restaurant owners can delete restaurant images" ON storage.objects
  FOR DELETE 
  USING (
    bucket_id = 'restaurant-images' 
    AND (
      is_admin(auth.uid()) 
      OR is_restaurant_owner(auth.uid())
    )
  );

-- Allow public read access to all restaurant images (for displaying on site)
CREATE POLICY "Restaurant images are publicly accessible" ON storage.objects
  FOR SELECT 
  USING (bucket_id = 'restaurant-images');

-- =====================================================
-- HELPER FUNCTIONS FOR FILE MANAGEMENT
-- =====================================================

-- Function to clean up old avatar files when user uploads new one
CREATE OR REPLACE FUNCTION cleanup_old_avatar_files()
RETURNS TRIGGER AS $$
BEGIN
  -- If avatar_url is being updated and old URL exists, schedule cleanup
  IF OLD.avatar_url IS NOT NULL 
     AND NEW.avatar_url IS NOT NULL 
     AND OLD.avatar_url != NEW.avatar_url 
     AND OLD.avatar_url LIKE '%/storage/v1/object/public/avatars/%' THEN
    
    -- Extract file path from old URL and delete the file
    -- Note: This is a simplified cleanup - in production you'd want 
    -- background job processing to handle this more robustly
    PERFORM storage.delete_object('avatars', 
      substring(OLD.avatar_url from '/avatars/(.*)$'));
  END IF;
  
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Trigger to automatically cleanup old avatar files
DROP TRIGGER IF EXISTS cleanup_old_avatar_files_trigger ON user_profiles;
CREATE TRIGGER cleanup_old_avatar_files_trigger
  AFTER UPDATE ON user_profiles
  FOR EACH ROW 
  WHEN (OLD.avatar_url IS DISTINCT FROM NEW.avatar_url)
  EXECUTE FUNCTION cleanup_old_avatar_files();

-- =====================================================
-- STORAGE UTILITY FUNCTIONS
-- =====================================================

-- Function to get optimized avatar URL (useful for future image transformation)
CREATE OR REPLACE FUNCTION get_avatar_url(user_id UUID, size TEXT DEFAULT 'original')
RETURNS TEXT AS $$
BEGIN
  -- For now, just return the stored URL
  -- In production (Option 3), this would handle image transformations:
  -- - ?width=150&height=150 for thumbnails
  -- - ?format=webp for better compression  
  -- - CDN URLs for faster loading
  
  RETURN (
    SELECT avatar_url 
    FROM user_profiles 
    WHERE id = user_id
  );
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Function to validate file upload before processing
CREATE OR REPLACE FUNCTION validate_file_upload(
  bucket_name TEXT,
  file_name TEXT,
  file_size BIGINT,
  mime_type TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  bucket_config RECORD;
BEGIN
  -- Get bucket configuration
  SELECT * INTO bucket_config 
  FROM storage.buckets 
  WHERE id = bucket_name;
  
  -- Check if bucket exists
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Bucket % does not exist', bucket_name;
  END IF;
  
  -- Check file size limit
  IF file_size > bucket_config.file_size_limit THEN
    RAISE EXCEPTION 'File size % exceeds bucket limit of %', 
      file_size, bucket_config.file_size_limit;
  END IF;
  
  -- Check mime type if restrictions exist
  IF bucket_config.allowed_mime_types IS NOT NULL 
     AND NOT (mime_type = ANY(bucket_config.allowed_mime_types)) THEN
    RAISE EXCEPTION 'MIME type % not allowed for bucket %', 
      mime_type, bucket_name;
  END IF;
  
  RETURN TRUE;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- =====================================================
-- INDEXES FOR BETTER PERFORMANCE
-- =====================================================

-- Index for faster storage object lookups by bucket and user folder
-- CREATE INDEX IF NOT EXISTS idx_storage_objects_bucket_folder 
-- ON storage.objects(bucket_id, (storage.foldername(name))[1]);

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================
-- Note: Cannot add comments on storage.objects policies due to permission restrictions
-- Policy descriptions:
-- "Users can upload their own avatar": Allows authenticated users to upload avatar images to their own folder in the avatars bucket
-- "Avatar images are publicly accessible": Enables public read access for avatar images so they can be displayed across the application  
-- "Restaurant images are publicly accessible": Enables public read access for restaurant images so they can be displayed on restaurant listings and details

COMMENT ON FUNCTION get_avatar_url(UUID, TEXT) IS 
'Returns avatar URL for a user. In production, this will handle image transformations and CDN URLs';

COMMENT ON FUNCTION validate_file_upload(TEXT, TEXT, BIGINT, TEXT) IS 
'Validates file uploads against bucket policies and restrictions before processing';

-- =====================================================
-- FUTURE PRODUCTION ENHANCEMENTS (OPTION 3)
-- =====================================================
-- 
-- When ready for production scaling, add:
--
-- 1. CDN Integration:
--    - CloudFront/CloudFlare for global distribution
--    - Edge caching for faster image loading
--    - Custom domain for storage URLs
-- 
-- 2. Image Processing Pipeline:
--    - Background jobs for thumbnail generation
--    - WebP conversion for modern browsers
--    - Automatic image optimization
--    - Multiple size variants (small, medium, large)
-- 
-- 3. Advanced Security:
--    - Virus scanning for uploads
--    - Content moderation API integration
--    - Rate limiting per user/IP
--    - EXIF data stripping for privacy
--
-- 4. Analytics & Monitoring:
--    - Upload success/failure tracking
--    - Storage usage monitoring
--    - Performance metrics
--    - Cost optimization alerts
--
-- 5. Cleanup & Maintenance:
--    - Scheduled cleanup of orphaned files
--    - Automated backup strategies  
--    - Storage usage reporting
--    - Dead link detection and removal
--
-- =====================================================