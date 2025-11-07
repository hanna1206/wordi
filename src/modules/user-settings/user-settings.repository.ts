import { eq } from 'drizzle-orm';

import { db } from '@/db/client';

import { LanguageCode } from './user-settings.const';
import { userSettingsTable } from './user-settings.schema';

const getByUserId = async (userId: string) => {
  const [settings] = await db
    .select()
    .from(userSettingsTable)
    .where(eq(userSettingsTable.userId, userId));

  return settings || null;
};

const update = async (
  userId: string,
  data: {
    name?: string;
    nativeLanguage?: LanguageCode;
  },
) => {
  const [updated] = await db
    .update(userSettingsTable)
    .set({
      name: data.name,
      nativeLanguage: data.nativeLanguage,
    })
    .where(eq(userSettingsTable.userId, userId))
    .returning();

  return updated;
};

export { getByUserId, update };
