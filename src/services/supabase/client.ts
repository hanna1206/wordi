import { createBrowserClient } from '@supabase/ssr';

import { environment } from '@/config/environment.config';

export const createClient = () => {
  const { supabaseApiUrl, supabaseAnonKey } = environment;

  return createBrowserClient(supabaseApiUrl!, supabaseAnonKey!);
};
