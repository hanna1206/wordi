import { createAnthropic } from '@ai-sdk/anthropic';

import { environment } from '@/config/environment.config';

const { anthropicApiKey } = environment;

const anthropic = createAnthropic({
  apiKey: anthropicApiKey,
});

export const claudeHaiku45Model = anthropic('claude-haiku-4-5');
