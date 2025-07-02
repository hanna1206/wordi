export interface UserSettings {
  id: string;
  email: string;
  name?: string;
  native_language?: string;
  created_at: string;
  updated_at: string;
}

export interface UserSettingsContext {
  userId: string;
  userSettings: UserSettings;
}
