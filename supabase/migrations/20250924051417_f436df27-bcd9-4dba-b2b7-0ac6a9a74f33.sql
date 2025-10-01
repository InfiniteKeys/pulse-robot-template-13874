-- Add new enum values in separate statements
ALTER TYPE public.app_role ADD VALUE 'overseer';
COMMIT;

ALTER TYPE public.app_role ADD VALUE 'editor';
COMMIT;