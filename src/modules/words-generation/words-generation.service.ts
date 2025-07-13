import { gpt41Model } from '@/services/llm/gpt-4.1';

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

const translateWordLlm = gpt41Model.withStructuredOutput(
  translateToLanguageOutputStructure,
);
const translateWordChain = translateToLanguagePrompt.pipe(translateWordLlm);

const normalizeWordLlm = gpt41Model.withStructuredOutput(
  normalizeWordOutputStructure,
);
const normalizeWordChain = normalizeWordPrompt.pipe(normalizeWordLlm);

const nounInfoLlm = gpt41Model.withStructuredOutput(nounInfoOutputStructure);
const nounInfoChain = nounInfoPrompt.pipe(nounInfoLlm);

const verbInfoLlm = gpt41Model.withStructuredOutput(verbInfoOutputStructure);
const verbInfoChain = verbInfoPrompt.pipe(verbInfoLlm);

const adjectiveInfoLlm = gpt41Model.withStructuredOutput(
  adjectiveInfoOutputStructure,
);
const adjectiveInfoChain = adjectiveInfoPrompt.pipe(adjectiveInfoLlm);

const pronounInfoLlm = gpt41Model.withStructuredOutput(
  pronounInfoOutputStructure,
);
const pronounInfoChain = pronounInfoPrompt.pipe(pronounInfoLlm);

const demonstrativePronounInfoLlm = gpt41Model.withStructuredOutput(
  demonstrativePronounInfoOutputStructure,
);
const demonstrativePronounInfoChain = demonstrativePronounInfoPrompt.pipe(
  demonstrativePronounInfoLlm,
);

export const getWordInfo = async (word: string, targetLanguage: string) => {
  const { normalizedWord, partOfSpeech } = await normalizeWordChain.invoke({
    word,
  });

  const {
    mainTranslation,
    additionalTranslations,
    exampleSentences,
    collocations,
    synonyms,
  } = await translateWordChain.invoke({
    word: normalizedWord,
    targetLanguage,
  });
  let posSpecifics = {};

  if (partOfSpeech.includes(PartOfSpeech.NOUN)) {
    const response = await nounInfoChain.invoke({
      word: normalizedWord,
      targetLanguage,
    });
    posSpecifics = { ...posSpecifics, ...response };
  }

  if (partOfSpeech.includes(PartOfSpeech.VERB)) {
    const response = await verbInfoChain.invoke({
      word: normalizedWord,
      targetLanguage,
    });
    const normalisedResponse = {
      ...response,
      separablePrefix:
        response.separablePrefix != null &&
        WRONG_VERB_SEPARABLE_PREFIX_VALUES.includes(response.separablePrefix)
          ? null
          : response.separablePrefix,
    };
    posSpecifics = { ...posSpecifics, ...normalisedResponse };
  }

  if (partOfSpeech.includes(PartOfSpeech.ADJECTIVE)) {
    const response = await adjectiveInfoChain.invoke({
      word: normalizedWord,
      targetLanguage,
    });
    posSpecifics = { ...posSpecifics, ...response };
  }

  if (partOfSpeech.includes(PartOfSpeech.PERSONAL_PRONOUN)) {
    const response = await pronounInfoChain.invoke({
      word: normalizedWord,
      targetLanguage,
    });
    posSpecifics = { ...posSpecifics, ...response };
  }

  if (partOfSpeech.includes(PartOfSpeech.DEMONSTRATIVE_PRONOUN)) {
    const response = await demonstrativePronounInfoChain.invoke({
      word: normalizedWord,
      targetLanguage,
    });
    posSpecifics = { ...posSpecifics, ...response };
  }

  return {
    normalizedWord,
    partOfSpeech,
    mainTranslation,
    additionalTranslations,
    exampleSentences,
    collocations,
    synonyms,
    ...posSpecifics,
  };
};
