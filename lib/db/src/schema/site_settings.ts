import { pgTable, text, varchar } from "drizzle-orm/pg-core";

export const siteSettings = pgTable("site_settings", {
  key: varchar("key", { length: 100 }).primaryKey(),
  value: text("value").notNull(),
});
