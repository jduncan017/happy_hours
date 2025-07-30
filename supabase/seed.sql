-- Seed data for local development
-- This file runs after migrations when using `supabase db reset`

-- Insert sample restaurants (using some from your existing data)
INSERT INTO restaurants (
    id,
    name,
    address,
    coordinates,
    area,
    cuisine_type,
    price_category,
    website,
    hero_image,
    happy_hours,
    notes,
    verified,
    created_by
) VALUES 
(
    uuid_generate_v4(),
    'Wild Taco',
    '215 E 7th Ave',
    ST_SetSRID(ST_MakePoint(-104.9806, 39.7259), 4326),
    'Capitol Hill',
    'Mexican',
    '2',
    'https://www.wildtacodenver.com/govs-park-menus/#happy-hour-govs-park-menus',
    '/photo-missing.webp',
    '{
        "Mon": [{"Start": "15:00", "End": "18:00"}],
        "Tue": [{"Start": "15:00", "End": "18:00"}],
        "Wed": [{"Start": "15:00", "End": "18:00"}],
        "Thu": [{"Start": "15:00", "End": "18:00"}],
        "Fri": [{"Start": "15:00", "End": "18:00"}]
    }',
    '{"Tue - Taco Tuesday", "https://www.wildtacodenver.com/event/taco-tuesday/"}',
    false,
    NULL
),
(
    uuid_generate_v4(),
    'Alma Fonda Fina',
    '2556 15th St, Denver, CO 80211',
    ST_SetSRID(ST_MakePoint(-105.0078, 39.7547), 4326),
    'LoHi',
    'Mexican',
    '3',
    'https://static1.squarespace.com/static/655aca2b4dc5be7809bed8ab/t/67450f1d594da52685b62f0b/1732579101330/ALMA_HH+Menu+July+%28resized%29+%281%29.pdf',
    '/photo-missing.webp',
    '{
        "Mon": [{"Start": "14:00", "End": "17:00"}],
        "Tue": [{"Start": "14:00", "End": "17:00"}],
        "Wed": [{"Start": "14:00", "End": "17:00"}],
        "Thu": [{"Start": "14:00", "End": "17:00"}],
        "Fri": [{"Start": "14:00", "End": "17:00"}]
    }',
    '{}',
    false,
    NULL
),
(
    uuid_generate_v4(),
    'Blue Sushi Sake Grill',
    '1616 16th St',
    ST_SetSRID(ST_MakePoint(-105.0006, 39.7525), 4326),
    'Union Station',
    'Japanese',
    '3',
    'https://www.bluesushisakegrill.com/menus/happy-hour',
    '/photo-missing.webp',
    '{
        "Sun": [{"Start": "12:00", "End": "21:00"}],
        "Mon": [{"Start": "14:00", "End": "17:30"}],
        "Tue": [{"Start": "14:00", "End": "17:30"}],
        "Wed": [{"Start": "14:00", "End": "17:30"}],
        "Thu": [{"Start": "14:00", "End": "17:30"}],
        "Fri": [{"Start": "14:00", "End": "17:30"}]
    }',
    '{}',
    false,
    NULL
);

-- Insert some sample deals
INSERT INTO deals (restaurant_id, description, category, days_applied, time_start, time_end)
SELECT 
    r.id,
    '$5 Happy Hour Tacos',
    'food',
    ARRAY['Mon', 'Tue', 'Wed', 'Thu', 'Fri']::day_of_week[],
    '15:00'::time,
    '18:00'::time
FROM restaurants r WHERE r.name = 'Wild Taco';

INSERT INTO deals (restaurant_id, description, category, days_applied, time_start, time_end)
SELECT 
    r.id,
    '$6 Specialty Cocktails',
    'drink',
    ARRAY['Mon', 'Tue', 'Wed', 'Thu', 'Fri']::day_of_week[],
    '14:00'::time,
    '17:00'::time
FROM restaurants r WHERE r.name = 'Alma Fonda Fina';

-- Insert default ratings for each restaurant
INSERT INTO restaurant_ratings (restaurant_id, food_rating, drink_rating, service_rating, atmosphere_rating, price_rating, overall_rating, review_count)
SELECT 
    id,
    0.0,
    0.0, 
    0.0,
    0.0,
    0.0,
    0.0,
    0
FROM restaurants;

-- Note: This is sample data for local development only
-- Production data should be migrated using the migration scripts