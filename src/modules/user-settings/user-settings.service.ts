import { createClient } from '@/services/supabase/server';

import { USER_SETTINGS_TABLE_NAME } from './user-settings.const';
import type { UserSettings } from './user-settings.types';

export const getUserSettings = async (
  userId: string,
): Promise<UserSettings> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from(USER_SETTINGS_TABLE_NAME)
    .select('*')
    .eq('user_id', userId)
    .single();

  if (!data || error) {
    throw new Error(error?.message || "Couldn't fetch user settings");
  }

  return data;
};

export const completeUserProfile = async (
  userId: string,
  profileData: { name: string; native_language: string },
): Promise<UserSettings> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from(USER_SETTINGS_TABLE_NAME)
    .update({
      name: profileData.name,
      native_language: profileData.native_language,
    })
    .eq('user_id', userId)
    .select()
    .single();

  if (!data || error) {
    throw new Error(error?.message || "Couldn't update user settings");
  }

  return data;
};
