## Wordi

A personal pet project where I experiment with ideas and new technologies. Built with Next.js.

### AI in development

I use Cursor a lot to generate code. Sometimes the code isn’t 100% clean because I prioritize speed over manual cleanup. Readability is less critical when AI can quickly explain any part of the codebase — I can always run a prompt like “Explain how this works”.

### What it does

An application to help users learn German words.
- Flash‑card game powered by a spaced repetition algorithm.

### AI in the app

The app integrates OpenAI for LLM‑powered features.
The prompting workflow doesn’t yet follow best practices and could be improved. I don’t have enough time to refine it now, but I plan to fix this later.

### Tech stack

- Framework: Next.js 15 (App Router), React 19, TypeScript 5
- UI: Chakra UI, react-icons
- Data/Auth: Supabase (Postgres, Auth)
- AI: OpenAI via LangChain
- Forms/Validation: React Hook Form, Zod
- Quality/Tooling: ESLint 9, Prettier 3, Husky, Madge

### Roadmap

- Generate exercises based on saved words.
- Vocabulary management.

### Getting started

1. Install the Supabase CLI (one-time):

```bash
npx supabase@latest --help
```

2. Start local services (Postgres, Auth, Studio):

```bash
supabase start
```

This prints the local API URL and anon key. Studio typically runs at http://localhost:54323.

3. Create `.env.local` in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=<output from "supabase start">
NEXT_PUBLIC_SUPABASE_ANON_KEY=<output from "supabase start">
NEXT_PUBLIC_APP_URL=http://localhost:3000
OPENAI_API_KEY=<your key>
```

4. Apply local migrations:

```bash
supabase db reset
```

5. Run the app:

```bash
npm run dev
```
