import { storage } from '../storage';
import type { StockPrice } from '@shared/schema';

/**
 * Interface for moving average calculation results
 */
export interface MACalculation {
  stockCode: string;
  date: string;
  ma10: number;           // 10-day moving average
  ma50: number;           // 50-day moving average
  currentPrice: number;   // Current closing price
  previousMa10?: number;  // Previous day's MA10 (for crossover detection)
  previousMa50?: number;  // Previous day's MA50 (for crossover detection)
}

/**
 * Interface for crossover signal detection results
 */
export interface CrossoverSignal {
  stockCode: string;
  stockName: string;
  signalType: 'golden' | 'death';  // Golden cross (bullish) or death cross (bearish)
  crossDate: string;
  price: number;          // Price at crossover
  ma10: number;           // MA10 value at crossover
  ma50: number;           // MA50 value at crossover
  volumeRank?: number;    // Ranking by trading volume (1-200)
}

/**
 * MovingAverageService - Handles moving average calculations and crossover detection
 * Implements technical analysis for identifying trading signals
 */
export class MovingAverageService {
  /**
   * Calculates simple moving average for a given period
   * @param prices - Array of closing prices (most recent first)
   * @param period - Number of periods for MA calculation
   * @returns Moving average value or null if insufficient data
   */
  calculateMA(prices: number[], period: number): number | null {
    if (prices.length < period) return null;

    // Simple moving average: sum of prices / period
    const sum = prices.slice(0, period).reduce((acc, price) => acc + price, 0);
    return sum / period;
  }

  /**
   * Calculates both 10-day and 50-day moving averages for a stock on a specific date
   * @param stockCode - Stock code
   * @param date - Target date in YYYY-MM-DD format
   * @returns MACalculation object or null if insufficient data
   */
  async calculateMAs(stockCode: string, date: string): Promise<MACalculation | null> {
    // Get last 60 days of price data (enough for MA50 calculation)
    const prices = await storage.getStockPrices(stockCode, 60);

    if (prices.length < 50) {
      return null; // Insufficient data for MA50 calculation
    }

    // Sort prices by date descending (most recent first)
    const sortedPrices = prices.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Find index of target date in sorted prices
    const todayIndex = sortedPrices.findIndex(p => p.date === date);
    if (todayIndex === -1) return null;

    // Get prices from target date onward (for MA calculation)
    const pricesFromToday = sortedPrices.slice(todayIndex);

    // Extract closing prices as numbers
    const closePrices = pricesFromToday.map(p => parseFloat(p.closePrice));

    // Calculate moving averages
    const ma10 = this.calculateMA(closePrices, 10);
    const ma50 = this.calculateMA(closePrices, 50);

    if (ma10 === null || ma50 === null) return null;

    let previousMa10: number | undefined;
    let previousMa50: number | undefined;

    // Calculate previous day's MAs for crossover detection
    if (todayIndex < sortedPrices.length - 1) {
      const prevPrices = sortedPrices.slice(todayIndex + 1).map(p => parseFloat(p.closePrice));
      previousMa10 = this.calculateMA(prevPrices, 10) || undefined;
      previousMa50 = this.calculateMA(prevPrices, 50) || undefined;
    }

    return {
      stockCode,
      date,
      ma10,
      ma50,
      currentPrice: parseFloat(sortedPrices[todayIndex].closePrice),
      previousMa10,
      previousMa50
    };
  }

  /**
   * Detects crossover between MA10 and MA50
   * Golden cross: MA10 crosses above MA50 (bullish)
   * Death cross: MA10 crosses below MA50 (bearish)
   * @param maCalc - Moving average calculation results
   * @returns Crossover type or null if no crossover
   */
  detectCrossover(maCalc: MACalculation): 'golden' | 'death' | null {
    // Need previous values to detect crossover
    if (!maCalc.previousMa10 || !maCalc.previousMa50) return null;

    // Calculate current and previous differences between MA10 and MA50
    const currentCross = maCalc.ma10 - maCalc.ma50;
    const previousCross = maCalc.previousMa10 - maCalc.previousMa50;

    // Golden cross: previous negative, current positive (MA10 crosses above MA50)
    if (previousCross < 0 && currentCross > 0) {
      return 'golden';
    }

    // Death cross: previous positive, current negative (MA10 crosses below MA50)
    if (previousCross > 0 && currentCross < 0) {
      return 'death';
    }

    return null;
  }

  /**
   * Detects crossover signals for all stocks on a specific date
   * @param date - Target date in YYYY-MM-DD format
   * @returns Array of crossover signals sorted by volume rank
   */
  async detectCrossoversForDate(date: string): Promise<CrossoverSignal[]> {
    const signals: CrossoverSignal[] = [];
    const stocks = await storage.getAllStocks();

    // Get all stock prices for the date to calculate volume ranking
    const pricesByDate = await storage.getStockPricesByDate(date);

    // Rank stocks by trading value (volume * price)
    const amountRanking = pricesByDate
      .sort((a, b) => parseInt(b.volumeValue) - parseInt(a.volumeValue))
      .slice(0, 200); // Top 200 by trading amount

    // Check each stock for crossovers
    for (const stock of stocks) {
      const maCalc = await this.calculateMAs(stock.code, date);

      if (!maCalc) continue; // Skip if insufficient data

      const crossoverType = this.detectCrossover(maCalc);

      if (crossoverType) {
        // Find volume rank for this stock
        const rankIndex = amountRanking.findIndex(p => p.stockCode === stock.code);
        const volumeRank = rankIndex >= 0 ? rankIndex + 1 : undefined;

        // Add to signals array
        signals.push({
          stockCode: stock.code,
          stockName: stock.name,
          signalType: crossoverType,
          crossDate: date,
          price: maCalc.currentPrice,
          ma10: maCalc.ma10,
          ma50: maCalc.ma50,
          volumeRank
        });
      }
    }

    // Sort signals by volume rank (most actively traded first)
    return signals.sort((a, b) => (a.volumeRank || 999) - (b.volumeRank || 999));
  }
}

// Export singleton instance
export const maService = new MovingAverageService();