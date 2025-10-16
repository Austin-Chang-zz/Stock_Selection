import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { dataSyncService } from "./services/dataSync";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/crossovers", async (req, res) => {
    try {
      const { date, signalType } = req.query;
      
      const signals = await storage.getCrossoverSignals(
        date as string | undefined,
        signalType as string | undefined
      );

      const stocks = await storage.getAllStocks();
      const stockMap = new Map(stocks.map(s => [s.code, s]));

      // Get latest prices for all stocks to show current data
      const latestSignals = await storage.getCrossoverSignals();
      const latestDate = latestSignals.length > 0 ? latestSignals[0].crossDate : null;
      
      const latestPrices = latestDate 
        ? await storage.getStockPricesByDate(latestDate)
        : [];
      const latestPriceMap = new Map(latestPrices.map(p => [p.stockCode, p]));

      // Get crossover date prices for comparison
      const crossoverPrices = await Promise.all(
        signals.map(signal => 
          storage.getStockPrices(signal.stockCode, 1).then(prices => ({
            stockCode: signal.stockCode,
            price: prices.find(p => p.date === signal.crossDate)
          }))
        )
      );
      const crossoverPriceMap = new Map(
        crossoverPrices
          .filter(item => item.price)
          .map(item => [item.stockCode, item.price!])
      );

      const enrichedSignals = signals.map(signal => {
        const stock = stockMap.get(signal.stockCode);
        const latestPrice = latestPriceMap.get(signal.stockCode);
        const crossoverPrice = crossoverPriceMap.get(signal.stockCode);
        
        // Use latest price as current, crossover price as previous for change calculation
        const currentPrice = latestPrice ? parseFloat(latestPrice.closePrice) : parseFloat(signal.price);
        const previousPrice = crossoverPrice ? parseFloat(crossoverPrice.closePrice) : currentPrice;
        const priceChange = currentPrice - previousPrice;
        const priceChangePercent = previousPrice !== 0 
          ? (priceChange / previousPrice) * 100 
          : 0;

        return {
          id: signal.id,
          code: signal.stockCode,
          name: stock?.name || signal.stockCode,
          price: currentPrice,
          priceChange,
          priceChangePercent,
          volumeRank: signal.volumeRank || null,
          signalType: signal.signalType,
          crossDate: signal.crossDate,
          ma10: parseFloat(signal.ma10),
          ma50: parseFloat(signal.ma50),
          volume: latestPrice ? parseInt(latestPrice.volume) : 0
        };
      });

      res.json(enrichedSignals);
    } catch (error) {
      console.error("Error fetching crossovers:", error);
      res.status(500).json({ error: "Failed to fetch crossover signals" });
    }
  });

  app.get("/api/stocks/:code", async (req, res) => {
    try {
      const { code } = req.params;
      const stock = await storage.getStock(code);
      
      if (!stock) {
        return res.status(404).json({ error: "Stock not found" });
      }

      const prices = await storage.getStockPrices(code, 60);
      
      res.json({
        stock,
        prices: prices.map(p => ({
          date: p.date,
          open: parseFloat(p.openPrice),
          close: parseFloat(p.closePrice),
          high: parseFloat(p.highPrice),
          low: parseFloat(p.lowPrice),
          volume: parseInt(p.volume)
        }))
      });
    } catch (error) {
      console.error("Error fetching stock:", error);
      res.status(500).json({ error: "Failed to fetch stock data" });
    }
  });

  app.post("/api/sync", async (req, res) => {
    try {
      const schema = z.object({
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
      });

      const { date } = schema.parse(req.body);
      
      await dataSyncService.fullSync(date);
      
      res.json({ success: true, message: `Data synced for ${date}` });
    } catch (error) {
      console.error("Error syncing data:", error);
      res.status(500).json({ 
        error: "Failed to sync data",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.post("/api/init-historical", async (req, res) => {
    try {
      const schema = z.object({
        startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
      });

      const { startDate, endDate } = schema.parse(req.body);
      
      dataSyncService.initializeHistoricalData(startDate, endDate)
        .catch(error => console.error("Background sync error:", error));
      
      res.json({ 
        success: true, 
        message: `Historical data initialization started from ${startDate} to ${endDate}` 
      });
    } catch (error) {
      console.error("Error initializing historical data:", error);
      res.status(500).json({ 
        error: "Failed to initialize historical data",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/candidates", async (req, res) => {
    try {
      const count = Math.min(parseInt(req.query.count as string) || 100, 100);
      
      // Get all available price dates to find previous trading day
      const allPrices = await storage.getAllStockPrices();
      console.log(`[API] Total stock prices in storage: ${allPrices.length}`);
      
      if (allPrices.length === 0) {
        console.log("[API] No stock prices available, returning empty array");
        return res.json([]);
      }
      
      // Get unique dates and sort descending
      const uniqueDates = Array.from(new Set(allPrices.map(p => p.date))).sort().reverse();
      const previousTradingDay = uniqueDates[0]; // Most recent date
      console.log(`[API] Previous trading day: ${previousTradingDay}`);
      
      if (!previousTradingDay) {
        return res.json([]);
      }
      
      // Get previous trading day prices sorted by trading amount
      const dayPrices = await storage.getStockPricesByDate(previousTradingDay);
      console.log(`[API] Day prices count: ${dayPrices.length}`);
      
      const topStocks = dayPrices
        .filter(p => p.volumeValue && parseInt(p.volumeValue) > 0)
        .sort((a, b) => parseInt(b.volumeValue) - parseInt(a.volumeValue))
        .slice(0, count);
      
      console.log(`[API] Top ${count} stocks selected: ${topStocks.length}`);
      
      // Get stock info and last crossovers
      const stocks = await storage.getAllStocks();
      const stockMap = new Map(stocks.map(s => [s.code, s]));
      const lastCrossovers = await storage.getLastCrossoverPerStock();
      
      const today = new Date(previousTradingDay);
      const candidates = topStocks.map(price => {
        const stock = stockMap.get(price.stockCode);
        const lastCross = lastCrossovers.get(price.stockCode);
        
        let crossingDays = null;
        if (lastCross) {
          const crossDate = new Date(lastCross.crossDate);
          const daysDiff = Math.floor((today.getTime() - crossDate.getTime()) / (1000 * 60 * 60 * 24));
          crossingDays = -daysDiff; // Negative for past, 0 for today
        }
        
        return {
          code: price.stockCode,
          name: stock?.name || price.stockCode,
          price: parseFloat(price.closePrice),
          lastCrossDate: lastCross?.crossDate || null,
          lastCrossType: lastCross?.signalType || null,
          crossingDays,
          volumeValue: parseInt(price.volumeValue)
        };
      });
      
      console.log(`[API] Returning ${candidates.length} candidates`);
      res.json(candidates);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      res.status(500).json({ error: "Failed to fetch investment candidates" });
    }
  });

  app.get("/api/market-status", async (req, res) => {
    try {
      const now = new Date();
      const taiwanTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Taipei" }));
      const hours = taiwanTime.getHours();
      const day = taiwanTime.getDay();
      
      const isWeekday = day !== 0 && day !== 6;
      const isMarketHours = hours >= 9 && hours < 14;
      const isOpen = isWeekday && isMarketHours;

      const latestSignals = await storage.getCrossoverSignals();
      const latestDate = latestSignals.length > 0 
        ? latestSignals[0].crossDate 
        : taiwanTime.toISOString().split('T')[0];

      res.json({
        status: isOpen ? "open" : "closed",
        lastUpdate: taiwanTime.toISOString().replace('T', ' ').substring(0, 19),
        latestDataDate: latestDate
      });
    } catch (error) {
      console.error("Error fetching market status:", error);
      res.status(500).json({ error: "Failed to fetch market status" });
    }
  });

  app.get("/api/candidates", async (req, res) => {
    try {
      const count = Math.min(parseInt(req.query.count as string) || 100, 100);
      
      const allPrices = await storage.getAllStockPrices();
      
      if (allPrices.length === 0) {
        return res.json([]);
      }

      const sortedByDate = allPrices.sort((a, b) => b.date.localeCompare(a.date));
      const latestDate = sortedByDate[0].date;
      
      const latestPrices = allPrices.filter(p => p.date === latestDate);
      
      const topStocks = latestPrices
        .sort((a, b) => parseInt(b.volumeValue) - parseInt(a.volumeValue))
        .slice(0, count);

      const lastCrossovers = await storage.getLastCrossoverPerStock();
      const stocks = await storage.getAllStocks();
      const stockMap = new Map(stocks.map(s => [s.code, s]));

      const candidates = topStocks.map(price => {
        const stock = stockMap.get(price.stockCode);
        const lastCross = lastCrossovers.get(price.stockCode);
        
        let crossingDays: number | null = null;
        if (lastCross) {
          const crossDate = new Date(lastCross.crossDate);
          const currentDate = new Date(latestDate);
          const diffTime = currentDate.getTime() - crossDate.getTime();
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          crossingDays = -diffDays;
        }

        return {
          code: price.stockCode,
          name: stock?.name || price.stockCode,
          price: parseFloat(price.closePrice),
          lastCrossDate: lastCross?.crossDate || null,
          lastCrossType: lastCross?.signalType || null,
          crossingDays,
          volume: parseInt(price.volume),
          volumeValue: parseInt(price.volumeValue)
        };
      });

      res.json(candidates);
    } catch (error) {
      console.error("Error fetching investment candidates:", error);
      res.status(500).json({ error: "Failed to fetch investment candidates" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
