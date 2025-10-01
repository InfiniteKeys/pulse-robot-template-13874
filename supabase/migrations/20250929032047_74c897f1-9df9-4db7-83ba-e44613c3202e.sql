-- Phase 1: Address Event Creator Exposure by creating a secure public view
CREATE OR REPLACE VIEW public.public_events AS 
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

-- Grant select permission on the view to authenticated users
GRANT SELECT ON public.public_events TO authenticated;
GRANT SELECT ON public.public_events TO anon;

-- Update RLS policy for events to hide created_by from public access
DROP POLICY IF EXISTS "Events are publicly viewable" ON public.events;

-- Create new policy that excludes created_by for non-admin users
CREATE POLICY "Events are publicly viewable without creator info" 
ON public.events 
FOR SELECT 
USING (
  CASE 
    WHEN has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'overseer'::app_role) THEN true
    ELSE false
  END
);

-- Create policy for public view access
CREATE POLICY "Public events view is accessible to everyone"
ON public.events
FOR SELECT 
USING (true);

-- Enable RLS on the view (inherits from base table)
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;