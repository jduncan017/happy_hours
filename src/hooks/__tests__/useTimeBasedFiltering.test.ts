import { describe, it, expect, jest } from "@jest/globals";
import type { Restaurant } from "@/lib/types";

// Import the functions directly for unit testing
import { timeToMinutes, formatTimeRange, isTimeInRange } from "@/utils/time/timeUtils";

describe("Time-based filtering core functions", () => {
  describe("Time overlap detection", () => {
    it("should detect overlapping time ranges correctly", () => {
      const filterStart = timeToMinutes("14:00"); // 2 PM
      const filterEnd = timeToMinutes("16:00");   // 4 PM
      const happyHourStart = timeToMinutes("15:00"); // 3 PM
      const happyHourEnd = timeToMinutes("18:00");   // 6 PM

      // Check overlap: filter (14:00-16:00) overlaps with happy hour (15:00-18:00)
      const hasOverlap = (
        (happyHourStart <= filterEnd && happyHourEnd >= filterStart) ||
        (filterStart <= happyHourEnd && filterEnd >= happyHourStart)
      );

      expect(hasOverlap).toBe(true);
    });

    it("should detect non-overlapping time ranges", () => {
      const filterStart = timeToMinutes("10:00"); // 10 AM
      const filterEnd = timeToMinutes("12:00");   // 12 PM
      const happyHourStart = timeToMinutes("15:00"); // 3 PM
      const happyHourEnd = timeToMinutes("18:00");   // 6 PM

      const hasOverlap = (
        (happyHourStart <= filterEnd && happyHourEnd >= filterStart) ||
        (filterStart <= happyHourEnd && filterEnd >= happyHourStart)
      );

      expect(hasOverlap).toBe(false);
    });
  });

  describe("Time range formatting", () => {
    it("should format time ranges correctly", () => {
      const formatted = formatTimeRange("15:00", "18:00");
      expect(formatted).toBe("3:00 PM - 6:00 PM");
    });
  });

  describe("Time in range detection", () => {
    it("should detect time within range", () => {
      const result = isTimeInRange("16:00", "15:00", "18:00");
      expect(result).toBe(true);
    });

    it("should detect time outside range", () => {
      const result = isTimeInRange("14:00", "15:00", "18:00");
      expect(result).toBe(false);
    });
  });
});