import { z } from 'zod';

import { Gender } from '../../linguistics.const';

export const buildNounGenderPrompt = (word: string): string => {
  return `You are a linguistic assistant. Your task is to determine the grammatical gender of a German noun.

  The German word is "${word}"
  
  IMPORTANT: Focus on the standard, grammatically correct form of the noun.
  If the word is not a noun or doesn't have a gender, return null. 
  When a noun has article "das", it is neuter. 
  When a word has article "der", it is masculine. 
  When a word has article "die', it is feminine.
  `;
};

export const outputStructure = z.object({
  gender: z
    .nativeEnum(Gender)
    .nullable()
    .describe(
      'The grammatical gender of the German word written in English (masculine, feminine, neuter), only if the word is a noun. Otherwise, return null.',
    ),
});
