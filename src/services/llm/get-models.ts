import { environment } from '@/config/environment.config';

// import { claudeHaiku45Model } from './claude-haiku-4.5';
import { claudeSonnet45Model } from './claude-sonnet-4.5';
// import { geminiFlash25LiteModel } from './gemini-flash-2.5-lite';
import { geminiFlash3Model } from './gemini-flash-3';
import { gpt41Model } from './gpt-4.1';
// import { gpt41MiniModel } from './gpt-4.1-mini';
import { gpt52Model } from './gpt-5.2';

export const getModels = () => {
  const provider = environment.llmProvider;

  if (provider === 'google') {
    return {
      fast: geminiFlash3Model,
      standard: geminiFlash3Model,
    };
  } else if (provider === 'anthropic') {
    return {
      fast: claudeSonnet45Model,
      standard: claudeSonnet45Model,
    };
  }

  // Default to OpenAI
  return {
    fast: gpt52Model,
    standard: gpt41Model,
  };
};
