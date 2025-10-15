# PRD: 台股移動平均線交叉信號監測系統

## 1. Overview

**項目名稱**: 台股移動平均線交叉信號監測系統 (Taiwan Stock MA Cross Signal Monitor)

**項目目標**: 開發一個Web應用程序，每日監控台股成交金額前200大的股票，當其10週移動平均線（10MA）與50週移動平均線（50MA）發生黃金交叉或死亡交叉時，列出這些股票。若無交叉，則顯示空白。

**目標用戶**: 股票投資者、交易員、金融分析師

**核心價值**: 幫助用戶快速識別技術指標信號，節省手動計算時間，及時掌握交易機會。

## 2. Completed Features

- ✅ 後端服務架設（FastAPI）與Docker容器化
- ✅ PostgreSQL數據庫設計與初始化
- ✅ 取得台股前200大股票列表
- ✅ 計算每支股票的10MA和50MA
- ✅ 判斷黃金交叉與死亡交叉
- ✅ 提供RESTful API返回交叉信號
- ✅ 前端基本框架（React/Vue.js）與顯示表格

## 3. System Architecture

### 3.1 Frontend Architecture

**技術棧**:
- React 18 + TypeScript
- 狀態管理: Redux Toolkit
- UI組件庫: Ant Design / Material-UI
- 圖表庫: Chart.js / Recharts
- 路由: React Router v6
- 建置工具: Vite
- HTTP客戶端: Axios

**前端架構圖**:
```
Frontend (React + TypeScript)
├── Components (可複用組件)
├── Pages (頁面組件)
├── Store (Redux狀態管理)
├── Services (API調用)
├── Hooks (自定義Hook)
└── Utils (工具函數)
```

**核心頁面**:
- **信號儀表板**: 顯示當日MA交叉信號
- **股票詳情頁**: 顯示個股K線圖與MA走勢
- **歷史查詢頁**: 查詢歷史交叉信號
- **設定頁面**: 參數設定與偏好設定

### 3.2 Backend Architecture

**技術棧**:
- FastAPI (Python 3.11)
- PostgreSQL 15
- Docker + Docker Compose
- Celery (背景任務)
- Redis (快取與訊息代理)
- SQLAlchemy (ORM)

**後端架構圖**:
```
Backend (FastAPI + PostgreSQL)
├── API Layer (RESTful endpoints)
├── Service Layer (業務邏輯)
├── Data Layer (數據存取)
├── Task Layer (Celery任務)
└── Utils (工具模塊)
```

**核心服務模塊**:
- **StockDataService**: 股票數據獲取與處理
- **MACalculatorService**: MA計算與交叉檢測
- **SignalNotificationService**: 信號通知處理
- **DataUpdateService**: 數據更新服務

## 4. Data Storage

### 數據庫設計

**主要數據表**:

1. **stock_basics** (股票基本資訊)
   - symbol (VARCHAR, PK)
   - name (VARCHAR)
   - industry (VARCHAR)
   - market_cap (BIGINT)
   - created_at (TIMESTAMP)

2. **stock_prices** (股價日線數據)
   - id (SERIAL, PK)
   - symbol (VARCHAR)
   - trade_date (DATE)
   - open_price (DECIMAL)
   - high_price (DECIMAL)
   - low_price (DECIMAL)
   - close_price (DECIMAL)
   - volume (BIGINT)
   - created_at (TIMESTAMP)

3. **ma_signals** (移動平均線信號)
   - id (SERIAL, PK)
   - symbol (VARCHAR)
   - signal_type (VARCHAR) -- 'golden_cross' or 'death_cross'
   - signal_date (DATE)
   - close_price (DECIMAL)
   - ma_10 (DECIMAL)
   - ma_50 (DECIMAL)
   - confirmed (BOOLEAN)
   - created_at (TIMESTAMP)

4. **system_logs** (系統日誌)
   - id (SERIAL, PK)
   - log_level (VARCHAR)
   - message (TEXT)
   - timestamp (TIMESTAMP)

### 索引策略
```sql
-- 性能優化索引
CREATE INDEX idx_stock_prices_symbol_date ON stock_prices(symbol, trade_date DESC);
CREATE INDEX idx_ma_signals_date_type ON ma_signals(signal_date, signal_type);
CREATE INDEX idx_ma_signals_symbol_date ON ma_signals(symbol, signal_date);
```

## 5. External Dependencies

### 第三方API
- **台灣證交所公開數據API**: 取得台股每日交易數據
- **Yahoo Finance API (備用)**: 透過`yfinance`庫獲取數據
- **Twder (台灣股市資料套件)**: 台股數據抓取

### 開發依賴
**後端**:
```txt
fastapi==0.104.1
uvicorn==0.24.0
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
celery==5.3.4
redis==5.0.1
pandas==2.1.3
yfinance==0.2.18
```

**前端**:
```txt
react==18.2.0
typescript==5.2.2
redux-toolkit==1.9.7
antd==5.12.0
chart.js==4.4.0
axios==1.6.0
```

## 6. Development Plan

### Sprint 0 (已完成)
- [x] 項目初始化與技術棧選型
- [x] 後端基礎架構搭建
- [x] 數據庫設計與Docker配置

### Sprint 1 (2週)
**目標**: 核心數據管道建立
- 股票數據獲取模塊
- MA計算引擎
- 基礎API端點

### Sprint 2 (2週)
**目標**: 前端基礎框架
- React項目初始化
- 基礎組件開發
- API對接

### Sprint 3 (2週)
**目標**: 核心功能完善
- 信號檢測自動化
- 數據可視化
- 用戶界面優化

