"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateSubmissionSchema, type CreateSubmission } from "@/lib/schemas";
import { AREA_OPTIONS, CUISINE_OPTIONS } from "./formOptions";
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
  Users,
  ArrowLeft,
  Info,
  Plus,
  X,
  Copy,
} from "lucide-react";

export default function RestaurantSubmissionPageContent() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCustomArea, setShowCustomArea] = useState(false);
  const [notes, setNotes] = useState<string[]>([""]);

  const MAX_NOTES = 5;
  const MAX_NOTE_LENGTH = 120; // Good length for chip display

  // Happy hour times state
  const DAYS = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  type TimeSlot = {
    start_time: string;
    end_time: string;
  };

  const defaultTimeSlot: TimeSlot = {
    start_time: "",
    end_time: "",
  };

  const [happyHourTimes, setHappyHourTimes] = useState<
    Record<string, TimeSlot[]>
  >(() => {
    const initialTimes: Record<string, TimeSlot[]> = {};
    DAYS.forEach((day) => {
      initialTimes[day] = [{ ...defaultTimeSlot }];
    });
    return initialTimes;
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreateSubmission>({
    resolver: zodResolver(CreateSubmissionSchema),
  });

  const watchedArea = watch("manual_data.area");

  // Handle area dropdown change
  useEffect(() => {
    if (watchedArea === "OTHER") {
      setShowCustomArea(true);
      setValue("manual_data.area", ""); // Clear the value so user can enter custom
    } else {
      setShowCustomArea(false);
    }
  }, [watchedArea, setValue]);

  // Handle notes management
  const addNote = () => {
    if (notes.length < MAX_NOTES) {
      setNotes([...notes, ""]);
    }
  };

  const removeNote = (index: number) => {
    if (notes.length > 1) {
      const newNotes = notes.filter((_, i) => i !== index);
      setNotes(newNotes);
      // Update form value
      setValue(
        "submission_notes",
        newNotes.filter((n) => n.trim()).join(" • "),
      );
    }
  };

  const updateNote = (index: number, value: string) => {
    if (value.length <= MAX_NOTE_LENGTH) {
      const newNotes = [...notes];
      newNotes[index] = value;
      setNotes(newNotes);
      // Update form value - join non-empty notes with bullet separator
      setValue(
        "submission_notes",
        newNotes.filter((n) => n.trim()).join(" • "),
      );
    }
  };

  // Get placeholder text for notes with happy hour specific examples
  const getNotePlaceholder = (index: number): string => {
    const placeholders = [
      'e.g., "Taco Tuesdays", "Half-price apps", "$1 mussels"',
      "Daily specials on draft beer",
      "2-for-1 cocktails during happy hour",
      "Live music on weekends",
      "Rooftop patio seating",
    ];
    return (
      placeholders[index] || `Note ${index + 1} - Happy hour special or detail`
    );
  };

  // Happy hour time management functions
  const addTimeSlot = (day: string) => {
    setHappyHourTimes((prev) => {
      const updated = {
        ...prev,
        [day]: [...prev[day], { ...defaultTimeSlot }],
      };

      // Update form immediately with the new state
      const formattedTimes: Record<string, TimeSlot[]> = {};
      Object.entries(updated).forEach(([dayKey, times]) => {
        const validTimes = times.filter(
          (time) => time.start_time.trim() && time.end_time.trim(),
        );
        if (validTimes.length > 0) {
          formattedTimes[dayKey] = validTimes;
        }
      });
      setValue("manual_data.happy_hour_times", formattedTimes);

      return updated;
    });
  };

  const removeTimeSlot = (day: string, index: number) => {
    if (happyHourTimes[day].length > 1) {
      setHappyHourTimes((prev) => {
        const updated = {
          ...prev,
          [day]: prev[day].filter((_, i) => i !== index),
        };

        // Update form immediately with the new state
        const formattedTimes: Record<string, TimeSlot[]> = {};
        Object.entries(updated).forEach(([dayKey, times]) => {
          const validTimes = times.filter(
            (time) => time.start_time.trim() && time.end_time.trim(),
          );
          if (validTimes.length > 0) {
            formattedTimes[dayKey] = validTimes;
          }
        });
        setValue("manual_data.happy_hour_times", formattedTimes);

        return updated;
      });
    }
  };

  const updateTimeSlot = (
    day: string,
    index: number,
    field: keyof TimeSlot,
    value: string,
  ) => {
    setHappyHourTimes((prev) => {
      const updated = {
        ...prev,
        [day]: prev[day].map((slot, i) =>
          i === index ? { ...slot, [field]: value } : slot,
        ),
      };

      // Update form immediately with the new state
      const formattedTimes: Record<string, TimeSlot[]> = {};
      Object.entries(updated).forEach(([dayKey, times]) => {
        const validTimes = times.filter(
          (time) => time.start_time.trim() && time.end_time.trim(),
        );
        if (validTimes.length > 0) {
          formattedTimes[dayKey] = validTimes;
        }
      });
      setValue("manual_data.happy_hour_times", formattedTimes);

      return updated;
    });
  };

  const copyMondayToAll = () => {
    const mondayTimes = happyHourTimes["Monday"];

    // Validate that Monday has at least one complete time slot
    const hasValidTimes = mondayTimes.some((slot) => {
      const hasStartTime = slot.start_time && slot.start_time.trim() !== "";
      const hasEndTime = slot.end_time && slot.end_time.trim() !== "";
      return hasStartTime && hasEndTime;
    });

    if (!hasValidTimes) {
      toast.error(
        "Please fill in valid start and end times for Monday before copying to all days.",
      );
      return;
    }

    setHappyHourTimes(() => {
      const updated: Record<string, TimeSlot[]> = {};
      DAYS.forEach((day) => {
        updated[day] = mondayTimes.map((slot) => ({ ...slot }));
      });

      // Update form immediately with the new state
      const formattedTimes: Record<string, TimeSlot[]> = {};
      Object.entries(updated).forEach(([dayKey, times]) => {
        const validTimes = times.filter(
          (time) => time.start_time.trim() && time.end_time.trim(),
        );
        if (validTimes.length > 0) {
          formattedTimes[dayKey] = validTimes;
        }
      });
      setValue("manual_data.happy_hour_times", formattedTimes);

      return updated;
    });
    toast.success("Monday's times copied to all days!");
  };

  const clearDay = (day: string) => {
    setHappyHourTimes((prev) => {
      const updated = {
        ...prev,
        [day]: [
          {
            start_time: "",
            end_time: "",
          },
        ],
      };

      // Update form immediately by removing this day's times
      const formattedTimes: Record<string, TimeSlot[]> = {};
      Object.entries(updated).forEach(([dayKey, times]) => {
        const validTimes = times.filter(
          (time) => time.start_time.trim() && time.end_time.trim(),
        );
        if (validTimes.length > 0) {
          formattedTimes[dayKey] = validTimes;
        }
      });
      setValue("manual_data.happy_hour_times", formattedTimes);

      return updated;
    });
    toast.success(`${day} times cleared!`);
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
        toast.success(
          "Restaurant submitted successfully! We'll review it soon.",
        );
        // Redirect to success or home page
        router.push("/search?submitted=true");
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-po1/20 to-py1/20 rounded-full p-4">
              <Users className="w-12 h-12 text-po1" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-4">
            Submit a Restaurant
          </h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Help us grow Denver&apos;s happy hour community by submitting your
            favorite spots!
          </p>
        </div>

        {/* Instructions Card */}
        <div className="bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-2xl shadow-lg p-8 mb-8 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-green-100 rounded-full p-2">
              <Info className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Instructions
              </h2>
              <p className="text-gray-600 text-sm">
                Please fill out the form below with accurate restaurant
                information
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                1
              </div>
              <p className="text-gray-700">
                <strong>Restaurant Name & Address:</strong> Enter the full
                restaurant name and complete street address.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                2
              </div>
              <p className="text-gray-700">
                <strong>Happy Hour URL:</strong> Provide a direct link to their
                happy hour page, menu, or main website. We&apos;ll auto-detect the
                main website from this URL.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                3
              </div>
              <p className="text-gray-700">
                <strong>Happy Hour Times:</strong> Enter the days and times when
                happy hour specials are available.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                4
              </div>
              <p className="text-gray-700">
                <strong>Submit for Review:</strong> We&apos;ll review and add your
                submission within 24-48 hours.
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Basic Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Restaurant Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Restaurant Name *
                  </label>
                  <input
                    {...register("manual_data.name")}
                    type="text"
                    placeholder="Restaurant Name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-po1 focus:border-po1 transition-colors"
                  />
                  {errors.manual_data?.name && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.manual_data.name.message}
                    </p>
                  )}
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Address *
                  </label>
                  <input
                    {...register("manual_data.address")}
                    type="text"
                    placeholder="1234 Main St, Denver, CO"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-po1 focus:border-po1 transition-colors"
                  />
                  {errors.manual_data?.address && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.manual_data.address.message}
                    </p>
                  )}
                </div>

                {/* Area & Cuisine Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Area/Neighborhood
                  </label>
                  {!showCustomArea ? (
                    <select
                      {...register("manual_data.area")}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-po1 focus:border-po1 transition-colors"
                    >
                      {AREA_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      {...register("manual_data.area")}
                      type="text"
                      placeholder="Enter custom area/neighborhood"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-po1 focus:border-po1 transition-colors"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cuisine Type
                  </label>
                  <select
                    {...register("manual_data.cuisine_type")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-po1 focus:border-po1 transition-colors"
                  >
                    {CUISINE_OPTIONS.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                        disabled={option.disabled}
                        className={
                          option.disabled
                            ? "font-semibold text-gray-500 bg-gray-100"
                            : ""
                        }
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Contact & Links */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Contact & Links
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Menu URL - Full width since website is auto-populated */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Happy Hour Menu/Info URL *
                  </label>
                  <input
                    {...register("manual_data.menu_url")}
                    type="url"
                    placeholder="https://restaurant.com/happy-hour"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-po1 focus:border-po1 transition-colors"
                  />
                  {errors.manual_data?.menu_url && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.manual_data.menu_url.message}
                    </p>
                  )}
                  <p className="mt-2 text-sm text-gray-500">
                    <strong>Best:</strong> Direct link to their happy hour page.{" "}
                    <strong>Good:</strong> Menu page or main website.
                  </p>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Phone Number
                  </label>
                  <input
                    {...register("manual_data.phone")}
                    type="tel"
                    placeholder="(303) 555-0123"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-po1 focus:border-po1 transition-colors"
                  />
                </div>

                {/* Happy Hour Times */}
                <div className="md:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Happy Hour Times *
                    </label>
                  </div>

                  <div className="space-y-4">
                    {DAYS.map((day) => {
                      return (
                        <div
                          key={day}
                          className="border border-gray-200 rounded-xl p-4"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-gray-900 flex items-center gap-2">
                              {day}
                              {day === "Monday" && (
                                <button
                                  type="button"
                                  onClick={copyMondayToAll}
                                  className="flex items-center gap-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded-full transition-colors"
                                  title="Copy Monday's times to all days"
                                >
                                  <Copy className="w-3 h-3" />
                                  Copy to All
                                </button>
                              )}
                            </h4>
                            <div className="flex items-center gap-2">
                              {happyHourTimes[day].length < 3 && (
                                <button
                                  type="button"
                                  onClick={() => addTimeSlot(day)}
                                  className="flex items-center gap-1 text-xs text-green-600 hover:text-green-700 transition-colors"
                                >
                                  <Plus className="w-3 h-3" />
                                  Add Time
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => clearDay(day)}
                                className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 transition-colors"
                                title={`Clear all times for ${day}`}
                              >
                                <X className="w-3 h-3" />
                                Clear Day
                              </button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            {happyHourTimes[day].map((timeSlot, slotIndex) => (
                              <div
                                key={`${day}-${slotIndex}`}
                                className="flex items-center gap-2 flex-wrap"
                              >
                                <input
                                  key={`${day}-${slotIndex}-start`}
                                  type="time"
                                  value={timeSlot.start_time || ""}
                                  onChange={(e) => {
                                    updateTimeSlot(
                                      day,
                                      slotIndex,
                                      "start_time",
                                      e.target.value,
                                    );
                                  }}
                                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-po1 focus:border-po1 text-sm"
                                />

                                <span className="text-gray-500 text-sm">
                                  to
                                </span>

                                <input
                                  key={`${day}-${slotIndex}-end`}
                                  type="time"
                                  value={timeSlot.end_time || ""}
                                  onChange={(e) => {
                                    updateTimeSlot(
                                      day,
                                      slotIndex,
                                      "end_time",
                                      e.target.value,
                                    );
                                  }}
                                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-po1 focus:border-po1 text-sm"
                                />

                                {happyHourTimes[day].length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeTimeSlot(day, slotIndex)
                                    }
                                    className="p-1 text-red-500 hover:text-red-700 transition-colors"
                                    title="Remove time slot"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Hidden input to register with form */}
                  <input
                    {...register("manual_data.happy_hour_times")}
                    type="hidden"
                  />

                  {errors.manual_data?.happy_hour_times && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      Please add at least one happy hour time
                    </p>
                  )}
                  <p className="mt-3 text-sm text-gray-500">
                    Set start and end times for each day. Leave empty if no
                    happy hour that day. Use &quot;Add Time&quot; for multiple
                    periods per day.
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Additional Information
              </h2>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Additional Notes (Optional)
                  </label>
                  {notes.length < MAX_NOTES && (
                    <button
                      type="button"
                      onClick={addNote}
                      className="flex items-center gap-1 text-sm text-po1 hover:text-po1/80 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Note ({notes.length}/{MAX_NOTES})
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {notes.map((note, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={note}
                        onChange={(e) => updateNote(index, e.target.value)}
                        placeholder={getNotePlaceholder(index)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-po1 focus:border-po1 transition-colors"
                        maxLength={MAX_NOTE_LENGTH}
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 min-w-[3rem] text-right">
                          {note.length}/{MAX_NOTE_LENGTH}
                        </span>
                        {notes.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeNote(index)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            title="Remove note"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Hidden input to register with form */}
                <input {...register("submission_notes")} type="hidden" />

                {errors.submission_notes && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.submission_notes.message}
                  </p>
                )}
                <p className="mt-3 text-sm text-gray-500">
                  Add short notes about happy hour specials, themed days, deals,
                  or other helpful details. Each note appears as a chip in the
                  restaurant listing.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-4 bg-po1 hover:bg-po1/90 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto min-w-[200px]"
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
              <p className="mt-3 text-sm text-gray-500 max-w-md mx-auto">
                Our team will review your submission and add it to the
                directory. Thank you for helping grow Denver&apos;s happy hour
                community!
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
