import { v4 as uuidv4 } from "uuid";
import type { LegacyRestaurant, Restaurant } from "./types";

export function transformLegacyRestaurantToEnhanced(
  legacyRestaurant: LegacyRestaurant,
  overrides: Partial<Restaurant> = {}
): Restaurant {
  const defaultEnhancedRestaurant: Restaurant = {
    id: uuidv4(),
    name: legacyRestaurant.name,
    address: legacyRestaurant.address,
    coordinates: undefined,
    area: legacyRestaurant.area,
    cuisineType: "Unknown",
    priceCategory: "2" as const,
    website: legacyRestaurant.website,
    menuUrl: undefined,
    heroImage: "/photo-missing.webp",
    images: [],
    happyHours: legacyRestaurant.happyHours,
    deals: [],
    notes: legacyRestaurant.notes,
    ratings: {
      food: 0,
      drink: 0,
      service: 0,
      atmosphere: 0,
      price: 0,
      overall: 0,
      reviewCount: 0,
    },
    verified: false,
    createdBy: "system",
    lastUpdated: new Date(),
    createdAt: new Date(),
    ...overrides,
  };

  return defaultEnhancedRestaurant;
}

export function inferCuisineFromName(name: string): string {
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes("taco") || lowerName.includes("mexican")) return "Mexican";
  if (lowerName.includes("sushi") || lowerName.includes("japanese")) return "Japanese";
  if (lowerName.includes("pizza") || lowerName.includes("italian")) return "Italian";
  if (lowerName.includes("burger") || lowerName.includes("grill")) return "American";
  if (lowerName.includes("bar") || lowerName.includes("pub")) return "Bar & Grill";
  if (lowerName.includes("cafe") || lowerName.includes("coffee")) return "Cafe";
  
  return "American";
}

export function inferPriceCategoryFromArea(area: string): Restaurant["priceCategory"] {
  const lowerArea = area.toLowerCase();
  
  if (lowerArea.includes("lohi") || lowerArea.includes("cherry creek") || lowerArea.includes("highland")) return "3";
  if (lowerArea.includes("downtown") || lowerArea.includes("union station")) return "3";
  if (lowerArea.includes("cap hill") || lowerArea.includes("capitol hill")) return "2";
  
  return "2";
}