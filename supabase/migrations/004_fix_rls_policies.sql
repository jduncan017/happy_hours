-- Fix RLS policies to allow service role access for API operations

-- Add policy for service role to insert restaurants
CREATE POLICY "Service role can insert restaurants" ON restaurants
    FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Add policy for service role to update restaurants  
CREATE POLICY "Service role can update restaurants" ON restaurants
    FOR UPDATE USING (auth.role() = 'service_role');

-- Add policy for service role to delete restaurants
CREATE POLICY "Service role can delete restaurants" ON restaurants
    FOR DELETE USING (auth.role() = 'service_role');

-- Add similar policies for deals table
CREATE POLICY "Service role can manage deals" ON deals
    FOR ALL USING (auth.role() = 'service_role');

-- Add policy for service role to manage restaurant ratings
CREATE POLICY "Service role can manage restaurant ratings" ON restaurant_ratings
    FOR ALL USING (auth.role() = 'service_role');