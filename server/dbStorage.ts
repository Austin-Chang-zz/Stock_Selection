
import { db } from "./db";
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

export class PostgresStorage implements IStorage {
  async getStock(code: string): Promise<Stock | undefined> {
    const result = await db.select().from(stocks).where(eq(stocks.code, code)).limit(1);
    return result[0];
  }

  async getAllStocks(): Promise<Stock[]> {
    return await db.select().from(stocks);
  }

  async createStock(stock: InsertStock): Promise<Stock> {
    const result = await db.insert(stocks).values(stock).returning();
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
    const query = db.select()
      .from(stockPrices)
      .where(eq(stockPrices.stockCode, stockCode))
      .orderBy(desc(stockPrices.date));

    if (limit) {
      return await query.limit(limit);
    }
    return await query;
  }

  async getStockPricesByDate(date: string): Promise<StockPrice[]> {
    return await db.select()
      .from(stockPrices)
      .where(eq(stockPrices.date, date));
  }

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

  async createStockPrice(price: InsertStockPrice): Promise<StockPrice> {
    const result = await db.insert(stockPrices).values(price).returning();
    return result[0];
  }

  async upsertStockPrice(price: InsertStockPrice): Promise<StockPrice> {
    const result = await db.insert(stockPrices)
      .values(price)
      .onConflictDoUpdate({
        target: [stockPrices.stockCode, stockPrices.date],
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

  async deleteStockPrice(stockCode: string, date: string): Promise<void> {
    await db.delete(stockPrices).where(and(
      eq(stockPrices.stockCode, stockCode),
      eq(stockPrices.date, date)
    ));
  }

  async getAllStockPrices(): Promise<StockPrice[]> {
    return await db.select().from(stockPrices);
  }

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

  async createCrossoverSignal(signal: InsertCrossoverSignal): Promise<CrossoverSignal> {
    const result = await db.insert(crossoverSignals).values(signal).returning();
    return result[0];
  }

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

  async deleteCrossoverSignalsByDate(date: string): Promise<void> {
    await db.delete(crossoverSignals).where(eq(crossoverSignals.crossDate, date));
  }

  async getLastCrossoverPerStock(): Promise<Map<string, CrossoverSignal>> {
    const query = sql`
      SELECT DISTINCT ON (stock_code) *
      FROM crossover_signals
      ORDER BY stock_code, cross_date DESC
    `;

    const result = await db.execute(query);
    const lastCrossovers = new Map<string, CrossoverSignal>();

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
