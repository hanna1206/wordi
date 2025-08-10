import { PromptTemplate } from '@langchain/core/prompts';
import { z } from 'zod';

export const pronounTypePrompt = PromptTemplate.fromTemplate(
  `You are a linguistic assistant. Your task is to identify the type of a German personal pronoun.

  The word is "{word}"
  All explanations should be given in "{targetLanguage}"
  
  IMPORTANT: 
  - Focus on grammatically correct, standard written forms
  - Provide the precise grammatical type of the pronoun
  - Return null if the word is not a personal pronoun
  `,
);

export const outputStructure = z.object({
  pronounType: z
    .string()
    .nullable()
    .describe(
      `The type of personal pronoun in German. Examples: "1st person singular", "2nd person plural", "3rd person singular masculine", etc. Return null if not a personal pronoun.`,
    ),
});
