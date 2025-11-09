/**
 * Calculate crossovers for all dates with sufficient historical data
 */
import { storage } from '../server/storage';
import { maService } from '../server/services/movingAverage';

async function main() {
  console.log('Calculating crossovers for all valid dates...\n');
  
  // Get all unique dates
  const allPrices = await storage.getAllStockPrices();
  const allDates = Array.from(new Set(allPrices.map(p => p.date))).sort();
  
  console.log(`Total dates in database: ${allDates.length}`);
  console.log(`Date range: ${allDates[0]} to ${allDates[allDates.length - 1]}\n`);
  
  // Only process dates where we have 50+ days of historical data
  // Since we have 59 days total, only the last 10 dates have sufficient data
  const validDates = allDates.slice(-10); // Last 10 dates
  console.log(`Dates with sufficient data (last 10): ${validDates[0]} to ${validDates[validDates.length - 1]}\n`);
  
  let totalCrossovers = 0;
  const crossoversByDate: Record<string, number> = {};
  
  for (const date of validDates) {
    console.log(`Processing ${date}...`);
    const signals = await maService.detectCrossoversForDate(date);
    
    crossoversByDate[date] = signals.length;
    totalCrossovers += signals.length;
    
    if (signals.length > 0) {
      console.log(`  ✓ Found ${signals.length} crossovers`);
      signals.slice(0, 3).forEach(s => {
        console.log(`    - ${s.stockCode} (${s.stockName}): ${s.signalType} cross`);
      });
    } else {
      console.log(`  - No crossovers`);
    }
    
    // Store crossovers
    for (const signal of signals) {
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
  }
  
  console.log(`\n=== SUMMARY ===`);
  console.log(`Total crossovers detected: ${totalCrossovers}`);
  console.log(`Dates processed: ${validDates.length}`);
  console.log(`\nCrossovers by date:`);
  Object.entries(crossoversByDate).forEach(([date, count]) => {
    if (count > 0) console.log(`  ${date}: ${count}`);
  });
  
  process.exit(0);
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
