import { createAnthropic } from '@ai-sdk/anthropic';

import { environment } from '@/config/environment.config';

const { anthropicApiKey } = environment;

const anthropic = createAnthropic({
  apiKey: anthropicApiKey,
});

export const claudeSonnet45Model = anthropic('claude-sonnet-4-5');
