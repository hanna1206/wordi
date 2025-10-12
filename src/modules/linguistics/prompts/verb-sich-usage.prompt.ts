import { PromptTemplate } from '@langchain/core/prompts';
import { z } from 'zod';

export const verbSichUsagePrompt = PromptTemplate.fromTemplate(
  `You are a linguistic assistant. Your task is to provide usage examples for a German verb that can be used both with and without the reflexive pronoun "sich".

  The German word is "{word}"
  
  LANGUAGE REQUIREMENTS:
  - All explanations and descriptions must be in {targetLanguage}
  - Only the German example sentences should be in German
  - Never mix languages within explanations
  
  IMPORTANT: 
  - Only provide this information if the verb truly has different meanings with and without "sich"
  - Focus on standard, grammatically correct usage
  - Provide clear explanations of the different meanings
  - Include 2-3 example sentences for each usage
  `,
);

export const outputStructure = z.object({
  sichUsage: z
    .object({
      withSich: z.string().describe(
        `The usage of the verb with the reflexive pronoun. ONLY provide this if the verb truly has a different meaning with sich.
        
        Requirements:
        - Explain the specific meaning that is different from the non-reflexive form IN {targetLanguage}
        - Provide 2-3 example sentences in German showing proper usage
        - Mention if this form is less common than the non-reflexive form
        - Focus on standard, grammatically correct usage
        - ALL explanations and descriptions must be in {targetLanguage}, only the German example sentences should be in German
        
        Example format: First explain the meaning in {targetLanguage}, then provide German examples: "Ich kann mir das nicht leisten", "Wir können uns einen Urlaub leisten".`,
      ),
      withoutSich: z.string().describe(
        `The usage of the verb without the reflexive pronoun. This should be the primary, most common usage.
        
        Requirements:
        - Explain the main meaning of the verb in its standard form IN {targetLanguage}
        - Provide 2-3 example sentences in German showing proper usage
        - Focus on the most common, standard usage
        - ALL explanations and descriptions must be in {targetLanguage}, only the German example sentences should be in German
        
        Example format: First explain the meaning in {targetLanguage}, then provide German examples: "Hilfe leisten", "gute Arbeit leisten", "einen Beitrag leisten".`,
      ),
    })
    .nullable()
    .describe(
      `Provide usage examples for verbs that can be used both with and without "sich". Return null if not applicable.`,
    ),
});
