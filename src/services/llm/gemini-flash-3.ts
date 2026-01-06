import { createGoogleGenerativeAI } from '@ai-sdk/google';

import { environment } from '@/config/environment.config';

const { googleAiApiKey } = environment;

const google = createGoogleGenerativeAI({
  apiKey: googleAiApiKey,
});

export const geminiFlash3Model = google('gemini-3-flash-preview');
