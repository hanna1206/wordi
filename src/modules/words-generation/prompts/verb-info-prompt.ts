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
  
  CRITICAL FOR REFLEXIVE CLASSIFICATION: Be extremely conservative and strict. Most verbs should be classified as 'non-reflexive'. 
  
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
      `Whether the verb is reflexive. Be EXTREMELY strict and conservative with this classification.
      
      - Return 'reflexive' ONLY if the verb MUST ALWAYS be used with a reflexive pronoun (sich) and cannot function without it in standard German (e.g., "sich freuen", "sich befinden", "sich ereignen").
      
      - Return 'non-reflexive' if the verb is primarily used without reflexive pronouns in its standard, most common meaning (e.g., "aufstehen", "gehen", "lesen", "trinken", "essen").
      
      - Return 'both' ONLY in very rare cases where the verb has two completely different, equally common meanings when used with and without reflexive pronouns. This should be reserved for a very small number of verbs.
      
      STRICT CRITERIA for 'both' category - ALL must be true:
      1. Both forms (with and without sich) must be commonly used in standard German (one may be more frequent than the other, but both must be well-established)
      2. Both forms must have clearly different meanings (not just transitive vs. intransitive)
      3. Both forms must be found in standard dictionaries as separate entries
      4. The reflexive form must NOT be just a logical extension of the non-reflexive form (e.g., "kämmen" vs "sich kämmen" is just transitive vs reflexive)
      
      VERIFIED EXAMPLES for 'both' category (use these as strict reference):
      * "leisten" vs "sich leisten": "leisten" means to perform/accomplish, "sich leisten" means to afford
      * "vorstellen" vs "sich vorstellen": "vorstellen" means to introduce someone, "sich vorstellen" means to introduce oneself/imagine
      * "waschen" vs "sich waschen": "waschen" means to wash something/someone, "sich waschen" means to wash oneself
      * "anziehen" vs "sich anziehen": "anziehen" means to dress someone/attract, "sich anziehen" means to get dressed
      * "treffen" vs "sich treffen": "treffen" means to meet someone/hit a target, "sich treffen" means to meet each other/get together
      * "verhalten" vs "sich verhalten": "verhalten" means to restrain/hold back, "sich verhalten" means to behave/act
      * "entscheiden" vs "sich entscheiden": "entscheiden" means to decide something, "sich entscheiden" means to make a decision/choose
      
      DO NOT classify as 'both' if:
      - The reflexive form is just the logical reflexive version of the transitive verb (e.g., "kämmen" vs "sich kämmen")
      - One form is extremely rare or archaic compared to the other
      - The verb can optionally take a reflexive pronoun but doesn't change meaning significantly
      - The meanings are too similar or one is just a special case of the other
      - You're not confident both forms are well-established in German
      
      When in doubt, classify as 'non-reflexive'. However, don't be overly restrictive with clearly established cases like "treffen/sich treffen".`,
    ),
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
      `ONLY provide this if isReflexive is 'both'. This field should be used very rarely.
      
      Provide this ONLY when:
      1. You have classified the verb as 'both' (following the strict criteria above)
      2. The verb has two completely different, equally established meanings with and without sich
      3. Both forms are commonly used in standard German
      
      For each usage, provide:
      - Clear explanation of the specific meaning IN {targetLanguage}
      - Multiple example sentences in German showing proper usage
      - Mention frequency of usage if one form is more common
      
      CRITICAL: All explanations, descriptions, and meanings must be written in {targetLanguage}. Only the German example sentences should be in German. Do NOT provide this field for verbs that are simply non-reflexive or only reflexive.`,
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
