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

const create = async (data: {
  userId: string;
  email: string;
  name: string;
  nativeLanguage: LanguageCode;
}) => {
  const [created] = await db
    .insert(userSettingsTable)
    .values({
      userId: data.userId,
      email: data.email,
      name: data.name,
      nativeLanguage: data.nativeLanguage,
    })
    .returning();

  return created;
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

const upsert = async (data: {
  userId: string;
  email: string;
  name: string;
  nativeLanguage: LanguageCode;
}) => {
  const { userId, email, name, nativeLanguage } = data;
  const [upserted] = await db
    .insert(userSettingsTable)
    .values({
      userId,
      email,
      name,
      nativeLanguage,
    })
    .onConflictDoUpdate({
      target: userSettingsTable.userId,
      set: {
        name: data.name,
        nativeLanguage: data.nativeLanguage,
      },
    })
    .returning();

  return upserted;
};

export { create, getByUserId, update, upsert };
