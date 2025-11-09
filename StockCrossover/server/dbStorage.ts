/**
 * Database Storage Layer
 * 
 * This module provides the PostgreSQL storage implementation using Drizzle ORM.
 * It handles all database operations for stocks, stock prices, and crossover signals.
 * 
 * Key responsibilities:
 * - Stock management (save, retrieve, check existence)
 * - Stock price data persistence with conflict handling
 * - Crossover signal storage and retrieval
 * - Market status tracking based on latest data
 */

import { db } from './db';
import { stocks, stockPrices, crossoverSignals } from "@shared/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import type {
  Stock,
  InsertStock,
  StockPrice,
  InsertStockPrice,
  CrossoverSignal,
  InsertCrossoverSignal,
} from "@shared/schema";
import type { IStorage } from "./storage";

/**
 * Alternative PostgreSQL storage implementation using Drizzle's advanced features
 * This version uses ON CONFLICT for proper upserts and raw SQL for complex queries
 */
export class PostgresStorage implements IStorage {
  /**
   * Retrieves a stock by its code.
   * @param code - The stock code to retrieve.
   * @returns The stock object if found, otherwise undefined.
   */
  async getStock(code: string): Promise<Stock | undefined> {
    const result = await db.select().from(stocks).where(eq(stocks.code, code)).limit(1);
    return result[0];
  }

  /**
   * Retrieves all stocks from the database.
   * @returns A promise that resolves to an array of all stocks.
   */
  async getAllStocks(): Promise<Stock[]> {
    return await db.select().from(stocks);
  }

  /**
   * Creates a new stock entry in the database.
   * @param stock - The stock data to insert.
   * @returns The created stock object.
   */
  async createStock(stock: InsertStock): Promise<Stock> {
    const result = await db.insert(stocks).values(stock).returning();
    return result[0];
  }

  /**
   * Updates an existing stock entry.
   * @param code - The stock code of the stock to update.
   * @param updates - A partial object containing the fields to update.
   * @returns The updated stock object if found, otherwise undefined.
   */
  async updateStock(code: string, updates: Partial<InsertStock>): Promise<Stock | undefined> {
    const result = await db.update(stocks)
      .set(updates)
      .where(eq(stocks.code, code))
      .returning();
    return result[0];
  }

  /**
   * Deletes a stock entry from the database.
   * @param code - The stock code of the stock to delete.
   */
  async deleteStock(code: string): Promise<void> {
    await db.delete(stocks).where(eq(stocks.code, code));
  }

  /**
   * Retrieves stock prices for a given stock code, optionally limited.
   * Prices are ordered by date in descending order.
   * @param stockCode - The stock code for which to retrieve prices.
   * @param limit - Optional maximum number of prices to retrieve.
   * @returns A promise that resolves to an array of stock prices.
   */
  async getStockPrices(stockCode: string, limit?: number): Promise<StockPrice[]> {
    const query = db.select()
      .from(stockPrices)
      .where(eq(stockPrices.stockCode, stockCode))
      .orderBy(desc(stockPrices.date));

    if (limit) {
      return await query.limit(limit);
    }
    return await query;
  }

  /**
   * Retrieves all stock prices for a specific date.
   * @param date - The date for which to retrieve stock prices.
   * @returns A promise that resolves to an array of stock prices for the given date.
   */
  async getStockPricesByDate(date: string): Promise<StockPrice[]> {
    return await db.select()
      .from(stockPrices)
      .where(eq(stockPrices.date, date));
  }

  /**
   * Retrieves a specific stock price for a given stock code and date.
   * @param stockCode - The stock code.
   * @param date - The date of the stock price.
   * @returns The stock price object if found, otherwise undefined.
   */
  async getStockPrice(stockCode: string, date: string): Promise<StockPrice | undefined> {
    const result = await db.select()
      .from(stockPrices)
      .where(and(
        eq(stockPrices.stockCode, stockCode),
        eq(stockPrices.date, date)
      ))
      .limit(1);
    return result[0];
  }

