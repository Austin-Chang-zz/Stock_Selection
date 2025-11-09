/**
 * Test MA calculation for a single stock on a single date
 */
import { storage } from '../server/storage';
import { maService } from '../server/services/movingAverage';

async function main() {
  const stockCode = '2330'; // TSMC
  const testDate = '2025-10-23'; // Most recent date
  
  console.log(`Testing MA calculation for ${stockCode} on ${testDate}...`);
  
  // Check how many prices we have
  const allPrices = await storage.getStockPrices(stockCode);
  console.log(`Total price records for ${stockCode}: ${allPrices.length}`);
  
  if (allPrices.length > 0) {
    console.log(`Date range: ${allPrices[allPrices.length - 1].date} to ${allPrices[0].date}`);
    console.log(`First 5 prices (descending):`, allPrices.slice(0, 5).map(p => ({ date: p.date, close: p.closePrice })));
  }
  
  // Calculate MAs
  const maCalc = await maService.calculateMAs(stockCode, testDate);
  
  if (maCalc) {
    console.log('\n✓ MA Calculation successful:');
    console.log(`  Date: ${maCalc.date}`);
    console.log(`  Price: ${maCalc.currentPrice}`);
    console.log(`  MA10: ${maCalc.ma10.toFixed(2)}`);
    console.log(`  MA50: ${maCalc.ma50.toFixed(2)}`);
    console.log(`  Previous MA10: ${maCalc.previousMa10?.toFixed(2) || 'N/A'}`);
    console.log(`  Previous MA50: ${maCalc.previousMa50?.toFixed(2) || 'N/A'}`);
    
    // Check for crossover
    const crossover = maService.detectCrossover(maCalc);
    console.log(`  Crossover detected: ${crossover || 'none'}`);
  } else {
    console.log('\n✗ MA Calculation failed: insufficient data');
  }
  
  // Test on an earlier date
  const earlierDate = '2025-09-20';
  console.log(`\n\nTesting MA calculation for ${stockCode} on ${earlierDate}...`);
  
  const maCalc2 = await maService.calculateMAs(stockCode, earlierDate);
  
  if (maCalc2) {
    console.log('✓ MA Calculation successful for earlier date');
    console.log(`  MA10: ${maCalc2.ma10.toFixed(2)}, MA50: ${maCalc2.ma50.toFixed(2)}`);
  } else {
    console.log('✗ MA Calculation failed for earlier date');
  }
  
  process.exit(0);
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
