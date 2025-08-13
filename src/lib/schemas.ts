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

// Restaurant Submission Schemas
export const RestaurantSubmissionSchema = z.object({
  id: z.string().uuid(),
  submitted_by: z.string().uuid(),
  website_url: z.string().url().optional(),
  extracted_data: z.record(z.string(), z.any()).optional(),
  status: z.enum(["pending", "approved", "rejected"]).default("pending"),
  admin_notes: z.string().optional(),
  created_at: z.date(),
  reviewed_at: z.date().optional(),
});

// For creating new submissions
export const CreateSubmissionSchema = z.object({
  manual_data: z.object({
    name: z.string().min(1, "Restaurant name is required"),
    address: z.string().min(1, "Address is required"),
    area: z.string().optional(),
    cuisine_type: z.string().optional(),
    website: z.string().url().optional(),
    menu_url: z.string().url("Please enter a valid menu URL").min(1, "Menu URL is required"),
    phone: z.string().optional(),
    happy_hour_times: z.record(z.string(), z.array(z.object({
      start_time: z.string().min(1, "Start time is required"),
      end_time: z.string().min(1, "End time is required"),
    }))).refine((times) => Object.keys(times).length > 0, {
      message: "Please add at least one day with happy hour times"
    }),
    notes: z.array(z.string()).optional(),
  }),
  submission_notes: z.string().max(500, "Notes must be less than 500 characters").optional(),
});

// For admin review
export const ReviewSubmissionSchema = z.object({
  status: z.enum(["approved", "rejected"]),
  admin_notes: z.string().optional(),
  edited_data: z.record(z.string(), z.any()).optional(),
});

export type RestaurantSubmission = z.infer<typeof RestaurantSubmissionSchema>;
export type CreateSubmission = z.infer<typeof CreateSubmissionSchema>;
export type ReviewSubmission = z.infer<typeof ReviewSubmissionSchema>;