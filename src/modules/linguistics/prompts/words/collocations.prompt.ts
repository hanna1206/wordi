import { z } from 'zod';

export const buildCollocationsPrompt = (
  word: string,
  targetLanguage: string,
): string => {
  return `Provide the most useful collocations for the German word "${word}".

LANGUAGE REQUIREMENTS:
- All collocations must be in German
- Translations must be in ${targetLanguage}

IMPORTANT INSTRUCTIONS:
- Provide 5-8 most useful and typical collocations for a B2 language learner
- Focus only on authentic combinations used by native speakers
- Include collocations that have idiomatic meaning, special context, or are important for natural communication
- Exclude generic combinations like "groß + noun" or "schön + noun"
- Do NOT include compound words created with the word's root
- Only include collocations WITH this word, not words derived FROM it

Examples of good collocations:
- For "Angst": "Angst haben vor", "aus Angst", "keine Angst!"
- For "Interesse": "Interesse zeigen", "großes Interesse", "Interesse wecken"

Examples of what NOT to include:
- Compound words: for "Haus" don't include "Hausfrau", "Haustür"
- Generic adjectives: for "Auto" don't include "großes Auto", "neues Auto"
`;
};

export const outputStructure = z.object({
  collocations: z
    .array(
      z.object({
        collocation: z.string().describe('The collocation in German'),
        translation: z
          .string()
          .describe('The translation of the collocation into {targetLanguage}'),
      }),
    )
    .describe('5-8 most useful collocations with this word for B2 learners'),
});
