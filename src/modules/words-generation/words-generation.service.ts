import { gpt5MiniModel } from '@/services/llm/gpt-5-mini';

import {
  adjectiveInfoPrompt,
  outputStructure as adjectiveInfoOutputStructure,
} from './prompts/adjective-info-prompt';
import {
  demonstrativePronounInfoPrompt,
  outputStructure as demonstrativePronounInfoOutputStructure,
} from './prompts/demonstrative-pronoun-info-prompt';
import {
  normalizeWordPrompt,
  outputStructure as normalizeWordOutputStructure,
} from './prompts/normalize-word.prompt';
import {
  nounInfoPrompt,
  outputStructure as nounInfoOutputStructure,
} from './prompts/noun-info.prompt';
import {
  outputStructure as pronounInfoOutputStructure,
  pronounInfoPrompt,
} from './prompts/pronoun-info-prompt';
import {
  outputStructure as translateToLanguageOutputStructure,
  translateToLanguagePrompt,
} from './prompts/translate-to-language.prompt';
import {
  outputStructure as verbInfoOutputStructure,
  verbInfoPrompt,
} from './prompts/verb-info-prompt';
import { PartOfSpeech } from './words-generation.const';

const WRONG_VERB_SEPARABLE_PREFIX_VALUES = ['null', '/', '/null'];

const translateWordLlm = gpt5MiniModel.withStructuredOutput(
  translateToLanguageOutputStructure,
);
const translateWordChain = translateToLanguagePrompt.pipe(translateWordLlm);

const normalizeWordLlm = gpt5MiniModel.withStructuredOutput(
  normalizeWordOutputStructure,
);
const normalizeWordChain = normalizeWordPrompt.pipe(normalizeWordLlm);

const nounInfoLlm = gpt5MiniModel.withStructuredOutput(nounInfoOutputStructure);
const nounInfoChain = nounInfoPrompt.pipe(nounInfoLlm);

const verbInfoLlm = gpt5MiniModel.withStructuredOutput(verbInfoOutputStructure);
const verbInfoChain = verbInfoPrompt.pipe(verbInfoLlm);

const adjectiveInfoLlm = gpt5MiniModel.withStructuredOutput(
  adjectiveInfoOutputStructure,
);
const adjectiveInfoChain = adjectiveInfoPrompt.pipe(adjectiveInfoLlm);

const pronounInfoLlm = gpt5MiniModel.withStructuredOutput(
  pronounInfoOutputStructure,
);
const pronounInfoChain = pronounInfoPrompt.pipe(pronounInfoLlm);

const demonstrativePronounInfoLlm = gpt5MiniModel.withStructuredOutput(
  demonstrativePronounInfoOutputStructure,
);
const demonstrativePronounInfoChain = demonstrativePronounInfoPrompt.pipe(
  demonstrativePronounInfoLlm,
);

export const getWordInfo = async (word: string, targetLanguage: string) => {
  const { normalizedWord, partOfSpeech } = await normalizeWordChain.invoke({
    word,
  });

  // Run translation and any relevant POS-specific queries in parallel
  const translatePromise = translateWordChain.invoke({
    word: normalizedWord,
    targetLanguage,
  });

  const nounPromise = partOfSpeech.includes(PartOfSpeech.NOUN)
    ? nounInfoChain.invoke({ word: normalizedWord, targetLanguage })
    : Promise.resolve(undefined);

  const verbPromise = partOfSpeech.includes(PartOfSpeech.VERB)
    ? verbInfoChain.invoke({ word: normalizedWord, targetLanguage })
    : Promise.resolve(undefined);

  const adjectivePromise = partOfSpeech.includes(PartOfSpeech.ADJECTIVE)
    ? adjectiveInfoChain.invoke({ word: normalizedWord, targetLanguage })
    : Promise.resolve(undefined);

  const personalPronounPromise = partOfSpeech.includes(
    PartOfSpeech.PERSONAL_PRONOUN,
  )
    ? pronounInfoChain.invoke({ word: normalizedWord, targetLanguage })
    : Promise.resolve(undefined);

  const demonstrativePronounPromise = partOfSpeech.includes(
    PartOfSpeech.DEMONSTRATIVE_PRONOUN,
  )
    ? demonstrativePronounInfoChain.invoke({
        word: normalizedWord,
        targetLanguage,
      })
    : Promise.resolve(undefined);

  const [
    translateResult,
    nounResult,
    verbResult,
    adjectiveResult,
    personalPronounResult,
    demonstrativePronounResult,
  ] = await Promise.all([
    translatePromise,
    nounPromise,
    verbPromise,
    adjectivePromise,
    personalPronounPromise,
    demonstrativePronounPromise,
  ]);

  let posSpecifics = {} as Record<string, unknown>;

  if (nounResult) {
    posSpecifics = { ...posSpecifics, ...nounResult };
  }

  if (verbResult) {
    const normalisedVerb = {
      ...verbResult,
      separablePrefix:
        verbResult.separablePrefix != null &&
        WRONG_VERB_SEPARABLE_PREFIX_VALUES.includes(verbResult.separablePrefix)
          ? null
          : verbResult.separablePrefix,
    };
    posSpecifics = { ...posSpecifics, ...normalisedVerb };
  }

  if (adjectiveResult) {
    posSpecifics = { ...posSpecifics, ...adjectiveResult };
  }

  if (personalPronounResult) {
    posSpecifics = { ...posSpecifics, ...personalPronounResult };
  }

  if (demonstrativePronounResult) {
    posSpecifics = { ...posSpecifics, ...demonstrativePronounResult };
  }

  return {
    normalizedWord,
    partOfSpeech,
    mainTranslation: translateResult.mainTranslation,
    additionalTranslations: translateResult.additionalTranslations,
    exampleSentences: translateResult.exampleSentences,
    collocations: translateResult.collocations,
    synonyms: translateResult.synonyms,
    ...posSpecifics,
  };
};
