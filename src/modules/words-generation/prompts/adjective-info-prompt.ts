import { PromptTemplate } from '@langchain/core/prompts';
import { z } from 'zod';

import { AdjectiveType } from '../words-generation.const';

export const adjectiveInfoPrompt = PromptTemplate.fromTemplate(
  `You are a linguistic assistant. Your task is to provide additional info about a given German adjective.

  The German word is "{word}"
  
  LANGUAGE REQUIREMENTS:
  - The word "{word}" is in GERMAN
  - All example sentences must be in GERMAN
  - All translations and explanations must be in "{targetLanguage}"
  - Never mix languages within a single field
  
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
            'Complete example sentence in GERMAN showing the preposition usage with the adjective',
          ),
        translation: z
          .string()
          .describe(
            'Translation of the ENTIRE example sentence into {targetLanguage} (NOT German)',
          ),
      }),
    )
    .nullable()
    .describe(
      `For the given German adjective, list ONLY the prepositions that are SPECIFICALLY and IDIOMATICALLY bound to this particular adjective.
      These must be prepositions that:
      1. Are strongly associated with this specific adjective (not general prepositions)
      2. Require a specific grammatical case when used with this adjective
      3. Form established, fixed expressions or grammatical constructions
      4. Cannot be easily substituted with other prepositions without changing meaning
      
             Each preposition should be an object with:
       - "rule": The preposition with required case (e.g., "auf + Akkusativ", "mit + Dativ")
       - "exampleSentence": A complete sentence in GERMAN demonstrating the adjective with this preposition
       - "translation": Translation of the ENTIRE example sentence into {targetLanguage} (NEVER in German)
      
      Examples of word-specific prepositions:
      - "stolz auf + Akkusativ" (proud of): "Er ist stolz auf seinen Sohn."
      - "zufrieden mit + Dativ" (satisfied with): "Sie ist zufrieden mit dem Ergebnis."
      - "verantwortlich für + Akkusativ" (responsible for): "Du bist verantwortlich für diese Aufgabe."
      
      DO NOT include:
      - General prepositions that work with many adjectives (wie, als, durch, etc.)
      - Optional or interchangeable prepositions
      - Prepositions that don't form fixed expressions with this specific adjective
      
      If this adjective has no such specific prepositional requirements, return null.`,
    ),
});
