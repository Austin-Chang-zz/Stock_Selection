/**
 * Debug MA calculation logic to understand the slicing issue
 */
import { storage } from '../server/storage';

async function main() {
  const stockCode = '2330';
  const targetDate = '2025-08-11'; // 51st day (should have 50 days of history)
  
  const prices = await storage.getStockPrices(stockCode);
  console.log(`Total prices: ${prices.length}`);
  
  // Sort descending (most recent first) 
  const sortedPrices = prices.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  console.log(`\nFirst 5 prices (most recent):`,
    sortedPrices.slice(0, 5).map(p => p.date));
  console.log(`\nLast 5 prices (oldest):`,
    sortedPrices.slice(-5).map(p => p.date));
  
  // Find target date
  const todayIndex = sortedPrices.findIndex(p => p.date === targetDate);
  console.log(`\nTarget date ${targetDate} is at index: ${todayIndex}`);
  console.log(`Date at that index: ${sortedPrices[todayIndex]?.date}`);
  
  // Current logic: slice from todayIndex to end
  const pricesFromToday = sortedPrices.slice(todayIndex);
  console.log(`\nCurrent logic slice(${todayIndex}) gives ${pricesFromToday.length} prices`);
  console.log(`First price: ${pricesFromToday[0]?.date}, Last: ${pricesFromToday[pricesFromToday.length - 1]?.date}`);
  
  console.log('\n--- PROBLEM IDENTIFIED ---');
  console.log(`We need 50 prices from ${targetDate} going BACKWARD in time (older dates)`);
  console.log(`In a descending array, older dates are at HIGHER indices`);
  console.log(`slice(${todayIndex}) gives indices ${todayIndex} to ${sortedPrices.length - 1}`);
  console.log(`That's ${sortedPrices.length - todayIndex} prices, but we need the target date PLUS 49 older ones = 50 total`);
  console.log(`We only have ${sortedPrices.length - todayIndex} prices from target to end!`);
  
  console.log('\n--- SOLUTION ---');
  console.log(`We should slice from 0 (most recent) to todayIndex + 50`);
  console.log(`But WAIT - that would give us NEWER dates than ${targetDate}!`);
  console.log(`The correct approach: we need indices from todayIndex to todayIndex + 49 (50 prices)`);
  console.log(`slice(todayIndex, todayIndex + 50) would give ${Math.min(50, sortedPrices.length - todayIndex)} prices`);
  
  const correctSlice = sortedPrices.slice(todayIndex, todayIndex + 50);
  console.log(`\nCorrect slice gives ${correctSlice.length} prices`);
  console.log(`From: ${correctSlice[0]?.date} to ${correctSlice[correctSlice.length - 1]?.date}`);
  
  process.exit(0);
}

main().catch(console.error);
