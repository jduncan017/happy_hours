import { describe, it, expect } from "@jest/globals";
import {
  HappyHourTimeSchema,
  RestaurantSchema,
  CoordinatesSchema,
  DealSchema,
  RestaurantRatingsSchema,
} from "../schemas";

describe("Schema Validation", () => {
  describe("HappyHourTimeSchema", () => {
    it("should validate correct time format", () => {
      const validTime = { Start: "15:00", End: "18:00" };
      expect(() => HappyHourTimeSchema.parse(validTime)).not.toThrow();
    });

    it("should reject invalid time format", () => {
      const invalidTime = { Start: "25:00", End: "18:00" };
      expect(() => HappyHourTimeSchema.parse(invalidTime)).toThrow();
    });
  });

  describe("CoordinatesSchema", () => {
    it("should validate correct coordinates", () => {
      const validCoords = { lat: 39.7392, lng: -104.9903 };
      expect(() => CoordinatesSchema.parse(validCoords)).not.toThrow();
    });

    it("should reject invalid latitude", () => {
      const invalidCoords = { lat: 91, lng: -104.9903 };
      expect(() => CoordinatesSchema.parse(invalidCoords)).toThrow();
    });
  });

  describe("DealSchema", () => {
    it("should validate complete deal", () => {
      const validDeal = {
        description: "$5 appetizers",
        category: "food" as const,
        daysApplied: ["Mon", "Tue"] as const,
        timeRange: { start: "15:00", end: "18:00" },
      };
      expect(() => DealSchema.parse(validDeal)).not.toThrow();
    });

    it("should validate deal without timeRange", () => {
      const validDeal = {
        description: "$5 appetizers",
        category: "food" as const,
        daysApplied: ["Mon", "Tue"] as const,
      };
      expect(() => DealSchema.parse(validDeal)).not.toThrow();
    });
  });

  describe("RestaurantRatingsSchema", () => {
    it("should validate correct ratings", () => {
      const validRatings = {
        food: 4.5,
        drink: 4.0,
        service: 3.8,
        atmosphere: 4.2,
        price: 3.5,
        overall: 4.0,
        reviewCount: 25,
      };
      expect(() => RestaurantRatingsSchema.parse(validRatings)).not.toThrow();
    });

    it("should reject ratings outside range", () => {
      const invalidRatings = {
        food: 6.0,
        drink: 4.0,
        service: 3.8,
        atmosphere: 4.2,
        price: 3.5,
        overall: 4.0,
        reviewCount: 25,
      };
      expect(() => RestaurantRatingsSchema.parse(invalidRatings)).toThrow();
    });
  });
});