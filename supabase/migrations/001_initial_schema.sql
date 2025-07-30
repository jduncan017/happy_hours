-- Enable PostGIS extension for geospatial queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE price_category AS ENUM ('1', '2', '3', '4');
CREATE TYPE deal_category AS ENUM ('food', 'drink', 'both');
CREATE TYPE day_of_week AS ENUM ('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun');

-- Create restaurants table
CREATE TABLE restaurants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    coordinates POINT,
    area VARCHAR(100),
    cuisine_type VARCHAR(100),
    price_category price_category DEFAULT '2',
    website TEXT,
    menu_url TEXT,
    hero_image TEXT NOT NULL DEFAULT '/photo-missing.webp',
    images TEXT[] DEFAULT '{}',
    happy_hours JSONB NOT NULL DEFAULT '{}',
    notes TEXT[] DEFAULT '{}',
    verified BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create deals table
CREATE TABLE deals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    category deal_category NOT NULL,
    days_applied day_of_week[] NOT NULL,
    time_start TIME,
    time_end TIME,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create restaurant_ratings table
CREATE TABLE restaurant_ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    food_rating DECIMAL(2,1) DEFAULT 0 CHECK (food_rating >= 0 AND food_rating <= 5),
    drink_rating DECIMAL(2,1) DEFAULT 0 CHECK (drink_rating >= 0 AND drink_rating <= 5),
    service_rating DECIMAL(2,1) DEFAULT 0 CHECK (service_rating >= 0 AND service_rating <= 5),
    atmosphere_rating DECIMAL(2,1) DEFAULT 0 CHECK (atmosphere_rating >= 0 AND atmosphere_rating <= 5),
    price_rating DECIMAL(2,1) DEFAULT 0 CHECK (price_rating >= 0 AND price_rating <= 5),
    overall_rating DECIMAL(2,1) DEFAULT 0 CHECK (overall_rating >= 0 AND overall_rating <= 5),
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(restaurant_id)
);

-- Create reviews table  
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    food_rating INTEGER CHECK (food_rating >= 1 AND food_rating <= 5),
    drink_rating INTEGER CHECK (drink_rating >= 1 AND drink_rating <= 5),
    service_rating INTEGER CHECK (service_rating >= 1 AND service_rating <= 5),
    atmosphere_rating INTEGER CHECK (atmosphere_rating >= 1 AND atmosphere_rating <= 5),
    price_rating INTEGER CHECK (price_rating >= 1 AND price_rating <= 5),
    review_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(restaurant_id, user_id)
);

-- Create restaurant_images table
CREATE TABLE restaurant_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    image_url TEXT NOT NULL,
    caption TEXT,
    image_category VARCHAR(50) DEFAULT 'general',
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create restaurant_submissions table for pending restaurants
CREATE TABLE restaurant_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submitted_by UUID NOT NULL REFERENCES auth.users(id),
    website_url TEXT,
    extracted_data JSONB,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ
);

-- Create edit_suggestions table for community editing
CREATE TABLE edit_suggestions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    suggested_by UUID NOT NULL REFERENCES auth.users(id),
    field_name VARCHAR(100) NOT NULL,
    current_value TEXT,
    suggested_value TEXT NOT NULL,
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ
);

-- Create indexes for performance
CREATE INDEX idx_restaurants_coordinates ON restaurants USING GIST(coordinates);
CREATE INDEX idx_restaurants_cuisine_type ON restaurants(cuisine_type);
CREATE INDEX idx_restaurants_price_category ON restaurants(price_category);
CREATE INDEX idx_restaurants_area ON restaurants(area);
CREATE INDEX idx_restaurants_verified ON restaurants(verified);
CREATE INDEX idx_deals_restaurant_id ON deals(restaurant_id);
CREATE INDEX idx_reviews_restaurant_id ON reviews(restaurant_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_restaurant_images_restaurant_id ON restaurant_images(restaurant_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_restaurants_updated_at BEFORE UPDATE ON restaurants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deals_updated_at BEFORE UPDATE ON deals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_restaurant_ratings_updated_at BEFORE UPDATE ON restaurant_ratings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();