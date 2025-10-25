'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import {
  logoutService,
  requestPasswordResetService,
  updatePasswordService,
} from '@/modules/auth/auth.service';

export const logout = async () => {
  const result = await logoutService();

  if (!result.success) {
    redirect('/error?message=' + encodeURIComponent(result.error || 'Error'));
  }

  revalidatePath('/', 'layout');
  redirect('/login');
};

export const requestPasswordReset = async (email: string) => {
  const result = await requestPasswordResetService(email);

  if (!result.success) {
    redirect('/error?message=' + encodeURIComponent(result.error || 'Error'));
  }

  return {
    success: true,
    message: 'Password reset link sent. Please check your email.',
  };
};

export const updatePassword = async (password: string) => {
  const result = await updatePasswordService(password);

  if (!result.success) {
    redirect('/error?message=' + encodeURIComponent(result.error || 'Error'));
  }

  revalidatePath('/', 'layout');
  redirect('/');
};
