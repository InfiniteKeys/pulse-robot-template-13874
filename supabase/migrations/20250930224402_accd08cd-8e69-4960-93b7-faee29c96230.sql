-- Drop remaining admin-related functions and triggers
DROP FUNCTION IF EXISTS public.handle_new_admin_user() CASCADE;
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;
DROP FUNCTION IF EXISTS public.is_overseer() CASCADE;
DROP FUNCTION IF EXISTS public.get_user_display_name(uuid) CASCADE;