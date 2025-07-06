import { PromptTemplate } from '@langchain/core/prompts';
import { z } from 'zod';

export const verbInfoPrompt = PromptTemplate.fromTemplate(
  `You are a linguistic assistant. Your task is to provide additional info about a given verb.

  The word is "{word}"
  All translations of the word are provided in "{targetLanguage}"
  All explanations should be given in "{targetLanguage}"
  
  IMPORTANT: Focus on grammatically correct, standard written forms. Avoid colloquial or spoken language variations. 
  Provide formal, grammatically accurate explanations and examples.
  `,
);

export const outputStructure = z.object({
  regular: z
    .enum(['regular', 'irregular'])
    .nullable()
    .describe(
      `Whether the verb is regular or irregular in German. 
      - Return "regular" if the verb follows standard conjugation patterns (adds -te for Präteritum and -t for past participle, e.g., "machen" -> "machte" -> "gemacht", "vorstellen" -> "stellte vor" -> "vorgestellt").
      - Return "irregular" if the verb has stem changes or irregular forms (e.g., "gehen" -> "ging" -> "gegangen", "sein" -> "war" -> "gewesen").
      Focus on the basic verb stem, not on separable prefixes.`,
    ),
  conjugation: z
    .string()
    .nullable()
    .describe(
      `The conjugation of the verb in German. 
      Here is an example for verb lassen: "lassen, lässt, ließ, hat gelassen"`,
    ),
  separablePrefix: z
    .string()
    .nullable()
    .describe(
      `The separable prefix of the verb if it has one. 
      Return the prefix only (e.g., "auf" for "aufstehen", "an" for "ankommen").
      Return null if the verb has no separable prefix or has an inseparable prefix.

      Common separable prefixes in German include: ab-, an-, auf-, aus-, bei-, ein-, fest-, fort-, her-, hin-, los-, mit-, nach-, nieder-, statt-, um-, vor-, weg-, weiter-, zu-, zurück-, zusammen-.
      
      Common inseparable prefixes (return null for these): be-, emp-, ent-, er-, ge-, miss-, ver-, zer-.
      
      Examples: "aufstehen" -> "auf", "ankommen" -> "an", "vereinbaren" -> null (inseparable "ver-"), "verstehen" -> null (inseparable "ver-")`,
    ),
  isReflexive: z
    .enum(['reflexive', 'non-reflexive', 'both'])
    .nullable()
    .describe(
      `Whether the verb is reflexive. Be very careful and accurate with this classification.
      - Return 'reflexive' ONLY if the verb MUST be used with a reflexive pronoun (sich) and cannot function without it (e.g., "sich freuen", "sich befinden").
      - Return 'non-reflexive' if the verb is used without reflexive pronouns in its standard meaning (e.g., "aufstehen", "gehen", "lesen").
      - Return 'both' ONLY if the verb has genuinely different meanings when used with and without reflexive pronouns (e.g., "waschen" vs "sich waschen").
      Do not confuse separable prefixes or other grammatical elements with reflexive usage.`,
    ),
  sichUsage: z
    .object({
      withSich: z.string().describe(
        `The usage of the verb with the reflexive pronoun. 
          If verb is used with reflexive pronomen very rarely or very often, please, mention this as well.`,
      ),
      withoutSich: z
        .string()
        .describe('The usage of the verb without the reflexive pronoun'),
    })
    .nullable()
    .describe(
      `ONLY provide this if isReflexive is 'both'. If the verb has genuinely different meanings when used with and without reflexive pronouns, explain the difference. 
      Do not provide this for verbs that are simply non-reflexive or only reflexive. Give explanation in {targetLanguage}`,
    ),
  prepositions: z
    .array(
      z.object({
        rule: z
          .string()
          .describe(
            'The preposition with case information (e.g., "mit + Dativ")',
          ),
        exampleSentence: z
          .string()
          .describe('Example sentence in German showing the preposition usage'),
        translation: z
          .string()
          .describe(
            'Translation of the example sentence into {targetLanguage}',
          ),
      }),
    )
    .nullable()
    .describe(
      `For the given German verb, list only the *specific* prepositions that are strongly and idiomatically connected to it, 
      requiring a particular case, and which form fixed expressions or established grammatical constructions.
      Each preposition should be an object with "rule" field containing the preposition and case (e.g., "mit + Dativ"), 
      "exampleSentence" field with a German example sentence, and "translation" field with the translation of the example sentence into {targetLanguage}.
      Do NOT include common, general prepositions that can combine freely with many verbs (such as mit, für, ohne) 
      unless they form a fixed or idiomatic phrase.
      If there are no such specific prepositions for this verb, return null without any explanations.`,
    ),
});
