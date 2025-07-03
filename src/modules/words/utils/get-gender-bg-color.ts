import type { TranslationNounResult } from '@/modules/words/words.types';

const FEMININE_BG_COLOR = '#FFF0F6';
const MASCULINE_BG_COLOR = '#E6F4FF';
const NEUTER_BG_COLOR = '#FFFBE6';

export const getGenderBgColor = (
  translation: TranslationNounResult,
): string | undefined => {
  if (
    translation &&
    Array.isArray(translation.partOfSpeech) &&
    translation.partOfSpeech.includes('noun') &&
    translation.gender
  ) {
    if (translation.gender === 'feminine') {
      return FEMININE_BG_COLOR; // very light pink
    } else if (translation.gender === 'masculine') {
      return MASCULINE_BG_COLOR; // very light blue
    } else if (translation.gender === 'neuter') {
      return NEUTER_BG_COLOR; // very light yellow
    }
  }
  return undefined;
};
