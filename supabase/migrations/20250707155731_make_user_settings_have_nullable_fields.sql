-- Make user_settings fields nullable for progressive onboarding
-- This allows users to sign up with minimal information and complete their profile later

-- Make name and native_language nullable
ALTER TABLE public.user_settings 
ALTER COLUMN name DROP NOT NULL,
ALTER COLUMN native_language DROP NOT NULL;

-- Update the auto-create user profile function to not set defaults
-- Users will complete their profile during onboarding flow
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_settings (user_id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Note: The trigger 'on_auth_user_created' remains the same
-- It will continue to auto-create user_settings rows, but now with minimal data
