'use server';

import * as Sentry from '@sentry/nextjs';
import { revalidateTag, unstable_cache } from 'next/cache';

import { withAuth } from '@/modules/auth/utils/with-auth';
import type { ActionResult } from '@/shared-types';

import { LanguageCode, USER_SETTINGS_CACHE_KEY } from './user-settings.const';
import * as userSettingsRepository from './user-settings.repository';
import type { UserSettings } from './user-settings.types';

export const getCachedUserSettings = unstable_cache(
  async (userId: string) => {
    return await userSettingsRepository.getByUserId(userId);
  },
  [USER_SETTINGS_CACHE_KEY],
  {
    revalidate: 86400 * 7, // one week - because profile rarely changes
    tags: [USER_SETTINGS_CACHE_KEY],
  },
);

export const completeProfile = withAuth<
  { name: string; nativeLanguage: LanguageCode },
  UserSettings
>(async (context, data): Promise<ActionResult<UserSettings>> => {
  const { name, nativeLanguage } = data;

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
    const newUserSettings = await userSettingsRepository.upsert({
      userId: context.user.id,
      email: context.user.email || '',
      name: name.trim(),
      nativeLanguage,
    });

    // Set cookie to indicate onboarding is complete
    // This will be read by middleware to avoid DB queries
    const { cookies } = await import('next/headers');
    (await cookies()).set('onboarding_complete', 'true', {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    // Revalidate cache so next request gets fresh data
    revalidateTag(USER_SETTINGS_CACHE_KEY);

    return { success: true, data: newUserSettings };
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
      const settings = await userSettingsRepository.getByUserId(
        context.user.id,
      );

      if (!settings) {
        return {
          success: false,
          error: 'User settings not found',
        };
      }

      return { success: true, data: settings };
    } catch (error) {
      Sentry.captureException(error);
      return { success: false, error: 'Failed to fetch user settings' };
    }
  },
);
