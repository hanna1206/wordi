import { cache } from 'react';

import type { User } from '@supabase/supabase-js';

import { environment } from '@/config/environment.config';
import { createClient } from '@/services/supabase/server';

interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

// Cached for the duration of a single request to avoid duplicate getUser calls
// This prevents duplicate supabase.auth.getUser() calls in the same request
export const getAuthenticatedUser = cache(async (): Promise<AuthResult> => {
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
});

export const logoutService = async (): Promise<void> => {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message || 'Failed to logout');
  }

  // Clear onboarding cookie on logout
  const { cookies } = await import('next/headers');
  (await cookies()).delete('onboarding_complete');
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
