-- Create user profiles table
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'restaurant_owner')),
    location TEXT,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, full_name)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NULL)
    );
    RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
CREATE TRIGGER create_user_profile_trigger
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION create_user_profile();

-- Add admin role function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = user_id AND role = 'admin'
    );
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Add function to check if user is restaurant owner
CREATE OR REPLACE FUNCTION is_restaurant_owner(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = user_id AND role IN ('restaurant_owner', 'admin')
    );
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Add RLS policies for user_profiles table
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view their own profile" ON user_profiles
    FOR SELECT USING (id = auth.uid());

-- Users can update their own profile (except role)
CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR UPDATE USING (id = auth.uid())
    WITH CHECK (
        id = auth.uid() AND
        -- Prevent users from changing their own role
        role = (SELECT role FROM user_profiles WHERE id = auth.uid())
    );

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON user_profiles
    FOR SELECT USING (is_admin(auth.uid()));

-- Admins can update any profile
CREATE POLICY "Admins can update any profile" ON user_profiles
    FOR UPDATE USING (is_admin(auth.uid()));

-- Create trigger for updated_at on user_profiles
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to promote user to admin (can only be called with service role)
CREATE OR REPLACE FUNCTION promote_user_to_admin(target_user_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    target_user_id UUID;
BEGIN
    -- Find user by email
    SELECT id INTO target_user_id
    FROM auth.users
    WHERE email = target_user_email;
    
    IF target_user_id IS NULL THEN
        RAISE EXCEPTION 'User not found with email: %', target_user_email;
    END IF;
    
    -- Update user role to admin
    UPDATE user_profiles
    SET role = 'admin', updated_at = NOW()
    WHERE id = target_user_id;
    
    RETURN TRUE;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Add index for user_profiles role for performance
CREATE INDEX idx_user_profiles_role ON user_profiles(role);