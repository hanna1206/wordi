import { z } from 'zod';

export const buildExampleSentencesPrompt = (word: string): string => {
  return `Provide example sentences showing how the German word "${word}" is used in context.

IMPORTANT INSTRUCTIONS:
- All sentences must be in German
- Provide at least 3 example sentences
- Use natural, authentic German that native speakers would use
- Vary the sentence structures and contexts
- Show different meanings or uses if the word has multiple senses
`;
};

export const outputStructure = z.object({
  exampleSentences: z
    .array(z.string())
    .describe(
      'Example sentences showing how this German word is used. There should be at least 3 example sentences in German language.',
    ),
});
