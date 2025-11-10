import type { User } from '@supabase/supabase-js';

export interface AuthenticatedContext {
  user: User;
}
