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
      `For the given German verb, list only the *specific* prepositions that are strongly and idiomatically connected to it, 
      requiring a particular case, and which form fixed expressions or established grammatical constructions.
      Format: """<preposition> + case — example sentence — translation of the example sentence in {targetLanguage}"""
      Do NOT include common, general prepositions that can combine freely with many verbs (such as mit, für, ohne) 
      unless they form a fixed or idiomatic phrase.
      If there are no such specific prepositions for this verb, return null without any explanations.`,
    ),
});
