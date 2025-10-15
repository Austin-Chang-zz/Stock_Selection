import { storage } from '../storage';
import type { StockPrice } from '@shared/schema';

export interface MACalculation {
  stockCode: string;
  date: string;
  ma10: number;
  ma50: number;
  currentPrice: number;
  previousMa10?: number;
  previousMa50?: number;
}

export interface CrossoverSignal {
  stockCode: string;
  stockName: string;
  signalType: 'golden' | 'death';
  crossDate: string;
  price: number;
  ma10: number;
  ma50: number;
  volumeRank?: number;
}

export class MovingAverageService {
  calculateMA(prices: number[], period: number): number | null {
    if (prices.length < period) return null;
    
    const sum = prices.slice(0, period).reduce((acc, price) => acc + price, 0);
    return sum / period;
  }

  async calculateMAs(stockCode: string, date: string): Promise<MACalculation | null> {
    const prices = await storage.getStockPrices(stockCode, 60);
    
    if (prices.length < 50) {
      return null;
    }

    const sortedPrices = prices.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const todayIndex = sortedPrices.findIndex(p => p.date === date);
    if (todayIndex === -1) return null;

    const pricesFromToday = sortedPrices.slice(todayIndex);
    
    const closePrices = pricesFromToday.map(p => parseFloat(p.closePrice));
    
    const ma10 = this.calculateMA(closePrices, 10);
    const ma50 = this.calculateMA(closePrices, 50);

    if (ma10 === null || ma50 === null) return null;

    let previousMa10: number | undefined;
    let previousMa50: number | undefined;

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

  detectCrossover(maCalc: MACalculation): 'golden' | 'death' | null {
    if (!maCalc.previousMa10 || !maCalc.previousMa50) return null;

    const currentCross = maCalc.ma10 - maCalc.ma50;
    const previousCross = maCalc.previousMa10 - maCalc.previousMa50;

    if (previousCross < 0 && currentCross > 0) {
      return 'golden';
    }

    if (previousCross > 0 && currentCross < 0) {
      return 'death';
    }

    return null;
  }

  async detectCrossoversForDate(date: string): Promise<CrossoverSignal[]> {
    const signals: CrossoverSignal[] = [];
    const stocks = await storage.getAllStocks();
    const pricesByDate = await storage.getStockPricesByDate(date);
    
    const amountRanking = pricesByDate
      .sort((a, b) => parseInt(b.volumeValue) - parseInt(a.volumeValue))
      .slice(0, 200);

    for (const stock of stocks) {
      const maCalc = await this.calculateMAs(stock.code, date);
      
      if (!maCalc) continue;

      const crossoverType = this.detectCrossover(maCalc);
      
      if (crossoverType) {
        const rankIndex = amountRanking.findIndex(p => p.stockCode === stock.code);
        const volumeRank = rankIndex >= 0 ? rankIndex + 1 : undefined;

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

    return signals.sort((a, b) => (a.volumeRank || 999) - (b.volumeRank || 999));
  }
}

export const maService = new MovingAverageService();
