-- Fix the profiles INSERT policy to allow authenticated users to create their own profile
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Also ensure we have a proper policy for UPSERTs
CREATE POLICY "Users can upsert their own profile" 
ON public.profiles 
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);