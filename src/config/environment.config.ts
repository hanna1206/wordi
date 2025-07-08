export const environment = {
  // Supabase configuration
  supabaseApiUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  appUrl: process.env.NEXT_PUBLIC_APP_URL,
  // LangSmith configuration
  langSmithTracing: process.env.LANGSMITH_TRACING,
  langSmithEndpoint: process.env.LANGSMITH_ENDPOINT,
  langSmithApiKey: process.env.LANGSMITH_API_KEY,
  langSmithProject: process.env.LANGSMITH_PROJECT,
  // OpenAI configuration
  openAIApiKey: process.env.OPENAI_API_KEY,
};
