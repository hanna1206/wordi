import { PromptTemplate } from '@langchain/core/prompts';
import { z } from 'zod';

export const collocationTranslationPrompt = PromptTemplate.fromTemplate(
  `Translate the German collocation or phrase to {targetLanguage}.

Collocation: "{collocation}"

IMPORTANT INSTRUCTIONS:
- Provide the most natural and idiomatic translation of the entire phrase
- Translate the phrase as a whole, not word-by-word
- Capture the meaning and usage context of the collocation
- Use the most common translation that native speakers would use
- Be precise and authentic
- If the input contains typos, grammatical errors, or mistakes, provide the corrected/normalized version
- If the input is already correct, return it as-is for the normalized version
`,
);

export const outputStructure = z.object({
  mainTranslation: z
    .string()
    .describe('The most natural and idiomatic translation of the collocation'),
  normalizedCollocation: z
    .string()
    .describe(
      'The corrected/normalized version of the collocation (fix typos and errors, or return as-is if correct)',
    ),
});
