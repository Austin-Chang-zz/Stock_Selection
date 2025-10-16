import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, integer, timestamp, index, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const stocks = pgTable("stocks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  codeIdx: index("code_idx").on(table.code),
}));

export const stockPrices = pgTable("stock_prices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  stockCode: text("stock_code").notNull().references(() => stocks.code),
  date: text("date").notNull(),
  openPrice: decimal("open_price", { precision: 10, scale: 2 }).notNull(),
  closePrice: decimal("close_price", { precision: 10, scale: 2 }).notNull(),
  highPrice: decimal("high_price", { precision: 10, scale: 2 }).notNull(),
  lowPrice: decimal("low_price", { precision: 10, scale: 2 }).notNull(),
  volume: text("volume").notNull(),
  volumeValue: text("volume_value").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  stockDateIdx: index("stock_date_idx").on(table.stockCode, table.date),
  dateIdx: index("date_idx").on(table.date),
  uniqueStockDate: unique("unique_stock_date").on(table.stockCode, table.date),
}));

export const crossoverSignals = pgTable("crossover_signals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  stockCode: text("stock_code").notNull().references(() => stocks.code),
  signalType: text("signal_type").notNull(),
  crossDate: text("cross_date").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  ma10: decimal("ma10", { precision: 10, scale: 2 }).notNull(),
  ma50: decimal("ma50", { precision: 10, scale: 2 }).notNull(),
  volumeRank: integer("volume_rank"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  crossDateIdx: index("cross_date_idx").on(table.crossDate),
  signalTypeIdx: index("signal_type_idx").on(table.signalType),
  uniqueSignal: unique("unique_signal").on(table.stockCode, table.crossDate, table.signalType),
}));

export const insertStockSchema = createInsertSchema(stocks).pick({
  code: true,
  name: true,
});

export const insertStockPriceSchema = createInsertSchema(stockPrices).pick({
  stockCode: true,
  date: true,
  openPrice: true,
  closePrice: true,
  highPrice: true,
  lowPrice: true,
  volume: true,
  volumeValue: true,
});

export const insertCrossoverSignalSchema = createInsertSchema(crossoverSignals).pick({
  stockCode: true,
  signalType: true,
  crossDate: true,
  price: true,
  ma10: true,
  ma50: true,
  volumeRank: true,
});

export type InsertStock = z.infer<typeof insertStockSchema>;
export type Stock = typeof stocks.$inferSelect;

export type InsertStockPrice = z.infer<typeof insertStockPriceSchema>;
export type StockPrice = typeof stockPrices.$inferSelect;

export type InsertCrossoverSignal = z.infer<typeof insertCrossoverSignalSchema>;
export type CrossoverSignal = typeof crossoverSignals.$inferSelect;
