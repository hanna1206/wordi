# Code Style Guide

This document describes the code style, conventions, and architectural patterns used in this Next.js project. Use this as a reference when working with AI assistants or onboarding new developers.

## Table of Contents

- [Project Overview](#project-overview)
- [Code Formatting](#code-formatting)
- [TypeScript Configuration](#typescript-configuration)
- [File and Folder Structure](#file-and-folder-structure)
- [Naming Conventions](#naming-conventions)
- [Module Architecture](#module-architecture)
- [React Components](#react-components)
- [Server Actions](#server-actions)
- [Database and Schema](#database-and-schema)
- [Import Organization](#import-organization)
- [Error Handling](#error-handling)
- [Code Quality Tools](#code-quality-tools)

---

## Project Overview

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **UI Library**: Chakra UI v3
- **Database ORM**: Drizzle ORM
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **Error Tracking**: Sentry
- **Package Manager**: npm

---

## Code Formatting

### Prettier Configuration

```json
{
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 80,
  "endOfLine": "auto"
}
```

**Key Rules:**

- Use single quotes for strings
- Always include trailing commas
- Maximum line width of 80 characters
- Auto line endings (cross-platform compatibility)

### Pre-commit Hooks

Lint-staged runs on commit:

- ESLint with auto-fix
- TypeScript type checking (no emit)
- Prettier formatting

---

## TypeScript Configuration

**Strict Mode Enabled:**

- `strict: true`
- `noEmit: true` (type checking only)
- `esModuleInterop: true`
- `isolatedModules: true`

**Path Aliases:**

```typescript
"@/*": ["./src/*"]
```

**Usage Example:**

```typescript
import { withAuth } from '@/modules/auth/utils/with-auth';
import { toaster } from '@/components/toaster';
```

---

## File and Folder Structure

### Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (app)/             # Authenticated app routes (route group)
│   ├── (auth)/            # Auth-related routes (route group)
│   └── api/               # API routes
├── components/            # Shared/global components
├── config/                # Configuration files
├── db/                    # Database client and schema
│   └── schema/            # Drizzle schema definitions
├── modules/               # Feature modules (domain-driven)
│   └── [module-name]/
│       ├── components/    # Module-specific components
│       ├── hooks/         # Module-specific hooks
│       ├── pages/         # Module page components
│       ├── utils/         # Module utilities
│       ├── [module].actions.ts      # Server actions
│       ├── [module].repository.ts   # Database queries
│       ├── [module].schema.ts       # Drizzle schema
│       ├── [module].service.ts      # Business logic
│       ├── [module].types.ts        # TypeScript types
│       ├── [module].const.ts        # Constants
│       └── [module].validation.ts   # Validation schemas
├── services/              # External service integrations
│   ├── llm/              # LLM service clients
│   └── supabase/         # Supabase client utilities
└── utils/                # Global utility functions
```

### Module Organization

Each feature module follows a consistent structure:

**Required Files:**

- `[module].types.ts` - TypeScript interfaces and types
- `[module].actions.ts` - Server actions (marked with `'use server'`)

**Optional Files (as needed):**

- `[module].repository.ts` - Database queries (Drizzle)
- `[module].schema.ts` - Database schema (Drizzle)
- `[module].service.ts` - Business logic
- `[module].const.ts` - Constants and enums
- `[module].validation.ts` - Zod validation schemas
- `components/` - Module-specific React components
- `hooks/` - Module-specific React hooks
- `pages/` - Full page components (named `[name].page.tsx`)
- `utils/` - Module-specific utilities

---

## Naming Conventions

### Files

| Type       | Convention                    | Example                    |
| ---------- | ----------------------------- | -------------------------- |
| Components | PascalCase + kebab-case       | `vocabulary-table.tsx`     |
| Pages      | kebab-case + `.page.tsx`      | `vocabulary.page.tsx`      |
| Hooks      | kebab-case + `use-` prefix    | `use-vocabulary-list.ts`   |
| Actions    | kebab-case + `.actions.ts`    | `vocabulary.actions.ts`    |
| Types      | kebab-case + `.types.ts`      | `vocabulary.types.ts`      |
| Schema     | kebab-case + `.schema.ts`     | `vocabulary.schema.ts`     |
| Repository | kebab-case + `.repository.ts` | `vocabulary.repository.ts` |
| Service    | kebab-case + `.service.ts`    | `auth.service.ts`          |
| Utils      | kebab-case                    | `with-auth.ts`             |
| Constants  | kebab-case + `.const.ts`      | `linguistics.const.ts`     |

### Variables and Functions

```typescript
// camelCase for variables and functions
const userName = 'John';
const fetchUserData = async () => {};

// PascalCase for React components
export const VocabularyTable = () => {};

// PascalCase for types and interfaces
interface UserSettings {}
type ActionResult<T> = {};

// SCREAMING_SNAKE_CASE for constants
const DEFAULT_PAGE_SIZE = 30;
const API_BASE_URL = 'https://api.example.com';

// Enums use PascalCase
enum PartOfSpeech {
  NOUN = 'noun',
  VERB = 'verb',
}
```

### Database Tables

```typescript
// Table names: camelCase + 'Table' suffix
export const vocabularyItemsTable = pgTable('vocabulary_items', {
  // Column names in schema: camelCase
  userId: uuid('user_id').notNull(),
  normalizedText: text('normalized_text').notNull(),
  // Actual database column names: snake_case
});
```

---

## Module Architecture

### Layered Architecture

```
┌─────────────────────────────────────┐
│  Components / Pages (Client)       │
│  - React components                 │
│  - Hooks                            │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│  Actions (Server)                   │
│  - 'use server' directive           │
│  - Input validation                 │
│  - Authentication/Authorization     │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│  Services (Business Logic)          │
│  - Domain logic                     │
│  - External API calls               │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│  Repository (Data Access)           │
│  - Database queries (Drizzle)       │
│  - Data transformation              │
└─────────────────────────────────────┘
```

### Higher-Order Functions (HOF) Pattern

Use HOFs for cross-cutting concerns:

```typescript
// Authentication wrapper
export const withAuth = <TInput, TOutput>(
  handler: (
    context: AuthenticatedContext,
    input: TInput,
  ) => Promise<ActionResult<TOutput>>,
) => {
  return async (input: TInput): Promise<ActionResult<TOutput>> => {
    const authResult = await getAuthenticatedUser();

    if (!authResult.success || !authResult.user) {
      return {
        success: false,
        error: authResult.error || 'Authentication required',
      };
    }

    const context: AuthenticatedContext = {
      user: authResult.user,
    };

    return await handler(context, input);
  };
};

// Usage in actions
export const deleteWord = withAuth<{ wordId: string }, void>(
  async (context, { wordId }): Promise<ActionResult<void>> => {
    await vocabularyRepository.deleteItem(wordId, context.user.id);
    return { success: true };
  },
);
```

**Common HOFs:**

- `withAuth` - Ensures user is authenticated
- `withUserSettings` - Provides user settings context (extends `withAuth`)

---

## React Components

### Component Structure

```typescript
'use client'; // Only for client components

import { memo, useState } from 'react';
import { LuIcon } from 'react-icons/lu';

import { Box, Flex, Text } from '@chakra-ui/react';

import { toaster } from '@/components/toaster';

interface ComponentProps {
  items: Item[];
  onItemClick: (id: string) => void;
}

export const ComponentName = memo<ComponentProps>((props) => {
  const { items, onItemClick } = props;
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (id: string): Promise<void> => {
    setIsLoading(true);
    // ... logic
    setIsLoading(false);
  };

  return (
    <Box>
      {/* Component JSX */}
    </Box>
  );
});

ComponentName.displayName = 'ComponentName';
```

**Key Patterns:**

- Use `memo` for performance optimization
- Destructure props immediately
- Use explicit return types for handlers (`: Promise<void>`, `: void`)
- Set `displayName` for debugging
- Use `'use client'` directive only when needed

### Hooks

```typescript
export const useVocabularyList = (
  sortOption: VocabularySortOption,
  searchQuery?: string,
) => {
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<Item[]>([]);

  const loadItems = useCallback(async () => {
    // ... logic
  }, [sortOption, searchQuery]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  return {
    isLoading,
    items,
    loadItems,
  };
};
```

**Hook Patterns:**

- Return object with named properties (not array)
- Use `useCallback` for functions returned from hooks
- Use `useRef` for values that shouldn't trigger re-renders
- Prefix custom hooks with `use`

---

## Server Actions

### Action Structure

```typescript
'use server';

import * as Sentry from '@sentry/nextjs';

import { withAuth } from '@/modules/auth/utils/with-auth';
import type { ActionResult } from '@/shared-types';

import * as repository from './module.repository';
import type { ModuleItem } from './module.types';

export const actionName = withAuth<InputType, OutputType>(
  async (context, input): Promise<ActionResult<OutputType>> => {
    // Validate input
    if (!input.requiredField) {
      return {
        success: false,
        error: 'Validation error message',
      };
    }

    try {
      // Business logic
      const result = await repository.doSomething(context.user.id, input);

      return { success: true, data: result };
    } catch (error) {
      Sentry.captureException(error);

      // Handle specific errors
      if (error instanceof Error && error.message.includes('duplicate')) {
        return {
          success: false,
          error: 'User-friendly error message',
        };
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Generic error',
      };
    }
  },
);
```

**Action Patterns:**

- Always use `'use server'` directive at top of file
- Wrap with `withAuth` or `withUserSettings` for protected actions
- Return `ActionResult<T>` type
- Capture exceptions with Sentry
- Provide user-friendly error messages
- Use repository pattern for database access

### ActionResult Type

```typescript
export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
```

---

## Database and Schema

### Drizzle Schema

```typescript
import { sql } from 'drizzle-orm';
import {
  boolean,
  index,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

export const statusEnum = pgEnum('status', ['active', 'inactive']);

export const tableName = pgTable(
  'table_name',
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    userId: uuid('user_id').notNull(),
    name: text('name').notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    metadata: jsonb('metadata').default({}).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .default(sql`timezone('utc'::text, now())`)
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .default(sql`timezone('utc'::text, now())`)
      .notNull(),
  },
  (table) => [
    // Indexes
    index('idx_table_name_user_id').on(table.userId),
    index('idx_table_name_created_at').on(table.createdAt.desc()),

    // Composite indexes for common queries
    index('idx_table_name_user_active').on(table.userId, table.isActive),

    // Unique constraints
    uniqueIndex('idx_table_name_unique').on(table.userId, table.name),
  ],
);
```

**Schema Patterns:**

- Use `uuid` for primary keys with `uuid_generate_v4()` default
- Use `timestamp` with timezone and string mode
- Use `jsonb` for flexible data structures
- Create indexes for frequently queried columns
- Use composite indexes for common query patterns
- Use `pgEnum` for fixed value sets

### Repository Pattern

```typescript
import { and, asc, desc, eq, ilike, inArray } from 'drizzle-orm';

import { db } from '@/db/client';

import { tableName } from './module.schema';
import type { ModuleItem } from './module.types';

const create = async (
  data: typeof tableName.$inferInsert,
): Promise<ModuleItem> => {
  const [item] = await db.insert(tableName).values(data).returning();
  return item as ModuleItem;
};

const getByUserId = async (
  userId: string,
  limit = 20,
  offset = 0,
): Promise<{ items: ModuleItem[]; total: number }> => {
  const whereConditions = [eq(tableName.userId, userId)];

  const [items, [{ total }]] = await Promise.all([
    db
      .select()
      .from(tableName)
      .where(and(...whereConditions))
      .orderBy(desc(tableName.createdAt))
      .limit(limit)
      .offset(offset),

    db
      .select({ total: count() })
      .from(tableName)
      .where(and(...whereConditions)),
  ]);

  return { items: items as ModuleItem[], total: total ?? 0 };
};

const deleteItem = async (id: string, userId: string): Promise<void> => {
  await db
    .delete(tableName)
    .where(and(eq(tableName.id, id), eq(tableName.userId, userId)));
};

export { create, deleteItem, getByUserId };
```

**Repository Patterns:**

- Export named functions (not default export)
- Use Drizzle query builder
- Use `and()` for multiple conditions
- Fetch data and count in parallel with `Promise.all`
- Always filter by `userId` for security
- Return typed results

---

## Import Organization

### Import Order (enforced by ESLint)

```typescript
// 1. Side effect imports
import './setup';

// 2. React
import { useCallback, useState } from 'react';

// 3. Third-party libraries (@ prefixed, then others)
import { Box, Flex } from '@chakra-ui/react';
import { sql } from 'drizzle-orm';

// 4. Type imports from third-party libraries
import type { User } from '@supabase/supabase-js';

// 5. Absolute imports from project (@/)
import { withAuth } from '@/modules/auth/utils/with-auth';
import { toaster } from '@/components/toaster';

// 6. Type imports from project
import type { ActionResult } from '@/shared-types';

// 7. Relative imports
import { formatDate } from '../utils/format-date';
import type { ModuleItem } from './module.types';
```

**Rules:**

- Imports are automatically sorted by `eslint-plugin-simple-import-sort`
- Run `npm run lint:js` to auto-fix import order
- Separate type imports from value imports

---

## Error Handling

### Client-Side (Components)

```typescript
import { toaster } from '@/components/toaster';

const handleAction = async (): Promise<void> => {
  const result = await someAction({ input });

  if (result.success) {
    toaster.create({
      type: 'success',
      title: 'Success',
      description: 'Action completed successfully',
    });
  } else {
    toaster.create({
      type: 'error',
      title: 'Error',
      description: result.error || 'Something went wrong',
    });
  }
};
```

### Server-Side (Actions)

```typescript
'use server';

import * as Sentry from '@sentry/nextjs';

export const action = async (): Promise<ActionResult<Data>> => {
  try {
    // ... logic
    return { success: true, data };
  } catch (error) {
    Sentry.captureException(error);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
```

**Error Handling Rules:**

- Never use `console.log` (ESLint error: `no-console`)
- Use `console.error` only in catch blocks (with ESLint disable comment)
- Always capture exceptions with Sentry in server actions
- Return user-friendly error messages
- Use `ActionResult` pattern for consistent error handling

---

## Code Quality Tools

### ESLint Rules

```javascript
{
  'no-console': 'error',  // Prevent console.log
  'simple-import-sort/imports': 'error',  // Enforce import order
  'simple-import-sort/exports': 'error',  // Enforce export order
  'prettier/prettier': 'error',  // Enforce Prettier formatting
}
```

### Scripts

```bash
# Development
npm run dev                 # Start dev server

# Linting
npm run lint               # Run ESLint + TypeScript checks
npm run lint:js            # Run ESLint with auto-fix
npm run lint:types         # Run TypeScript type checking
npm run prettier           # Format all files

# Database
npm run db:generate        # Generate migrations
npm run db:migrate         # Run migrations
npm run db:push            # Push schema changes
npm run db:studio          # Open Drizzle Studio

# Dependency Analysis
npm run deps:check         # Check for circular dependencies
npm run deps:orphans       # Find unused files
npm run deps:draw          # Generate dependency graph
```

### Madge Configuration

```json
{
  "detectiveOptions": {
    "ts": {
      "skipTypeImports": true
    }
  }
}
```

Circular dependencies are not allowed and checked in CI.

---

## Best Practices Summary

### Do's ✅

- Use TypeScript strict mode
- Use path aliases (`@/`) for imports
- Wrap server actions with `withAuth` or `withUserSettings`
- Use `ActionResult<T>` for action return types
- Capture exceptions with Sentry
- Use repository pattern for database access
- Use `memo` for React components
- Set `displayName` on memoized components
- Use Prettier for formatting
- Use ESLint auto-fix before committing
- Use named exports (not default exports) for utilities
- Use kebab-case for file names
- Use PascalCase for component names
- Use camelCase for variables and functions

### Don'ts ❌

- Don't use `console.log` (use Sentry or proper logging)
- Don't skip TypeScript type checking
- Don't access database directly from components
- Don't use default exports for utilities
- Don't create circular dependencies
- Don't bypass authentication checks
- Don't expose sensitive data in client components
- Don't use `any` type (use `unknown` if needed)
- Don't commit without running linters
- Don't use inline styles (use Chakra UI props)

---

## Additional Notes

### Chakra UI v3

This project uses Chakra UI v3 with the new component API:

```typescript
// Compound components
<Card.Root>
  <Card.Body>
    <Card.Title>Title</Card.Title>
  </Card.Body>
</Card.Root>

// Responsive props
<Box display={{ base: 'block', md: 'none' }} />

// Color tokens
<Text color="fg.muted" />
<Box bg="bg.muted" />
```

### Next.js App Router

- Use route groups for layout organization: `(app)`, `(auth)`
- Server components by default (add `'use client'` when needed)
- Use `loading.tsx` for loading states
- Use `error.tsx` for error boundaries
- Use `not-found.tsx` for 404 pages

### Supabase Integration

- Use `createClient()` from `@/services/supabase/server` for server-side
- Use `createClient()` from `@/services/supabase/client` for client-side
- Authentication is handled via Supabase Auth
- Database access is via Drizzle ORM (not Supabase client)

---

**Last Updated**: January 2026
**Version**: 1.0.0
