import { PromptTemplate } from '@langchain/core/prompts';
import { z } from 'zod';

export const classifyInputPrompt = PromptTemplate.fromTemplate(
  `You are a German language expert. Analyze the following German text and determine if it is a single compound word or a true multi-word collocation/phrase.

Input: "{input}"

CLASSIFICATION RULES:
- A COMPOUND WORD is a single word that may be written with spaces but should be written as one word in German
  Examples: "staat angehörigkeit" → compound word (should be "Staatsangehörigkeit")
            "haus tür" → compound word (should be "Haustür")

- A REFLEXIVE VERB with "sich" is treated as a single word (the verb itself)
  Examples: "sich beschweren" → compound word (normalized: "beschweren")
            "sich freuen" → compound word (normalized: "freuen")
            "sich erinnern" → compound word (normalized: "erinnern")
            
- A COLLOCATION is a genuine multi-word phrase or expression
  Examples: "ins Kino gehen" → collocation (go to the cinema)
            "Kaffee trinken" → collocation (drink coffee)
            "auf jeden Fall" → collocation (in any case)

IMPORTANT:
- If the input is a reflexive verb with "sich", classify it as "compound-word" and normalize to just the verb
- If the input could be written as a single German compound word, classify it as "compound-word"
- If the input is a genuine multi-word phrase that cannot be written as one word, classify it as "collocation"
- If you're uncertain, default to "collocation"
- For compound words, provide the correct normalized form (written as one word)
- For reflexive verbs, provide just the verb without "sich"
- For collocations, provide the normalized form with proper spacing and capitalization
`,
);

export const outputStructure = z.object({
  classification: z
    .enum(['compound-word', 'collocation'])
    .describe(
      'Whether the input is a compound word that should be written as one word, or a true multi-word collocation',
    ),
  normalizedForm: z
    .string()
    .describe(
      'The correct normalized form: for compound words, write as one word; for collocations, use proper spacing and capitalization',
    ),
  reasoning: z
    .string()
    .describe('Brief explanation of why this classification was chosen'),
});
