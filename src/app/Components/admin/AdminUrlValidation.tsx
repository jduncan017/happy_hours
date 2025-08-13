import type { RestaurantUrlValidation } from "@/lib/supabase/urlValidation";
import toast from "react-hot-toast";
import {
  Globe,
  ArrowLeft,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Link,
  Trash2,
} from "lucide-react";
import { useState } from "react";

interface AdminUrlValidationProps {
  urlValidation: {
    results: RestaurantUrlValidation[];
    isValidating: boolean;
    progress?: { completed: number; total: number; message?: string };
    lastValidated?: Date;
  };
  urlEdits: Record<string, { website?: string; menuUrl?: string }>;
  isSaving: boolean;
  savingProgress: {
    phase: "saving" | "revalidating";
    current: number;
    total: number;
  } | null;
  onExitValidationMode: () => void;
  onUrlEdit: (restaurantId: string, type: "website" | "menuUrl", value: string) => void;
  onBatchSave: () => void;
  onDeleteRestaurant: (restaurantId: string, restaurantName: string) => void;
}

export default function AdminUrlValidation({
  urlValidation,
  urlEdits,
  isSaving,
  savingProgress,
  onExitValidationMode,
  onUrlEdit,
  onBatchSave,
  onDeleteRestaurant,
}: AdminUrlValidationProps) {
  // Get broken URLs count for display
  const brokenUrlsCount = urlValidation.results.filter((result) => {
    const hasBrokenWebsite = result.website && !result.website.isValid;
    const hasBrokenMenuUrl = result.menuUrl && !result.menuUrl.isValid;
    return hasBrokenWebsite || hasBrokenMenuUrl;
  }).length;

  return (
    <div className="UrlValidationMode h-fit">
      <div className="UrlValidationResults bg-stone-800/50 rounded-2xl p-6 border border-white/10">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h3 className="text-xl font-medium text-white flex items-center gap-2">
              <Globe className="w-5 h-5" />
              URL Validation Results
            </h3>
            <button
              onClick={onExitValidationMode}
              className="flex items-center gap-2 text-xs cursor-pointer px-3 py-2 bg-stone-700/50 hover:bg-stone-700/70 border border-white/10 rounded-lg text-white/70 hover:text-white transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Search
            </button>
          </div>

          <div className="flex items-center gap-4">
            {Object.keys(urlEdits).length > 0 && (
              <button
                onClick={onBatchSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-3 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 rounded-lg text-green-300 hover:text-green-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {savingProgress ? (
                      <>
                        {savingProgress.phase === "saving"
                          ? `Saving ${savingProgress.current}/${savingProgress.total}...`
                          : `Revalidating ${savingProgress.current}/${savingProgress.total}...`}
                      </>
                    ) : (
                      "Processing..."
                    )}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save All Changes ({Object.keys(urlEdits).length})
                  </>
                )}
              </button>
            )}
            {urlValidation.lastValidated && (
              <span className="text-xs text-white/60">
                Last checked: {urlValidation.lastValidated.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Validation Content */}
        {urlValidation.isValidating ? (
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-300" />
            <p className="text-white/70 mb-2">
              {urlValidation.progress
                ? `Validating URLs... ${urlValidation.progress.completed}/${urlValidation.progress.total}`
                : "Starting validation..."}
            </p>
          </div>
        ) : brokenUrlsCount > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-red-300 mb-4">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium text-lg">
                {brokenUrlsCount} restaurant
                {brokenUrlsCount !== 1 ? "s" : ""} with broken URLs
              </span>
            </div>

            <div className="space-y-4">
              {urlValidation.results
                .filter((result) => {
                  const hasBrokenWebsite =
                    result.website && !result.website.isValid;
                  const hasBrokenMenuUrl =
                    result.menuUrl && !result.menuUrl.isValid;
                  return hasBrokenWebsite || hasBrokenMenuUrl;
                })
                .map((result) => {
                  const currentEdits = urlEdits[result.restaurantId] || {};

                  return (
                    <div
                      key={result.restaurantId}
                      className="bg-stone-700/30 rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-white text-lg">
                          {result.restaurantName}
                        </div>
                        <button
                          onClick={() =>
                            onDeleteRestaurant(
                              result.restaurantId,
                              result.restaurantName,
                            )
                          }
                          className="flex items-center text-xs gap-2 px-3 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 rounded-lg text-red-300 hover:text-red-200 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete Restaurant
                        </button>
                      </div>

                      {result.website && !result.website.isValid && (
                        <div className="flex flex-col gap-4">
                          <div className="URLResult flex gap-2">
                            <div className="text-sm text-gray-400 flex items-center gap-2">
                              <span>
                                {result.website.error ||
                                  `Status ${result.website.statusCode} - `}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <a
                                href={result.website.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs break-all"
                              >
                                {result.website.url}
                              </a>
                            </div>
                          </div>
                          <input
                            type="url"
                            placeholder="Enter new website URL or leave empty to remove..."
                            value={currentEdits.website || ""}
                            onChange={(e) =>
                              onUrlEdit(
                                result.restaurantId,
                                "website",
                                e.target.value,
                              )
                            }
                            className="w-full px-3 py-2 text-sm bg-stone-600/50 border border-white/10 rounded text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-py1/40 focus:border-py1/40"
                          />
                        </div>
                      )}

                      {result.menuUrl && !result.menuUrl.isValid && (
                        <div className="space-y-2">
                          <div className="text-sm text-red-300 flex items-center gap-2">
                            <ExternalLink className="w-4 h-4" />
                            <span>
                              Menu:{" "}
                              {result.menuUrl.error ||
                                `Status ${result.menuUrl.statusCode}`}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Link className="w-4 h-4 text-red-300" />
                            <a
                              href={result.menuUrl.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 underline bg-stone-800 px-2 py-1 rounded break-all"
                            >
                              {result.menuUrl.url}
                            </a>
                          </div>
                          <input
                            type="url"
                            placeholder="Enter new menu URL or leave empty to remove..."
                            value={currentEdits.menuUrl || ""}
                            onChange={(e) =>
                              onUrlEdit(
                                result.restaurantId,
                                "menuUrl",
                                e.target.value,
                              )
                            }
                            className="w-full px-3 py-2 bg-stone-600/50 border border-white/10 rounded text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        ) : urlValidation.results.length > 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-400" />
            <h3 className="text-lg font-medium text-white mb-2">
              All URLs Working!
            </h3>
            <p className="text-white/70">
              All restaurant URLs are working correctly.
            </p>
          </div>
        ) : (
          <div className="text-center py-8">
            <Globe className="w-12 h-12 mx-auto mb-4 text-white/50" />
            <h3 className="text-lg font-medium text-white mb-2">
              Ready to Validate
            </h3>
            <p className="text-white/70">
              Click the &quot;Validate URLs&quot; button to check all restaurant
              links.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}