export const environment = {
  supabaseApiUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  appUrl: process.env.NEXT_PUBLIC_APP_URL,
  langSmithTracing: process.env.LANGSMITH_TRACING,
  langSmithEndpoint: process.env.LANGSMITH_ENDPOINT,
  langSmithApiKey: process.env.LANGSMITH_API_KEY,
  langSmithProject: process.env.LANGSMITH_PROJECT,
  openAIApiKey: process.env.OPENAI_API_KEY,
  googleAiApiKey: process.env.GOOGLE_AI_API_KEY,
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  llmProvider: process.env.LLM_PROVIDER || 'openai',
};
