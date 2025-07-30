export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      restaurants: {
        Row: {
          id: string
          name: string
          address: string
          coordinates: [number, number] | null
          area: string | null
          cuisine_type: string | null
          price_category: '1' | '2' | '3' | '4' | null
          website: string | null
          menu_url: string | null
          hero_image: string
          images: string[]
          happy_hours: Json
          notes: string[]
          verified: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          address: string
          coordinates?: [number, number] | null
          area?: string | null
          cuisine_type?: string | null
          price_category?: '1' | '2' | '3' | '4' | null
          website?: string | null
          menu_url?: string | null
          hero_image?: string
          images?: string[]
          happy_hours?: Json
          notes?: string[]
          verified?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string
          coordinates?: [number, number] | null
          area?: string | null
          cuisine_type?: string | null
          price_category?: '1' | '2' | '3' | '4' | null
          website?: string | null
          menu_url?: string | null
          hero_image?: string
          images?: string[]
          happy_hours?: Json
          notes?: string[]
          verified?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      deals: {
        Row: {
          id: string
          restaurant_id: string
          description: string
          category: 'food' | 'drink' | 'both'
          days_applied: ('Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun')[]
          time_start: string | null
          time_end: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          description: string
          category: 'food' | 'drink' | 'both'
          days_applied: ('Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun')[]
          time_start?: string | null
          time_end?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          description?: string
          category?: 'food' | 'drink' | 'both'
          days_applied?: ('Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun')[]
          time_start?: string | null
          time_end?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      restaurant_ratings: {
        Row: {
          id: string
          restaurant_id: string
          food_rating: number
          drink_rating: number
          service_rating: number
          atmosphere_rating: number
          price_rating: number
          overall_rating: number
          review_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          food_rating?: number
          drink_rating?: number
          service_rating?: number
          atmosphere_rating?: number
          price_rating?: number
          overall_rating?: number
          review_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          food_rating?: number
          drink_rating?: number
          service_rating?: number
          atmosphere_rating?: number
          price_rating?: number
          overall_rating?: number
          review_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          restaurant_id: string
          user_id: string
          food_rating: number | null
          drink_rating: number | null
          service_rating: number | null
          atmosphere_rating: number | null
          price_rating: number | null
          review_text: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          user_id: string
          food_rating?: number | null
          drink_rating?: number | null
          service_rating?: number | null
          atmosphere_rating?: number | null
          price_rating?: number | null
          review_text?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          user_id?: string
          food_rating?: number | null
          drink_rating?: number | null
          service_rating?: number | null
          atmosphere_rating?: number | null
          price_rating?: number | null
          review_text?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}