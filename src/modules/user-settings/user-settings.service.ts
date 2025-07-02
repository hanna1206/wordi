import { createClient } from '@/services/supabase/server';
import type { ActionResult } from '@/shared-types';

import { USER_SETTINGS_TABLE_NAME } from './user-settings.const';
import type { UserSettings } from './user-settings.types';

export const getUserSettings = async (
  userId: string,
): Promise<ActionResult<UserSettings>> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from(USER_SETTINGS_TABLE_NAME)
    .select('*')
    .eq('user_id', userId)
    .single();

  if (!data || error) {
    return {
      success: false,
      error: error?.message || "Couldn't fetch user settings",
    };
  }

  return {
    success: true,
    data,
  };
};
