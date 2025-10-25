import type { User } from '@supabase/supabase-js';

import { environment } from '@/config/environment.config';
import { createClient } from '@/services/supabase/server';
import type { ActionResult } from '@/shared-types';

interface AuthResult {
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

export const logoutService = async (): Promise<ActionResult<void>> => {
  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return { success: true };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Logout error:', error);
    return {
      success: false,
      error: 'Failed to logout',
    };
  }
};

export const requestPasswordResetService = async (
  email: string,
): Promise<ActionResult<void>> => {
  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${environment.appUrl}/auth/reset-password`,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return { success: true };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Request password reset error:', error);
    return {
      success: false,
      error: 'Failed to request password reset',
    };
  }
};

export const updatePasswordService = async (
  password: string,
): Promise<ActionResult<void>> => {
  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return { success: true };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Update password error:', error);
    return {
      success: false,
      error: 'Failed to update password',
    };
  }
};
