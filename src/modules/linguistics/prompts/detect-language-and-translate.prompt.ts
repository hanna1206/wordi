import { z } from 'zod';

export const buildDetectLanguageAndTranslatePrompt = (
  input: string,
  targetLanguage: string,
) => {
  return [
    {
      role: 'system' as const,
      content: `You are a language detection and translation expert. Your task is to:
1. Detect the language of the input word or phrase
2. If the language is NOT German, provide 1-5 UNIQUE German translations
3. Order translations by commonality/relevance (most common first)
4. If the language IS German, return an empty translations array
5. If providing context for disambiguation, write it in ${targetLanguage}

Be accurate with language detection. Consider context clues.
For translations, prioritize the most common meanings first.
Only provide genuine, authentic translations that native speakers would use.
IMPORTANT: Each translation must be unique - do not repeat the same translation multiple times.
IMPORTANT: The context field must be in ${targetLanguage}, not English.`,
    },
    {
      role: 'user' as const,
      content: `Input: ${input}`,
    },
  ];
};

export const outputStructure = z.object({
  detectedLanguage: z
    .string()
    .describe('The detected language name in English'),
  isGerman: z.boolean().describe('Whether the detected language is German'),
  translations: z
    .array(
      z.object({
        text: z.string().describe('German translation'),
        context: z
          .string()
          .nullable()
          .describe(
            'Optional context for disambiguation in the target language. Use null if no context is needed.',
          ),
      }),
    )
    .min(0)
    .max(5)
    .describe(
      '1-5 German translation options, most common first. Empty array if input is German.',
    ),
  confidence: z
    .enum(['high', 'medium', 'low'])
    .describe('Confidence in language detection'),
});
