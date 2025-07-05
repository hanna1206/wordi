import { PromptTemplate } from '@langchain/core/prompts';
import { z } from 'zod';

export const normalizeWordPrompt = PromptTemplate.fromTemplate(
  `You are a linguistic assistant. Your task is to provide the normalized form of a given word as it usually appears in dictionaries.
  Normalized form of word should be in German language.

- If the word is a noun, return it in the singular nominative form (for example, "house") with its definite article (for example, "der Haus").
- If the word is a verb, return its infinitive form (for example, "to go").
- If the word is an adjective, return its base form (for example, "beautiful").
- If it is another part of speech, return the word unchanged.

Examples:  
Input: "houses" → Output: "house" (noun, singular)  
Input: "went" → Output: "go" (verb, infinitive)  
Input: "beautiful" (inflected as "beautifully") → Output: "beautiful" (adjective, base)

The word is "{word}"
`,
);

export const outputStructure = z.object({
  normalizedWord: z.string().describe('The normalized form of the word'),
  partOfSpeech: z.array(z.string()).describe(
    `The part of speech of the word in English, e.g. noun, verb, adjective, adverb, etc. 
      Return an array of parts of speech, if a word can be used as different parts of speech, 
      like this: ["noun", "verb", "adjective", "adverb"]. If word can be used as only one part of speech, 
      return an array with one element.`,
  ),
});
