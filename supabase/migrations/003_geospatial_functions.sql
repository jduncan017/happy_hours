-- Create function to find restaurants within radius
CREATE OR REPLACE FUNCTION restaurants_within_radius(
    center_lat FLOAT,
    center_lng FLOAT,
    radius_meters FLOAT
)
RETURNS TABLE (
    id UUID,
    name VARCHAR(255),
    address TEXT,
    coordinates POINT,
    area VARCHAR(100),
    cuisine_type VARCHAR(100),
    price_category price_category,
    website TEXT,
    menu_url TEXT,
    hero_image TEXT,
    images TEXT[],
    happy_hours JSONB,
    notes TEXT[],
    verified BOOLEAN,
    created_by UUID,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    distance_meters FLOAT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.id,
        r.name,
        r.address,
        r.coordinates,
        r.area,
        r.cuisine_type,
        r.price_category,
        r.website,
        r.menu_url,
        r.hero_image,
        r.images,
        r.happy_hours,
        r.notes,
        r.verified,
        r.created_by,
        r.created_at,
        r.updated_at,
        ST_Distance(
            ST_Transform(ST_SetSRID(ST_MakePoint(center_lng, center_lat), 4326), 3857),
            ST_Transform(r.coordinates, 3857)
        ) as distance_meters
    FROM restaurants r
    WHERE r.coordinates IS NOT NULL
    AND ST_DWithin(
        ST_Transform(ST_SetSRID(ST_MakePoint(center_lng, center_lat), 4326), 3857),
        ST_Transform(r.coordinates, 3857),
        radius_meters
    )
    ORDER BY distance_meters;
END;
$$ LANGUAGE plpgsql;