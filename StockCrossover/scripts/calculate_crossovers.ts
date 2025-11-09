/**
 * Manually calculate crossover signals for all historical data
 */
import { storage } from '../server/storage';
import { maService } from '../server/services/movingAverage';

async function main() {
  console.log('Starting crossover calculation...');
  
  // Get all stock prices to find unique dates
  const allPrices = await storage.getAllStockPrices();
  const allDates = Array.from(new Set(allPrices.map(p => p.date))).sort();
  
  console.log(`Found ${allDates.length} unique dates with price data`);
  console.log(`Date range: ${allDates[0]} to ${allDates[allDates.length - 1]}`);
  
  let totalCrossovers = 0;
  
  for (const date of allDates) {
    console.log(`Processing date: ${date}`);
    
    try {
      const crossovers = await maService.detectCrossoversForDate(date);
      
      if (crossovers.length > 0) {
        console.log(`  Found ${crossovers.length} crossovers on ${date}`);
        
        // Store each crossover
        for (const signal of crossovers) {
          await storage.upsertCrossoverSignal({
            stockCode: signal.stockCode,
            signalType: signal.signalType,
            crossDate: signal.crossDate,
            price: signal.price.toString(),
            ma10: signal.ma10.toString(),
            ma50: signal.ma50.toString(),
            volumeRank: signal.volumeRank || null,
          });
        }
        
        totalCrossovers += crossovers.length;
      }
    } catch (error) {
      console.error(`  Error processing ${date}:`, error instanceof Error ? error.message : error);
    }
  }
  
  console.log(`\nComplete! Detected ${totalCrossovers} crossover signals across ${allDates.length} dates`);
  process.exit(0);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
