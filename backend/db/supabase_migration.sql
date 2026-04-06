-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: hotels
CREATE TABLE IF NOT EXISTS public.hotels (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  hotel_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  phone_number TEXT,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies
-- Users can only view their own profile
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = user_id);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

-- Hotels RLS Policies
-- Users can only view their own hotel details
CREATE POLICY "Users can view own hotel" 
ON public.hotels FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.hotel_id = hotels.id
  )
);

-- Users can only update their own hotel details
CREATE POLICY "Users can update own hotel" 
ON public.hotels FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.hotel_id = hotels.id
  )
);

-- Note: Example RLS for other tables (e.g. price_update_logs, rooms, bookings)
-- ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Users can only interact with their hotel's rooms"
-- ON public.rooms FOR ALL USING (
--  EXISTS (
--    SELECT 1 FROM public.profiles
--    WHERE profiles.user_id = auth.uid()
--    AND profiles.hotel_id = rooms.hotel_id
--  )
-- );
