import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  message?: string;
  className?: string;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12"
};

const LoadingSpinner = React.memo<LoadingSpinnerProps>(({
  size = "md",
  message,
  className = "",
}) => {
  return (
    <div className={`LoadingSpinner flex flex-col items-center justify-center gap-2 ${className}`}>
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-b-2 border-stone-800`} />
      {message && (
        <p className="text-sm text-gray-500">{message}</p>
      )}
    </div>
  );
});

LoadingSpinner.displayName = "LoadingSpinner";

export default LoadingSpinner;