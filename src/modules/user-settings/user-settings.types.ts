// user-settings.types.ts
import { AuthenticatedContext } from '@/modules/auth/auth.types';

import { userSettingsTable } from './user-settings.schema';

export type UserSettings = typeof userSettingsTable.$inferSelect;
export type InsertUserSettings = typeof userSettingsTable.$inferInsert;
export type UpdateUserSettings = Partial<
  Pick<InsertUserSettings, 'name' | 'nativeLanguage'>
>;

// For your withUserSettings helper
export interface UserSettingsContext extends AuthenticatedContext {
  userSettings: UserSettings;
}
