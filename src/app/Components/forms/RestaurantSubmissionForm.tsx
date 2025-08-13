"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateSubmissionSchema, type CreateSubmission } from "@/lib/schemas";
import { useModal } from "@/contexts/ModalContext";
import toast from "react-hot-toast";
import {
  Globe,
  MapPin,
  Phone,
  Clock,
  FileText,
  Send,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

interface RestaurantSubmissionFormProps {
  onSuccess?: () => void;
}

export default function RestaurantSubmissionForm({
  onSuccess,
}: RestaurantSubmissionFormProps) {
  const [submissionMethod, setSubmissionMethod] = useState<"url" | "manual">("url");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const { showModal } = useModal();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<CreateSubmission>({
    resolver: zodResolver(CreateSubmissionSchema),
  });

  const websiteUrl = watch("website_url");

  // Extract data from website URL
  const handleExtractData = async () => {
    if (!websiteUrl) {
      toast.error("Please enter a website URL first");
      return;
    }

    setIsExtracting(true);
    try {
      const response = await fetch("/api/extract-restaurant-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: websiteUrl }),
      });

      const data = await response.json();

      if (data.success) {
        setExtractedData(data.restaurant);
        toast.success("Restaurant data extracted successfully!");
        
        // Pre-fill manual fields with extracted data
        if (data.restaurant.name) {
          setValue("manual_data.name", data.restaurant.name);
        }
        if (data.restaurant.address) {
          setValue("manual_data.address", data.restaurant.address);
        }
        if (data.restaurant.phone) {
          setValue("manual_data.phone", data.restaurant.phone);
        }
        if (data.restaurant.cuisine_type) {
          setValue("manual_data.cuisine_type", data.restaurant.cuisine_type);
        }
      } else {
        toast.error(data.error || "Failed to extract restaurant data");
      }
    } catch (error) {
      console.error("Error extracting data:", error);
      toast.error("Error extracting restaurant data");
    } finally {
      setIsExtracting(false);
    }
  };

  const onSubmit = async (data: CreateSubmission) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/submit-restaurant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Restaurant submitted successfully! We'll review it soon.");
        reset();
        setExtractedData(null);
        onSuccess?.();
      } else {
        toast.error(result.error || "Failed to submit restaurant");
      }
    } catch (error) {
      console.error("Error submitting restaurant:", error);
      toast.error("Error submitting restaurant");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="RestaurantSubmissionForm max-w-2xl mx-auto p-6 bg-stone-800/50 rounded-2xl border border-white/10">
      <div className="FormHeader mb-6">
        <h2 className="text-2xl font-serif font-bold text-white mb-2">
          Submit a Restaurant
        </h2>
        <p className="text-white/70">
          Help us grow Denver&apos;s happy hour community by submitting your favorite spots!
        </p>
      </div>

      {/* Submission Method Toggle */}
      <div className="SubmissionMethodToggle mb-6">
        <div className="flex items-center gap-4 p-1 bg-stone-700/50 rounded-xl">
          <button
            type="button"
            onClick={() => setSubmissionMethod("url")}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
              submissionMethod === "url"
                ? "bg-po1/20 text-po1 border border-po1/30"
                : "text-white/70 hover:text-white"
            }`}
          >
            <Globe className="w-4 h-4 inline mr-2" />
            Website URL
          </button>
          <button
            type="button"
            onClick={() => setSubmissionMethod("manual")}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
              submissionMethod === "manual"
                ? "bg-po1/20 text-po1 border border-po1/30"
                : "text-white/70 hover:text-white"
            }`}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Manual Entry
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* URL Method */}
        {submissionMethod === "url" && (
          <div className="URLSection">
            <label className="block text-sm font-medium text-white mb-2">
              Restaurant Website URL
            </label>
            <div className="flex gap-2">
              <input
                {...register("website_url")}
                type="url"
                placeholder="https://restaurant-website.com"
                className="flex-1 px-4 py-3 bg-stone-700/50 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-po1 focus:border-po1"
              />
              <button
                type="button"
                onClick={handleExtractData}
                disabled={isExtracting || !websiteUrl}
                className="px-4 py-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-xl text-blue-300 hover:text-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExtracting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Extract Info"
                )}
              </button>
            </div>
            {errors.website_url && (
              <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.website_url.message}
              </p>
            )}

            {/* Extracted Data Preview */}
            {extractedData && (
              <div className="mt-4 p-4 bg-green-600/10 border border-green-500/20 rounded-lg">
                <h4 className="text-green-400 font-medium mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Extracted Data
                </h4>
                <div className="text-sm text-green-300 space-y-1">
                  {extractedData.name && <p><strong>Name:</strong> {extractedData.name}</p>}
                  {extractedData.address && <p><strong>Address:</strong> {extractedData.address}</p>}
                  {extractedData.phone && <p><strong>Phone:</strong> {extractedData.phone}</p>}
                  {extractedData.cuisine_type && <p><strong>Cuisine:</strong> {extractedData.cuisine_type}</p>}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Manual Entry Method */}
        {submissionMethod === "manual" && (
          <div className="ManualEntrySection space-y-4">
            {/* Restaurant Name */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Restaurant Name *
              </label>
              <input
                {...register("manual_data.name")}
                type="text"
                placeholder="Restaurant Name"
                className="w-full px-4 py-3 bg-stone-700/50 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-po1 focus:border-po1"
              />
              {errors.manual_data?.name && (
                <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.manual_data.name.message}
                </p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Address *
              </label>
              <input
                {...register("manual_data.address")}
                type="text"
                placeholder="1234 Main St, Denver, CO"
                className="w-full px-4 py-3 bg-stone-700/50 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-po1 focus:border-po1"
              />
              {errors.manual_data?.address && (
                <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.manual_data.address.message}
                </p>
              )}
            </div>

            {/* Area & Cuisine Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Area/Neighborhood
                </label>
                <input
                  {...register("manual_data.area")}
                  type="text"
                  placeholder="LoDo, Capitol Hill, etc."
                  className="w-full px-4 py-3 bg-stone-700/50 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-po1 focus:border-po1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Cuisine Type
                </label>
                <input
                  {...register("manual_data.cuisine_type")}
                  type="text"
                  placeholder="American, Italian, etc."
                  className="w-full px-4 py-3 bg-stone-700/50 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-po1 focus:border-po1"
                />
              </div>
            </div>

            {/* Website & Menu URL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  <Globe className="w-4 h-4 inline mr-1" />
                  Website URL
                </label>
                <input
                  {...register("manual_data.website")}
                  type="url"
                  placeholder="https://restaurant.com"
                  className="w-full px-4 py-3 bg-stone-700/50 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-po1 focus:border-po1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Menu URL
                </label>
                <input
                  {...register("manual_data.menu_url")}
                  type="url"
                  placeholder="https://menu-link.com"
                  className="w-full px-4 py-3 bg-stone-700/50 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-po1 focus:border-po1"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                <Phone className="w-4 h-4 inline mr-1" />
                Phone Number
              </label>
              <input
                {...register("manual_data.phone")}
                type="tel"
                placeholder="(303) 555-0123"
                className="w-full px-4 py-3 bg-stone-700/50 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-po1 focus:border-po1"
              />
            </div>
          </div>
        )}

        {/* Additional Notes */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Additional Notes (Optional)
          </label>
          <textarea
            {...register("submission_notes")}
            rows={3}
            placeholder="Any additional information about happy hours, specials, or other details..."
            className="w-full px-4 py-3 bg-stone-700/50 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-po1 focus:border-po1 resize-none"
          />
          {errors.submission_notes && (
            <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.submission_notes.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="SubmitSection">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-4 bg-po1/20 hover:bg-po1/30 border border-po1/30 rounded-xl text-po1 hover:text-po1/90 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Submit Restaurant
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}