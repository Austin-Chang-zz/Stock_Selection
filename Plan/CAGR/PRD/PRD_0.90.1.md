## Product Requirement Document (PRD): Stock Invest CAGR



### Change Log

| Date       | Version | Description                            | Author          |
| ---------- | ------- | -------------------------------------- | --------------- |
| 2025-12-14 | 0.90.1  | Initial PRD        | Austin |

### 1. Overview & Vision

This document outlines the requirements for stock selection for long term stock traders by offering stock's yearly long term profit/loss behavior.

### 2. Problem Statement

Long term stockholders have issues :
-  **Miss leading by dividend** : Some stock long term price difference eat up the dividend or got very small amount of total return.
-  **Miss leading by yield rate and PE ratio** : Some sharply growth stock may have very low yield rate and high PE ratio, but if long term hold this kind of stock will have huge total return and very high CAGR (Compound Annual Growth Rate).
-  **Avoid High price stocks** : High price stocks sometimes mean the stock have stable growth revenue and earnings. Besides, trader can buy few shares instead of a whole sheet (1000 shares). 
-  **Avoid larger fluctuation price changed stock** : Long term stockholders don't have skill to judge the stock price is too high or too low and no clear indicators to make entry or exit decision.  

- **Difficulty of the long term CAGR calculation** : The stock broker's app normally only provide entry and exit price differences as profit/loss calculation. But those apps do not provide long term total return or CAGR (Compound Annual Growth Rate) if there were cash or stock dividends. Besides, every trader has diffenece tax rate which make the calculation more complex.


### Features

#### 📊 Default CAGR calculation
- Calculate the stock yearly long term history default profit and loss for future stock selection. Assume trader buy one sheet stock and at 1st trading day of the year and sell all one sheet and related stock dividend shares.  
  - The profit and loss calculation items (hereinafter referred to as "CAGR") include:
    - Capital Gain/Loss
    - Total After-Tax Cash Dividends
    - Total After-Tax Stock Dividends
    - Total Comprehensive Profit/Loss
    - Total Return
    - Final Shares Held
    - Final Stock Value
    - CAGR (Compound Annual Growth Rate)
    - 5 Years yfinance real data base for calculation

#### 📈 Trader's history CAGR calculation and on-hand CAGR estimation
- Trader only enter all histry entry and exit price and quantity, this app will automatically calculate the "CAGR".
-   

- Payment pages
  - Free user locked items
    - weekly free usage and auto expired function
  