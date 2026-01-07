import { environment } from '@/config/environment.config';

import { geminiFlash25LiteModel } from './gemini-flash-2.5-lite';
import { gpt41Model } from './gpt-4.1';
import { gpt41MiniModel } from './gpt-4.1-mini';

export const getModels = () => {
  const provider = environment.llmProvider;

  if (provider === 'google') {
    return {
      fast: geminiFlash25LiteModel,
      standard: geminiFlash25LiteModel,
    };
  }

  // Default to OpenAI
  return {
    fast: gpt41MiniModel,
    standard: gpt41Model,
  };
};
