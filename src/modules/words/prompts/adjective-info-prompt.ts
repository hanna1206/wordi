import { PromptTemplate } from '@langchain/core/prompts';
import { z } from 'zod';

import { AdjectiveType } from '../words.const';

export const adjectiveInfoPrompt = PromptTemplate.fromTemplate(
  `You are a linguistic assistant. Your task is to provide additional info about a given adjective.

  The word is "{word}"
  All translations of the word are provided in "{targetLanguage}"
  All explanations should be given in "{targetLanguage}"
  
  IMPORTANT: Focus on grammatically correct, standard written forms. Avoid colloquial or spoken language variations. 
  Provide formal, grammatically accurate explanations and examples.
  `,
);

export const outputStructure = z.object({
  type: z
    .nativeEnum(AdjectiveType)
    .nullable()
    .describe(
      `The type of the German adjective:
      - Return "qualitative" if the adjective describes a quality or characteristic that can have degrees (e.g., "schön", "groß", "intelligent" - can be more or less beautiful, big, intelligent).
      - Return "relative" if the adjective describes a relationship, origin, material, or classification that typically doesn't have degrees (e.g., "deutsch", "hölzern", "städtisch" - something is either German or not, made of wood or not).
      Qualitative adjectives can usually form comparative and superlative forms, while relative adjectives typically cannot.`,
    ),
  comparisonForms: z
    .object({
      positive: z
        .string()
        .describe('The positive (default) form of the adjective'),
      comparative: z
        .string()
        .nullable()
        .describe(
          'The comparative form of the adjective (e.g., "schöner" for "schön", "besser" for "gut")',
        ),
      superlative: z
        .string()
        .nullable()
        .describe(
          'The superlative form of the adjective (e.g., "schönste" for "schön", "beste" for "gut")',
        ),
    })
    .nullable()
    .describe(
      `The comparison forms of the German adjective as an object with positive, comparative, and superlative forms.
      - positive: The base form of the adjective (same as the input word)
      - comparative: The comparative form (e.g., "schöner" for "schön", "größer" for "groß"). Return null if the adjective doesn't have a comparative form (typically for relative adjectives).
      - superlative: The superlative form (e.g., "schönste" for "schön", "größte" for "groß"). Return null if the adjective doesn't have a superlative form.
      For irregular forms, provide the actual form (e.g., "besser"/"beste" for "gut", "mehr"/"meiste" for "viel").
      Return null for the entire object if the adjective is relative and doesn't have comparison forms.`,
    ),
  prepositions: z
    .array(
      z.object({
        rule: z
          .string()
          .describe(
            'The preposition with case information (e.g., "auf + Akkusativ", "mit + Dativ")',
          ),
        exampleSentence: z
          .string()
          .describe(
            'Example sentence in German showing the preposition usage with the adjective',
          ),
        translation: z
          .string()
          .describe(
            'Translation of the example sentence into {targetLanguage}',
          ),
      }),
    )
    .nullable()
    .describe(
      `For the given German adjective, list only the *specific* prepositions that are strongly and idiomatically connected to it, 
      requiring a particular case, and which form fixed expressions or established grammatical constructions.
      Each preposition should be an object with "rule" field containing the preposition and case (e.g., "auf + Akkusativ"), 
      "exampleSentence" field with a German example sentence showing the adjective with the preposition, 
      and "translation" field with the translation of the example sentence into {targetLanguage}.
      Examples: "stolz auf + Akkusativ" (proud of), "zufrieden mit + Dativ" (satisfied with), "verantwortlich für + Akkusativ" (responsible for).
      Do NOT include common, general prepositions that can combine freely with many adjectives 
      unless they form a fixed or idiomatic phrase with this specific adjective.
      If there are no such specific prepositions for this adjective, return null without any explanations.`,
    ),
});
