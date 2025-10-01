-- Add comprehensive profile fields for student registration
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS grade INTEGER CHECK (grade >= 9 AND grade <= 12);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS why_join_club TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS available_thursdays BOOLEAN;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS interested_competitions BOOLEAN;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS accessibility_needs TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS interested_interschool TEXT CHECK (interested_interschool IN ('yes', 'no', 'not sure'));
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS preferred_prizes TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS previous_experience TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS recent_math_grade TEXT CHECK (recent_math_grade IN ('90 - 100%', '75 - 89%', '60 - 74%', 'Below 60%'));
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS agreed_to_rules BOOLEAN DEFAULT FALSE;

-- Update existing profiles with default full_name from display_name or email
UPDATE public.profiles 
SET full_name = COALESCE(display_name, 'Unknown User') 
WHERE full_name IS NULL;

-- Now make full_name required for new profiles
ALTER TABLE public.profiles ALTER COLUMN full_name SET NOT NULL;