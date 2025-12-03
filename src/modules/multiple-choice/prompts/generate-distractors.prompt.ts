import { PromptTemplate } from '@langchain/core/prompts';
import { z } from 'zod';

export const generateDistractorsPrompt = PromptTemplate.fromTemplate(
  `You are a language learning expert creating plausible but incorrect answer options (distractors) for a multiple choice vocabulary exercise.

The exercise shows a word/phrase in the user's native language ({nativeLanguage}), and the user must select the correct {targetLanguage} translation from 4 options.

Generate exactly 3 distractors for each vocabulary item. Each distractor must be:
1. In {targetLanguage} (the target language being learned)
2. Match the part of speech of the correct answer
3. For nouns: match the grammatical gender of the correct answer (if applicable)
4. For verbs: be in the same form (infinitive, conjugated, etc.) as the correct answer
5. Semantically or phonetically similar to make them plausible
6. NOT obviously incorrect or unrelated
7. For collocations (multi-word phrases): provide complete phrase alternatives, not single words

Vocabulary items to generate distractors for:
{items}

IMPORTANT:
- Return exactly 3 distractors per item
- Distractors must be in {targetLanguage}
- Match part of speech and grammatical properties
- Make distractors challenging but fair
- For collocations, provide complete phrases as distractors
`,
);

export const outputStructure = z
  .object({
    distractors: z
      .record(
        z.string(),
        z
          .array(z.string())
          .length(3)
          .describe('Exactly 3 distractors in the target language'),
      )
      .describe(
        'Map of vocabulary item IDs to their 3 distractors. Each distractor must match the part of speech and grammatical properties of the correct answer.',
      ),
  })
  .strict();
