import { withAuth } from '@/modules/auth/utils/with-auth';
import type { ActionResult } from '@/shared-types';

import { getUserSettings } from '../user-settings.service';
import { UserSettingsContext } from '../user-settings.types';

export const withUserSettings = <TInput, TOutput>(
  handler: (
    context: UserSettingsContext,
    input: TInput,
  ) => Promise<ActionResult<TOutput>>,
) => {
  return withAuth<TInput, TOutput>(async (context, input) => {
    const userSettings = await getUserSettings(context.userId);

    if (!userSettings) {
      return {
        success: false,
        error: 'User profile not found',
      };
    }

    const nextContext: UserSettingsContext = {
      ...context,
      userSettings,
    };

    return handler(nextContext, input);
  });
};
