import { PromptTemplate } from '@langchain/core/prompts';
import { z } from 'zod';

import { Regularity } from '../words-generation.const';

export const verbRegularityPrompt = PromptTemplate.fromTemplate(
  `You are a linguistic assistant. Your task is to determine whether a German verb is regular or irregular.

  The German word is "{word}"
  
  IMPORTANT: 
  - Focus on the basic verb stem, not on separable prefixes
  - Consider the verb's conjugation in Präteritum and past participle forms
  - Return null if the word is not a verb
  `,
);

export const outputStructure = z.object({
  regular: z
    .nativeEnum(Regularity)
    .nullable()
    .describe(
      `Whether the verb is regular or irregular in German. 
      - Return "regular" if the verb follows standard conjugation patterns (adds -te for Präteritum and -t for past participle, e.g., "machen" -> "machte" -> "gemacht", "vorstellen" -> "stellte vor" -> "vorgestellt").
      - Return "irregular" if the verb has stem changes or irregular forms (e.g., "gehen" -> "ging" -> "gegangen", "sein" -> "war" -> "gewesen").
      Focus on the basic verb stem, not on separable prefixes.`,
    ),
});
