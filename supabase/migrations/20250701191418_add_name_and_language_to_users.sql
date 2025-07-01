-- Add name and native_language columns to users table
ALTER TABLE public.users 
ADD COLUMN name TEXT,
ADD COLUMN native_language TEXT CHECK (native_language IN ('russian', 'english', 'ukrainian'));

-- Update the handle_new_user function to extract data from auth.users metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, native_language)
  VALUES (
    NEW.id, 
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NULL),
    COALESCE(NEW.raw_user_meta_data->>'nativeLanguage', NULL)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
