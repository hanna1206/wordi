import { gpt41MiniModel } from '@/services/llm/gpt-4.1-mini';

import {
  outputStructure,
  translateToLanguagePrompt,
} from './prompts/translate-to-language';

export const translateWord = async (word: string, targetLanguage: string) => {
  const structuredLlm = gpt41MiniModel.withStructuredOutput(outputStructure);

  const chain = translateToLanguagePrompt.pipe(structuredLlm);

  const response = await chain.invoke({
    word,
    targetLanguage,
  });

  return response;
};
