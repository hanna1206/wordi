import { z } from 'zod';

export const buildVerbReflexivityPrompt = (word: string): string => {
  return `You are a linguistic assistant. Your task is to classify whether a German verb is reflexive, non-reflexive, or both.

  The German word is "${word}"
  
  CRITICAL: Be extremely conservative and strict. Most verbs should be classified as 'non-reflexive'.
  
  Only classify as 'both' if the verb has two completely different, equally established meanings:
  - "leisten" (to perform/accomplish) vs "sich leisten" (to afford) - DIFFERENT MEANINGS
  - "vorstellen" (to introduce someone) vs "sich vorstellen" (to introduce oneself/imagine) - DIFFERENT MEANINGS
  - "waschen" (to wash something/someone) vs "sich waschen" (to wash oneself) - DIFFERENT MEANINGS
  - "anziehen" (to dress someone/attract) vs "sich anziehen" (to get dressed) - DIFFERENT MEANINGS
  - "treffen" (to meet someone/hit target) vs "sich treffen" (to meet each other/get together) - DIFFERENT MEANINGS
  - "verhalten" (to restrain/hold back) vs "sich verhalten" (to behave/act) - DIFFERENT MEANINGS
  - "entscheiden" (to decide something) vs "sich entscheiden" (to make a decision/choose) - DIFFERENT MEANINGS
  
  DO NOT classify as 'both' if:
  - The reflexive form is just a logical extension (e.g., "kämmen" vs "sich kämmen" - this is just transitive vs reflexive)
  - One form is much more common than the other
  - The verb can optionally take sich but meaning doesn't change significantly
  - You're not absolutely certain both forms are equally established
  
  When in doubt, always choose 'non-reflexive'. Accuracy is more important than completeness.
  `;
};

export const outputStructure = z.object({
  isReflexive: z
    .enum(['reflexive', 'non-reflexive', 'both'])
    .nullable()
    .describe(
      `Whether the verb is reflexive. Be EXTREMELY strict and conservative with this classification.
      
      - Return 'reflexive' ONLY if the verb MUST ALWAYS be used with a reflexive pronoun (sich) and cannot function without it in standard German (e.g., "sich freuen", "sich befinden", "sich ereignen").
      
      - Return 'non-reflexive' if the verb is primarily used without reflexive pronouns in its standard, most common meaning (e.g., "aufstehen", "gehen", "lesen", "trinken", "essen").
      
      - Return 'both' ONLY in very rare cases where the verb has two completely different, equally common meanings when used with and without reflexive pronouns. This should be reserved for a very small number of verbs.
      
      STRICT CRITERIA for 'both' category - ALL must be true:
      1. Both forms (with and without sich) must be commonly used in standard German
      2. Both forms must have clearly different meanings (not just transitive vs. intransitive)
      3. Both forms must be found in standard dictionaries as separate entries
      4. The reflexive form must NOT be just a logical extension of the non-reflexive form
      
      When in doubt, classify as 'non-reflexive'.`,
    ),
});
