import type { UserSettings } from '../user-settings.types';

export const isProfileComplete = (userSettings: UserSettings): boolean => {
  return !!(userSettings.name && userSettings.nativeLanguage);
};
