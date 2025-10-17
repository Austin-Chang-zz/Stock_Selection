/**
 * API Routes Configuration
 * 
 * This module defines all HTTP API endpoints for the stock analysis application.
 * It handles requests for stock data, crossover signals, market status, and data synchronization.
 * 
 * Main endpoints:
 * - GET /api/stocks - Retrieve all stocks
 * - GET /api/crossovers/:date - Get crossover signals for a specific date
 * - GET /api/candidates/:limit - Get investment candidates sorted by crossover frequency
 * - GET /api/market-status - Check if market data is current
 * - POST /api/sync - Manually trigger data synchronization
 * 
 * All responses follow JSON format with appropriate HTTP status codes.
 */

import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "./db";
import { stocks, stockPrices, crossoverSignals, insertStockSchema, insertStockPriceSchema, insertCrossoverSignalSchema } from "@shared/schema";
import { eq, desc, and, sql } from "drizzle-orm";
import { z } from "zod";
import * as storage from './dbStorage';
import { dataSyncService } from './services/dataSync';

/**
 * Registers all API routes for the application
 * @param app - Express application instance
 * @returns HTTP server instance
 */
export async function registerRoutes(app: Express): Promise<Server> {
  /**
   * GET /api/crossovers - Retrieves crossover signals with optional filtering
   * Query parameters:
   * - date: Filter by specific date (YYYY-MM-DD)
   * - signalType: Filter by signal type ('golden' or 'death')
   */
  app.get("/api/crossovers", async (req, res) => {
    try {
      const { date, signalType } = req.query;

      // Get crossover signals from storage with optional filters
      const signals = await storage.getCrossoverSignals(
        date as string | undefined,
        signalType as string | undefined
      );

      // Get stock information for enrichment
      const stocks = await storage.getAllStocks();
      const stockMap = new Map(stocks.map(s => [s.code, s]));

      // Get latest prices to show current market data
      const latestSignals = await storage.getCrossoverSignals();
      const latestDate = latestSignals.length > 0 ? latestSignals[0].crossDate : null;

      const latestPrices = latestDate 
        ? await storage.getStockPricesByDate(latestDate)
        : [];
      const latestPriceMap = new Map(latestPrices.map(p => [p.stockCode, p]));

      // Get prices at crossover time for change calculation
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

      // Enrich signals with current data and price changes
      const enrichedSignals = signals.map(signal => {
        const stock = stockMap.get(signal.stockCode);
        const latestPrice = latestPriceMap.get(signal.stockCode);
        const crossoverPrice = crossoverPriceMap.get(signal.stockCode);

        // Calculate price changes since crossover
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

  /**
   * GET /api/stocks/:code - Retrieves detailed information for a specific stock
   * Includes stock metadata and recent price history
   */
  app.get("/api/stocks/:code", async (req, res) => {
    try {
      const { code } = req.params;
      const stock = await storage.getStock(code);

      if (!stock) {
        return res.status(404).json({ error: "Stock not found" });
      }

      // Get recent price history (last 60 trading days)
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

  /**
   * POST /api/sync - Manually triggers data synchronization for a specific date
   * Body: { date: 'YYYY-MM-DD' }
   */
  app.post("/api/sync", async (req, res) => {
    try {
      // Validate request body using Zod schema
      const schema = z.object({
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/) // YYYY-MM-DD format
      });

      const { date } = schema.parse(req.body);

      // Execute synchronization
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

  /**
   * POST /api/init-historical - Initializes historical data for a date range
   * Runs asynchronously in the background
   * Body: { startDate: 'YYYY-MM-DD', endDate: 'YYYY-MM-DD' }
   */
  app.post("/api/init-historical", async (req, res) => {
    try {
      const schema = z.object({
        startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
      });

      const { startDate, endDate } = schema.parse(req.body);

      // Start historical data initialization in background (non-blocking)
      dataSyncService.initializeHistoricalData(startDate, endDate)
        .catch((error: Error) => console.error("Background sync error:", error));

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

  /**
   * GET /api/candidates - Retrieves investment candidates (top stocks by trading amount)
   * Query parameters:
   * - count: Number of stocks to return (20, 50, or 100, defaults to 100)
   * 
   * Used by the investment candidate tracking feature (v1.02.0)
   */
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

      // Get unique dates and sort descending to find most recent trading day
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

      // Get stock info and last crossovers for enrichment
      const stocks = await storage.getAllStocks();
      const stockMap = new Map(stocks.map(s => [s.code, s]));
      const lastCrossovers = await storage.getLastCrossoverPerStock();

      const today = new Date(previousTradingDay);
      const candidates = topStocks.map(price => {
        const stock = stockMap.get(price.stockCode);
        const lastCross = lastCrossovers.get(price.stockCode);

        // Calculate days since last crossover (negative values indicate past crossovers)
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
          crossingDays, // Key field for investment candidate tracking
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

  /**
   * GET /api/market-status - Returns current Taiwan stock market status
   * Provides information about whether market is open/closed and last update time
   */
  app.get("/api/market-status", async (req, res) => {
    try {
      const now = new Date();
      // Convert to Taiwan timezone
      const taiwanTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Taipei" }));
      const hours = taiwanTime.getHours();
      const day = taiwanTime.getDay();

      // Taiwan stock market hours: 9:00-14:00, Monday-Friday
      const isWeekday = day !== 0 && day !== 6; // 0=Sunday, 6=Saturday
      const isMarketHours = hours >= 9 && hours < 14;
      const isOpen = isWeekday && isMarketHours;

      // Get latest data date from existing signals
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

  // Create HTTP server for the Express app
  const httpServer = createServer(app);

  return httpServer;
}