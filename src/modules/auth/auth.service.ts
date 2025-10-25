import type { User } from '@supabase/supabase-js';

import { environment } from '@/config/environment.config';
import { createClient } from '@/services/supabase/server';

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

export const logoutService = async (): Promise<void> => {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message || 'Failed to logout');
  }
};

export const requestPasswordResetService = async (
  email: string,
): Promise<void> => {
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${environment.appUrl}/auth/reset-password`,
  });

  if (error) {
    throw new Error(error.message || 'Failed to request password reset');
  }
};

export const updatePasswordService = async (
  password: string,
): Promise<void> => {
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    throw new Error(error.message || 'Failed to update password');
  }
};
