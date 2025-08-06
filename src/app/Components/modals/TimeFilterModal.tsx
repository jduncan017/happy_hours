"use client";

import { useState } from "react";
import ModalWrapper from "./modalWrapper";
import SiteButton from "../SmallComponents/siteButton";

export interface TimeFilter {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

interface TimeFilterModalProps {
  onApplyFilter: (filter: TimeFilter) => void;
  onApplyNowFilter: () => void;
  onApplyTodayFilter: () => void;
  onClose: () => void;
  currentFilter?: TimeFilter;
}

export default function TimeFilterModal({
  onApplyFilter,
  onApplyNowFilter,
  onApplyTodayFilter,
  onClose,
  currentFilter,
}: TimeFilterModalProps) {
  const [selectedDay, setSelectedDay] = useState(
    currentFilter?.dayOfWeek || "",
  );
  const [startTime, setStartTime] = useState(currentFilter?.startTime || "");
  const [endTime, setEndTime] = useState(currentFilter?.endTime || "");

  const daysOfWeek = [
    { value: "Mon", label: "Monday" },
    { value: "Tue", label: "Tuesday" },
    { value: "Wed", label: "Wednesday" },
    { value: "Thu", label: "Thursday" },
    { value: "Fri", label: "Friday" },
    { value: "Sat", label: "Saturday" },
    { value: "Sun", label: "Sunday" },
  ];

  const timeOptions = [];

  // Generate times for restaurant day: 8am to 2am (next day)
  // First add 8am to 11:30pm
  for (let hour = 8; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
      const displayTime = new Date(
        `1970-01-01T${timeString}`,
      ).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      timeOptions.push({ value: timeString, label: displayTime });
    }
  }

  // Then add 12am to 2am (next day)
  for (let hour = 0; hour <= 2; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
      const displayTime = new Date(
        `1970-01-01T${timeString}`,
      ).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      timeOptions.push({ value: timeString, label: displayTime });
    }
  }

  const handleApply = () => {
    if (selectedDay && startTime && endTime) {
      onApplyFilter({
        dayOfWeek: selectedDay,
        startTime,
        endTime,
      });
      onClose();
    }
  };

  const isValid = selectedDay && startTime && endTime && startTime < endTime;

  return (
    <ModalWrapper>
      <div className="TimeFilterModal">
        <div className="ModalContent relative flex max-h-[90vh] w-full max-w-[500px] flex-col px-4 py-6 font-sans sm:px-6">
          {/* Header */}
          <div className="ModalHeader">
            <h2 className="text-2xl font-bold text-black mb-4">
              Filter by Time
            </h2>

            {/* Quick Filter Buttons */}
            <div className="QuickFilters flex gap-2">
              <div className="flex-1">
                <SiteButton
                  text="Happy Hours Now"
                  onSubmit={() => {
                    onApplyNowFilter();
                    onClose();
                  }}
                  variant="white"
                  rounded={true}
                  size="sm"
                  addClasses="w-full"
                />
              </div>
              <div className="flex-1">
                <SiteButton
                  text="Happy Hours Today"
                  onSubmit={() => {
                    onApplyTodayFilter();
                    onClose();
                  }}
                  variant="white"
                  rounded={true}
                  size="sm"
                  addClasses="w-full"
                />
              </div>
            </div>

            <p className="text-gray-300 text-sm">
              Or set a custom day and time range below:
            </p>
          </div>

          {/* Day Selection */}
          <div className="DaySelection mb-6">
            <label className="block text-lg font-semibold text-black mb-3">
              Select Day of Week:
            </label>
            <div className="DayButtons grid grid-cols-2 gap-2 sm:grid-cols-3">
              {daysOfWeek.map((day) => (
                <button
                  key={day.value}
                  onClick={() => setSelectedDay(day.value)}
                  className={`h-10 px-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    selectedDay === day.value
                      ? "bg-py1 text-white border border-py1"
                      : "bg-white text-gray-700 border border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>

          {/* Time Range Selection */}
          <div className="TimeSelection mb-6">
            <label className="block text-lg font-semibold text-black">
              Select Time Range:
            </label>
            <div className="TimeInputs grid grid-cols-1 gap-2 sm:grid-cols-2">
              {/* Start Time */}
              <div className="StartTime">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Start Time:
                </label>
                <select
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-gray-300 rounded-lg text-sm focus:border-py1 focus:outline-none focus:ring-1 focus:ring-py1"
                >
                  <option value="">Select start time</option>
                  {timeOptions.map((time) => (
                    <option key={time.value} value={time.value}>
                      {time.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* End Time */}
              <div className="EndTime">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  End Time:
                </label>
                <select
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-gray-300 rounded-lg text-sm focus:border-py1 focus:outline-none focus:ring-1 focus:ring-py1"
                  disabled={!startTime}
                >
                  <option value="">Select end time</option>
                  {timeOptions
                    .filter((time) => !startTime || time.value > startTime)
                    .map((time) => (
                      <option key={time.value} value={time.value}>
                        {time.label}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>

          {/* Validation Message */}
          {selectedDay && startTime && endTime && startTime >= endTime && (
            <div className="ValidationError mb-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg">
              <p className="text-red-300 text-sm">
                End time must be after start time
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="ModalActions flex gap-3 justify-end">
            <SiteButton
              text="Apply Filter"
              onSubmit={handleApply}
              variant="orange"
              rounded={true}
              size="sm"
              disabled={!isValid}
            />
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
}
