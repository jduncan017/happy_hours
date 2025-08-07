import React from "react";

interface ImageErrorFallbackProps {
  error?: Error;
  retry: () => void;
}

export default function ImageErrorFallback({ error, retry }: ImageErrorFallbackProps) {
  return (
    <div className="ImageErrorFallback flex flex-col items-center justify-center h-full p-4 text-center bg-gray-100 border border-gray-200 rounded">
      <div className="mb-2">
        <svg
          className="w-8 h-8 mx-auto text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
      <p className="mb-2 text-xs font-medium text-gray-600">Image Error</p>
      <button
        onClick={retry}
        className="px-2 py-1 text-xs text-white bg-gray-600 rounded hover:bg-gray-700 focus:outline-none"
      >
        Retry
      </button>
    </div>
  );
}