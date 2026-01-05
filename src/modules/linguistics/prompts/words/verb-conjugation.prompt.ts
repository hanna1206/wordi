import { z } from 'zod';

export const buildVerbConjugationPrompt = (word: string): string => {
  return `You are a linguistic assistant. Your task is to provide the conjugation pattern of a German verb.

  The German word is "${word}"
  
  IMPORTANT: 
  - Provide the conjugation in the standard format: infinitive, 3rd person singular present, 3rd person singular past, present perfect
  - Use German forms only
  - Return null if the word is not a verb
  `;
};

export const outputStructure = z.object({
  conjugation: z
    .string()
    .nullable()
    .describe(
      `The conjugation of the verb in German. 
      Here is an example for verb lassen: "lassen, lässt, ließ, hat gelassen"`,
    ),
});
