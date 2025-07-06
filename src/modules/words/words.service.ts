import { gpt41MiniModel } from '@/services/llm/gpt-4.1-mini';

import {
  adjectiveInfoPrompt,
  outputStructure as adjectiveInfoOutputStructure,
} from './prompts/adjective-info-prompt';
import {
  normalizeWordPrompt,
  outputStructure as normalizeWordOutputStructure,
} from './prompts/normalize-word.prompt';
import {
  nounInfoPrompt,
  outputStructure as nounInfoOutputStructure,
} from './prompts/noun-info.prompt';
import {
  outputStructure as translateToLanguageOutputStructure,
  translateToLanguagePrompt,
} from './prompts/translate-to-language.prompt';
import {
  outputStructure as verbInfoOutputStructure,
  verbInfoPrompt,
} from './prompts/verb-info-prompt';

export const getWordInfo = async (word: string, targetLanguage: string) => {
  const translateWordLlm = gpt41MiniModel.withStructuredOutput(
    translateToLanguageOutputStructure,
  );
  const translateWordChain = translateToLanguagePrompt.pipe(translateWordLlm);

  const normalizeWordLlm = gpt41MiniModel.withStructuredOutput(
    normalizeWordOutputStructure,
  );
  const normalizeWordChain = normalizeWordPrompt.pipe(normalizeWordLlm);

  const nounInfoLlm = gpt41MiniModel.withStructuredOutput(
    nounInfoOutputStructure,
  );
  const nounInfoChain = nounInfoPrompt.pipe(nounInfoLlm);

  const verbInfoLlm = gpt41MiniModel.withStructuredOutput(
    verbInfoOutputStructure,
  );
  const verbInfoChain = verbInfoPrompt.pipe(verbInfoLlm);

  const adjectiveInfoLlm = gpt41MiniModel.withStructuredOutput(
    adjectiveInfoOutputStructure,
  );
  const adjectiveInfoChain = adjectiveInfoPrompt.pipe(adjectiveInfoLlm);

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

  if (partOfSpeech.includes('noun')) {
    const response = await nounInfoChain.invoke({
      word: normalizedWord,
      targetLanguage,
    });
    posSpecifics = response;
  }

  if (partOfSpeech.includes('verb')) {
    const response = await verbInfoChain.invoke({
      word: normalizedWord,
      targetLanguage,
    });
    posSpecifics = response;
  }

  if (partOfSpeech.includes('adjective')) {
    const response = await adjectiveInfoChain.invoke({
      word: normalizedWord,
      targetLanguage,
    });
    posSpecifics = response;
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
