import { createGoogleGenerativeAI } from '@ai-sdk/google';

import { environment } from '@/config/environment.config';

const { googleAiApiKey } = environment;

const google = createGoogleGenerativeAI({
  apiKey: googleAiApiKey,
});

export const geminiFlash25Model = google('gemini-2.5-flash');
