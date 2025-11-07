'use server';

import * as Sentry from '@sentry/nextjs';
import { redirect } from 'next/navigation';

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
    await userSettingsRepository.update(context.userId, {
      name: name.trim(),
      nativeLanguage,
    });

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
      const settings = await userSettingsRepository.getByUserId(context.userId);

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
