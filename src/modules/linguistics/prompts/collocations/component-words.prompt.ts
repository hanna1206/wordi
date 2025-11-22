import { PromptTemplate } from '@langchain/core/prompts';
import { z } from 'zod';

export const componentWordsPrompt = PromptTemplate.fromTemplate(
  `Extract the component words from the German collocation and provide their out-of-context translations in {targetLanguage}.

Collocation: "{collocation}"

IMPORTANT INSTRUCTIONS:
- Identify the main content words in the collocation (nouns, verbs, adjectives, adverbs)
- Exclude articles, prepositions, and other function words unless they're essential to meaning
- For each component word, provide its dictionary form (infinitive for verbs, nominative singular for nouns)
- Provide the out-of-context translation (the basic dictionary meaning, not the meaning within the collocation)
- Include articles for nouns (e.g., "das Kino" not just "Kino")

Examples:
- "ins Kino gehen" → component words: ["das Kino", "gehen"]
- "Kaffee trinken" → component words: ["der Kaffee", "trinken"]
- "auf jeden Fall" → component words: ["der Fall"] (jeden is not a content word in this context)
`,
);

export const outputStructure = z.object({
  componentWords: z
    .array(
      z.object({
        word: z
          .string()
          .describe(
            'The component word in its dictionary form (with article for nouns)',
          ),
        translation: z
          .string()
          .describe(
            'The out-of-context dictionary translation to {targetLanguage}',
          ),
      }),
    )
    .describe('The main content words that make up the collocation'),
});
