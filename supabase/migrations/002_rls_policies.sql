-- Enable RLS on all tables
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE edit_suggestions ENABLE ROW LEVEL SECURITY;

-- Restaurants policies
CREATE POLICY "Restaurants are viewable by everyone" ON restaurants
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert restaurants" ON restaurants
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own restaurants" ON restaurants
    FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Restaurant owners can update their verified restaurants" ON restaurants
    FOR UPDATE USING (verified = true AND auth.uid() = created_by);

-- Deals policies
CREATE POLICY "Deals are viewable by everyone" ON deals
    FOR SELECT USING (true);

CREATE POLICY "Restaurant creators can manage deals" ON deals
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM restaurants 
            WHERE restaurants.id = deals.restaurant_id 
            AND restaurants.created_by = auth.uid()
        )
    );

-- Restaurant ratings policies (public read, system managed)
CREATE POLICY "Restaurant ratings are viewable by everyone" ON restaurant_ratings
    FOR SELECT USING (true);

-- Reviews policies
CREATE POLICY "Reviews are viewable by everyone" ON reviews
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert reviews" ON reviews
    FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" ON reviews
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" ON reviews
    FOR DELETE USING (auth.uid() = user_id);

-- Restaurant images policies
CREATE POLICY "Restaurant images are viewable by everyone" ON restaurant_images
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can upload images" ON restaurant_images
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own images" ON restaurant_images
    FOR UPDATE USING (auth.uid() = user_id);

-- Restaurant submissions policies
CREATE POLICY "Users can view their own submissions" ON restaurant_submissions
    FOR SELECT USING (auth.uid() = submitted_by);

CREATE POLICY "Authenticated users can create submissions" ON restaurant_submissions
    FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = submitted_by);

CREATE POLICY "Users can update their pending submissions" ON restaurant_submissions
    FOR UPDATE USING (auth.uid() = submitted_by AND status = 'pending');

-- Edit suggestions policies
CREATE POLICY "Edit suggestions are viewable by everyone" ON edit_suggestions
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create suggestions" ON edit_suggestions
    FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = suggested_by);

CREATE POLICY "Users can update their own suggestions" ON edit_suggestions
    FOR UPDATE USING (auth.uid() = suggested_by AND status = 'pending');