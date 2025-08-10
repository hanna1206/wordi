import { PromptTemplate } from '@langchain/core/prompts';
import { z } from 'zod';

import { Gender } from '../words-generation.const';

export const nounGenderPrompt = PromptTemplate.fromTemplate(
  `You are a linguistic assistant. Your task is to determine the grammatical gender of a German noun.

  The German word is "{word}"
  
  IMPORTANT: Focus on the standard, grammatically correct form of the noun.
  If the word is not a noun or doesn't have a gender, return null.
  `,
);

export const outputStructure = z.object({
  gender: z
    .nativeEnum(Gender)
    .nullable()
    .describe(
      'The grammatical gender of the German word written in English (masculine, feminine, neuter), only if the word is a noun. Otherwise, return null.',
    ),
});
