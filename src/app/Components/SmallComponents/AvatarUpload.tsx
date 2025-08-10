import { useState, useRef, ChangeEvent } from 'react';
import { Camera } from 'lucide-react';
import NextImage from 'next/image';
import LoadingSpinner from './LoadingSpinner';

interface AvatarUploadProps {
  currentUrl?: string | null;
  onUpload: (file: File) => Promise<void>;
  uploading?: boolean;
  theme?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  fallbackInitials?: string;
  className?: string;
}

export default function AvatarUpload({
  currentUrl,
  onUpload,
  uploading = false,
  theme = 'dark',
  size = 'md',
  fallbackInitials = 'U',
  className = ''
}: AvatarUploadProps) {
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'w-12 h-12 text-sm',
    md: 'w-20 h-20 text-xl', 
    lg: 'w-32 h-32 text-2xl'
  };

  const buttonTheme = theme === 'dark'
    ? 'bg-stone-700 hover:bg-stone-600 text-white border-white/10'
    : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-300';

  const helpTextColor = theme === 'dark' ? 'text-white/50' : 'text-gray-500';

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, WebP, or GIF)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      alert('Image must be less than 5MB');
      return;
    }

    try {
      await onUpload(file);
      setImageError(false);
    } catch (error) {
      console.error('Avatar upload failed:', error);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`flex items-center gap-6 ${className}`}>
      {/* Avatar Display */}
      <div className="relative">
        {currentUrl && !imageError ? (
          <NextImage
            src={currentUrl}
            alt="Profile avatar"
            width={size === 'sm' ? 48 : size === 'md' ? 80 : 128}
            height={size === 'sm' ? 48 : size === 'md' ? 80 : 128}
            className={`${sizeClasses[size]} rounded-full object-cover border-2 border-po1/50`}
            key={currentUrl} // Force re-render when URL changes
            onError={() => setImageError(true)}
          />
        ) : (
          <div className={`${sizeClasses[size]} bg-po1 text-white rounded-full flex items-center justify-center font-bold border-2 border-po1/50`}>
            {fallbackInitials}
          </div>
        )}
      </div>
      
      {/* Upload Button */}
      <div>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className={`inline-flex items-center px-4 py-2 rounded-xl transition-colors border cursor-pointer ${buttonTheme} ${uploading ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
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
        </button>
        
        <p className={`text-xs ${helpTextColor} mt-2`}>
          JPG, PNG or GIF. Max size 5MB.
        </p>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
        />
      </div>
    </div>
  );
}