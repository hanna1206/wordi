import { PromptTemplate } from '@langchain/core/prompts';
import { z } from 'zod';

export const nounInfoPrompt = PromptTemplate.fromTemplate(
  `You are a linguistic assistant. Your task is to provide additional info about a given noun.

  The word is "{word}"
  `,
);

export const outputStructure = z.object({
  gender: z
    .string()
    .nullable()
    .describe(
      'The grammatical gender of the German word written in English (masculine, feminine, neuter), only if the word is a noun. Otherwise, return null.',
    ),
  pluralForm: z
    .string()
    .nullable()
    .describe(
      'The plural form of the German word. Of course, written in German',
    ),
});
