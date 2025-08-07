import React from "react";

interface MapErrorFallbackProps {
  error?: Error;
  retry: () => void;
}

export default function MapErrorFallback({ error, retry }: MapErrorFallbackProps) {
  return (
    <div className="MapErrorFallback flex flex-col items-center justify-center h-full p-8 text-center bg-gray-50 border border-gray-200 rounded-lg">
      <div className="mb-4">
        <svg
          className="w-12 h-12 mx-auto text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
          />
        </svg>
      </div>
      <h3 className="mb-2 text-lg font-medium text-gray-800">Map unavailable</h3>
      <p className="mb-4 text-sm text-gray-600">
        {error?.message?.includes('API') 
          ? 'Google Maps failed to load. Please check your connection.'
          : 'The map encountered an error and cannot be displayed.'
        }
      </p>
      <button
        onClick={retry}
        className="px-4 py-2 text-white bg-stone-600 rounded hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-500"
      >
        Reload map
      </button>
      <p className="mt-3 text-xs text-gray-500">
        You can still view restaurant details in the list view
      </p>
    </div>
  );
}