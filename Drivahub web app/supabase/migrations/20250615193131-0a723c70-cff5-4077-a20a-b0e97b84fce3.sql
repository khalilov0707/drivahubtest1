
-- Create statements table
CREATE TABLE public.statements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  date DATE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  miles INTEGER NOT NULL,
  deadhead_miles INTEGER,
  type TEXT NOT NULL CHECK (type IN ('regular', 'deadhead')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create loads table
CREATE TABLE public.loads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  pickup TEXT NOT NULL,
  dropoff TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  date DATE NOT NULL,
  miles INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS) for statements
ALTER TABLE public.statements ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for statements
CREATE POLICY "Users can view their own statements" 
  ON public.statements 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own statements" 
  ON public.statements 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own statements" 
  ON public.statements 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own statements" 
  ON public.statements 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Enable Row Level Security (RLS) for loads
ALTER TABLE public.loads ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for loads
CREATE POLICY "Users can view their own loads" 
  ON public.loads 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own loads" 
  ON public.loads 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own loads" 
  ON public.loads 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own loads" 
  ON public.loads 
  FOR DELETE 
  USING (auth.uid() = user_id);
