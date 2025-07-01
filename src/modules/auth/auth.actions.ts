'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

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
