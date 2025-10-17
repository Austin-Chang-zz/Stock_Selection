
/**
 * Database Schema Definition
 * 
 * This file defines the PostgreSQL database schema using Drizzle ORM.
 * It includes three main tables for stock market data management:
 * - stocks: Master table of stock information
 * - stock_prices: Daily OHLCV (Open, High, Low, Close, Volume) price data
 * - crossover_signals: Moving average crossover signals for trading analysis
 * 
 * The schema also includes Zod validation schemas for type-safe data insertion.
 */

import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, integer, timestamp, index, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

/**
 * Stocks Table
 * 
 * Master table storing basic information about stocks traded on the Taiwan Stock Exchange.
 * Each stock has a unique code (e.g., "2330" for TSMC) and a display name.
 * 
 * Columns:
 * - id: UUID primary key, auto-generated
 * - code: Stock ticker symbol, unique identifier (e.g., "2330", "2317")
 * - name: Company name in Chinese (e.g., "台積電", "鴻海")
 * - createdAt: Timestamp when the record was created
 * 
 * Indexes:
 * - code_idx: Index on stock code for faster lookups
 */
export const stocks = pgTable("stocks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  codeIdx: index("code_idx").on(table.code),
}));

/**
 * Stock Prices Table
 * 
 * Stores daily OHLCV (Open, High, Low, Close, Volume) price data for stocks.
 * This is the primary data source for technical analysis and chart generation.
 * 
 * Columns:
 * - id: UUID primary key, auto-generated
 * - stockCode: Foreign key reference to stocks.code
 * - date: Trading date in YYYY-MM-DD format (e.g., "2024-01-15")
 * - openPrice: Opening price of the day
 * - closePrice: Closing price of the day
 * - highPrice: Highest price of the day
 * - lowPrice: Lowest price of the day
 * - volume: Number of shares traded (stored as text for large numbers)
 * - volumeValue: Total trading value in TWD (stored as text for large numbers)
 * - createdAt: Timestamp when the record was created
 * 
 * Indexes:
 * - stock_date_idx: Composite index on (stockCode, date) for efficient queries
 * - date_idx: Index on date for date-range queries
 * 
 * Constraints:
 * - unique_stock_date: Ensures only one price record per stock per day
 */
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

/**
 * Crossover Signals Table
 * 
 * Stores moving average crossover signals for technical analysis.
 * Crossover signals occur when:
 * - Golden Cross: MA10 crosses above MA50 (bullish signal)
 * - Death Cross: MA10 crosses below MA50 (bearish signal)
 * 
 * Columns:
 * - id: UUID primary key, auto-generated
 * - stockCode: Foreign key reference to stocks.code
 * - signalType: Type of crossover ("golden" or "death")
 * - crossDate: Date when the crossover occurred (YYYY-MM-DD format)
 * - price: Stock closing price on the crossover date
 * - ma10: 10-day moving average value at crossover
 * - ma50: 50-day moving average value at crossover
 * - volumeRank: Ranking of trading volume (1 = highest volume)
 * - createdAt: Timestamp when the record was created
 * 
 * Indexes:
 * - cross_date_idx: Index on crossDate for date-range queries
 * - signal_type_idx: Index on signalType for filtering by signal type
 * 
 * Constraints:
 * - unique_signal: Ensures only one signal per stock per date per type
 */
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

/**
 * Zod Validation Schemas
 * 
 * These schemas provide runtime type validation for data insertion.
 * They are auto-generated from the Drizzle table definitions and pick only
 * the fields that should be provided during insertion (excluding auto-generated fields).
 */

// Stock insertion schema - validates stock code and name
export const insertStockSchema = createInsertSchema(stocks).pick({
  code: true,
  name: true,
});

// Stock price insertion schema - validates all OHLCV fields
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

// Crossover signal insertion schema - validates signal data
export const insertCrossoverSignalSchema = createInsertSchema(crossoverSignals).pick({
  stockCode: true,
  signalType: true,
  crossDate: true,
  price: true,
  ma10: true,
  ma50: true,
  volumeRank: true,
});

/**
 * TypeScript Types
 * 
 * These type aliases provide type-safe interfaces for working with the database.
 * - Insert types: Used when inserting new records
 * - Select types: Represent the full record structure including auto-generated fields
 */

export type InsertStock = z.infer<typeof insertStockSchema>;
export type Stock = typeof stocks.$inferSelect;

export type InsertStockPrice = z.infer<typeof insertStockPriceSchema>;
export type StockPrice = typeof stockPrices.$inferSelect;

export type InsertCrossoverSignal = z.infer<typeof insertCrossoverSignalSchema>;
export type CrossoverSignal = typeof crossoverSignals.$inferSelect;
