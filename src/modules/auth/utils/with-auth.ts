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
      userId: authResult.user.id,
    };

    try {
      return await handler(context, input);
    } catch (error) {
      console.error('Action error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred',
      };
    }
  };
};
