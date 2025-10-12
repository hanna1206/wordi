import { PromptTemplate } from '@langchain/core/prompts';
import { z } from 'zod';

export const adjectiveComparisonFormsPrompt = PromptTemplate.fromTemplate(
  `You are a linguistic assistant. Your task is to provide the comparison forms of a German adjective.

  The German word is "{word}"
  
  IMPORTANT:
  - Provide all three forms: positive (base), comparative, and superlative
  - For irregular adjectives, provide the actual irregular forms
  - If the adjective is relative and doesn't have comparison forms, return null for the entire object
  - Return null if the word is not an adjective
  `,
);

export const outputStructure = z.object({
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
});
