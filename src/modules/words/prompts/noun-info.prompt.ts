import { PromptTemplate } from '@langchain/core/prompts';
import { z } from 'zod';

export const nounInfoPrompt = PromptTemplate.fromTemplate(
  `You are a linguistic assistant. Your task is to provide additional info about a given noun.

  The word is "{word}"
  All translations of the word are provided in "{targetLanguage}"
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
  prepositions: z
    .array(z.string())
    .nullable()
    .describe(
      `For the given German noun, list only the *specific* prepositions that are strongly and idiomatically connected to it, requiring a particular case, and which form fixed expressions or established grammatical constructions.
      Format: """<preposition> + case — example sentence — translation of the example sentence in {targetLanguage}"""
      Do NOT include common, general prepositions that can combine freely with many nouns (such as mit, für, ohne) 
      unless they form a fixed or idiomatic phrase.
      If there are no such specific prepositions for this noun, return null without any explanations.`,
    ),
});
