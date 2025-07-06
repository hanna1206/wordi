import { PromptTemplate } from '@langchain/core/prompts';
import { z } from 'zod';

import { Gender } from '../words.const';

export const nounInfoPrompt = PromptTemplate.fromTemplate(
  `You are a linguistic assistant. Your task is to provide additional info about a given noun.

  The word is "{word}"
  All translations of the word are provided in "{targetLanguage}"
  `,
);

export const outputStructure = z.object({
  gender: z
    .nativeEnum(Gender)
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
      `For the given German noun, list only the *specific* prepositions that are strongly and idiomatically connected to it, requiring a particular case, and which form fixed expressions or established grammatical constructions.
      Each preposition should be an object with "rule" field containing the preposition and case (e.g., "mit + Dativ"), 
      "exampleSentence" field with a German example sentence, and "translation" field with the translation of the example sentence into {targetLanguage}.
      Do NOT include common, general prepositions that can combine freely with many nouns (such as mit, für, ohne) 
      unless they form a fixed or idiomatic phrase.
      If there are no such specific prepositions for this noun, return null without any explanations.`,
    ),
});
