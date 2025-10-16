
import {
  type Stock,
  type InsertStock,
  type StockPrice,
  type InsertStockPrice,
  type CrossoverSignal,
  type InsertCrossoverSignal,
  stocks,
  stockPrices,
  crossoverSignals
} from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";

export interface IStorage {
  getStock(code: string): Promise<Stock | undefined>;
  getAllStocks(): Promise<Stock[]>;
  createStock(stock: InsertStock): Promise<Stock>;
  updateStock(code: string, stock: Partial<InsertStock>): Promise<Stock | undefined>;
  deleteStock(code: string): Promise<void>;

  getStockPrices(stockCode: string, limit?: number): Promise<StockPrice[]>;
  getStockPricesByDate(date: string): Promise<StockPrice[]>;
  getStockPrice(stockCode: string, date: string): Promise<StockPrice | undefined>;
  createStockPrice(price: InsertStockPrice): Promise<StockPrice>;
  upsertStockPrice(price: InsertStockPrice): Promise<StockPrice>;
  deleteStockPrice(stockCode: string, date: string): Promise<void>;
  getAllStockPrices(): Promise<StockPrice[]>;

  getCrossoverSignals(date?: string, signalType?: string): Promise<CrossoverSignal[]>;
  getCrossoverSignal(stockCode: string, crossDate: string, signalType: string): Promise<CrossoverSignal | undefined>;
  createCrossoverSignal(signal: InsertCrossoverSignal): Promise<CrossoverSignal>;
  upsertCrossoverSignal(signal: InsertCrossoverSignal): Promise<CrossoverSignal>;
  deleteCrossoverSignalsByDate(date: string): Promise<void>;
  getLastCrossoverPerStock(): Promise<Map<string, CrossoverSignal>>;
}

export class PostgresStorage implements IStorage {
  async getStock(code: string): Promise<Stock | undefined> {
    const result = await db.select().from(stocks).where(eq(stocks.code, code)).limit(1);
    return result[0];
  }

  async getAllStocks(): Promise<Stock[]> {
    return await db.select().from(stocks);
  }

  async createStock(insertStock: InsertStock): Promise<Stock> {
    const result = await db.insert(stocks).values(insertStock).returning();
    return result[0];
  }

  async updateStock(code: string, updates: Partial<InsertStock>): Promise<Stock | undefined> {
    const result = await db.update(stocks)
      .set(updates)
      .where(eq(stocks.code, code))
      .returning();
    return result[0];
  }

  async deleteStock(code: string): Promise<void> {
    await db.delete(stocks).where(eq(stocks.code, code));
  }

  async getStockPrices(stockCode: string, limit?: number): Promise<StockPrice[]> {
    let query = db.select().from(stockPrices)
      .where(eq(stockPrices.stockCode, stockCode))
      .orderBy(desc(stockPrices.date));
    
    if (limit) {
      query = query.limit(limit) as any;
    }
    
    return await query;
  }

  async getStockPricesByDate(date: string): Promise<StockPrice[]> {
    return await db.select().from(stockPrices).where(eq(stockPrices.date, date));
  }

  async getStockPrice(stockCode: string, date: string): Promise<StockPrice | undefined> {
    const result = await db.select().from(stockPrices)
      .where(and(
        eq(stockPrices.stockCode, stockCode),
        eq(stockPrices.date, date)
      ))
      .limit(1);
    return result[0];
  }

  async createStockPrice(insertPrice: InsertStockPrice): Promise<StockPrice> {
    const result = await db.insert(stockPrices).values(insertPrice).returning();
    return result[0];
  }

  async upsertStockPrice(insertPrice: InsertStockPrice): Promise<StockPrice> {
    const existing = await this.getStockPrice(insertPrice.stockCode, insertPrice.date);
    
    if (existing) {
      const result = await db.update(stockPrices)
        .set(insertPrice)
        .where(and(
          eq(stockPrices.stockCode, insertPrice.stockCode),
          eq(stockPrices.date, insertPrice.date)
        ))
        .returning();
      return result[0];
    }
    
    return this.createStockPrice(insertPrice);
  }

  async deleteStockPrice(stockCode: string, date: string): Promise<void> {
    await db.delete(stockPrices)
      .where(and(
        eq(stockPrices.stockCode, stockCode),
        eq(stockPrices.date, date)
      ));
  }

