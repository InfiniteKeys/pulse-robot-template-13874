-- Add missing columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS display_name TEXT,
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS grade TEXT,
ADD COLUMN IF NOT EXISTS why_join_club TEXT,
ADD COLUMN IF NOT EXISTS available_thursdays BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS interested_competitions TEXT[],
ADD COLUMN IF NOT EXISTS accessibility_needs TEXT,
ADD COLUMN IF NOT EXISTS interested_interschool BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS preferred_prizes TEXT[],
ADD COLUMN IF NOT EXISTS previous_experience TEXT,
ADD COLUMN IF NOT EXISTS recent_math_grade TEXT,
ADD COLUMN IF NOT EXISTS agreed_to_rules BOOLEAN DEFAULT false;