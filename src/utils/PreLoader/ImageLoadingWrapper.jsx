import React from "react";
import { useQuery } from "@tanstack/react-query";
import Loader from "./PreLoader";
import Image from "next/image";
import { fetchOgImage } from "../fetchOgImage";
import { useImageBackground } from "@/hooks/useImageBackground";

const ImageLoadingWrapper = ({ restaurant, className }) => {
  // Check if restaurant already has a valid heroImage (not the placeholder)
  const hasValidImage = restaurant.heroImage && 
    restaurant.heroImage !== "/photo-missing.webp" && 
    restaurant.heroImage.trim() !== "";

  // If we have a valid image, use it directly, otherwise fetch from website
  const { data: fetchedImageUrl, isLoading, isError } = useQuery({
    queryKey: ['ogImage', restaurant.website],
    queryFn: () => fetchOgImage(restaurant.website),
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    retry: 1,
    refetchOnWindowFocus: false,
    enabled: !hasValidImage && !!restaurant.website, // Only fetch if no valid image and has website
  });

  // Use cached image if available, otherwise use fetched image
  const imageUrl = hasValidImage ? restaurant.heroImage : fetchedImageUrl;
  const { backgroundClass, isAnalyzing } = useImageBackground(imageUrl);

  // Loading State (only show if we're fetching from website)
  if (isLoading && !hasValidImage) return <Loader />;

  // Error Return (if no valid cached image AND fetch failed)
  if (!hasValidImage && (isError || fetchedImageUrl === "Image Not Found"))
    return (
      <div className="PhotoMissing relative flex h-full w-full items-center justify-center bg-stone-300">
        <div className="MissingTextContainer absolute rounded-lg bg-black p-2">
          <p className="MissingText font-semibold text-white">Photo Missing</p>
        </div>
        <Image
          className="object-cover"
          src="/photo-missing.webp"
          alt="Error loading image"
          width={400}
          height={400}
        />
      </div>
    );

  // Image Return with dynamic background
  return (
    <div className={`ImageContainer relative flex h-full w-full items-center justify-center transition-colors duration-300 ${backgroundClass}`}>
      {isAnalyzing && (
        <div className="AnalysisLoader absolute inset-0 flex items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-stone-500 border-t-transparent"></div>
        </div>
      )}
      {/*eslint-disable-next-line @next/next/no-img-element*/}
      <img
        className={`${className} ${isAnalyzing ? 'opacity-50' : 'opacity-100'} transition-opacity duration-300`}
        src={imageUrl}
        alt={`Screenshot of ${restaurant.name}`}
        style={{ objectFit: 'contain' }}
      />
    </div>
  );
};

export default ImageLoadingWrapper;
