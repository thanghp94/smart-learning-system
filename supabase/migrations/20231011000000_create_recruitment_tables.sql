
-- Create recruitment status enumeration
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'recruitment_status'
  ) THEN
    CREATE TYPE public.recruitment_status AS ENUM (
      'new_application',
      'cv_reviewing',
      'interview_scheduled',
      'passed_interview',
      'offer_sent',
      'hired',
      'rejected'
    );
  END IF;
END
$$;

-- Create candidates table
CREATE TABLE IF NOT EXISTS public.candidates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  birth_date DATE,
  gender TEXT,
  cv_path TEXT,
  linkedin_url TEXT,
  portfolio_url TEXT,
  current_status recruitment_status DEFAULT 'new_application',
  current_position TEXT,
  years_of_experience NUMERIC,
  education_level TEXT,
  skills TEXT[],
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create recruitment stages table (for tracking candidate progress)
CREATE TABLE IF NOT EXISTS public.recruitment_stages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidate_id UUID REFERENCES public.candidates(id) ON DELETE CASCADE,
  status recruitment_status NOT NULL,
  start_date TIMESTAMPTZ DEFAULT now(),
  end_date TIMESTAMPTZ,
  feedback TEXT,
  score NUMERIC,
  interviewer_id UUID REFERENCES public.employees(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create recruitment positions table
CREATE TABLE IF NOT EXISTS public.recruitment_positions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  requirements TEXT,
  is_active BOOLEAN DEFAULT true,
  facility_id UUID REFERENCES public.facilities(id),
  department TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create applications table (connecting candidates to positions)
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidate_id UUID REFERENCES public.candidates(id) ON DELETE CASCADE,
  position_id UUID REFERENCES public.recruitment_positions(id) ON DELETE CASCADE,
  status recruitment_status DEFAULT 'new_application',
  applied_date TIMESTAMPTZ DEFAULT now(),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recruitment_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recruitment_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Create policies for candidates
CREATE POLICY "Users can view candidates"
  ON public.candidates FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create candidates"
  ON public.candidates FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update candidates"
  ON public.candidates FOR UPDATE
  TO authenticated
  USING (true);

-- Create policies for recruitment stages
CREATE POLICY "Users can view recruitment stages"
  ON public.recruitment_stages FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create recruitment stages"
  ON public.recruitment_stages FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update recruitment stages"
  ON public.recruitment_stages FOR UPDATE
  TO authenticated
  USING (true);

-- Create policies for recruitment positions
CREATE POLICY "Users can view recruitment positions"
  ON public.recruitment_positions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create recruitment positions"
  ON public.recruitment_positions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update recruitment positions"
  ON public.recruitment_positions FOR UPDATE
  TO authenticated
  USING (true);

-- Create policies for applications
CREATE POLICY "Users can view applications"
  ON public.applications FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create applications"
  ON public.applications FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update applications"
  ON public.applications FOR UPDATE
  TO authenticated
  USING (true);

-- Create trigger to update updated_at on all tables
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now(); 
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_candidates_timestamp
BEFORE UPDATE ON candidates
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recruitment_stages_timestamp
BEFORE UPDATE ON recruitment_stages
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recruitment_positions_timestamp
BEFORE UPDATE ON recruitment_positions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_timestamp
BEFORE UPDATE ON applications
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create view to join candidates with their current stage and position
CREATE OR REPLACE VIEW candidates_with_details AS
SELECT 
  c.*,
  p.title AS position_title,
  p.department,
  a.status AS application_status,
  a.applied_date
FROM 
  candidates c
LEFT JOIN 
  applications a ON c.id = a.candidate_id
LEFT JOIN 
  recruitment_positions p ON a.position_id = p.id;
