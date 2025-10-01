-- Replace the overly permissive "Users can view all profiles" policy
-- with more secure policies that maintain functionality

-- First, drop the existing overly permissive policy
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Allow users to view their own profile (needed for AuthProvider)
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Allow overseers to view all profiles (needed for UserManagement)
CREATE POLICY "Overseers can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (has_role(auth.uid(), 'overseer'::app_role));