-- Create a trigger function to automatically assign overseer role to new admin users
CREATE OR REPLACE FUNCTION public.handle_new_admin_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create basic profile
  INSERT INTO public.profiles (user_id, display_name, full_name)
  VALUES (new.id, COALESCE(new.raw_user_meta_data ->> 'display_name', 'Admin User'), COALESCE(new.raw_user_meta_data ->> 'full_name', 'Admin User'));
  
  -- Assign overseer role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'overseer'::app_role);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to automatically assign overseer role when admin users confirm their email
CREATE TRIGGER on_admin_user_confirmed
  AFTER UPDATE OF email_confirmed_at ON auth.users
  FOR EACH ROW
  WHEN (old.email_confirmed_at IS NULL AND new.email_confirmed_at IS NOT NULL)
  EXECUTE FUNCTION public.handle_new_admin_user();