import { createOpenAI } from '@ai-sdk/openai';

import { environment } from '@/config/environment.config';

const { openAIApiKey } = environment;

const openai = createOpenAI({
  apiKey: openAIApiKey,
});

export const gpt41NanoModel = openai('gpt-4.1-nano');
