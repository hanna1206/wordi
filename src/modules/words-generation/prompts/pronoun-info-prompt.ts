import { PromptTemplate } from '@langchain/core/prompts';
import { z } from 'zod';

export const pronounInfoPrompt = PromptTemplate.fromTemplate(
  `You are a linguistic assistant. Your task is to provide detailed information about a given German personal pronoun.

  The word is "{word}"
  All translations of the word are provided in "{targetLanguage}"
  All explanations should be given in "{targetLanguage}"
  
  IMPORTANT: Focus on grammatically correct, standard written forms. Provide formal, grammatically accurate explanations and examples.
  `,
);

export const outputStructure = z.object({
  pronounType: z
    .string()
    .describe(
      `The type of personal pronoun in German. Examples: "1st person singular", "2nd person plural", "3rd person singular masculine", etc.`,
    ),
  declensions: z
    .array(
      z.object({
        case: z
          .string()
          .describe(
            'The German case name (Nominativ, Akkusativ, Dativ, Genitiv)',
          ),
        form: z
          .string()
          .describe(
            'The pronoun form in this case (e.g., "ich", "mich", "mir", "meiner")',
          ),
        translation: z
          .string()
          .describe('Translation of the pronoun form into {targetLanguage}'),
        example: z
          .string()
          .describe(
            'Example sentence in German showing the pronoun in this case',
          ),
      }),
    )
    .describe(
      `Array of declensions for the personal pronoun showing how it changes in different cases.
      Each declension should include the case name, the pronoun form, translation, and an example sentence.
      Include all relevant cases (Nominativ, Akkusativ, Dativ, and Genitiv if applicable).`,
    ),
});
