import { PromptTemplate } from '@langchain/core/prompts';
import { z } from 'zod';

export const translateToLanguagePrompt = PromptTemplate.fromTemplate(
  `Translate the German word "{word}" to {targetLanguage} and provide additional info about this word. If the word is a noun, also provide its grammatical gender in English (masculine, feminine, neuter).`,
);

export const outputStructure = z.object({
  mainTranslation: z
    .string()
    .describe('The most common translation of the word'),
  additionalTranslations: z
    .array(z.string())
    .describe(
      'Other translations of the word, return just empty array like this: [] if none',
    ),
  partOfSpeech: z.array(z.string()).describe(
    `The part of speech of the word in English, e.g. noun, verb, adjective, adverb, etc. 
      Return an array of parts of speech, if a word can be used as different parts of speech, 
      like this: ["noun", "verb", "adjective", "adverb"]. If word can be used as only one part of speech, 
      return an array with one element.`,
  ),
  exampleSentences: z.array(z.string()).describe(
    `Example of how this German word is used in a German sentence. 
      There should be at least 3 example sentences in German language.`,
  ),
  collocations: z.array(z.string()).describe(
    `5-8 most useful and typical collocations with this word in German language 
      and set expressions for a language learner at level B2. 
      Focus only on authentical combinations used by native speakers, 
      which have either idiomatic meaning, special context, or are important 
      for natural communication. Exclude generic combinations like "big <word>" or "nice <word>". 
      Each collocation should have a translation into {targetLanguage} 
      in the following format: "<collocation> - <translation into {targetLanguage}>".
      Important note: do not return, please, word, that are composed using {word}. 
      Only collocations with this word, not word created with its root.`,
  ),
  synonyms: z.array(z.string()).describe(`Synonyms of the word in German. 
    If they are nouns - add article. For example: "das Buch".`),
});
