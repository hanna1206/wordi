'use server';

import * as Sentry from '@sentry/nextjs';
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

  try {
    await completeUserProfile(context.userId, {
      name: name.trim(),
      native_language: nativeLanguage,
    });

    // Redirect to home page after successful completion
    // Note: redirect() throws and prevents execution of code after it
    redirect('/');
  } catch (error) {
    Sentry.captureException(error);
    return {
      success: false,
      error: 'Failed to complete profile',
    };
  }
});

export const fetchUserSettings = withAuth<void, UserSettings>(
  async (context): Promise<ActionResult<UserSettings>> => {
    try {
      const data = await getUserSettings(context.userId);
      return { success: true, data };
    } catch (error) {
      Sentry.captureException(error);
      return { success: false, error: 'Failed to fetch user settings' };
    }
  },
);
