-- Update coordinate function to work with geometry column type
CREATE OR REPLACE FUNCTION update_restaurant_coordinates(
  restaurant_id uuid,
  lng numeric,
  lat numeric
) RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  UPDATE restaurants 
  SET coordinates = ST_SetSRID(ST_MakePoint(lng, lat), 4326)
  WHERE id = restaurant_id;
END;
$$;

-- Grant execution permission to authenticated and service roles  
GRANT EXECUTE ON FUNCTION update_restaurant_coordinates TO authenticated, service_role;