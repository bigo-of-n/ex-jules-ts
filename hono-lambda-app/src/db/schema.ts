import { sqliteTable, text, real } from 'drizzle-orm/sqlite-core';

export const navData = sqliteTable('nav_data', {
  isin: text('isin').notNull(),
  date: text('date').notNull(), // Assuming YYYY-MM-DD format for date
  nav: real('nav').notNull(),
  code: text('code').notNull(),
});

// Define a type for the NAV data for better type safety in your application
export type NavDataItem = typeof navData.$inferSelect; // For selecting data
export type NewNavDataItem = typeof navData.$inferInsert; // For inserting data
