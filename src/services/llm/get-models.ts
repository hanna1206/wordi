import { environment } from '@/config/environment.config';

import { geminiFlash25Model } from './gemini-flash-2.5';
import { geminiFlash3Model } from './gemini-flash-3';
import { gpt41Model } from './gpt-4.1';
import { gpt41MiniModel } from './gpt-4.1-mini';

export const getModels = () => {
  const provider = environment.llmProvider;

  if (provider === 'google') {
    return {
      fast: geminiFlash25Model,
      standard: geminiFlash3Model,
    };
  }

  // Default to OpenAI
  return {
    fast: gpt41MiniModel,
    standard: gpt41Model,
  };
};
