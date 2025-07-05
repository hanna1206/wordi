import { PromptTemplate } from '@langchain/core/prompts';
import { z } from 'zod';

export const verbInfoPrompt = PromptTemplate.fromTemplate(
  `You are a linguistic assistant. Your task is to provide additional info about a given verb.

  The word is "{word}"
  All translations of the word are provided in "{targetLanguage}"
  `,
);

export const outputStructure = z.object({
  regular: z
    .string()
    .nullable()
    .describe(
      'Whether the verb is regular or irregular. If it is regular, return "regular". If it is irregular, return "irregular".',
    ),
  conjugation: z
    .string()
    .nullable()
    .describe(
      `The conjugation of the verb in German. 
      Here is an example for verb lassen: "lassen, lässt, ließ, hat gelassen"`,
    ),
  prepositions: z
    .array(z.string())
    .nullable()
    .describe(
      `For the given German verb, list only the prepositions that are commonly 
      used with it along with the required cases (if any). 
      Format: "<preposition> + case — example sentence - translation of the example sentence in {targetLanguage}"
      
      If there are no specific prepositions used with this noun, 
      do not return null and do not add any explanations.`,
    ),
});
