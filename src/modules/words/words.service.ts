import { gpt41MiniModel } from '@/services/llm/gpt-4.1-mini';

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
    const { gender, pluralForm } = await nounInfoChain.invoke({
      word: normalizedWord,
    });
    posSpecifics = {
      gender,
      pluralForm,
    };
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
