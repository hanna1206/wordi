'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { environment } from '@/config/environment.config';
import { createClient } from '@/services/supabase/server';

export const logout = async () => {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    redirect('/error?message=' + encodeURIComponent(error.message));
  }

  revalidatePath('/', 'layout');
  redirect('/login');
};

export const requestPasswordReset = async (email: string) => {
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${environment.appUrl}/auth/reset-password`,
  });

  if (error) {
    redirect('/error?message=' + encodeURIComponent(error.message));
  }

  return {
    success: true,
    message: 'Password reset link sent. Please check your email.',
  };
};

export const updatePassword = async (password: string) => {
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect('/error?message=' + encodeURIComponent(error.message));
  }

  revalidatePath('/', 'layout');
  redirect('/');
};
