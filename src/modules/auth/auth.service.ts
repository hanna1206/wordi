import type { User } from '@supabase/supabase-js';

import { createClient } from '@/services/supabase/server';

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

export const getAuthenticatedUser = async (): Promise<AuthResult> => {
  try {
    const supabase = await createClient();

    const {
      data: { user: user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: 'Authentication required',
      };
    }

    return {
      success: true,
      user,
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auth error:', error);
    return {
      success: false,
      error: 'Authentication failed',
    };
  }
};
