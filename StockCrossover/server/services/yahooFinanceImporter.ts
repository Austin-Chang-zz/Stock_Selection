import { spawn } from 'child_process';
import { storage } from '../storage';  //Postgres data base storage
import { maService } from './movingAverage';
import type { StockPrice } from '@shared/schema';

interface YahooHistoricalData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

/**
 * Fetch historical data from Yahoo Finance using Python yfinance
 */
async function fetchYahooFinanceData(stockCodes: string[], days: number): Promise<Record<string, YahooHistoricalData[]>> {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python3', [
      'scripts/fetch_historical_data.py',
      days.toString(),
      ...stockCodes
    ]);

    let stdout = '';
    let stderr = '';

    pythonProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    pythonProcess.on('close', (code) => {
      // if code = 0 means pythonProcess close normally when meet 'close' event.
      if (code !== 0) {
        console.error('[Yahoo Finance] Python script error:', stderr);
        reject(new Error(`Python script exited with code ${code}: ${stderr}`));
        return;
      }
      // code = 0 , close normally condition
      try {
        const results = JSON.parse(stdout);
        //result is js object which could support function or comments
        resolve(results);
      } catch (error) {
        reject(new Error(`Failed to parse Yahoo Finance data: ${error}`));
      }
    });
  });
}

/**
 * Import historical data for all tracked stocks from Yahoo Finance
 */
export async function importHistoricalDataFromYahoo(days: number = 60): Promise<void> {
  console.log(`[Yahoo Finance] Starting historical data import for ${days} days...`);

  try {
    // First, get the top 100 stocks from the most recent TWSE sync
    const allPrices = await storage.getAllStockPrices();
    
    if (allPrices.length === 0) {
      throw new Error('No stock data available. Please run TWSE sync first.');
    }

    // Find the most recent date
    const dates = Array.from(new Set(allPrices.map((p: StockPrice) => p.date))).sort().reverse();
    const latestDate = dates[0];
    
    // Get top 100 stocks by trading volume from latest date
    const latestPrices = allPrices.filter((p: StockPrice) => p.date === latestDate);
    const topStocks = latestPrices
      .sort((a: StockPrice, b: StockPrice) => {
        const aValue = parseFloat(a.volumeValue || '0');
        const bValue = parseFloat(b.volumeValue || '0');
        return bValue - aValue;
      })
      .slice(0, 100);

    const stockCodes = topStocks.map((p: StockPrice) => p.stockCode);
    console.log(`[Yahoo Finance] Fetching data for ${stockCodes.length} stocks...`);

    // Fetch historical data from Yahoo Finance in batches (to avoid overwhelming the API)
    const batchSize = 10;
    const allHistoricalData: Record<string, YahooHistoricalData[]> = {};

    for (let i = 0; i < stockCodes.length; i += batchSize) {
      const batch = stockCodes.slice(i, i + batchSize);
      console.log(`[Yahoo Finance] Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(stockCodes.length / batchSize)}...`);
      
      const batchData = await fetchYahooFinanceData(batch, days);
      Object.assign(allHistoricalData, batchData);
      
      // Small delay to respect rate limits
      if (i + batchSize < stockCodes.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log(`[Yahoo Finance] Retrieved data for ${Object.keys(allHistoricalData).length} stocks`);

    // Import data into database
    let totalRecordsImported = 0;
    
    for (const [stockCode, historicalData] of Object.entries(allHistoricalData)) {
      if (!historicalData || historicalData.length === 0) {
        console.log(`[Yahoo Finance] No data for stock ${stockCode}`);
        continue;
      }

      // Get stock info
      const stock = await storage.getStock(stockCode);
      if (!stock) {
        console.log(`[Yahoo Finance] Stock ${stockCode} not found in database, skipping`);
        continue;
      }

      // Import each day's data
      for (const dayData of historicalData) {
        try {
          // Check if this date already exists
          const existingPrice = await storage.getStockPrice(stockCode, dayData.date);
          
          if (!existingPrice) {
            await storage.createStockPrice({
              stockCode: stockCode,
              date: dayData.date,
              openPrice: dayData.open.toString(),
              highPrice: dayData.high.toString(),
              lowPrice: dayData.low.toString(),
              closePrice: dayData.close.toString(),
              volume: dayData.volume.toString(),
              volumeValue: '0', // Yahoo Finance doesn't provide trading value
            });
            totalRecordsImported++;
          }
        } catch (error) {
          console.error(`[Yahoo Finance] Error importing ${stockCode} for ${dayData.date}:`, error);
        }
      }
    }

    console.log(`[Yahoo Finance] Imported ${totalRecordsImported} historical price records`);

    // Calculate moving averages and detect crossovers for all dates
    console.log('[Yahoo Finance] Calculating moving averages and detecting crossovers...');
    
    // Get all unique dates that have price data
    const allUpdatedPrices = await storage.getAllStockPrices();
    const allDates = Array.from(new Set(allUpdatedPrices.map((p: StockPrice) => p.date))).sort();
    
    let crossoverCount = 0;
    for (const date of allDates) {
      const crossovers = await maService.detectCrossoversForDate(date);
      if (crossovers.length > 0) {
        // Convert CrossoverSignal to InsertCrossoverSignal format
        const insertSignals = crossovers.map((signal: { stockCode: string; signalType: string; crossDate: string; price: number; ma10: number; ma50: number; volumeRank?: number }) => ({
          stockCode: signal.stockCode,
          signalType: signal.signalType,
          crossDate: signal.crossDate,
          price: signal.price.toString(),
          ma10: signal.ma10.toString(),
          ma50: signal.ma50.toString(),
          volumeRank: signal.volumeRank || null,
        }));
        
        for (const signal of insertSignals) {
          await storage.upsertCrossoverSignal(signal);
        }
        crossoverCount += crossovers.length;
      }
    }

    console.log(`[Yahoo Finance] Historical import complete! Imported ${totalRecordsImported} records, detected ${crossoverCount} crossover signals`);
  } catch (error) {
    console.error('[Yahoo Finance] Import failed:', error);
    throw error;
  }
}

export const yahooFinanceImporter = {
  importHistoricalDataFromYahoo,
};
