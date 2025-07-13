import { PromptTemplate } from '@langchain/core/prompts';
import { z } from 'zod';

import { Regularity } from '../words-generation.const';

export const verbInfoPrompt = PromptTemplate.fromTemplate(
  `You are a linguistic assistant. Your task is to provide additional info about a given German verb.

  The German word is "{word}"
  
  LANGUAGE REQUIREMENTS:
  - The word "{word}" is in GERMAN
  - All example sentences must be in GERMAN
  - All translations and explanations must be in "{targetLanguage}"
  - Never mix languages within a single field
  
  IMPORTANT: Focus on grammatically correct, standard written forms. Avoid colloquial or spoken language variations. 
  Provide formal, grammatically accurate explanations and examples.
  
  CRITICAL FOR REFLEXIVE CLASSIFICATION: Pay special attention to verbs that can be used both with and without reflexive pronouns but have different meanings:
  - "leisten" (to perform/accomplish) vs "sich leisten" (to afford)
  - "vorstellen" (to introduce someone) vs "sich vorstellen" (to introduce oneself/imagine)
  - "waschen" (to wash something/someone) vs "sich waschen" (to wash oneself)
  - "anziehen" (to dress someone/attract) vs "sich anziehen" (to get dressed)
  
  If the verb can be used both ways with different meanings, classify it as 'both' and provide detailed explanations for both usages.
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
      Return the prefix only (e.g., "auf" for "aufstehen", "an" for "ankommen") or null if the verb has no separable prefix or has an inseparable prefix.

      Common separable prefixes in German include: ab-, an-, auf-, aus-, bei-, ein-, fest-, fort-, her-, hin-, los-, mit-, nach-, nieder-, statt-, um-, vor-, weg-, weiter-, zu-, zurück-, zusammen-.
      
      Common inseparable prefixes (return null for these): be-, emp-, ent-, er-, ge-, miss-, ver-, zer-.
      
      Examples: 
      - Verbs with separable prefixes: "aufstehen" -> "auf", "ankommen" -> "an"
      - Verbs with inseparable prefixes: "vereinbaren" -> null, "verstehen" -> null
      - Verbs with no prefix: "gehen" -> null, "schlafen" -> null, "essen" -> null`,
    ),
  isReflexive: z
    .enum(['reflexive', 'non-reflexive', 'both'])
    .nullable()
    .describe(
      `Whether the verb is reflexive. Be very careful and accurate with this classification.
      - Return 'reflexive' ONLY if the verb MUST be used with a reflexive pronoun (sich) and cannot function without it (e.g., "sich freuen", "sich befinden").
      - Return 'non-reflexive' if the verb is used without reflexive pronouns in its standard meaning (e.g., "aufstehen", "gehen", "lesen").
      - Return 'both' ONLY if the verb has genuinely different meanings when used with and without reflexive pronouns.
      
      IMPORTANT EXAMPLES for 'both' category:
      * "leisten" vs "sich leisten": "leisten" means to perform/accomplish (e.g., "Hilfe leisten" = to provide help), while "sich leisten" means to afford (e.g., "sich etwas leisten können" = to be able to afford something)
      * "waschen" vs "sich waschen": "waschen" means to wash something/someone else, while "sich waschen" means to wash oneself
      * "vorstellen" vs "sich vorstellen": "vorstellen" means to introduce someone else, while "sich vorstellen" means to introduce oneself or to imagine
      * "anziehen" vs "sich anziehen": "anziehen" means to dress someone else or to attract, while "sich anziehen" means to get dressed
      
      Do not confuse separable prefixes or other grammatical elements with reflexive usage.`,
    ),
  sichUsage: z
    .object({
      withSich: z.string().describe(
        `The usage of the verb with the reflexive pronoun. 
        Explain the specific meaning and provide example sentences in German.
        For example, for "leisten": explain that "sich leisten" means "to afford" and give examples like "Ich kann mir das nicht leisten" (I can't afford that).
        If verb is used with reflexive pronoun very rarely or very often, please mention this as well.`,
      ),
      withoutSich: z.string().describe(
        `The usage of the verb without the reflexive pronoun.
          Explain the specific meaning and provide example sentences in German.
          For example, for "leisten": explain that "leisten" means "to perform/accomplish/provide" and give examples like "Hilfe leisten" (to provide help) or "gute Arbeit leisten" (to do good work).`,
      ),
    })
    .nullable()
    .describe(
      `ONLY provide this if isReflexive is 'both'. If the verb has genuinely different meanings when used with and without reflexive pronouns, explain the difference with specific examples in German and their meanings.
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
          .describe(
            'Complete example sentence in GERMAN showing the preposition usage',
          ),
        translation: z
          .string()
          .describe(
            'Translation of the ENTIRE example sentence into {targetLanguage} (NOT German)',
          ),
      }),
    )
    .nullable()
    .describe(
      `For the given German verb, list ONLY the prepositions that are SPECIFICALLY and IDIOMATICALLY bound to this particular verb.
      These must be prepositions that:
      1. Are strongly associated with this specific verb (not general prepositions)
      2. Require a specific grammatical case when used with this verb
      3. Form established, fixed expressions or grammatical constructions
      4. Cannot be easily substituted with other prepositions without changing meaning
      
             Each preposition should be an object with:
       - "rule": The preposition with required case (e.g., "an + Akkusativ", "mit + Dativ")
       - "exampleSentence": A complete sentence in GERMAN demonstrating the verb with this preposition
       - "translation": Translation of the ENTIRE example sentence into {targetLanguage} (NEVER in German)
      
      Examples of word-specific prepositions:
      - "denken an + Akkusativ" (think of): "Ich denke an meine Kindheit."
      - "warten auf + Akkusativ" (wait for): "Wir warten auf den Bus."
      - "sich freuen über + Akkusativ" (be happy about): "Sie freut sich über das Geschenk."
      
      DO NOT include:
      - General prepositions that work with many verbs (mit, für, ohne, durch, etc.)
      - Optional or interchangeable prepositions
      - Prepositions that don't form fixed expressions with this specific verb
      - Common directional or temporal prepositions unless they're idiomatically bound
      
      If this verb has no such specific prepositional requirements, return null.`,
    ),
});
