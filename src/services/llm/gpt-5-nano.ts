import { ChatOpenAI } from '@langchain/openai';

import { environment } from '@/config/environment.config';

const { openAIApiKey } = environment;

export const gpt5NanoModel = new ChatOpenAI({
  apiKey: openAIApiKey,
  model: 'gpt-5-nano',
});
