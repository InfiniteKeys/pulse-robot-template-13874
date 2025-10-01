-- Create club_stats table for managing homepage statistics
CREATE TABLE public.club_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  active_members INTEGER NOT NULL DEFAULT 8,
  competitions INTEGER NOT NULL DEFAULT 0,
  awards_won INTEGER NOT NULL DEFAULT 0,
  years_running TEXT NOT NULL DEFAULT '1st',
  success_rate TEXT NOT NULL DEFAULT '100%',
  weekly_sessions INTEGER NOT NULL DEFAULT 2,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.club_stats ENABLE ROW LEVEL SECURITY;

-- Create policies for public viewing
CREATE POLICY "Stats are viewable by everyone" 
ON public.club_stats 
FOR SELECT 
USING (true);

-- Create policies for admin management
CREATE POLICY "Admins can insert stats" 
ON public.club_stats 
FOR INSERT 
WITH CHECK (is_admin_or_overseer());

CREATE POLICY "Admins can update stats" 
ON public.club_stats 
FOR UPDATE 
USING (is_admin_or_overseer());

CREATE POLICY "Admins can delete stats" 
ON public.club_stats 
FOR DELETE 
USING (is_admin_or_overseer());

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_club_stats_updated_at
BEFORE UPDATE ON public.club_stats
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();