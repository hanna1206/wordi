import { PromptTemplate } from '@langchain/core/prompts';
import { z } from 'zod';

export const usageNotesPrompt = PromptTemplate.fromTemplate(
  `Provide usage notes and context information for the German collocation.

Collocation: "{collocation}"

IMPORTANT INSTRUCTIONS:
- Explain when and how this collocation is typically used
- Mention any register information (formal, informal, casual, etc.)
- Note any regional variations if relevant
- Highlight any grammatical patterns or structures associated with the collocation
- Mention any cultural context that would help a learner understand proper usage
- Keep the notes concise but informative (2-4 sentences)
- Write in {targetLanguage}
`,
);

export const outputStructure = z.object({
  usageNotes: z
    .string()
    .describe(
      'Concise usage notes explaining when and how to use this collocation',
    ),
});
