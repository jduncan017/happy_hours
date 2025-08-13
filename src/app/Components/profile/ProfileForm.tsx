"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { UserProfile } from "@/lib/types";
import FormSection from "@/app/Components/SmallComponents/FormSection";
import FormField from "@/app/Components/SmallComponents/FormField";
import AvatarUpload from "@/app/Components/SmallComponents/AvatarUpload";
import SiteButton from "@/app/Components/SmallComponents/siteButton";
import { User2, MapPin, Camera, Mail, Calendar } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useUser } from "@/contexts/UserContext";

interface ProfileFormProps {
  user: User;
  profile: UserProfile | null;
}

export default function ProfileForm({ user, profile }: ProfileFormProps) {
  const [fullName, setFullName] = useState(
    profile?.full_name || user.user_metadata?.full_name || "",
  );
  const [location, setLocation] = useState(profile?.location || "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");
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

      const { error } = await supabase.from("user_profiles").upsert(
        {
          id: user.id,
          full_name: fullName || null,
          location: location || null,
          avatar_url: avatarUrl || null,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "id",
        },
      );

      if (error) {
        console.error("Profile update error:", error);
        toast.error(`Failed to update profile: ${error.message}`, {
          id: toastId,
        });
      } else {
        console.log("Profile updated successfully");

        // Clean up old avatar if it changed and was in our storage
        if (
          oldAvatarUrl &&
          oldAvatarUrl !== avatarUrl &&
          oldAvatarUrl.includes("/avatars/")
        ) {
          try {
            const urlParts = oldAvatarUrl.split(
              "/storage/v1/object/public/avatars/",
            );
            if (urlParts.length > 1) {
              const oldPath = urlParts[1];
              console.log("Cleaning up old avatar:", oldPath);

              const { error: deleteError } = await supabase.storage
                .from("avatars")
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
      webP.src =
        "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
    });
  };

  // Smart image compression with WebP preference and JPEG fallback
  const compressImage = async (
    file: File,
    maxWidth = 400,
  ): Promise<{ file: File; format: string }> => {
    // Detect WebP support
    const supportsWebP = await detectWebPSupport();

    // Determine optimal format and quality
    const format = supportsWebP ? "webp" : "jpeg";
    const mimeType = `image/${format}`;
    const quality = supportsWebP ? 0.8 : 0.85; // WebP can handle lower quality better

    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
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
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, 0, 0, newWidth, newHeight);
        }

        // Try WebP first, fallback to JPEG if needed
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: mimeType,
                lastModified: Date.now(),
              });
              resolve({ file: compressedFile, format });
            } else if (format === "webp") {
              // WebP failed, fallback to JPEG
              canvas.toBlob(
                (jpegBlob) => {
                  if (jpegBlob) {
                    const jpegFile = new File([jpegBlob], file.name, {
                      type: "image/jpeg",
                      lastModified: Date.now(),
                    });
                    resolve({ file: jpegFile, format: "jpeg" });
                  } else {
                    resolve({ file, format: "original" }); // Final fallback
                  }
                },
                "image/jpeg",
                0.85,
              );
            } else {
              resolve({ file, format: "original" }); // Final fallback
            }
          },
          mimeType,
          quality,
        );
      };

      img.onerror = () => {
        resolve({ file, format: "original" }); // Fallback to original if image load fails
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const handleAvatarUpload = async (file: File) => {
    // Prevent double uploads in React Strict Mode
    if (uploadInProgress.current) {
      return;
    }

    uploadInProgress.current = true;
    setUploading(true);
    const toastId = toast.loading("Uploading avatar...");

    try {
      // Smart compression with WebP preference and JPEG fallback
      const { file: compressedFile, format } = await compressImage(file);

      // Create organized file path with optimal format: {user_id}/avatar_{timestamp}.{format}
      // This ensures unique URLs naturally without client-side cache busting
      const timestamp = Date.now();
      const filePath = `${user.id}/avatar_${timestamp}.${format}`;

      // Upload compressed image to avatars bucket first
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from("avatars")
        .upload(filePath, compressedFile, {
          cacheControl: "31536000", // 1 year cache
          upsert: false, // Don't overwrite, create unique files
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }

      // Get public URL for new upload
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      // Update local state immediately
      setAvatarUrl(publicUrl);

      // Optimistic update - immediately update the UI
      updateProfile({ avatar_url: publicUrl });

      // Attempt to clean up old avatar (non-critical operation)
      if (avatarUrl && avatarUrl.includes("/avatars/")) {
        try {
          // Extract the path after the public URL base
          const urlParts = avatarUrl.split(
            "/storage/v1/object/public/avatars/",
          );
          if (urlParts.length > 1) {
            const oldPath = urlParts[1];

            // Use setTimeout to make cleanup async and non-blocking
            setTimeout(async () => {
              try {
                const { error: deleteError } = await supabase.storage
                  .from("avatars")
                  .remove([oldPath]);
                if (deleteError) {
                  console.warn(
                    "Background cleanup failed:",
                    deleteError.message,
                  );
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
        .upsert(
          {
            id: user.id,
            avatar_url: publicUrl,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "id",
          },
        );

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

      const formatMessage = "Profile photo updated successfully!";

      toast.success(formatMessage, {
        id: toastId,
        duration: 4000,
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
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const joinDate = new Date(user.created_at).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <form onSubmit={handleSubmit} className="ProfileForm space-y-6">
      {/* Avatar Section */}
      <FormSection title="Profile Photo" icon={Camera} theme="dark">
        <AvatarUpload
          currentUrl={avatarUrl}
          onUpload={handleAvatarUpload}
          uploading={uploading}
          theme="dark"
          fallbackInitials={getInitials(
            fullName || user.email?.split("@")[0] || "U",
          )}
        />
      </FormSection>

      {/* Account Info */}
      <FormSection title="Account Information" icon={User2} theme="dark">
        <FormField
          id="email"
          label="Email Address"
          icon={Mail}
          type="email"
          value={user.email || ""}
          disabled
          theme="dark"
          className="bg-stone-700/50 cursor-not-allowed text-white/70"
          helpText="Contact support to change your email address."
        />

        <FormField
          id="memberSince"
          label="Member Since"
          icon={Calendar}
          type="text"
          value={joinDate}
          disabled
          theme="dark"
          className="bg-stone-700/50 cursor-not-allowed text-white/70"
        />
      </FormSection>

      {/* Personal Info */}
      <FormSection title="Personal Information" theme="dark">
        <FormField
          id="fullName"
          name="fullName"
          label="Full Name"
          icon={User2}
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Enter your full name"
          theme="dark"
        />

        <FormField
          id="location"
          name="location"
          label="Location"
          icon={MapPin}
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Denver, CO"
          theme="dark"
          helpText="Help us recommend nearby happy hours"
        />
      </FormSection>

      {/* Action Buttons */}
      <div className="ProfileActions flex flex-col sm:flex-row gap-4 pt-4">
        <SiteButton
          type="submit"
          text={loading ? "Saving..." : "Save Profile"}
          variant="orange"
          disabled={loading}
          addClasses="flex-1"
        />

        <Link href="/" className="flex-1">
          <SiteButton 
            text="Back to Hunting"
            variant="white"
            addClasses="w-full"
          />
        </Link>
      </div>

      {/* Help Text */}
      <div className="HelpText text-center">
        <p className="text-sm text-white/60">
          Need help?{" "}
          <Link href="/contact" className="text-po1 hover:underline">
            Contact support
          </Link>{" "}
          or{" "}
          <Link
            href="/auth/forgot-password"
            className="text-po1 hover:underline"
          >
            reset your password
          </Link>
          .
        </p>
      </div>
    </form>
  );
}
