# Wordi - AI Agent Instructions

## Project Overview

Next.js 15 app for learning German vocabulary with AI-powered flashcards and spaced repetition.

## Architecture

### Module-Based Structure

Code organized in `src/modules/` by feature domain:

- **auth**: Supabase authentication, `withAuth()` HOF for protected actions
- **flashcards**: Spaced repetition algorithm (SM-2), game modes (Latest/Review)
- **linguistics**: OpenAI/LangChain integration for German word analysis (prompts in `prompts/`)
- **vocabulary**: Word storage with JSONB fields for flexible linguistic data
- **user-settings**: Onboarding flow, language preferences

Each module follows pattern: `*.actions.ts` (Server Actions), `*.repository.ts` (DB layer), `*.schema.ts` (Drizzle schema), `*.types.ts` (TypeScript types)

### Data Layer

- **Drizzle ORM** with Postgres via `src/db/client.ts`
- Schema split across modules, exported via `src/db/schema/index.ts`
- Types inferred from schema: `typeof table.$inferSelect` / `.$inferInsert`
- Enums defined in `src/db/shared.ts` (e.g., `partOfSpeechEnum`)
- Relations defined in `src/db/relations.ts`

### Next.js Patterns

- **Route Groups**: `(app)` for authenticated pages, `(auth)` for public auth pages
- **Server Actions**: All `*.actions.ts` files use `'use server'` directive
- **Auth Guard**: `withAuth<TInput, TOutput>()` HOF returns `ActionResult<T>` with `{success, data?, error?}` shape
- **Middleware**: `src/middleware.ts` refreshes Supabase session on all requests
- **Dynamic Rendering**: App routes use `export const dynamic = 'force-dynamic'`

### AI Integration

- LLM models configured in `src/services/llm/` (gpt-4.1, gpt-5-mini, etc.)
- Prompts use LangChain `PromptTemplate` with Zod schemas for structured output
- Example: `linguistics.service.ts` orchestrates multiple prompt calls for word enrichment
- LangSmith tracing available via `LANGSMITH_*` env vars

## Key Workflows

### Development Commands

```bash
npm run dev              # Start Next.js dev server
supabase start           # Start local Supabase (Postgres + Auth + Studio)
supabase db reset        # Apply migrations to local DB
npm run db:studio        # Open Drizzle Studio
npm run lint             # ESLint + TypeScript type check
npm run deps:check       # Detect circular dependencies (madge)
```

### Database Workflow

1. Define schema in module's `*.schema.ts` (e.g., `vocabulary.schema.ts`)
2. Export from `src/db/schema/index.ts`
3. Run `npm run db:generate` to create migration
4. Run `npm run db:migrate` (or `supabase db reset` locally)

### Pre-commit Checks

Husky runs `lint-staged` (formats, lints, type-checks) + `madge --circular` on commit

## Code Conventions

### Import Sorting

ESLint enforces 7-group order via `simple-import-sort`:

1. Side effects
2. React, then `@`-prefixed libs, then other libs
3. Type imports from third-party libs
4. Absolute imports from `@/` (TypeScript alias for `src/`)
5. Type imports from project
6. Relative imports
7. Other (e.g., CSS)

Example:

```typescript
'use server';

import { gpt41Model } from '@/services/llm/gpt-4.1';

import type { ActionResult } from '@/shared-types';
```

### Naming Conventions

- **Files**: kebab-case with suffix (e.g., `flashcards.actions.ts`, `spaced-repetition.utils.ts`)
- **Database fields**: snake_case (Drizzle schema mirrors Postgres)
- **TypeScript**: camelCase for variables/functions, PascalCase for types/components
- **Server Actions**: Return `ActionResult<T>` with `{success: boolean, data?: T, error?: string}`

### Error Handling

- Use Sentry for exceptions: `Sentry.captureException(error)`
- No `console.log` in production (ESLint enforces `no-console: error`)
- Server Actions wrap try-catch and return `{success: false, error: '...'}`

### Environment Variables

All vars read from `src/config/environment.config.ts`:

- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `DATABASE_URL` (for Drizzle)
- `OPENAI_API_KEY`
- Optional: `LANGSMITH_*` for LLM tracing

## Project-Specific Patterns

### Supabase Client Creation

Always use `src/services/supabase/server.ts` for SSR:

```typescript
import { createClient } from '@/services/supabase/server';
const supabase = await createClient();
```

### Protected Server Actions

```typescript
export const myAction = withAuth<InputType, OutputType>(
  async (context, input) => {
    const userId = context.user.id; // Authenticated user guaranteed
    // ... business logic
    return { success: true, data: result };
  },
);
```

### Flashcard Algorithm

SM-2 spaced repetition in `flashcards/utils/spaced-repetition.utils.ts`. Quality scores (0-5) adjust easiness factor and interval. Note: DB fields use snake_case directly in utils to avoid conversion overhead.

### Vocabulary Item Storage

Vocabulary items (words and collocations) stored in `vocabularyItemsTable` with:

- `type`: Discriminator field ('word' or 'collocation')
- `normalizedText`: Canonical form (e.g., infinitive verb or normalized collocation)
- `sortableText`: Text prepared for alphabetical sorting (articles removed, lowercase)
- `commonData`: JSONB for shared metadata (translations, examples, collocations) for words, or all the data for collocatons
- `specificData`: JSONB for type-specific data (noun gender, verb conjugations, component words, etc.)
- `vocabularyCacheView`: Deduplicated across users for performance

Note: `wordsTable`, `normalizedWord`, `sortableWord`, `partSpecificData`, `wordCacheView`, and `CommonWordData` are deprecated aliases maintained for backward compatibility.

### LLM Prompts

Each prompt in `linguistics/prompts/` exports:

1. `PromptTemplate` with placeholders
2. `outputStructure` Zod schema for parsing

LangChain's `withStructuredOutput()` enforces schema on LLM responses.

## Testing & Quality

- No unit tests yet (speed-first approach)
- Madge enforces no circular dependencies
- ESLint 9 with strict TypeScript checks
- Prettier for formatting (runs on save and pre-commit)

## Common Pitfalls

- Don't use `process.env.*` directly—import from `environment.config.ts`
- Server Actions must be async and return `ActionResult<T>`
- Don't forget `'use server'` directive at top of actions file
- Use `await createClient()` for Supabase in SSR context
- Import DB schema from `@/db/schema` (re-exported), not module schemas directly

- for icons use only `react-icons/lu` package
- always prefer self-explanatory code over comments
