'use server';

import * as Sentry from '@sentry/nextjs';

import { withAuth } from '@/modules/auth/utils/with-auth';
import type { ActionResult } from '@/shared-types';

import { LanguageCode } from './user-settings.const';
import * as userSettingsRepository from './user-settings.repository';
import type { UserSettings } from './user-settings.types';

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