  /**
   * Creates a new stock price entry.
   * @param price - The stock price data to insert.
   * @returns The created stock price object.
   */
  async createStockPrice(price: InsertStockPrice): Promise<StockPrice> {
    const result = await db.insert(stockPrices).values(price).returning();
    return result[0];
  }

  /**
   * Improved upsert using Drizzle's ON CONFLICT clause
   * More efficient than separate select + insert/update
   * Inserts a new stock price or updates an existing one if a conflict occurs
   * on the composite unique key (stockCode, date).
   * @param price - The stock price data to upsert.
   * @returns The upserted stock price object.
   */
  async upsertStockPrice(price: InsertStockPrice): Promise<StockPrice> {
    const result = await db.insert(stockPrices)
      .values(price)
      .onConflictDoUpdate({
        target: [stockPrices.stockCode, stockPrices.date], // Composite unique key
        set: {
          openPrice: price.openPrice,
          closePrice: price.closePrice,
          highPrice: price.highPrice,
          lowPrice: price.lowPrice,
          volume: price.volume,
          volumeValue: price.volumeValue
        }
      })
      .returning();
    return result[0];
  }

  /**
   * Deletes a stock price entry for a specific stock code and date.
   * @param stockCode - The stock code.
   * @param date - The date of the stock price to delete.
   */
  async deleteStockPrice(stockCode: string, date: string): Promise<void> {
    await db.delete(stockPrices).where(and(
      eq(stockPrices.stockCode, stockCode),
      eq(stockPrices.date, date)
    ));
  }

  /**
   * Retrieves all stock prices from the database.
   * @returns A promise that resolves to an array of all stock prices.
   */
  async getAllStockPrices(): Promise<StockPrice[]> {
    return await db.select().from(stockPrices);
  }

  /**
   * Retrieves crossover signals, optionally filtered by date and signal type.
   * Results are ordered by date descending, then by volume rank ascending.
   * @param date - Optional date to filter signals.
   * @param signalType - Optional signal type to filter signals.
   * @returns A promise that resolves to an array of crossover signals.
   */
  async getCrossoverSignals(date?: string, signalType?: string): Promise<CrossoverSignal[]> {
    let query = db.select().from(crossoverSignals);

    const conditions = [];
    if (date) conditions.push(eq(crossoverSignals.crossDate, date));
    if (signalType) conditions.push(eq(crossoverSignals.signalType, signalType));

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    return await query.orderBy(
      desc(crossoverSignals.crossDate),
      crossoverSignals.volumeRank
    );
  }

  /**
   * Retrieves a specific crossover signal.
   * @param stockCode - The stock code.
   * @param crossDate - The date of the crossover.
   * @param signalType - The type of signal.
   * @returns The crossover signal object if found, otherwise undefined.
   */
  async getCrossoverSignal(stockCode: string, crossDate: string, signalType: string): Promise<CrossoverSignal | undefined> {
    const result = await db.select()
      .from(crossoverSignals)
      .where(and(
        eq(crossoverSignals.stockCode, stockCode),
        eq(crossoverSignals.crossDate, crossDate),
        eq(crossoverSignals.signalType, signalType)
      ))
      .limit(1);
    return result[0];
  }

  /**
   * Creates a new crossover signal entry.
   * @param signal - The crossover signal data to insert.
   * @returns The created crossover signal object.
   */
  async createCrossoverSignal(signal: InsertCrossoverSignal): Promise<CrossoverSignal> {
    const result = await db.insert(crossoverSignals).values(signal).returning();
    return result[0];
  }

