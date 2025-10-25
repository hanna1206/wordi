'use server';

import * as Sentry from '@sentry/nextjs';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import {
  logoutService,
  requestPasswordResetService,
  updatePasswordService,
} from '@/modules/auth/auth.service';

export const logout = async () => {
  try {
    await logoutService();
    revalidatePath('/', 'layout');
    redirect('/login');
  } catch (error) {
    Sentry.captureException(error);
    redirect('/error?message=' + encodeURIComponent('Failed to logout'));
  }
};

export const requestPasswordReset = async (email: string) => {
  try {
    await requestPasswordResetService(email);
    return {
      success: true,
      message: 'Password reset link sent. Please check your email.',
    };
  } catch (error) {
    Sentry.captureException(error);
    redirect(
      '/error?message=' +
        encodeURIComponent('Failed to request password reset'),
    );
  }
};

export const updatePassword = async (password: string) => {
  try {
    await updatePasswordService(password);
    revalidatePath('/', 'layout');
    redirect('/');
  } catch (error) {
    Sentry.captureException(error);
    redirect(
      '/error?message=' + encodeURIComponent('Failed to update password'),
    );
  }
};
