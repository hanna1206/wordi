import { PromptTemplate } from '@langchain/core/prompts';
import { z } from 'zod';

export const synonymsPrompt = PromptTemplate.fromTemplate(
  `Provide synonyms for the German word "{word}".

IMPORTANT INSTRUCTIONS:
- All synonyms must be in German
- If the word is a noun, include the article (e.g., "das Buch")
- Only provide synonyms if the word is a noun, adjective, or verb
- For pronouns and other parts of speech, return an empty array []
- Do NOT invent synonyms if they are hard to find or don't exist naturally
- Return empty array [] if no clear, authentic synonyms exist
- Only include words that native speakers would recognize as true synonyms
- Consider the context and register (formal/informal) of the synonyms
`,
);

export const outputStructure = z.object({
  synonyms: z
    .array(z.string())
    .describe(
      'Synonyms of the word in German. If they are nouns - add article. Return empty array [] if no authentic synonyms exist or if the word is not a noun, adjective, or verb.',
    ),
});
