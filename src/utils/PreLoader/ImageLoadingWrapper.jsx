import React, { useState, useEffect } from "react";
import Loader from "./PreLoader";
import { fetchOgImage } from "../fetchOgImage";
import Image from "next/image";

const ImageLoadingWrapper = ({ restaurant, className }) => {
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetchOgImage(restaurant.website)
      .then((url) => {
        if (url === "Image Not Found") {
          setIsError(true);
          setIsLoading(false);
        } else {
          setImageUrl(url);
          setIsLoading(false);
        }
      })
      .catch(() => {
        setIsError(true);
        setIsLoading(false);
      });
  }, [restaurant.website]);

  // Loading State
  if (isLoading) return <Loader />;

  // Error Return
  if (isError)
    return (
      <Image
        className={`p-10 ${className}`}
        src="/image-error.png"
        alt="Error loading image"
        width={275}
        height={275}
      />
    );

  // Image Return
  return (
    <>
      {/*eslint-disable-next-line @next/next/no-img-element*/}
      <img
        className={className}
        src={imageUrl}
        alt={`Screenshot of ${restaurant.name}`}
      />
    </>
  );
};

export default ImageLoadingWrapper;
