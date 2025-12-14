## How to access the yfinance database
### App features
- If I want to develop a stock invest profit/loss calculation app has features as follows:
  - Input :
    - stock number or stock name.
    - one sheet (1000 shares) quantity.
    - Period of time by years. most period is 5 years.
    - entry date, the first trading date of starting year.
    - exit date, the last trading date of ending year.
  - Ouput:
    - Capital Gain/Loss
    - Total After-Tax Cash Dividends Collected
    - Total After-Tax stock Dividends Collected
    - Total Comprehensive Profit/Loss
    - Total Return %
    - Average Annualized Return (CAGR)
    - Annual Profit/Loss Breakdown by a table
  ### Qustion
    - If I use yfinance API to get the app needed data, how to get cost/performance result ?
      - Download all maximum 5 year stock data through yfinace api to app based database and query this database when user make a search and query every time ? The 5 year trading data of all Taiwan stock market are very huge.
      - Or, access yfinance database when user make a search and query every time ? 
    - what is the price of using yfinance api? 
    - if use postgres database as app based database, what is the price of using database including size and computing or others ?
  
  