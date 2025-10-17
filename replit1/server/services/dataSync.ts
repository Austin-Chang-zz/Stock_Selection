import { storage } from '../storage';
import { twseApi } from './twseApi';
import { maService } from './movingAverage';

/**
 * DataSyncService - Orchestrates data synchronization workflow
 * Handles fetching data from TWSE, storing it, and detecting crossovers
 */
export class DataSyncService {
  /**
   * Syncs stock data for a specific date from TWSE API to database
   * @param date - Date string in YYYY-MM-DD format
   */
  async syncStockData(date: string): Promise<void> {
    console.log(`[DataSync] Starting sync for ${date}...`);

    try {
      // Fetch all stocks data for the date from TWSE
      const allStocksData = await twseApi.getAllStocksDailyData(date);

      if (!allStocksData || allStocksData.length === 0) {
        console.log(`[DataSync] No data available for ${date}`);
        return;
      }

      console.log(`[DataSync] Found ${allStocksData.length} stocks`);

      // Filter, sort by trading value, and take top 100
      const sortedByAmount = allStocksData
        .filter(stock => stock.TradeValue && stock.TradeValue !== '--')
        .sort((a, b) => {
          const valueA = parseInt(twseApi.parseVolume(a.TradeValue));
          const valueB = parseInt(twseApi.parseVolume(b.TradeValue));
          return valueB - valueA; // Descending order
        })
        .slice(0, 100); // Top 100 by trading amount

      console.log(`[DataSync] Processing top ${sortedByAmount.length} stocks by trading amount`);

      // Process each stock in the top 100
      for (const stockData of sortedByAmount) {
        // Check if stock exists in database, create if not
        const existingStock = await storage.getStock(stockData.Code);

        if (!existingStock) {
          await storage.createStock({
            code: stockData.Code,
            name: stockData.Name
          });
        }

        // Upsert stock price data (insert or update if exists)
        await storage.upsertStockPrice({
          stockCode: stockData.Code,
          date: date,
          openPrice: twseApi.parsePrice(stockData.OpeningPrice).toFixed(2),
          closePrice: twseApi.parsePrice(stockData.ClosingPrice).toFixed(2),
          highPrice: twseApi.parsePrice(stockData.HighestPrice).toFixed(2),
          lowPrice: twseApi.parsePrice(stockData.LowestPrice).toFixed(2),
          volume: twseApi.parseVolume(stockData.TradeVolume),
          volumeValue: twseApi.parseVolume(stockData.TradeValue)
        });
      }

      console.log(`[DataSync] Stock data synced successfully for ${date}`);
    } catch (error) {
      console.error(`[DataSync] Error syncing stock data:`, error);
      throw error;
    }
  }

  /**
   * Detects moving average crossovers for a specific date and stores them
   * @param date - Date string in YYYY-MM-DD format
   */
  async detectAndStoreCrossovers(date: string): Promise<void> {
    console.log(`[DataSync] Detecting crossovers for ${date}...`);

    try {
      // Clear existing crossover signals for this date to avoid duplicates
      await storage.deleteCrossoverSignalsByDate(date);

      // Detect new crossover signals using moving average service
      const crossovers = await maService.detectCrossoversForDate(date);

      console.log(`[DataSync] Found ${crossovers.length} crossover signals`);

      // Store each detected crossover signal
      for (const crossover of crossovers) {
        await storage.upsertCrossoverSignal({
          stockCode: crossover.stockCode,
          signalType: crossover.signalType,
          crossDate: crossover.crossDate,
          price: crossover.price.toFixed(2),
          ma10: crossover.ma10.toFixed(2),
          ma50: crossover.ma50.toFixed(2),
          volumeRank: crossover.volumeRank
        });
      }

      console.log(`[DataSync] Crossovers stored successfully for ${date}`);
    } catch (error) {
      console.error(`[DataSync] Error detecting crossovers:`, error);
      throw error;
    }
  }

  /**
   * Performs complete synchronization for a date
   * Syncs stock data and detects crossovers in sequence
   * @param date - Date string in YYYY-MM-DD format
   */
  async fullSync(date: string): Promise<void> {
    console.log(`[DataSync] Starting full sync for ${date}`);

    await this.syncStockData(date);
    await this.detectAndStoreCrossovers(date);

    console.log(`[DataSync] Full sync completed for ${date}`);
  }

  /**
   * Initializes historical data for a date range
   * Used for backfilling data when first setting up the application
   * @param startDate - Start date in YYYY-MM-DD format
   * @param endDate - End date in YYYY-MM-DD format
   */
  async initializeHistoricalData(startDate: string, endDate: string): Promise<void> {
    const dates = this.getDateRange(startDate, endDate);

    console.log(`[DataSync] Initializing historical data for ${dates.length} days`);

    // Process each date sequentially with delay to avoid rate limiting
    for (const date of dates) {
      try {
        await this.fullSync(date);
        await this.delay(2000); // 2 second delay between requests
      } catch (error) {
        console.error(`[DataSync] Failed to sync ${date}:`, error);
      }
    }

    console.log(`[DataSync] Historical data initialization completed`);
  }

  /**
   * Generates an array of date strings between start and end dates
   * Excludes weekends (Saturday and Sunday)
   * @param startDate - Start date in YYYY-MM-DD format
   * @param endDate - End date in YYYY-MM-DD format
   * @returns Array of date strings
   */
  private getDateRange(startDate: string, endDate: string): string[] {
    const dates: string[] = [];
    const current = new Date(startDate);
    const end = new Date(endDate);

    // Iterate through each day in the range
    while (current <= end) {
      // Skip weekends (0 = Sunday, 6 = Saturday)
      if (current.getDay() !== 0 && current.getDay() !== 6) {
        dates.push(current.toISOString().split('T')[0]);
      }
      current.setDate(current.getDate() + 1);
    }

    return dates;
  }

  /**
   * Utility function to delay execution
   * @param ms - Milliseconds to delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const dataSyncService = new DataSyncService();