import React, { useState, useEffect } from "react";
import Loader from "./PreLoader";
import { fetchOgImage } from "../fetchOgImage";

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

  // Error Return
  if (isLoading) return <Loader />;
  if (isError)
    return (
      <>
        {/*eslint-disable-next-line @next/next/no-img-element*/}
        <img
          src="/image-error.png"
          alt="Error loading image"
          className={`p-10 ${className}`}
        />
      </>
    );

  // Image Return
  return (
    <>
      {/*eslint-disable-next-line @next/next/no-img-element*/}
      <img
        src={imageUrl}
        alt={`Screenshot of ${restaurant.name}`}
        className={className}
      />
    </>
  );
};

export default ImageLoadingWrapper;
