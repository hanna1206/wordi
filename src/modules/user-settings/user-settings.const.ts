export const USER_SETTINGS_TABLE_NAME = 'user_settings';

export enum LanguageCode {
  RUSSIAN = 'russian',
  ENGLISH = 'english',
  UKRAINIAN = 'ukrainian',
  TURKISH = 'turkish',
  PORTUGUESE = 'portuguese',
}

export const LanguageLabels = {
  [LanguageCode.RUSSIAN]: 'Russian',
  [LanguageCode.ENGLISH]: 'English',
  [LanguageCode.UKRAINIAN]: 'Ukrainian',
  [LanguageCode.TURKISH]: 'Turkish',
  [LanguageCode.PORTUGUESE]: 'Portuguese',
};

export const ONBOARDING_COOKIE_KEY = 'onboarding_complete';
export const USER_SETTINGS_CACHE_KEY = 'user-settings';
