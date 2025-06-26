
-- Drop existing RLS policies on facilities if any exist
DROP POLICY IF EXISTS "Allow public access to facilities" ON public.facilities;

-- Add public access policy to facilities table
CREATE POLICY "Allow public access to facilities"
ON public.facilities
FOR ALL
USING (true)
WITH CHECK (true);

-- Ensure RLS is enabled for the facilities table
ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;

-- Drop existing RLS policies on classes if any exist
DROP POLICY IF EXISTS "Allow public access to classes" ON public.classes;

-- Add public access policy to classes table
CREATE POLICY "Allow public access to classes"
ON public.classes
FOR ALL
USING (true)
WITH CHECK (true);

-- Ensure RLS is enabled for the classes table
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;

-- Drop existing RLS policies on students if any exist
DROP POLICY IF EXISTS "Allow public access to students" ON public.students;

-- Add public access policy to students table
CREATE POLICY "Allow public access to students"
ON public.students
FOR ALL
USING (true)
WITH CHECK (true);

-- Ensure RLS is enabled for the students table
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
