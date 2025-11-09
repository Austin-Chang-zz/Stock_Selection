/**
 * Test MA calculation on a date with sufficient historical data
 */
import { storage } from '../server/storage';
import { maService } from '../server/services/movingAverage';

async function main() {
  const stockCode = '2330';
  
  // Get all dates for this stock
  const allPrices = await storage.getStockPrices(stockCode);
  console.log(`Total days of data: ${allPrices.length}`);
  
  // Test the 50th most recent date (should have exactly 50 days of data before it)
  if (allPrices.length >= 51) {
    const testDate = allPrices[50].date; // Index 50 = 51st most recent day
    console.log(`\nTesting date with 50 days of history: ${testDate}`);
    
    const maCalc = await maService.calculateMAs(stockCode, testDate);
    
    if (maCalc) {
      console.log('✓ MA Calculation successful:');
      console.log(`  MA10: ${maCalc.ma10.toFixed(2)}, MA50: ${maCalc.ma50.toFixed(2)}`);
      console.log(`  Previous MA10: ${maCalc.previousMa10?.toFixed(2) || 'N/A'}`);
      console.log(`  Previous MA50: ${maCalc.previousMa50?.toFixed(2) || 'N/A'}`);
      
      const crossover = maService.detectCrossover(maCalc);
      console.log(`  Crossover: ${crossover || 'none'}`);
    } else {
      console.log('✗ Failed');
    }
  }
  
  // Now test crossover detection for all valid dates
  console.log('\n\nTesting crossover detection for all dates with sufficient data...');
  const signals = await maService.detectCrossoversForDate('2025-10-23');
  console.log(`Found ${signals.length} crossover signals on 2025-10-23`);
  
  if (signals.length > 0) {
    console.log('\nFirst 5 signals:');
    signals.slice(0, 5).forEach(s => {
      console.log(`  ${s.stockCode} (${s.stockName}): ${s.signalType} cross`);
    });
  }
  
  process.exit(0);
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
