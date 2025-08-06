import React from "react";
import Loader from "./PreLoader";
import Image from "next/image";
import { useRestaurantImage } from "@/hooks/useRestaurantImage";
import { useImageBackground } from "@/hooks/useImageBackground";

const ImageLoadingWrapper = ({ restaurant, className }) => {
  // Use the database-first image hook
  const { data: imageUrl, isLoading, isError } = useRestaurantImage(restaurant.id);
  const { backgroundClass, isAnalyzing } = useImageBackground(imageUrl);

  // Loading State
  if (isLoading) return <Loader />;

  // Error Return
  if (isError)
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
        onError={(e) => {
          // If image fails to load (CORS, 404, etc), show fallback
          console.warn(`Failed to load image for ${restaurant.name}: ${imageUrl}`);
          e.target.src = '/photo-missing.webp';
        }}
      />
    </div>
  );
};

export default ImageLoadingWrapper;
