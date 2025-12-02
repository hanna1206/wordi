import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Check if user has completed onboarding
 * This is a lightweight function designed for middleware (Edge runtime)
 * Uses Supabase client directly instead of Drizzle (not available in Edge runtime)
 */
export const checkOnboardingComplete = async (
  supabase: SupabaseClient,
  userId: string,
): Promise<boolean> => {
  const { data: userSettings } = await supabase
    .from('user_settings')
    .select('name, native_language')
    .eq('user_id', userId)
    .single();

  return !!(userSettings?.name && userSettings?.native_language);
};