  async getAllStockPrices(): Promise<StockPrice[]> {
    return await db.select().from(stockPrices);
  }

  async getCrossoverSignals(date?: string, signalType?: string): Promise<CrossoverSignal[]> {
    let conditions = [];
    
    if (date) {
      conditions.push(eq(crossoverSignals.crossDate, date));
    }
    
    if (signalType) {
      conditions.push(eq(crossoverSignals.signalType, signalType));
    }
    
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    
    return await db.select().from(crossoverSignals)
      .where(whereClause)
      .orderBy(desc(crossoverSignals.crossDate), crossoverSignals.volumeRank);
  }

  async getCrossoverSignal(stockCode: string, crossDate: string, signalType: string): Promise<CrossoverSignal | undefined> {
    const result = await db.select().from(crossoverSignals)
      .where(and(
        eq(crossoverSignals.stockCode, stockCode),
        eq(crossoverSignals.crossDate, crossDate),
        eq(crossoverSignals.signalType, signalType)
      ))
      .limit(1);
    return result[0];
  }

  async createCrossoverSignal(insertSignal: InsertCrossoverSignal): Promise<CrossoverSignal> {
    const result = await db.insert(crossoverSignals).values(insertSignal).returning();
    return result[0];
  }

  async upsertCrossoverSignal(insertSignal: InsertCrossoverSignal): Promise<CrossoverSignal> {
    const existing = await this.getCrossoverSignal(
      insertSignal.stockCode,
      insertSignal.crossDate,
      insertSignal.signalType
    );
    
    if (existing) {
      const result = await db.update(crossoverSignals)
        .set(insertSignal)
        .where(and(
          eq(crossoverSignals.stockCode, insertSignal.stockCode),
          eq(crossoverSignals.crossDate, insertSignal.crossDate),
          eq(crossoverSignals.signalType, insertSignal.signalType)
        ))
        .returning();
      return result[0];
    }
    
    return this.createCrossoverSignal(insertSignal);
  }

  async deleteCrossoverSignalsByDate(date: string): Promise<void> {
    await db.delete(crossoverSignals).where(eq(crossoverSignals.crossDate, date));
  }

  async getLastCrossoverPerStock(): Promise<Map<string, CrossoverSignal>> {
    const lastCrossovers = new Map<string, CrossoverSignal>();
    
    // Get all signals ordered by date descending
    const signals = await db.select().from(crossoverSignals)
      .orderBy(desc(crossoverSignals.crossDate));
    
    for (const signal of signals) {
      if (!lastCrossovers.has(signal.stockCode)) {
        lastCrossovers.set(signal.stockCode, signal);
      }
    }
    
    return lastCrossovers;
  }
}

export class MemStorage implements IStorage {
  private stocks: Map<string, Stock>;
  private stockPrices: Map<string, StockPrice>;
  private crossoverSignals: Map<string, CrossoverSignal>;

  constructor() {
    this.stocks = new Map();
    this.stockPrices = new Map();
    this.crossoverSignals = new Map();
  }

  async getStock(code: string): Promise<Stock | undefined> {
    return Array.from(this.stocks.values()).find(s => s.code === code);
  }

  async getAllStocks(): Promise<Stock[]> {
    return Array.from(this.stocks.values());
  }

  async createStock(insertStock: InsertStock): Promise<Stock> {
    const id = randomUUID();
    const stock: Stock = {
      ...insertStock,
      id,
      createdAt: new Date()
    };
    this.stocks.set(id, stock);
    return stock;
  }

  async updateStock(code: string, updates: Partial<InsertStock>): Promise<Stock | undefined> {
    const stock = await this.getStock(code);
    if (!stock) return undefined;

    const updated = { ...stock, ...updates };
    this.stocks.set(stock.id, updated);
    return updated;
  }

  async deleteStock(code: string): Promise<void> {
    const stock = await this.getStock(code);
    if (stock) {
      this.stocks.delete(stock.id);
    }
  }

  async getStockPrices(stockCode: string, limit?: number): Promise<StockPrice[]> {
    const prices = Array.from(this.stockPrices.values())
      .filter(p => p.stockCode === stockCode)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return limit ? prices.slice(0, limit) : prices;
  }

