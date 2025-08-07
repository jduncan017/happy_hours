import React from "react";

interface ErrorStateProps {
  error: Error | string;
  onRetry?: () => void;
  className?: string;
}

const ErrorState = React.memo<ErrorStateProps>(({
  error,
  onRetry,
  className = "",
}) => {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  const errorMessage = error instanceof Error ? error.message : String(error);

  return (
    <div className={`ErrorState text-center ${className}`}>
      <p className="mb-4 text-red-600">
        {errorMessage}
      </p>
      <button
        onClick={handleRetry}
        className="rounded bg-stone-800 px-4 py-2 text-white hover:bg-stone-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  );
});

ErrorState.displayName = "ErrorState";

export default ErrorState;