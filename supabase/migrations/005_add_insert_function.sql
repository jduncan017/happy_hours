-- Create function to insert restaurant with PostGIS coordinates
CREATE OR REPLACE FUNCTION insert_restaurant_with_coordinates(
  p_name text,
  p_address text,
  p_area text,
  p_cuisine_type text,
  p_price_category text,
  p_lng numeric,
  p_lat numeric,
  p_website text DEFAULT NULL,
  p_hero_image text DEFAULT NULL,
  p_images text[] DEFAULT NULL,
  p_happy_hours jsonb DEFAULT NULL,
  p_notes text DEFAULT NULL,
  p_verified boolean DEFAULT false
) RETURNS TABLE(
  id uuid,
  name text,
  address text,
  area text,
  cuisine_type text,
  price_category text,
  website text,
  hero_image text,
  images text[],
  happy_hours jsonb,
  notes text,
  verified boolean,
  coordinates geometry,
  created_at timestamptz,
  updated_at timestamptz
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  INSERT INTO restaurants (
    name,
    address,
    area,
    cuisine_type,
    price_category,
    website,
    hero_image,
    images,
    happy_hours,
    notes,
    verified,
    coordinates
  ) VALUES (
    p_name,
    p_address,
    p_area,
    p_cuisine_type,
    p_price_category::price_category_enum,
    p_website,
    p_hero_image,
    p_images,
    p_happy_hours,
    p_notes,
    p_verified,
    ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)
  ) RETURNING
    restaurants.id,
    restaurants.name,
    restaurants.address,
    restaurants.area,
    restaurants.cuisine_type,
    restaurants.price_category,
    restaurants.website,
    restaurants.hero_image,
    restaurants.images,
    restaurants.happy_hours,
    restaurants.notes,
    restaurants.verified,
    restaurants.coordinates,
    restaurants.created_at,
    restaurants.updated_at;
END;
$$;

-- Grant execution permission to authenticated and service roles
GRANT EXECUTE ON FUNCTION insert_restaurant_with_coordinates TO authenticated, service_role;