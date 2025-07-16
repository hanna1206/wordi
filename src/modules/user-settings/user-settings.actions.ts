'use server';

import { redirect } from 'next/navigation';

import { withAuth } from '@/modules/auth/utils/with-auth';
import type { ActionResult } from '@/shared-types';

import { completeUserProfile, getUserSettings } from './user-settings.service';
import type { UserSettings } from './user-settings.types';

export const completeProfile = withAuth<
  { name: string; nativeLanguage: string },
  UserSettings
>(async (context, data): Promise<ActionResult<UserSettings>> => {
  const { name, nativeLanguage } = data;

  // Validate input
  if (!name?.trim()) {
    return {
      success: false,
      error: 'Name is required',
    };
  }

  if (!nativeLanguage) {
    return {
      success: false,
      error: 'Native language is required',
    };
  }

  const result = await completeUserProfile(context.userId, {
    name: name.trim(),
    native_language: nativeLanguage,
  });

  if (!result.success) {
    return {
      success: false,
      error: result.error || 'Failed to complete profile',
    };
  }

  // Redirect to home page after successful completion
  // Note: redirect() throws and prevents execution of code after it
  redirect('/');
});

export const fetchUserSettings = withAuth<void, UserSettings>(
  async (context): Promise<ActionResult<UserSettings>> => {
    const result = await getUserSettings(context.userId);

    if (!result.success) {
      return {
        success: false,
        error: result.error || 'Failed to fetch user settings',
      };
    }

    return {
      success: true,
      data: result.data,
    };
  },
);
