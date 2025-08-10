import { PromptTemplate } from '@langchain/core/prompts';
import { z } from 'zod';

export const adjectivePrepositionsPrompt = PromptTemplate.fromTemplate(
  `You are a linguistic assistant. Your task is to provide prepositions that are specifically and idiomatically bound to a given German adjective.

  The German word is "{word}"
  
  LANGUAGE REQUIREMENTS:
  - The word "{word}" is in GERMAN
  - All example sentences must be in GERMAN
  - All translations and explanations must be in "{targetLanguage}"
  - Never mix languages within a single field
  
  IMPORTANT: Focus on grammatically correct, standard written forms. Avoid colloquial or spoken language variations.
  
  For the given German adjective, list ONLY the prepositions that are SPECIFICALLY and IDIOMATICALLY bound to this particular adjective.
  These must be prepositions that:
  1. Are strongly associated with this specific adjective (not general prepositions)
  2. Require a specific grammatical case when used with this adjective
  3. Form established, fixed expressions or grammatical constructions
  4. Cannot be easily substituted with other prepositions without changing meaning
  
  Examples of adjective-specific prepositions:
  - "stolz auf + Akkusativ" (proud of): "Er ist stolz auf seinen Sohn."
  - "zufrieden mit + Dativ" (satisfied with): "Sie ist zufrieden mit dem Ergebnis."
  - "verantwortlich für + Akkusativ" (responsible for): "Du bist verantwortlich für diese Aufgabe."
  
  DO NOT include:
  - General prepositions that work with many adjectives (wie, als, durch, etc.)
  - Optional or interchangeable prepositions
  - Prepositions that don't form fixed expressions with this specific adjective
  
  If this adjective has no such specific prepositional requirements, return null.
  `,
);

export const outputStructure = z.object({
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
      'Array of prepositions specifically bound to this adjective, or null if none exist',
    ),
});
