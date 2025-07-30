// Enhanced types - exports both new enhanced types and legacy types for backward compatibility
export {
  type HappyHourTime,
  type HappyHours,
  type Coordinates,
  type Deal,
  type RestaurantRatings,
  type Restaurant,
  type City,
  type States,
  type HappyHoursData,
} from "./schemas";

// Import for use in legacy types
import type { HappyHours } from "./schemas";

// Legacy Restaurant interface for backward compatibility
export interface LegacyRestaurant {
  name: string;
  address: string;
  area: string;
  website?: string;
  happyHours: HappyHours;
  notes: string[];
}

// Legacy data structure for backward compatibility
export interface LegacyHappyHoursData {
  CO: {
    [cityName: string]: LegacyRestaurant[];
  };
}