import { PromptTemplate } from '@langchain/core/prompts';
import { z } from 'zod';

import { Gender } from '../words-generation.const';

export const nounInfoPrompt = PromptTemplate.fromTemplate(
  `You are a linguistic assistant. Your task is to provide additional info about a given German noun.

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
      `For the given German noun, list ONLY the prepositions that are SPECIFICALLY and IDIOMATICALLY bound to this particular noun.
      These must be prepositions that:
      1. Are strongly associated with this specific noun (not general prepositions)
      2. Require a specific grammatical case when used with this noun
      3. Form established, fixed expressions or grammatical constructions
      4. Cannot be easily substituted with other prepositions without changing meaning
      
             Each preposition should be an object with:
       - "rule": The preposition with required case (e.g., "an + Dativ", "für + Akkusativ")
       - "exampleSentence": A complete sentence in GERMAN demonstrating the noun with this preposition
       - "translation": Translation of the ENTIRE example sentence into {targetLanguage} (NEVER in German)
      
      Examples of word-specific prepositions:
      - "Angst vor + Dativ" (fear of): "Er hat Angst vor Spinnen."
      - "Interesse an + Dativ" (interest in): "Sie zeigt Interesse an Musik."
      - "Freude über + Akkusativ" (joy about): "Die Freude über den Erfolg war groß."
      
      DO NOT include:
      - General prepositions that work with many nouns (mit, für, ohne, durch, etc.)
      - Optional or interchangeable prepositions
      - Prepositions that don't form fixed expressions with this specific noun
      - Common locative or temporal prepositions unless they're idiomatically bound
      
      If this noun has no such specific prepositional requirements, return null.`,
    ),
});
