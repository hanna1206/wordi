import { ChatOpenAI } from '@langchain/openai';

import { environment } from '@/config/environment.config';

const { openAiApiKey, openAiModel } = environment;

export const openAiClient = new ChatOpenAI({
  model: openAiModel,
  apiKey: openAiApiKey,
});
