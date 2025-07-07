export interface UserSettings {
  id: string;
  email: string;
  name: string | null;
  native_language: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserSettingsContext {
  userId: string;
  userSettings: UserSettings;
}
