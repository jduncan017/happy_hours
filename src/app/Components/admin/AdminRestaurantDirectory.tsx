import { useState } from "react";
import { Restaurant } from "@/lib/types";
import RestaurantEditorModalImproved from "./RestaurantEditorModalImproved";
import ModalWrapper from "../modals/modalWrapper";
import AdminRestaurantSearch from "./AdminRestaurantSearch";
import AdminUrlValidation from "./AdminUrlValidation";
import type { RestaurantUrlValidation } from "@/lib/supabase/urlValidation";
import toast from "react-hot-toast";
import { useModal } from "@/contexts/ModalContext";
import {
  Building2,
  Loader2,
  Globe,
} from "lucide-react";

interface AdminRestaurantDirectoryProps {
  restaurants: Restaurant[];
  totalFiltered: number;
  hasFilters: boolean;
  onLoadMore: () => void;
  hasMore: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: {
    areas: string[];
    cuisineTypes: string[];
    verificationStatus: string[];
  };
  onFilterChange: (
    filterType: "areas" | "cuisineTypes" | "verificationStatus",
    value: string | string[],
  ) => void;
  onClearFilters: () => void;
  uniqueAreas: { value: string; label: string }[];
  uniqueCuisineTypes: { value: string; label: string }[];
}

export default function AdminRestaurantDirectory({
  restaurants,
  totalFiltered,
  hasFilters,
  onLoadMore,
  hasMore,
  searchQuery,
  onSearchChange,
  filters,
  onFilterChange,
  onClearFilters,
  uniqueAreas,
  uniqueCuisineTypes,
}: AdminRestaurantDirectoryProps) {
  const { showModal, hideModal } = useModal();
  const [urlValidation, setUrlValidation] = useState<{
    results: RestaurantUrlValidation[];
    isValidating: boolean;
    progress?: { completed: number; total: number; message?: string };
    lastValidated?: Date;
  }>({ results: [], isValidating: false });
  const [urlEdits, setUrlEdits] = useState<
    Record<string, { website?: string; menuUrl?: string }>
  >({});
  const [isSaving, setIsSaving] = useState(false);
  const [savingProgress, setSavingProgress] = useState<{
    phase: "saving" | "revalidating";
    current: number;
    total: number;
  } | null>(null);
  const [showValidationMode, setShowValidationMode] = useState(false);

  const handleRestaurantSelect = (restaurant: Restaurant) => {
    const handleRestaurantUpdate = (updatedRestaurant: Restaurant) => {
      // Update the local state optimistically
      // In a real implementation, you'd refetch or update the restaurants list
      toast.success('✅ Restaurant updated successfully!');
      hideModal();
    };

    showModal(
      <ModalWrapper theme="dark" showCloseButton={false}>
        <RestaurantEditorModalImproved
          restaurant={restaurant}
          onUpdate={handleRestaurantUpdate}
          onClose={hideModal}
        />
      </ModalWrapper>
    );
  };

  const handleUrlValidation = async () => {
    setShowValidationMode(true);
    setUrlValidation((prev) => ({
      ...prev,
      isValidating: true,
      progress: undefined,
      results: [],
    }));

    try {
      // Use streaming API for progress updates
      const response = await fetch("/api/admin/validate-urls-stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `API request failed: ${response.status} ${response.statusText}`,
        );
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Failed to get response reader");
      }

      const decoder = new TextDecoder();
      let buffer = "";

      // Read the stream
      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || ""; // Keep incomplete line in buffer

        for (const line of lines) {
          if (line.trim()) {
            try {
              const data = JSON.parse(line);

              switch (data.type) {
                case "progress":
                  setUrlValidation((prev) => ({
                    ...prev,
                    progress: {
                      completed: data.completed,
                      total: data.total,
                      message: data.message,
                    },
                  }));
                  break;

                case "complete":
                  setUrlValidation({
                    results: data.results,
                    isValidating: false,
                    lastValidated: new Date(),
                  });

                  toast.success(
                    `Validation complete! ${data.results.length} restaurants checked, ${data.summary.brokenUrls} have broken URLs`,
                  );
                  break;

                case "fatal_error":
                  throw new Error(data.error);

                case "error":
                  console.warn(`⚠️ ${data.message}`);
                  break;

                default:
                  console.log(`ℹ️ ${data.message}`);
                  break;
              }
            } catch (parseError) {
              console.warn("Failed to parse streaming response:", line);
            }
          }
        }
      }
    } catch (error) {
      console.error("Streaming URL validation failed:", error);
      setUrlValidation((prev) => ({
        ...prev,
        isValidating: false,
        progress: undefined,
      }));

      toast.error(
        `URL validation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  };

  const handleExitValidationMode = () => {
    setShowValidationMode(false);
    setUrlValidation((prev) => ({ ...prev, isValidating: false, results: [] }));
    setUrlEdits({});
  };

  // Get broken URLs count for display
  const brokenUrlsCount = urlValidation.results.filter((result) => {
    const hasBrokenWebsite = result.website && !result.website.isValid;
    const hasBrokenMenuUrl = result.menuUrl && !result.menuUrl.isValid;
    return hasBrokenWebsite || hasBrokenMenuUrl;
  }).length;

  // Handle URL replacement
  const handleUrlEdit = (
    restaurantId: string,
    type: "website" | "menuUrl",
    value: string,
  ) => {
    setUrlEdits((prev) => ({
      ...prev,
      [restaurantId]: {
        ...prev[restaurantId],
        [type]: value,
      },
    }));
  };

  const handleBatchSave = async () => {
    const restaurantIds = Object.keys(urlEdits);
    if (restaurantIds.length === 0) {
      toast.error("No changes to save");
      return;
    }

    setIsSaving(true);
    setSavingProgress({
      phase: "saving",
      current: 0,
      total: restaurantIds.length,
    });

    let successCount = 0;
    let errorCount = 0;
    const successfulUpdates: {
      restaurantId: string;
      edits: (typeof urlEdits)[string];
    }[] = [];

    // Phase 1: Save all URL changes
    for (let i = 0; i < restaurantIds.length; i++) {
      const restaurantId = restaurantIds[i];
      const edits = urlEdits[restaurantId];
      if (!edits) continue;

      setSavingProgress({
        phase: "saving",
        current: i + 1,
        total: restaurantIds.length,
      });

      try {
        const response = await fetch("/api/admin/update-restaurant-urls", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            restaurantId,
            websiteUrl:
              edits.website !== undefined
                ? edits.website === ""
                  ? null
                  : edits.website
                : undefined,
            menuUrl:
              edits.menuUrl !== undefined
                ? edits.menuUrl === ""
                  ? null
                  : edits.menuUrl
                : undefined,
          }),
        });

        const data = await response.json();

        if (data.success) {
          successCount++;
          successfulUpdates.push({ restaurantId, edits });
        } else {
          console.error(
            `Failed to update URLs for restaurant ${restaurantId}:`,
            data.error,
          );
          errorCount++;
        }
      } catch (error) {
        console.error(
          `Error updating URLs for restaurant ${restaurantId}:`,
          error,
        );
        errorCount++;
      }
    }

    // Phase 2: Re-validate the successfully updated restaurants
    if (successfulUpdates.length > 0) {
      setSavingProgress({
        phase: "revalidating",
        current: 0,
        total: successfulUpdates.length,
      });

      const updatedValidationResults = [...urlValidation.results];

      for (let i = 0; i < successfulUpdates.length; i++) {
        const { restaurantId, edits } = successfulUpdates[i];

        setSavingProgress({
          phase: "revalidating",
          current: i + 1,
          total: successfulUpdates.length,
        });

        // Find the restaurant in the original validation results
        const originalResult = urlValidation.results.find(
          (r) => r.restaurantId === restaurantId,
        );
        if (!originalResult) continue;

        // Create the new URLs for validation
        const newWebsiteUrl =
          edits.website !== undefined
            ? edits.website === ""
              ? null
              : edits.website
            : originalResult.website?.url;
        const newMenuUrl =
          edits.menuUrl !== undefined
            ? edits.menuUrl === ""
              ? null
              : edits.menuUrl
            : originalResult.menuUrl?.url;

        try {
          // Re-validate with the new URLs using the correct API endpoint
          const response = await fetch(
            "/api/admin/validate-single-restaurant",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                restaurantId,
                website: newWebsiteUrl,
                menuUrl: newMenuUrl,
              }),
            },
          );

          const data = await response.json();

          if (!data.success) {
            console.error(
              `Failed to re-validate restaurant ${restaurantId}:`,
              data.error,
            );
            continue;
          }

          const revalidationResult = data.result;

          // Update the validation results
          const resultIndex = updatedValidationResults.findIndex(
            (r) => r.restaurantId === restaurantId,
          );
          if (resultIndex !== -1) {
            updatedValidationResults[resultIndex] = revalidationResult;
          }
        } catch (error) {
          console.error(
            `Failed to re-validate restaurant ${restaurantId}:`,
            error,
          );
        }
      }

      // Update the validation results state
      setUrlValidation((prev) => ({
        ...prev,
        results: updatedValidationResults,
      }));
    }

    // Clear all edits on completion
    if (successCount > 0) {
      setUrlEdits({});
    }

    // Reset saving state
    setIsSaving(false);
    setSavingProgress(null);

    // Show completion toast
    if (errorCount === 0) {
      toast.success(
        `✅ Successfully updated and revalidated ${successCount} restaurant${successCount !== 1 ? "s" : ""}!`,
      );
    } else if (successCount > 0) {
      toast.success(`✅ Updated ${successCount} restaurants successfully`);
      toast.error(`${errorCount} restaurants failed to update`);
    } else {
      toast.error(
        `Failed to update ${errorCount} restaurant${errorCount !== 1 ? "s" : ""}`,
      );
    }
  };

  const handleDeleteRestaurant = async (
    restaurantId: string,
    restaurantName: string,
  ) => {
    const confirmed = confirm(
      `⚠️ Are you sure you want to delete "${restaurantName}"?\n\nThis action cannot be undone and will permanently remove the restaurant from the database.`,
    );

    if (!confirmed) return;

    try {
      const response = await fetch("/api/admin/delete-restaurant", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          restaurantId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`✅ Restaurant "${restaurantName}" has been deleted`);

        // Remove from validation results
        setUrlValidation((prev) => ({
          ...prev,
          results: prev.results.filter((r) => r.restaurantId !== restaurantId),
        }));

        // Clear any edits for this restaurant
        setUrlEdits((prev) => {
          const newEdits = { ...prev };
          delete newEdits[restaurantId];
          return newEdits;
        });
      } else {
        toast.error(`Failed to delete restaurant: ${data.error}`);
      }
    } catch (error) {
      console.error("Error deleting restaurant:", error);
      toast.error(
        `Error deleting restaurant: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  };

  return (
    <div className="AdminRestaurantDirectory">
      {/* Restaurant Directory Header */}
      <div className="RestaurantListInfo flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="RestaurantListIcon w-12 h-12 bg-po1/20 rounded-xl flex items-center justify-center mr-4">
            <Building2 className="w-6 h-6 text-po1" />
          </div>
          <div>
            <h2 className="RestaurantListTitle text-xl font-bold text-white uppercase tracking-wide">
              Restaurant Directory
            </h2>
            <p className="RestaurantListSubtitle text-white/70">
              {hasFilters
                ? `Showing ${restaurants.length} of ${totalFiltered} restaurants`
                : "Use the search bar and filters to find restaurants"}
            </p>
          </div>
        </div>

        {/* URL Validation Button */}
        <button
          onClick={handleUrlValidation}
          disabled={urlValidation.isValidating}
          className="AdminUrlValidationButton px-4 py-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-xl text-blue-300 hover:text-blue-200 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {urlValidation.isValidating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {urlValidation.progress
                ? `Validated ${urlValidation.progress.completed}/${urlValidation.progress.total}`
                : "Starting validation..."}
            </>
          ) : (
            <>
              <Globe className="w-4 h-4" />
              Validate URLs
              {brokenUrlsCount > 0 && (
                <span className="bg-red-500/20 text-red-300 px-2 py-1 rounded-md text-xs ml-2">
                  {brokenUrlsCount} broken
                </span>
              )}
            </>
          )}
        </button>
      </div>

      {/* Conditional Content: Search & Filters OR URL Validation Results */}
      {!showValidationMode ? (
        <AdminRestaurantSearch
          restaurants={restaurants}
          totalFiltered={totalFiltered}
          hasFilters={hasFilters}
          onLoadMore={onLoadMore}
          hasMore={hasMore}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          filters={filters}
          onFilterChange={onFilterChange}
          onClearFilters={onClearFilters}
          uniqueAreas={uniqueAreas}
          uniqueCuisineTypes={uniqueCuisineTypes}
          onRestaurantSelect={handleRestaurantSelect}
        />
      ) : (
        <AdminUrlValidation
          urlValidation={urlValidation}
          urlEdits={urlEdits}
          isSaving={isSaving}
          savingProgress={savingProgress}
          onExitValidationMode={handleExitValidationMode}
          onUrlEdit={handleUrlEdit}
          onBatchSave={handleBatchSave}
          onDeleteRestaurant={handleDeleteRestaurant}
        />
      )}

    </div>
  );
}