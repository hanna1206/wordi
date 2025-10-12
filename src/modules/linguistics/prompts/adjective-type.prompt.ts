import { PromptTemplate } from '@langchain/core/prompts';
import { z } from 'zod';

import { AdjectiveType } from '../linguistics.const';

export const adjectiveTypePrompt = PromptTemplate.fromTemplate(
  `You are a linguistic assistant. Your task is to classify the type of a German adjective.

  The German word is "{word}"
  
  IMPORTANT:
  - Qualitative adjectives describe qualities that can have degrees (can be more or less)
  - Relative adjectives describe relationships, origins, materials that don't have degrees
  - Return null if the word is not an adjective
  `,
);

export const outputStructure = z.object({
  type: z
    .nativeEnum(AdjectiveType)
    .nullable()
    .describe(
      `The type of the German adjective:
      - Return "qualitative" if the adjective describes a quality or characteristic that can have degrees (e.g., "schön", "groß", "intelligent" - can be more or less beautiful, big, intelligent).
      - Return "relative" if the adjective describes a relationship, origin, material, or classification that typically doesn't have degrees (e.g., "deutsch", "hölzern", "städtisch" - something is either German or not, made of wood or not).
      Qualitative adjectives can usually form comparative and superlative forms, while relative adjectives typically cannot.`,
    ),
});
