import {
  LanguageCode,
  LanguageLabels,
} from '@/modules/user-settings/user-settings.const';

export const getLanguageName = (languageCode: LanguageCode | null): string => {
  if (!languageCode) {
    return 'Not set';
  }
  return LanguageLabels[languageCode] || languageCode;
};
