import { PromptTemplate } from '@langchain/core/prompts';
import { z } from 'zod';

export const collocationExamplesPrompt = PromptTemplate.fromTemplate(
  `Generate example sentences that demonstrate the usage of the German collocation.

Collocation: "{collocation}"

IMPORTANT INSTRUCTIONS:
- Provide 3-5 example sentences in German that use this collocation naturally
- Each sentence should demonstrate a different context or usage
- Sentences should be appropriate for B2 level German learners
- Keep sentences clear and not overly complex
- Provide accurate translations to {targetLanguage} for each sentence
- Ensure the collocation is used naturally and idiomatically in each sentence
`,
);

export const outputStructure = z.object({
  exampleSentences: z
    .array(
      z.object({
        german: z.string().describe('The example sentence in German'),
        translation: z
          .string()
          .describe('The translation of the sentence to {targetLanguage}'),
      }),
    )
    .describe('3-5 example sentences demonstrating the collocation usage'),
});
