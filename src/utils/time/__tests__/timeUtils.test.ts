import { describe, it, expect } from "@jest/globals";
import {
  timeToMinutes,
  formatTime12Hour,
  formatTimeRange,
  isTimeInRestaurantDay,
  getCurrentDayOfWeek,
  getCurrentTime,
  isTimeInRange
} from "../timeUtils";

describe("Time Utilities", () => {
  describe("timeToMinutes", () => {
    it("should convert morning times correctly", () => {
      expect(timeToMinutes("08:00")).toBe(480); // 8am = 8*60 minutes
      expect(timeToMinutes("10:30")).toBe(630); // 10:30am = 10*60 + 30
    });

    it("should convert afternoon/evening times correctly", () => {
      expect(timeToMinutes("15:00")).toBe(900); // 3pm = 15*60 minutes
      expect(timeToMinutes("23:30")).toBe(1410); // 11:30pm = 23*60 + 30
    });

    it("should convert overnight times correctly (add 24 hours)", () => {
      expect(timeToMinutes("00:00")).toBe(1440); // midnight = 24*60 (next day)
      expect(timeToMinutes("02:00")).toBe(1560); // 2am = (24+2)*60 (next day)
    });

    it("should handle edge case hours gracefully", () => {
      expect(timeToMinutes("05:00")).toBe(300); // 5am (invalid restaurant hour but handled)
    });
  });

  describe("formatTime12Hour", () => {
    it("should format morning times", () => {
      expect(formatTime12Hour("08:00")).toBe("8:00 AM");
      expect(formatTime12Hour("09:30")).toBe("9:30 AM");
    });

    it("should format afternoon times", () => {
      expect(formatTime12Hour("13:00")).toBe("1:00 PM");
      expect(formatTime12Hour("18:45")).toBe("6:45 PM");
    });

    it("should format midnight and noon correctly", () => {
      expect(formatTime12Hour("00:00")).toBe("12:00 AM");
      expect(formatTime12Hour("12:00")).toBe("12:00 PM");
    });
  });

  describe("formatTimeRange", () => {
    it("should format time ranges correctly", () => {
      expect(formatTimeRange("15:00", "18:00")).toBe("3:00 PM - 6:00 PM");
      expect(formatTimeRange("08:30", "11:30")).toBe("8:30 AM - 11:30 AM");
    });

    it("should format overnight ranges correctly", () => {
      expect(formatTimeRange("22:00", "02:00")).toBe("10:00 PM - 2:00 AM");
    });
  });

  describe("isTimeInRestaurantDay", () => {
    it("should accept valid restaurant hours (8am-2am)", () => {
      expect(isTimeInRestaurantDay("08:00")).toBe(true);
      expect(isTimeInRestaurantDay("15:00")).toBe(true);
      expect(isTimeInRestaurantDay("23:00")).toBe(true);
      expect(isTimeInRestaurantDay("01:00")).toBe(true);
      expect(isTimeInRestaurantDay("02:00")).toBe(true);
    });

    it("should reject invalid restaurant hours", () => {
      expect(isTimeInRestaurantDay("03:00")).toBe(false);
      expect(isTimeInRestaurantDay("07:00")).toBe(false);
    });
  });

  describe("getCurrentDayOfWeek", () => {
    it("should return a valid day abbreviation", () => {
      const day = getCurrentDayOfWeek();
      const validDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      expect(validDays).toContain(day);
    });
  });

  describe("getCurrentTime", () => {
    it("should return time in HH:MM format", () => {
      const time = getCurrentTime();
      expect(time).toMatch(/^\d{2}:\d{2}$/);
    });
  });

  describe("isTimeInRange", () => {
    it("should correctly identify time within range", () => {
      expect(isTimeInRange("16:00", "15:00", "18:00")).toBe(true);
      expect(isTimeInRange("15:00", "15:00", "18:00")).toBe(true); // start time
      expect(isTimeInRange("18:00", "15:00", "18:00")).toBe(true); // end time
    });

    it("should correctly identify time outside range", () => {
      expect(isTimeInRange("14:00", "15:00", "18:00")).toBe(false);
      expect(isTimeInRange("19:00", "15:00", "18:00")).toBe(false);
    });
  });
});