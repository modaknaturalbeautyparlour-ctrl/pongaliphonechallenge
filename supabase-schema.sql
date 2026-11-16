-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create contest_registrations table
CREATE TABLE IF NOT EXISTS public.contest_registrations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    registration_number TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    email TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT NOT NULL,
    consent_given BOOLEAN DEFAULT false,
    registration_status TEXT DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create registration_activity table
CREATE TABLE IF NOT EXISTS public.registration_activity (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    registration_id TEXT NOT NULL,
    activity_type TEXT NOT NULL,
    activity_description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_registrations_phone ON public.contest_registrations(phone_number);
CREATE INDEX IF NOT EXISTS idx_registrations_email ON public.contest_registrations(email);
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON public.contest_registrations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_registration_id ON public.registration_activity(registration_id);
CREATE INDEX IF NOT EXISTS idx_activity_created_at ON public.registration_activity(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.contest_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registration_activity ENABLE ROW LEVEL SECURITY;

-- RLS Policies for contest_registrations

-- Allow anonymous users to INSERT (for public registration)
CREATE POLICY "Allow public registration insert"
ON public.contest_registrations
FOR INSERT
TO anon
WITH CHECK (true);

-- Allow anonymous users to SELECT their own registration (optional)
CREATE POLICY "Allow public registration select"
ON public.contest_registrations
FOR SELECT
TO anon
USING (true);

-- Allow authenticated users (admins) full access
CREATE POLICY "Allow authenticated full access to registrations"
ON public.contest_registrations
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- RLS Policies for registration_activity

-- Allow anonymous users to INSERT (for activity tracking with consent)
CREATE POLICY "Allow public activity insert"
ON public.registration_activity
FOR INSERT
TO anon
WITH CHECK (true);

-- Allow authenticated users (admins) full access
CREATE POLICY "Allow authenticated full access to activity"
ON public.registration_activity
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Enable Realtime for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.contest_registrations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.registration_activity;

-- Create a function to prevent duplicate registrations
CREATE OR REPLACE FUNCTION check_duplicate_registration()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM public.contest_registrations 
        WHERE phone_number = NEW.phone_number OR email = NEW.email
    ) THEN
        RAISE EXCEPTION 'Phone number or email already registered';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for duplicate check (optional - can be handled in frontend too)
-- DROP TRIGGER IF EXISTS prevent_duplicate_registration ON public.contest_registrations;
-- CREATE TRIGGER prevent_duplicate_registration
-- BEFORE INSERT ON public.contest_registrations
-- FOR EACH ROW
-- EXECUTE FUNCTION check_duplicate_registration();
