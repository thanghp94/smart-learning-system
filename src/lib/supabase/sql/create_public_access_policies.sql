
-- Drop existing RLS policies on classes if any exist
DROP POLICY IF EXISTS "Allow public access to classes" ON public.classes;

-- Add public access policy to classes table
CREATE POLICY "Allow public access to classes"
ON public.classes
FOR ALL
USING (true)
WITH CHECK (true);

-- Drop existing RLS policies on students if any exist
DROP POLICY IF EXISTS "Allow public access to students" ON public.students;

-- Add public access policy to students table
CREATE POLICY "Allow public access to students"
ON public.students
FOR ALL
USING (true)
WITH CHECK (true);

-- Make sure RLS is enabled for these tables (it's required for the policies to take effect)
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
