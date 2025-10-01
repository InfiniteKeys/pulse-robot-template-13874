-- Create table for storing Google Classroom announcements
CREATE TABLE public.classroom_announcements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  classroom_id TEXT NOT NULL,
  announcement_id TEXT NOT NULL UNIQUE,
  title TEXT,
  text TEXT,
  creator_name TEXT,
  creation_time TIMESTAMP WITH TIME ZONE,
  update_time TIMESTAMP WITH TIME ZONE,
  attachments JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for efficient querying by classroom
CREATE INDEX idx_classroom_announcements_classroom_id ON public.classroom_announcements(classroom_id);

-- Create index for sorting by creation time
CREATE INDEX idx_classroom_announcements_creation_time ON public.classroom_announcements(creation_time DESC);

-- Enable Row Level Security
ALTER TABLE public.classroom_announcements ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access (since this is public announcement feed)
CREATE POLICY "Announcements are publicly viewable" 
ON public.classroom_announcements 
FOR SELECT 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_classroom_announcements_updated_at
BEFORE UPDATE ON public.classroom_announcements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();