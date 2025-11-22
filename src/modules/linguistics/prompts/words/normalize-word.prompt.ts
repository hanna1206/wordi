import { PromptTemplate } from '@langchain/core/prompts';
import { z } from 'zod';

import { PartOfSpeech } from '@/modules/linguistics/linguistics.const';

export const normalizeWordPrompt = PromptTemplate.fromTemplate(
  `You are a linguistic assistant. Your task is to provide the normalized form of a given word as it usually appears in dictionaries.
  Normalized form of word should be in German language.

IMPORTANT RULES:
- Preserve the original part of speech unless the capitalization clearly indicates otherwise
- If the word starts with a lowercase letter and is a verb, keep it as a verb (infinitive form)
- If the word starts with an uppercase letter and could be a substantivized verb, treat it as a noun
- Do NOT convert verbs to nouns unless the input word is capitalized

- If the word is a noun, return it in the singular nominative form with its definite article (for example, "der Haus").
- If the word is a verb, return its infinitive form without "zu" (for example, "lernen", not "das Lernen").
- If the word is an adjective, return its base form (for example, "schön").
- If the word is a personal pronoun, return its nominative form (for example, "ich", "du", "er", "sie", "es", "wir", "ihr", "Sie").
- If the word is a demonstrative pronoun, return its base form (for example, "dieser", "jener", "solcher", "welcher", "derselbe", "derjenige").
- If it is another part of speech, return the word unchanged.

PRONOUN IDENTIFICATION:
- Personal pronouns: ich, du, er, sie, es, wir, ihr, Sie (and their declined forms)
- Demonstrative pronouns: dieser, jener, solcher, welcher, derselbe, derjenige (and their declined forms)

Examples:  
Input: "lernen" → Output: "lernen" (verb, infinitive - keep as verb because lowercase)
Input: "Lernen" → Output: "das Lernen" (noun, because capitalized)
Input: "lerne" → Output: "lernen" (verb, infinitive form)
Input: "Häuser" → Output: "das Haus" (noun, singular with article)
Input: "schöne" → Output: "schön" (adjective, base form)
Input: "mich" → Output: "ich" (personal pronoun, nominative form)
Input: "diesen" → Output: "dieser" (demonstrative pronoun, base form)

The word is "{word}"
`,
);

export const outputStructure = z.object({
  normalizedWord: z.string().describe('The normalized form of the word'),
  partOfSpeech: z.array(z.nativeEnum(PartOfSpeech)).describe(
    `The part of speech of the word in English, e.g. noun, verb, adjective, adverb, personal pronoun, demonstrative pronoun, etc. 
      Return an array of parts of speech, if a word can be used as different parts of speech, 
      like this: ["noun", "verb", "adjective", "adverb"]. If word can be used as only one part of speech, 
      return an array with one element.
      
      For pronouns, be specific:
      - Use "personal pronoun" for: ich, du, er, sie, es, wir, ihr, Sie
      - Use "demonstrative pronoun" for: dieser, jener, solcher, welcher, derselbe, derjenige`,
  ),
});
