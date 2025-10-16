import { storage } from '../storage';
import { twseApi } from './twseApi';
import { maService } from './movingAverage';

export class DataSyncService {
  async syncStockData(date: string): Promise<void> {
    console.log(`[DataSync] Starting sync for ${date}...`);
    
    try {
      const allStocksData = await twseApi.getAllStocksDailyData(date);
      
      if (!allStocksData || allStocksData.length === 0) {
        console.log(`[DataSync] No data available for ${date}`);
        return;
      }

      console.log(`[DataSync] Found ${allStocksData.length} stocks`);

      const sortedByAmount = allStocksData
        .filter(stock => stock.TradeValue && stock.TradeValue !== '--')
        .sort((a, b) => {
          const valueA = parseInt(twseApi.parseVolume(a.TradeValue));
          const valueB = parseInt(twseApi.parseVolume(b.TradeValue));
          return valueB - valueA;
        })
        .slice(0, 100);

      console.log(`[DataSync] Processing top ${sortedByAmount.length} stocks by trading amount`);

      for (const stockData of sortedByAmount) {
        const existingStock = await storage.getStock(stockData.Code);
        
        if (!existingStock) {
          await storage.createStock({
            code: stockData.Code,
            name: stockData.Name
          });
        }

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

  async detectAndStoreCrossovers(date: string): Promise<void> {
    console.log(`[DataSync] Detecting crossovers for ${date}...`);
    
    try {
      await storage.deleteCrossoverSignalsByDate(date);
      
      const crossovers = await maService.detectCrossoversForDate(date);
      
      console.log(`[DataSync] Found ${crossovers.length} crossover signals`);

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

  async fullSync(date: string): Promise<void> {
    console.log(`[DataSync] Starting full sync for ${date}`);
    
    await this.syncStockData(date);
    await this.detectAndStoreCrossovers(date);
    
    console.log(`[DataSync] Full sync completed for ${date}`);
  }

  async initializeHistoricalData(startDate: string, endDate: string): Promise<void> {
    const dates = this.getDateRange(startDate, endDate);
    
    console.log(`[DataSync] Initializing historical data for ${dates.length} days`);
    
    for (const date of dates) {
      try {
        await this.fullSync(date);
        await this.delay(2000);
      } catch (error) {
        console.error(`[DataSync] Failed to sync ${date}:`, error);
      }
    }
    
    console.log(`[DataSync] Historical data initialization completed`);
  }

  private getDateRange(startDate: string, endDate: string): string[] {
    const dates: string[] = [];
    const current = new Date(startDate);
    const end = new Date(endDate);

    while (current <= end) {
      if (current.getDay() !== 0 && current.getDay() !== 6) {
        dates.push(current.toISOString().split('T')[0]);
      }
      current.setDate(current.getDate() + 1);
    }

    return dates;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const dataSyncService = new DataSyncService();
