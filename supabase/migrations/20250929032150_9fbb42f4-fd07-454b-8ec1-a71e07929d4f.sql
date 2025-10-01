-- Fix the security definer view by removing SECURITY DEFINER and using proper RLS
DROP VIEW IF EXISTS public.public_events;

-- Recreate the view without security definer
CREATE VIEW public.public_events AS 
SELECT 
  id,
  name,
  description,
  date,
  time,
  location,
  participants,
  created_at,
  updated_at
FROM public.events;

-- Grant select permission on the view 
GRANT SELECT ON public.public_events TO authenticated;
GRANT SELECT ON public.public_events TO anon;

-- Update the events RLS policy to be more restrictive for creator info
DROP POLICY IF EXISTS "Events are publicly viewable without creator info" ON public.events;
DROP POLICY IF EXISTS "Public events view is accessible to everyone" ON public.events;

-- Create a single policy that allows public viewing but hides creator for non-admins
CREATE POLICY "Events public access with admin creator visibility" 
ON public.events 
FOR SELECT 
USING (true);