import { z } from 'zod';

export const buildVerbPrepositionsPrompt = (
  word: string,
  targetLanguage: string,
): string => {
  return `You are a linguistic assistant. Your task is to provide prepositions that are specifically and idiomatically bound to a given German verb.

  The German word is "${word}"
  
  LANGUAGE REQUIREMENTS:
  - The word "${word}" is in GERMAN
  - All example sentences must be in GERMAN
  - All translations and explanations must be in "${targetLanguage}"
  - Never mix languages within a single field
  
  IMPORTANT: Focus on grammatically correct, standard written forms. Avoid colloquial or spoken language variations.
  
  For the given German verb, list ONLY the prepositions that are SPECIFICALLY and IDIOMATICALLY bound to this particular verb.
  These must be prepositions that:
  1. Are strongly associated with this specific verb (not general prepositions)
  2. Require a specific grammatical case when used with this verb
  3. Form established, fixed expressions or grammatical constructions
  4. Cannot be easily substituted with other prepositions without changing meaning
  
  Examples of verb-specific prepositions:
  - "denken an + Akkusativ" (think of): "Ich denke an meine Kindheit."
  - "warten auf + Akkusativ" (wait for): "Wir warten auf den Bus."
  - "sich freuen über + Akkusativ" (be happy about): "Sie freut sich über das Geschenk."
  
  DO NOT include:
  - General prepositions that work with many verbs (mit, für, ohne, durch, etc.)
  - Optional or interchangeable prepositions
  - Prepositions that don't form fixed expressions with this specific verb
  - Common directional or temporal prepositions unless they're idiomatically bound
  
  If this verb has no such specific prepositional requirements, return null.
  `;
};

export const outputStructure = z.object({
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
          .describe(
            'Complete example sentence in GERMAN showing the preposition usage',
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
      'Array of prepositions specifically bound to this verb, or null if none exist',
    ),
});
