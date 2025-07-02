import { LANGUAGE_MAP } from '@/modules/user-settings/user-settings.const';

export const getLanguageName = (languageCode: string): string => {
  return LANGUAGE_MAP[languageCode] || languageCode;
};