  async getStockPricesByDate(date: string): Promise<StockPrice[]> {
    return Array.from(this.stockPrices.values())
      .filter(p => p.date === date);
  }

  async getStockPrice(stockCode: string, date: string): Promise<StockPrice | undefined> {
    return Array.from(this.stockPrices.values())
      .find(p => p.stockCode === stockCode && p.date === date);
  }

  async createStockPrice(insertPrice: InsertStockPrice): Promise<StockPrice> {
    const id = randomUUID();
    const price: StockPrice = {
      ...insertPrice,
      id,
      createdAt: new Date()
    };
    this.stockPrices.set(id, price);
    return price;
  }

  async upsertStockPrice(insertPrice: InsertStockPrice): Promise<StockPrice> {
    const existing = await this.getStockPrice(insertPrice.stockCode, insertPrice.date);

    if (existing) {
      const updated = { ...existing, ...insertPrice };
      this.stockPrices.set(existing.id, updated);
      return updated;
    }

    return this.createStockPrice(insertPrice);
  }

  async deleteStockPrice(stockCode: string, date: string): Promise<void> {
    const price = await this.getStockPrice(stockCode, date);
    if (price) {
      this.stockPrices.delete(price.id);
    }
  }

  async getAllStockPrices(): Promise<StockPrice[]> {
    return Array.from(this.stockPrices.values());
  }

  async getCrossoverSignals(date?: string, signalType?: string): Promise<CrossoverSignal[]> {
    let signals = Array.from(this.crossoverSignals.values());

    if (date) {
      signals = signals.filter(s => s.crossDate === date);
    }

    if (signalType) {
      signals = signals.filter(s => s.signalType === signalType);
    }

    return signals.sort((a, b) => {
      const dateCompare = b.crossDate.localeCompare(a.crossDate);
      if (dateCompare !== 0) return dateCompare;

      return (a.volumeRank || 999) - (b.volumeRank || 999);
    });
  }

  async getCrossoverSignal(stockCode: string, crossDate: string, signalType: string): Promise<CrossoverSignal | undefined> {
    return Array.from(this.crossoverSignals.values())
      .find(s => s.stockCode === stockCode && s.crossDate === crossDate && s.signalType === signalType);
  }

  async createCrossoverSignal(insertSignal: InsertCrossoverSignal): Promise<CrossoverSignal> {
    const id = randomUUID();
    const signal: CrossoverSignal = {
      ...insertSignal,
      volumeRank: insertSignal.volumeRank ?? null,
      id,
      createdAt: new Date()
    };
    this.crossoverSignals.set(id, signal);
    return signal;
  }

  async upsertCrossoverSignal(insertSignal: InsertCrossoverSignal): Promise<CrossoverSignal> {
    const existing = await this.getCrossoverSignal(
      insertSignal.stockCode,
      insertSignal.crossDate,
      insertSignal.signalType
    );

    if (existing) {
      const updated = {
        ...existing,
        ...insertSignal,
        volumeRank: insertSignal.volumeRank ?? null
      };
      this.crossoverSignals.set(existing.id, updated);
      return updated;
    }

    return this.createCrossoverSignal(insertSignal);
  }

  async deleteCrossoverSignalsByDate(date: string): Promise<void> {
    const toDelete = Array.from(this.crossoverSignals.entries())
      .filter(([_, signal]) => signal.crossDate === date)
      .map(([id]) => id);

    toDelete.forEach(id => this.crossoverSignals.delete(id));
  }

  async getLastCrossoverPerStock(): Promise<Map<string, CrossoverSignal>> {
    const lastCrossovers = new Map<string, CrossoverSignal>();

    // Sort by date descending to get most recent first
    const sortedSignals = Array.from(this.crossoverSignals.values()).sort((a, b) =>
      b.crossDate.localeCompare(a.crossDate)
    );

    for (const signal of sortedSignals) {
      if (!lastCrossovers.has(signal.stockCode)) {
        lastCrossovers.set(signal.stockCode, signal);
      }
    }

    return lastCrossovers;
  }
}

// Use PostgreSQL storage
export const storage = new PostgresStorage();
