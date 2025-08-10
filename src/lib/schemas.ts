import { z } from "zod";

export const HappyHourTimeSchema = z.object({
  Start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  End: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
});

export const HappyHoursSchema = z.record(
  z.string(),
  z.array(HappyHourTimeSchema).optional()
);

export const CoordinatesSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export const DealSchema = z.object({
  description: z.string(),
  category: z.enum(["food", "drink", "both"]),
  daysApplied: z.array(z.enum(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"])),
  timeRange: z.object({
    start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
    end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  }).optional(),
});

export const RestaurantRatingsSchema = z.object({
  food: z.number().min(0).max(5),
  drink: z.number().min(0).max(5),
  service: z.number().min(0).max(5),
  atmosphere: z.number().min(0).max(5),
  price: z.number().min(0).max(5),
  overall: z.number().min(0).max(5),
  reviewCount: z.number().min(0),
});

export const RestaurantSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Restaurant name is required"),
  address: z.string().min(1, "Address is required"),
  coordinates: CoordinatesSchema.optional(),
  area: z.string(),
  cuisineType: z.string(),
  priceCategory: z.enum(["1", "2", "3", "4"]),
  website: z.string().url().optional(),
  menuUrl: z.string().url().optional(),
  heroImage: z.string().url(),
  images: z.array(z.string().url()),
  happyHours: HappyHoursSchema,
  deals: z.array(DealSchema),
  notes: z.array(z.string()),
  ratings: RestaurantRatingsSchema,
  verified: z.boolean(),
  createdBy: z.string().uuid(),
  lastUpdated: z.date(),
  createdAt: z.date(),
});

export const CitySchema = z.record(z.string(), z.array(RestaurantSchema));

export const StatesSchema = z.record(z.string(), CitySchema);

export const HappyHoursDataSchema = z.object({
  CO: CitySchema,
});

// User Profile Schema
export const UserProfileSchema = z.object({
  id: z.string().uuid(),
  full_name: z.string().nullable(),
  avatar_url: z.string().url().nullable(),
  role: z.enum(["user", "admin", "restaurant_owner"]),
  location: z.string().nullable(),
  preferences: z.record(z.string(), z.any()).optional(),
  created_at: z.date(),
  updated_at: z.date(),
});

export type HappyHourTime = z.infer<typeof HappyHourTimeSchema>;
export type HappyHours = z.infer<typeof HappyHoursSchema>;
export type Coordinates = z.infer<typeof CoordinatesSchema>;
export type Deal = z.infer<typeof DealSchema>;
export type RestaurantRatings = z.infer<typeof RestaurantRatingsSchema>;
export type Restaurant = z.infer<typeof RestaurantSchema>;
export type City = z.infer<typeof CitySchema>;
export type States = z.infer<typeof StatesSchema>;
export type HappyHoursData = z.infer<typeof HappyHoursDataSchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;