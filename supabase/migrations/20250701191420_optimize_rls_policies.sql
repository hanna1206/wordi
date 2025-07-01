-- Optimize RLS policies for better performance
-- Replace auth.uid() with (select auth.uid()) to avoid re-evaluation for each row

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;

-- Create optimized policies
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING ((select auth.uid()) = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING ((select auth.uid()) = id); 