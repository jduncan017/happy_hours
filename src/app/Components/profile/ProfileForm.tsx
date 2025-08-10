"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { UserProfile } from "@/lib/types";
import TextInput from "@/app/Components/SmallComponents/TextInput";
import LoadingSpinner from "@/app/Components/SmallComponents/LoadingSpinner";
import { User2, MapPin, Camera, Mail, Calendar } from "lucide-react";
import Link from "next/link";
import NextImage from "next/image";
import toast from "react-hot-toast";
import { useUser } from "@/contexts/UserContext";

interface ProfileFormProps {
  user: User;
  profile: UserProfile | null;
}

export default function ProfileForm({ user, profile }: ProfileFormProps) {
  const [fullName, setFullName] = useState(profile?.full_name || user.user_metadata?.full_name || "");
  const [location, setLocation] = useState(profile?.location || "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const uploadInProgress = useRef(false); // Prevent double uploads in dev mode
  const supabase = createClient();
  const { refreshProfile, updateProfile } = useUser();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const toastId = toast.loading("Updating profile...");

    try {
      // Get current profile to find old avatar for cleanup
      const oldAvatarUrl = profile?.avatar_url;
      
      const { error } = await supabase
        .from("user_profiles")
        .upsert({
          id: user.id,
          full_name: fullName || null,
          location: location || null,
          avatar_url: avatarUrl || null,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'id'
        });

      if (error) {
        console.error("Profile update error:", error);
        toast.error(`Failed to update profile: ${error.message}`, { id: toastId });
      } else {
        console.log("Profile updated successfully");
        
        // Clean up old avatar if it changed and was in our storage
        if (oldAvatarUrl && oldAvatarUrl !== avatarUrl && oldAvatarUrl.includes('/avatars/')) {
          try {
            const urlParts = oldAvatarUrl.split('/storage/v1/object/public/avatars/');
            if (urlParts.length > 1) {
              const oldPath = urlParts[1];
              console.log("Cleaning up old avatar:", oldPath);
              
              const { error: deleteError } = await supabase.storage
                .from('avatars')
                .remove([oldPath]);
              
              if (deleteError) {
                console.warn("Old avatar cleanup failed:", deleteError.message);
              } else {
                console.log("Old avatar cleaned up successfully");
              }
            }
          } catch (cleanupError) {
            console.warn("Avatar cleanup error (non-fatal):", cleanupError);
          }
        }
        
        // Refresh UserContext
        try {
          const refreshSuccess = await refreshProfile();
          if (!refreshSuccess) {
            console.warn("UserContext refresh returned false");
          }
        } catch (refreshError) {
          console.warn("UserContext refresh failed:", refreshError);
        }
        
        toast.success("Profile updated successfully!", { id: toastId });
      }
    } catch (err: any) {
      console.error("Profile update error:", err);
      toast.error("An unexpected error occurred", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  // WebP support detection utility
  const detectWebPSupport = (): Promise<boolean> => {
    return new Promise((resolve) => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        resolve(webP.height === 2);
      };
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
  };

  // Smart image compression with WebP preference and JPEG fallback
  const compressImage = async (file: File, maxWidth = 400): Promise<{ file: File; format: string }> => {
    // Detect WebP support
    const supportsWebP = await detectWebPSupport();
    
    // Determine optimal format and quality
    const format = supportsWebP ? 'webp' : 'jpeg';
    const mimeType = `image/${format}`;
    const quality = supportsWebP ? 0.8 : 0.85; // WebP can handle lower quality better
    
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions maintaining aspect ratio
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        const newWidth = img.width * ratio;
        const newHeight = img.height * ratio;
        
        canvas.width = newWidth;
        canvas.height = newHeight;
        
        // Draw image with high quality scaling
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, newWidth, newHeight);
        }
        
        // Try WebP first, fallback to JPEG if needed
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: mimeType,
                lastModified: Date.now()
              });
              resolve({ file: compressedFile, format });
            } else if (format === 'webp') {
              // WebP failed, fallback to JPEG
              canvas.toBlob(
                (jpegBlob) => {
                  if (jpegBlob) {
                    const jpegFile = new File([jpegBlob], file.name, {
                      type: 'image/jpeg',
                      lastModified: Date.now()
                    });
                    resolve({ file: jpegFile, format: 'jpeg' });
                  } else {
                    resolve({ file, format: 'original' }); // Final fallback
                  }
                },
                'image/jpeg',
                0.85
              );
            } else {
              resolve({ file, format: 'original' }); // Final fallback
            }
          },
          mimeType,
          quality
        );
      };
      
      img.onerror = () => {
        resolve({ file, format: 'original' }); // Fallback to original if image load fails
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Prevent double uploads in React Strict Mode
    if (uploadInProgress.current) {
      console.log("Upload already in progress, skipping...");
      return;
    }

    // Validate file type and size
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG, PNG, WebP, or GIF)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      toast.error("Image must be less than 5MB");
      return;
    }

    uploadInProgress.current = true;
    setUploading(true);
    const toastId = toast.loading("Uploading avatar...");

    try {
      console.log("Starting avatar upload for user:", user.id);
      
      // Smart compression with WebP preference and JPEG fallback
      const { file: compressedFile, format } = await compressImage(file);
      console.log("Image compressed:", { format, size: compressedFile.size });
      
      // Create organized file path with optimal format: {user_id}/avatar_{timestamp}.{format}
      // This ensures unique URLs naturally without client-side cache busting
      const timestamp = Date.now();
      const filePath = `${user.id}/avatar_${timestamp}.${format}`;
      console.log("Upload path:", filePath);

      // Upload compressed image to avatars bucket first
      console.log("Starting upload to avatars bucket...");
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('avatars')
        .upload(filePath, compressedFile, {
          cacheControl: '31536000', // 1 year cache
          upsert: false // Don't overwrite, create unique files
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }
      
      console.log("Upload successful:", uploadData);

      // Get public URL for new upload
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      console.log("New avatar URL:", publicUrl);
      
      // Update local state immediately and reset any image errors
      setAvatarUrl(publicUrl);
      setImageError(false);
      
      // Optimistic update - immediately update the UI
      updateProfile({ avatar_url: publicUrl });

      // Attempt to clean up old avatar (non-critical operation)
      if (avatarUrl && avatarUrl.includes('/avatars/')) {
        try {
          // Extract the path after the public URL base
          const urlParts = avatarUrl.split('/storage/v1/object/public/avatars/');
          if (urlParts.length > 1) {
            const oldPath = urlParts[1];
            console.log("Attempting to clean up old avatar:", oldPath);
            
            // Use setTimeout to make cleanup async and non-blocking
            setTimeout(async () => {
              try {
                const { error: deleteError } = await supabase.storage.from('avatars').remove([oldPath]);
                if (deleteError) {
                  console.warn("Background cleanup failed:", deleteError.message);
                } else {
                  console.log("Background cleanup successful");
                }
              } catch (err) {
                console.warn("Background cleanup error:", err);
              }
            }, 1000); // Clean up after 1 second delay
          }
        } catch (cleanupError) {
          console.warn("Cleanup setup error (non-fatal):", cleanupError);
        }
      }

      // Update the user profile in the database immediately
      console.log("Updating profile with avatar URL:", publicUrl);
      const { error: profileUpdateError } = await supabase
        .from("user_profiles")
        .upsert({
          id: user.id,
          avatar_url: publicUrl,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'id'
        });

      if (profileUpdateError) {
        console.error("Profile avatar URL update failed:", profileUpdateError);
        toast.error(`Profile update failed: ${profileUpdateError.message}`);
      } else {
        console.log("Profile avatar URL updated in database");
        
        // Refresh the UserContext to update the UI immediately
        try {
          const refreshSuccess = await refreshProfile();
          if (refreshSuccess) {
            console.log("UserContext refreshed successfully");
          } else {
            console.warn("UserContext refresh returned false");
          }
        } catch (refreshError) {
          console.warn("UserContext refresh failed:", refreshError);
        }
      }

      const formatMessage = format === 'webp' 
        ? "Avatar uploaded as WebP for optimal performance!" 
        : format === 'jpeg' 
        ? "Avatar uploaded as JPEG for compatibility!" 
        : "Avatar uploaded successfully!";
      
      toast.success(formatMessage, { 
        id: toastId,
        duration: 4000 
      });
    } catch (err: any) {
      console.error("Avatar upload error:", err);
      toast.error(err.message || "Failed to upload avatar", { id: toastId });
    } finally {
      uploadInProgress.current = false;
      setUploading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const joinDate = new Date(user.created_at).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric"
  });

  return (
    <form onSubmit={handleSubmit} className="ProfileForm space-y-6">

      {/* Avatar Section */}
      <div className="ProfileAvatar bg-stone-800/50 rounded-2xl p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Camera className="w-5 h-5 mr-2" />
          Profile Photo
        </h3>
        
        <div className="flex items-center gap-6">
          {/* Avatar Display */}
          <div className="relative">
            {avatarUrl && !imageError ? (
              <NextImage
                src={avatarUrl}
                alt="Profile avatar"
                width={80}
                height={80}
                className="w-20 h-20 rounded-full object-cover border-2 border-po1/50"
                key={avatarUrl} // Force re-render when URL changes
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-20 h-20 bg-po1 text-white rounded-full flex items-center justify-center font-bold text-xl border-2 border-po1/50">
                {getInitials(fullName || user.email?.split('@')[0] || "U")}
              </div>
            )}
          </div>
          
          {/* Upload Button */}
          <div>
            <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-stone-700 hover:bg-stone-600 text-white rounded-xl transition-colors border border-white/10">
              {uploading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4 mr-2" />
                  Change Photo
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
            <p className="text-xs text-white/50 mt-2">
              JPG, PNG or GIF. Max size 5MB.
            </p>
          </div>
        </div>
      </div>

      {/* Account Info */}
      <div className="AccountInfo bg-stone-800/50 rounded-2xl p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <User2 className="w-5 h-5 mr-2" />
          Account Information
        </h3>
        
        <div className="space-y-4">
          {/* Email (Read-only) */}
          <div>
            <label className="block text-sm text-white/80 mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={user.email || ""}
                disabled
                className="w-full rounded-xl bg-stone-700/50 border border-white/10 px-4 py-3 pr-10 text-white/70 cursor-not-allowed"
              />
              <Mail className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
            </div>
            <p className="text-xs text-white/50 mt-1">
              Contact support to change your email address.
            </p>
          </div>

          {/* Member Since */}
          <div>
            <label className="block text-sm text-white/80 mb-1">
              Member Since
            </label>
            <div className="relative">
              <input
                type="text"
                value={joinDate}
                disabled
                className="w-full rounded-xl bg-stone-700/50 border border-white/10 px-4 py-3 pr-10 text-white/70 cursor-not-allowed"
              />
              <Calendar className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
            </div>
          </div>
        </div>
      </div>

      {/* Personal Info */}
      <div className="PersonalInfo bg-stone-800/50 rounded-2xl p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">
          Personal Information
        </h3>
        
        <div className="space-y-4">
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm text-white/80 mb-1">
              Full Name
            </label>
            <div className="relative">
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full rounded-xl bg-stone-800/80 border border-white/10 px-4 py-3 pr-10 placeholder:text-white/40 text-white focus:ring-2 focus:ring-po1 focus:outline-none"
              />
              <User2 className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
            </div>
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm text-white/80 mb-1">
              Location
            </label>
            <div className="relative">
              <input
                id="location"
                name="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Denver, CO"
                className="w-full rounded-xl bg-stone-800/80 border border-white/10 px-4 py-3 pr-10 placeholder:text-white/40 text-white focus:ring-2 focus:ring-po1 focus:outline-none"
              />
              <MapPin className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
            </div>
            <p className="text-xs text-white/50 mt-1">
              Help us recommend nearby happy hours
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="ProfileActions flex flex-col sm:flex-row gap-4 pt-4">
        {loading ? (
          <div className="bg-stone-800/60 text-white/70 font-semibold py-4 px-6 rounded-xl flex items-center justify-center border border-white/10">
            <LoadingSpinner size="sm" className="mr-3" />
            Saving Profile...
          </div>
        ) : (
          <button
            type="submit"
            className="flex-1 rounded-xl bg-gradient-to-r from-po1 to-py1 px-6 py-4 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-po1/50 focus:ring-offset-2 focus:ring-offset-stone-900"
          >
            Save Profile
          </button>
        )}
        
        <Link
          href="/"
          className="flex-1 text-center rounded-xl bg-stone-700 hover:bg-stone-600 px-6 py-4 text-white font-semibold border border-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-stone-900"
        >
          Back to Hunt
        </Link>
      </div>

      {/* Help Text */}
      <div className="HelpText text-center">
        <p className="text-sm text-white/60">
          Need help? <Link href="/contact" className="text-po1 hover:underline">Contact support</Link> or{" "}
          <Link href="/auth/forgot-password" className="text-po1 hover:underline">reset your password</Link>.
        </p>
      </div>
    </form>
  );
}