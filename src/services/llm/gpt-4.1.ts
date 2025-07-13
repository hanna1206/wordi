import { ChatOpenAI } from '@langchain/openai';

import { environment } from '@/config/environment.config';

const { openAIApiKey } = environment;

export const gpt41Model = new ChatOpenAI({
  apiKey: openAIApiKey,
  model: 'gpt-4.1',
});
