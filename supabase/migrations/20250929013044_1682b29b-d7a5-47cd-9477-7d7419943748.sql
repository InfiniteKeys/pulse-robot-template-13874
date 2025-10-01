-- Create trigger for new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, full_name)
  VALUES (new.id, COALESCE(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)), COALESCE(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)));
  RETURN new;
END;
$$;

-- Create trigger for admin user signup (for /admin route)
CREATE OR REPLACE FUNCTION public.handle_new_admin_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create basic profile
  INSERT INTO public.profiles (user_id, display_name, full_name)
  VALUES (new.id, COALESCE(new.raw_user_meta_data ->> 'display_name', 'Admin User'), COALESCE(new.raw_user_meta_data ->> 'full_name', 'Admin User'));
  
  -- Assign overseer role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'overseer'::app_role);
  
  RETURN new;
END;
$$;

-- Create the trigger that fires on user creation
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();