-- =====================================================
-- FIX STORAGE SETUP - REMOVE PROBLEMATIC COMMENTS
-- =====================================================
-- 
-- This migration fixes the storage setup by removing comments
-- that require elevated permissions on storage.objects table.
-- The previous migration (010) partially applied successfully.
--
-- =====================================================

-- Add comments only on functions we own (not storage.objects policies)
COMMENT ON FUNCTION get_avatar_url(UUID, TEXT) IS 
'Returns avatar URL for a user. In production, this will handle image transformations and CDN URLs';

COMMENT ON FUNCTION validate_file_upload(TEXT, TEXT, BIGINT, TEXT) IS 
'Validates file uploads against bucket policies and restrictions before processing';

-- Note: Storage policies are working correctly, but we cannot add comments
-- due to Supabase's security model where storage.objects is owned by supabase_storage_admin