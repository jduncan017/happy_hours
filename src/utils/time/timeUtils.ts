/**
 * Time utility functions for handling restaurant happy hour times
 * Consolidates time conversion and formatting logic across the application
 */

/**
 * Convert time string to minutes since restaurant day start (8am)
 * Restaurant day runs 8am-2am, so we need to handle the overnight period
 */
export const timeToMinutes = (timeString: string): number => {
  const [hours, minutes] = timeString.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes;
  
  // If it's 8am or later (8:00-23:59), return as-is
  if (hours >= 8) {
    return totalMinutes;
  }
  // If it's early hours (0:00-2:59), add 24 hours to put it at end of restaurant day
  else if (hours <= 2) {
    return totalMinutes + (24 * 60);
  }
  // Hours 3-7 are not valid for restaurant operations, but handle gracefully
  else {
    return totalMinutes;
  }
};

/**
 * Format 24-hour time string to 12-hour format with AM/PM
 */
export const formatTime12Hour = (time: string): string => {
  let hour = parseInt(time.split(":")[0], 10);
  const minutes = time.split(":")[1];
  const meridiem = hour >= 12 ? "PM" : "AM";
  
  hour = hour > 12 ? hour - 12 : hour;
  hour = hour === 0 ? 12 : hour;
  
  return `${hour}:${minutes} ${meridiem}`;
};

/**
 * Format a time range from start and end time strings
 */
export const formatTimeRange = (start: string, end: string): string => {
  const startFormatted = formatTime12Hour(start);
  const endFormatted = formatTime12Hour(end);
  return `${startFormatted} - ${endFormatted}`;
};

/**
 * Check if current time falls within restaurant operating hours (8am-2am)
 */
export const isTimeInRestaurantDay = (timeString: string): boolean => {
  const [hours] = timeString.split(':').map(Number);
  // Valid restaurant hours: 8am-2am (8-23 or 0-2)
  return (hours >= 8 && hours <= 23) || (hours >= 0 && hours <= 2);
};

/**
 * Get current day of week in the format used by restaurant data
 */
export const getCurrentDayOfWeek = (): string => {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return daysOfWeek[new Date().getDay()];
};

/**
 * Get current time in HH:MM format
 */
export const getCurrentTime = (): string => {
  return new Date().toTimeString().slice(0, 5);
};

/**
 * Check if current time falls within a time range
 * Simple string comparison for HH:MM format times
 */
export const isTimeInRange = (currentTime: string, start: string, end: string): boolean => {
  return currentTime >= start && currentTime <= end;
};