### Sprint 4 (2週)
**目標**: 進階功能與部署
- 通知系統
- 性能優化
- 生產環境部署

## 7. To-Do Checklist

### Sprint 1: 核心數據管道
**Success Criteria**:
- [ ] 實現從證交所API獲取前200大股票列表
- [ ] 建立股票歷史價格數據獲取管道
- [ ] 實現10MA/50MA計算邏輯
- [ ] 完成交叉信號檢測算法
- [ ] 提供基礎REST API (`/api/signals/daily`)
- [ ] 數據庫寫入性能測試通過

### Sprint 2: 前端基礎框架
**Success Criteria**:
- [ ] React + TypeScript項目初始化
- [ ] 實現信號列表組件
- [ ] 建立Redux狀態管理
- [ ] 完成API服務層封裝
- [ ] 實現響應式佈局
- [ ] 前端與後端聯調測試通過

### Sprint 3: 核心功能完善
**Success Criteria**:
- [ ] 實現Celery定時任務自動檢測
- [ ] 完成股票詳情頁與K線圖
- [ ] 實現歷史信號查詢功能
- [ ] 添加數據導出功能(CSV/Excel)
- [ ] 完成錯誤處理與加載狀態
- [ ] 用戶體驗測試通過

### Sprint 4: 進階功能與部署
**Success Criteria**:
- [ ] 實現郵件/Line通知功能
- [ ] 添加參數自定義設定
- [ ] 完成系統監控與日誌
- [ ] 生產環境Docker部署
- [ ] 性能壓力測試通過
- [ ] 用戶驗收測試完成

## 8. Project Structure (src tree)

### 後端項目結構
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI應用入口
│   ├── config.py               # 配置管理
│   ├── database.py             # 數據庫連接
│   ├── models/                 # 數據模型
│   │   ├── __init__.py
│   │   ├── stock.py
│   │   ├── signal.py
│   │   └── base.py
│   ├── schemas/                # Pydantic模型
│   │   ├── __init__.py
│   │   ├── stock.py
│   │   └── signal.py
│   ├── api/                    # API路由
│   │   ├── __init__.py
│   │   ├── v1/                 # API版本1
│   │   │   ├── __init__.py
│   │   │   ├── endpoints/
│   │   │   │   ├── signals.py
│   │   │   │   ├── stocks.py
│   │   │   │   └── system.py
│   │   │   └── routers.py
│   ├── services/               # 業務邏輯層
│   │   ├── __init__.py
│   │   ├── stock_service.py
│   │   ├── ma_calculator.py
│   │   ├── signal_detector.py
│   │   └── data_fetcher.py
│   ├── tasks/                  # Celery任務
│   │   ├── __init__.py
│   │   ├── celery_app.py
│   │   ├── daily_check.py
│   │   └── data_update.py
│   ├── utils/                  # 工具函數
│   │   ├── __init__.py
│   │   ├── date_utils.py
│   │   ├── calculation.py
│   │   └── logger.py
│   └── dependencies.py         # FastAPI依賴注入
├── tests/                      # 測試文件
├── scripts/                    # 數據庫腳本
├── requirements/
│   ├── base.txt
│   ├── dev.txt
│   └── prod.txt
├── Dockerfile
└── docker-compose.yml
```

### 前端項目結構
```
frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/             # 可複用組件
│   │   ├── common/
│   │   │   ├── Header/
│   │   │   ├── Footer/
│   │   │   ├── Loading/
│   │   │   └── ErrorBoundary/
│   │   ├── signals/
│   │   │   ├── SignalTable/
│   │   │   ├── SignalCard/
│   │   │   └── SignalFilter/
│   │   └── stocks/
│   │       ├── StockChart/
│   │       ├── PriceDisplay/
│   │       └── MAIndicator/
│   ├── pages/                  # 頁面組件
│   │   ├── Dashboard/          # 儀表板
│   │   ├── StockDetail/        # 股票詳情
│   │   ├── History/            # 歷史查詢
│   │   ├── Settings/           # 設定
│   │   └── NotFound/           # 404頁面
│   ├── store/                  # 狀態管理
│   │   ├── slices/
│   │   │   ├── signalSlice.ts
│   │   │   ├── stockSlice.ts
│   │   │   └── uiSlice.ts
│   │   ├── index.ts
│   │   └── hooks.ts
│   ├── services/               # API服務
│   │   ├── api/
│   │   │   ├── base.ts
│   │   │   ├── signalAPI.ts
│   │   │   └── stockAPI.ts
│   │   └── types/              # TypeScript類型定義
│   ├── hooks/                  # 自定義Hook
│   │   ├── useSignals.ts
│   │   ├── useStocks.ts
│   │   └── useLocalStorage.ts
│   ├── utils/                  # 工具函數
│   │   ├── dateUtils.ts
│   │   ├── formatters.ts
│   │   ├── constants.ts
│   │   └── validators.ts
│   ├── styles/                 # 全局樣式
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── package.json
├── tsconfig.json
├── vite.config.ts
└── index.html
```

### 基礎設施結構
```
infrastructure/
├── nginx/
│   ├── nginx.conf
│   └── ssl/                    # SSL證書
├── monitoring/
│   ├── prometheus.yml
│   └── grafana-dashboard.json
├── scripts/
│   ├── deploy.sh
│   ├── backup.sh
│   └── health-check.sh
└── docker/
    ├── backend.Dockerfile
    ├── frontend.Dockerfile
    └── nginx.Dockerfile
```

此PRD提供了完整的項目規劃，從技術架構到開發計劃，確保團隊對項目有清晰的理解和一致的方向。