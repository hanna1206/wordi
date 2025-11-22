import { PromptTemplate } from '@langchain/core/prompts';
import { z } from 'zod';

export const basicTranslationPrompt = PromptTemplate.fromTemplate(
  `Translate the German word "{word}" to {targetLanguage}.

IMPORTANT INSTRUCTIONS:
- Provide the most common translation first
- For additional translations, return an empty array if there are no genuine alternative translations
- For example, "Apfel" is always "apple" - don't invent additional translations
- Be precise and authentic - only include translations that native speakers would actually use
`,
);

export const outputStructure = z.object({
  mainTranslation: z
    .string()
    .describe('The most common translation of the word'),
  additionalTranslations: z
    .array(z.string())
    .describe(
      'Other genuine translations of the word. Return empty array [] if there are no authentic alternative translations. Do not invent translations.',
    ),
});
