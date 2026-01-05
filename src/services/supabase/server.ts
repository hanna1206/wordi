import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

import { environment } from '@/config/environment.config';

export const createClient = async () => {
  const { supabaseApiUrl, supabaseAnonKey } = environment;
  const cookieStore = await cookies();

  return createServerClient(supabaseApiUrl!, supabaseAnonKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(
        cookiesToSet: {
          name: string;
          value: string;
          options?: unknown;
        }[],
      ) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            cookieStore.set(name, value, options as any),
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
};
