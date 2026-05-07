import React, { useState } from "react";
import Loader from "./PreLoader";
import Image from "next/image";
import { useRestaurantImage } from "@/hooks/useRestaurantImages";
import { useImageBackground } from "@/hooks/useImageBackground";
import { normalizeImageUrl } from "@/utils/image/normalizeImageUrl";
import type { Restaurant } from "@/lib/types";

interface ImageLoadingWrapperProps {
  restaurant: Restaurant;
  className?: string;
}

const FALLBACK = "/photo-missing.webp";

const ImageLoadingWrapper: React.FC<ImageLoadingWrapperProps> = ({
  restaurant,
  className,
}) => {
  const { data: imageUrl, isLoading, isError } = useRestaurantImage(
    restaurant.id,
    restaurant.heroImage,
  );
  const [loadFailed, setLoadFailed] = useState(false);
  const resolvedUrl =
    imageUrl && !loadFailed ? normalizeImageUrl(imageUrl, FALLBACK) : FALLBACK;
  const { backgroundClass, isAnalyzing } = useImageBackground(resolvedUrl);

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <div className="PhotoMissing relative flex h-full w-full items-center justify-center bg-stone-300">
        <div className="MissingTextContainer absolute rounded-lg bg-black p-2">
          <p className="MissingText font-semibold text-white">Photo Missing</p>
        </div>
        <Image
          className="object-cover"
          src={FALLBACK}
          alt="Error loading image"
          width={400}
          height={400}
        />
      </div>
    );
  }

  return (
    <div
      className={`ImageContainer relative flex h-full w-full items-center justify-center transition-colors duration-300 ${backgroundClass}`}
    >
      {isAnalyzing && (
        <div className="AnalysisLoader absolute inset-0 flex items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-stone-500 border-t-transparent"></div>
        </div>
      )}
      <Image
        key={resolvedUrl}
        className={`${className ?? ""} ${
          isAnalyzing ? "opacity-50" : "opacity-100"
        } transition-opacity duration-300 object-contain`}
        src={resolvedUrl}
        alt={`Photo of ${restaurant.name}`}
        fill
        sizes="(max-width: 640px) 100vw, 200px"
        onError={() => {
          if (!loadFailed) {
            console.warn(
              `Failed to load image for ${restaurant.name}: ${imageUrl}`,
            );
            setLoadFailed(true);
          }
        }}
      />
    </div>
  );
};

export default ImageLoadingWrapper;
