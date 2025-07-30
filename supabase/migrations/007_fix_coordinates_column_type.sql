-- Fix coordinates column type to be compatible with PostGIS
-- Change from POINT to geometry(Point, 4326) for proper PostGIS support

ALTER TABLE restaurants 
ALTER COLUMN coordinates TYPE geometry(Point, 4326) USING coordinates::geometry;