import { PromptTemplate } from '@langchain/core/prompts';
import { z } from 'zod';

export const demonstrativePronounDeclensionsPrompt =
  PromptTemplate.fromTemplate(
    `You are a linguistic assistant. Your task is to provide the complete declension table for a German demonstrative pronoun.

  The word is "{word}"
  All explanations should be given in "{targetLanguage}"
  
  IMPORTANT: 
  - Focus on grammatically correct, standard written forms
  - Provide formal, grammatically accurate declensions
  - For demonstrative pronouns like "dieser", "jener", "derjenige", "derselbe", etc.
  - Provide the complete declension showing changes across all four cases and all genders
  - Include all four cases: Nominativ, Akkusativ, Dativ, Genitiv
  - Include all three genders: Masculine, Feminine, Neuter, plus Plural
  `,
  );

export const outputStructure = z.object({
  declensions: z
    .array(
      z.object({
        case: z
          .string()
          .describe(
            'The German case name (Nominativ, Akkusativ, Dativ, Genitiv)',
          ),
        masculine: z
          .string()
          .describe(
            'The masculine form in this case (e.g., "dieser", "diesen", "diesem", "dieses")',
          ),
        feminine: z
          .string()
          .describe(
            'The feminine form in this case (e.g., "diese", "diese", "dieser", "dieser")',
          ),
        neuter: z
          .string()
          .describe(
            'The neuter form in this case (e.g., "dieses", "dieses", "diesem", "dieses")',
          ),
        plural: z
          .string()
          .describe(
            'The plural form in this case (e.g., "diese", "diese", "diesen", "dieser")',
          ),
      }),
    )
    .nullable()
    .describe(
      `Complete declension table for the demonstrative pronoun showing how it changes across all cases and genders.
      Each entry should include the case name and the forms for masculine, feminine, neuter, and plural.
      Include all four cases: Nominativ, Akkusativ, Dativ, and Genitiv.
      Return null if not a demonstrative pronoun.`,
    ),
});
