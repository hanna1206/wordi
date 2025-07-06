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
    .array(
      z.object({
        rule: z
          .string()
          .describe(
            'The preposition with case information (e.g., "mit + Dativ")',
          ),
        exampleSentence: z
          .string()
          .describe('Example sentence in German showing the preposition usage'),
        translation: z
          .string()
          .describe(
            'Translation of the example sentence into {targetLanguage}',
          ),
      }),
    )
    .nullable()
    .describe(
      `For the given German verb, list only the *specific* prepositions that are strongly and idiomatically connected to it, 
      requiring a particular case, and which form fixed expressions or established grammatical constructions.
      Each preposition should be an object with "rule" field containing the preposition and case (e.g., "mit + Dativ"), 
      "exampleSentence" field with a German example sentence, and "translation" field with the translation of the example sentence into {targetLanguage}.
      Do NOT include common, general prepositions that can combine freely with many verbs (such as mit, für, ohne) 
      unless they form a fixed or idiomatic phrase.
      If there are no such specific prepositions for this verb, return null without any explanations.`,
    ),
});
