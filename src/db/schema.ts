import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const cards = sqliteTable('cards', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  japanese: text('japanese').notNull(),
  reading: text('reading'),
  meaning: text('meaning').notNull(),
  createdAt: integer('created_at').notNull().$defaultFn(() => Date.now()),
  lastReviewedAt: integer('last_reviewed_at'),
  dueAt: integer('due_at'),
  status: text('status').default('new'), // new, learning, graduated
});