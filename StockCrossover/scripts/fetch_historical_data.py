#!/usr/bin/env python3
"""
Fetch historical Taiwan stock data from Yahoo Finance using yfinance
"""
import sys
import json
import yfinance as yf
from datetime import datetime, timedelta
import pandas as pd

def fetch_stock_data(stock_code, days=60):
    """
    Fetch historical data for a Taiwan stock
    
    Args:
        stock_code: Taiwan stock code (e.g., "2330")
        days: Number of days of historical data to fetch
        
    Returns:
        List of daily stock data dictionaries
    """
    try:
        # Add .TW suffix for Taiwan stocks
        ticker = f"{stock_code}.TW"
        
        # Calculate date range
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days + 30)  # Extra buffer for weekends/holidays
        
        # Fetch data from Yahoo Finance
        stock = yf.Ticker(ticker)
        hist = stock.history(start=start_date.strftime('%Y-%m-%d'), end=end_date.strftime('%Y-%m-%d'))
        
        if hist.empty:
            return []
        
        # Convert to list of dictionaries
        result = []
        for date, row in hist.iterrows():
            result.append({
                'date': date.strftime('%Y-%m-%d'),
                'open': float(row['Open']),
                'high': float(row['High']),
                'low': float(row['Low']),
                'close': float(row['Close']),
                'volume': int(row['Volume'])
            })
        
        return result
        
    except Exception as e:
        print(f"Error fetching {stock_code}: {str(e)}", file=sys.stderr)
        return []

def fetch_multiple_stocks(stock_codes, days=60):
    """
    Fetch historical data for multiple Taiwan stocks
    
    Args:
        stock_codes: List of Taiwan stock codes
        days: Number of days of historical data to fetch
        
    Returns:
        Dictionary mapping stock codes to their historical data
    """
    results = {}
    
    for code in stock_codes:
        data = fetch_stock_data(code, days)
        if data:
            results[code] = data
    
    return results

if __name__ == "__main__":
    # Read days and stock codes from command line arguments
    # Usage: python fetch_historical_data.py <days> <stock_code1> <stock_code2> ...
    if len(sys.argv) < 3:
        print("Usage: python fetch_historical_data.py <days> <stock_code1> <stock_code2> ...")
        sys.exit(1)
    
    days = int(sys.argv[1])
    stock_codes = sys.argv[2:]
    
    # Fetch data
    results = fetch_multiple_stocks(stock_codes, days)
    
    # Output as JSON
    print(json.dumps(results, ensure_ascii=False))
