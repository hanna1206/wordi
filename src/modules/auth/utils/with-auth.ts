import { getAuthenticatedUser } from '@/modules/auth/auth.service';
import type { AuthenticatedContext } from '@/modules/auth/auth.types';
import type { ActionResult } from '@/shared-types';

export const withAuth = <TInput, TOutput>(
  handler: (
    context: AuthenticatedContext,
    input: TInput,
  ) => Promise<ActionResult<TOutput>>,
) => {
  return async (input: TInput): Promise<ActionResult<TOutput>> => {
    const authResult = await getAuthenticatedUser();

    if (!authResult.success || !authResult.user) {
      return {
        success: false,
        error: authResult.error || 'Authentication required',
      };
    }

    const context: AuthenticatedContext = {
      user: authResult.user,
    };

    return await handler(context, input);
  };
};
