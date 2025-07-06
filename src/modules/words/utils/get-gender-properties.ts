import type { Gender } from '@/modules/words/words.types';

const GENDER_PROPERTIES: Record<
  Gender,
  { article: 'der' | 'die' | 'das'; colorScheme: 'blue' | 'pink' | 'yellow' }
> = {
  masculine: { article: 'der', colorScheme: 'blue' },
  feminine: { article: 'die', colorScheme: 'pink' },
  neuter: { article: 'das', colorScheme: 'yellow' },
};

export const getGenderProperties = (gender?: Gender) => {
  if (!gender) {
    return null;
  }
  return GENDER_PROPERTIES[gender];
};
