import { z } from 'zod';

export const buildVerbSeparablePrefixPrompt = (word: string): string => {
  return `You are a linguistic assistant. Your task is to identify the separable prefix of a German verb if it has one.

  The German word is "${word}"
  
  Common separable prefixes in German include: ab-, an-, auf-, aus-, bei-, ein-, fest-, fort-, her-, hin-, los-, mit-, nach-, nieder-, statt-, um-, vor-, weg-, weiter-, zu-, zurück-, zusammen-.
  
  Common inseparable prefixes (return null for these): be-, emp-, ent-, er-, ge-, miss-, ver-, zer-.
  
  IMPORTANT:
  - Return only the prefix part (e.g., "auf" for "aufstehen")
  - Return null if the verb has no separable prefix
  - Return null if the verb has an inseparable prefix
  - Return null if the word is not a verb
  `;
};

export const outputStructure = z.object({
  separablePrefix: z
    .string()
    .nullable()
    .describe(
      `The separable prefix of the verb if it has one. 
      Return the prefix only (e.g., "auf" for "aufstehen", "an" for "ankommen") or null if the verb has no separable prefix or has an inseparable prefix.

      Examples: 
      - Verbs with separable prefixes: "aufstehen" -> "auf", "ankommen" -> "an"
      - Verbs with inseparable prefixes: "vereinbaren" -> null, "verstehen" -> null
      - Verbs with no prefix: "gehen" -> null, "schlafen" -> null, "essen" -> null`,
    ),
});
