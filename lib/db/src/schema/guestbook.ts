import { pgTable, serial, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const guestbookMessages = pgTable("guestbook_messages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  message: text("message").notNull(),
  emoji: varchar("emoji", { length: 10 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const insertGuestbookMessageSchema = createInsertSchema(guestbookMessages).omit({ id: true, createdAt: true });
export type InsertGuestbookMessage = z.infer<typeof insertGuestbookMessageSchema>;
export type GuestbookMessage = typeof guestbookMessages.$inferSelect;