  /**
   * Improved upsert for crossover signals using ON CONFLICT.
   * Inserts a new crossover signal or updates an existing one if a conflict occurs
   * on the composite unique key (stockCode, crossDate, signalType).
   * @param signal - The crossover signal data to upsert.
   * @returns The upserted crossover signal object.
   */
  async upsertCrossoverSignal(signal: InsertCrossoverSignal): Promise<CrossoverSignal> {
    const result = await db.insert(crossoverSignals)
      .values(signal)
      .onConflictDoUpdate({
        target: [crossoverSignals.stockCode, crossoverSignals.crossDate, crossoverSignals.signalType],
        set: {
          price: signal.price,
          ma10: signal.ma10,
          ma50: signal.ma50,
          volumeRank: signal.volumeRank
        }
      })
      .returning();
    return result[0];
  }

  /**
   * Deletes all crossover signals for a specific date.
   * @param date - The date for which to delete crossover signals.
   */
  async deleteCrossoverSignalsByDate(date: string): Promise<void> {
    await db.delete(crossoverSignals).where(eq(crossoverSignals.crossDate, date));
  }

  /**
   * More efficient implementation using PostgreSQL's DISTINCT ON
   * Gets the most recent crossover signal for each stock in a single query.
   * @returns A Map where keys are stock codes and values are the latest CrossoverSignal objects.
   */
  async getLastCrossoverPerStock(): Promise<Map<string, CrossoverSignal>> {
    const query = sql`
      SELECT DISTINCT ON (stock_code) *
      FROM crossover_signals
      ORDER BY stock_code, cross_date DESC
    `;

    const result = await db.execute(query);
    const lastCrossovers = new Map<string, CrossoverSignal>();

    // Map database rows to CrossoverSignal objects
    for (const row of result.rows as any[]) {
      lastCrossovers.set(row.stock_code, {
        id: row.id,
        stockCode: row.stock_code,
        signalType: row.signal_type,
        crossDate: row.cross_date,
        price: row.price,
        ma10: row.ma10,
        ma50: row.ma50,
        volumeRank: row.volume_rank,
        createdAt: row.created_at
      });
    }

    return lastCrossovers;
  }
}

// Create and export a singleton instance for use throughout the application
const dbStorage = new PostgresStorage();

// Export individual methods for direct usage (backwards compatibility)
export const getStock = (code: string) => dbStorage.getStock(code);
export const getAllStocks = () => dbStorage.getAllStocks();
export const createStock = (stock: InsertStock) => dbStorage.createStock(stock);
export const updateStock = (code: string, updates: Partial<InsertStock>) => dbStorage.updateStock(code, updates);
export const deleteStock = (code: string) => dbStorage.deleteStock(code);

export const getStockPrices = (stockCode: string, limit?: number) => dbStorage.getStockPrices(stockCode, limit);
export const getStockPricesByDate = (date: string) => dbStorage.getStockPricesByDate(date);
export const getStockPrice = (stockCode: string, date: string) => dbStorage.getStockPrice(stockCode, date);
export const createStockPrice = (price: InsertStockPrice) => dbStorage.createStockPrice(price);
export const upsertStockPrice = (price: InsertStockPrice) => dbStorage.upsertStockPrice(price);
export const deleteStockPrice = (stockCode: string, date: string) => dbStorage.deleteStockPrice(stockCode, date);
export const getAllStockPrices = () => dbStorage.getAllStockPrices();

export const getCrossoverSignals = (date?: string, signalType?: string) => dbStorage.getCrossoverSignals(date, signalType);
export const getCrossoverSignal = (stockCode: string, crossDate: string, signalType: string) => dbStorage.getCrossoverSignal(stockCode, crossDate, signalType);
export const createCrossoverSignal = (signal: InsertCrossoverSignal) => dbStorage.createCrossoverSignal(signal);
export const upsertCrossoverSignal = (signal: InsertCrossoverSignal) => dbStorage.upsertCrossoverSignal(signal);
export const deleteCrossoverSignalsByDate = (date: string) => dbStorage.deleteCrossoverSignalsByDate(date);
export const getLastCrossoverPerStock = () => dbStorage.getLastCrossoverPerStock();