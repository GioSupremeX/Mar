import { pgTable, serial, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";

export const artworks = pgTable("artworks", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 100 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  imageUrl: text("image_url").notNull(),
  description: text("description"),
  position: integer("position").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Artwork = typeof artworks.$inferSelect;
export type InsertArtwork = typeof artworks.$inferInsert;
