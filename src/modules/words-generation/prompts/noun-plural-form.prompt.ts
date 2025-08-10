import { PromptTemplate } from '@langchain/core/prompts';
import { z } from 'zod';

export const nounPluralFormPrompt = PromptTemplate.fromTemplate(
  `You are a linguistic assistant. Your task is to provide the plural form of a German noun.

  The German word is "{word}"
  
  IMPORTANT: 
  - Focus on grammatically correct, standard written forms
  - Provide the plural form in German
  - If the word is not a noun or doesn't have a plural form, return null
  `,
);

export const outputStructure = z.object({
  pluralForm: z
    .string()
    .nullable()
    .describe(
      'The plural form of the German word. Of course, written in German',
    ),
});
