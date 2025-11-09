# Taiwan Stock Moving Average Crossover Monitor

## Overview

A fintech application that monitors Taiwan Stock Exchange (TWSE) data to identify moving average crossover signals (golden cross and death cross) for the top 200 stocks by trading amount. The system automatically syncs daily stock data, calculates 10-day and 50-day moving averages, and provides a professional dashboard for visualizing these technical signals.

### Change Log

| Date | Version | Description | Author |
| --- | --- | --- | --- |
| 2025-10-08 | 1.01.0 | Initial version | Agent 3 |
| 2025-10-09 | 1.02.0 | Add investment candidate tracking feature with configurable stock count and crossing history | user |

### User Request

**IMPORTANT**: All contents in this replit.md file constitute the Project Requirement Document (PRD) and are the source of truth for developing this application. **You MUST obtain user approval before making any changes to this document.** Additionally, update the change log including date, version, description, and author for later reference if there are any changes to this replit.md.

### User Preferences

Preferred communication style: Simple, everyday language.

## Complete Features
**Core Features:**
- Real-time monitoring of golden cross (bullish) and death cross (bearish) signals
- Top 100 stocks by trading amount tracking
- Automated daily data synchronization with TWSE OpenAPI
- Responsive dashboard with both card and table views
- Dark/light theme support with Material Design principles

**Investment Candidate Tracking (v1.02.0):**
- Permanent display of top stocks by trading amount from previous trading day
- Configurable stock count (20, 50, or up to 100 stocks) selectable by user
- Last crossover date tracking (either golden cross or death cross)
- Crossing days count indicator showing days elapsed since last crossover:
  - Negative values (e.g., -5) indicate crossover occurred 5 days ago
  - Zero (0) indicates crossover occurred today
  - Provides early signal identification for long-term investment opportunities
- Sortable crossing count column for quick identification of recent crossovers
  - Click to toggle ascending/descending order
  - Helps prioritize investment candidates based on crossover timing


## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React 18 with TypeScript for type safety
- Vite as the build tool and dev server
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for server state management

**UI Component System:**
- shadcn/ui components built on Radix UI primitives
- Tailwind CSS for styling with custom design tokens
- Theme system supporting both light and dark modes via CSS variables
- Component library includes cards, tables, tabs, dialogs, and form controls

**Candidate Tracking UI Components (v1.02.0):**
- Stock count selector dropdown (20, 50, 100 options)
- Investment candidates table with sortable crossing count column
- Visual indicators for crossing days count (negative/zero values)
- Last crossover type badge (golden cross in red, death cross in green per Taiwan market convention)
- Responsive table layout for mobile and desktop viewing

**Design System:**
- Based on Material Design principles with fintech aesthetics
- Custom color palette for signal visualization (red for golden cross, green for death cross)
- Typography using Inter (UI), Noto Sans TC (Chinese), and JetBrains Mono (data/numbers)
- Responsive design optimized for mobile and desktop

### Backend Architecture

**Server Framework:**
- Express.js for REST API endpoints
- TypeScript for type safety across client and server
- Shared schema definitions between frontend and backend

**API Structure:**
- `/api/crossovers` - Retrieve crossover signals with optional date and signal type filters
- `/api/sync` - Trigger manual data synchronization
- `/api/candidates` - Retrieve top N stocks by previous day trading amount with crossing history
  - Query parameter: `count` (default: 100, max: 100, options: 20, 50, 100)
  - Returns: stock code, name, price, last cross date, last cross type, crossing days count
- RESTful design with JSON responses

**Data Processing Services:**

1. **TWSE API Service** (`server/services/twseApi.ts`)
   - Interfaces with Taiwan Stock Exchange OpenAPI
   - Fetches daily stock data including prices and trading volumes
   - Handles data parsing and normalization

2. **Data Sync Service** (`server/services/dataSync.ts`)
   - Orchestrates the data synchronization workflow
   - Filters and ranks stocks by trading volume (top 200)
   - Updates stock information and price history

3. **Moving Average Service** (`server/services/movingAverage.ts`)
   - Calculates 10-day and 50-day moving averages
   - Detects crossover signals (golden/death cross)
   - Generates signal metadata with price and MA values

4. **Scheduler Service** (`server/services/scheduler.ts`)
   - Cron-based automated data sync (14:30 Taiwan time, Mon-Fri)
   - Manual sync trigger capability
   - Error handling and logging for sync operations

### Data Storage Solutions

**Database Technology:**
- PostgreSQL via Neon serverless (@neondatabase/serverless)
- Drizzle ORM for type-safe database queries
- Schema-first approach with Drizzle-Zod for validation

**Database Schema:**

1. **stocks table** - Master list of tracked stocks
   - Primary key: UUID
   - Unique stock code and name
   - Indexed on stock code for fast lookups

2. **stock_prices table** - Historical price data
   - Foreign key to stocks via stock code
   - OHLC (Open, High, Low, Close) prices with decimal precision
   - Trading volume and volume value
   - Composite index on (stock_code, date) for efficient querying
   - Supports time-series price retrieval for MA calculations

3. **crossover_signals table** - Detected MA crossover events
   - Foreign key to stocks
   - Signal type (golden/death), cross date, price at crossover
   - MA10 and MA50 values at time of crossover
   - Volume rank for signal prioritization
   - Composite unique index on (stock_code, cross_date, signal_type)
   - Additional query support for last crossover date per stock (used for candidate tracking)

**Storage Implementation:**
- In-memory storage implementation for development/testing
- PostgreSQL implementation for production via Drizzle
- Abstracted storage interface (IStorage) allows switching between implementations

### Authentication and Authorization

Currently not implemented - the application is designed as a read-only monitoring dashboard without user authentication requirements.

## External Dependencies

### Third-Party Services

**Taiwan Stock Exchange (TWSE) OpenAPI:**
- Data source: `https://openapi.twse.com.tw/v1`
- Provides daily stock trading data for Taiwan market
- No authentication required for public endpoints
- Rate limiting and timeout handling implemented (30s timeout)

**Neon Serverless PostgreSQL:**
- Cloud PostgreSQL database via @neondatabase/serverless
- Connection via DATABASE_URL environment variable
- Handles connection pooling and serverless scaling

### Key NPM Dependencies

**Frontend:**
- `@tanstack/react-query` - Server state management and caching
- `@radix-ui/*` - Headless UI component primitives
- `tailwindcss` - Utility-first CSS framework
- `class-variance-authority` - Component variant management
- `date-fns` - Date manipulation and formatting
- `axios` - HTTP client for API requests
- `wouter` - Lightweight routing

**Backend:**
- `express` - Web server framework
- `drizzle-orm` - TypeScript ORM
- `drizzle-zod` - Zod schema generation from Drizzle
- `node-cron` - Task scheduling
- `connect-pg-simple` - PostgreSQL session store (for future auth)

**Build & Development:**
- `vite` - Frontend build tool and dev server
- `tsx` - TypeScript execution for server
- `esbuild` - JavaScript bundler for production builds
- `@replit/vite-plugin-*` - Replit-specific development tools

### Development Workflow

- Development mode: Vite dev server with HMR + Express backend (`npm run dev`)
- Production build: Vite builds frontend to `dist/public`, esbuild bundles backend to `dist`
- Database migrations: Drizzle Kit for schema management (`npm run db:push`)
- Type checking: TypeScript compiler in noEmit mode (`npm run check`)

## Project Structure

```
├── client/                          # Frontend React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                  # shadcn/ui component library
│   │   │   │   ├── accordion.tsx
│   │   │   │   ├── alert-dialog.tsx
│   │   │   │   ├── badge.tsx
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── chart.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── select.tsx
│   │   │   │   ├── table.tsx
│   │   │   │   ├── tabs.tsx
│   │   │   │   └── ... (other shadcn components)
│   │   │   ├── CandidatesTable.tsx  # Investment candidates table component
│   │   │   ├── DataSourceInfo.tsx   # Data source information component
│   │   │   ├── EmptyState.tsx       # Empty state placeholder
│   │   │   ├── FilterTabs.tsx       # Signal filter tabs
│   │   │   ├── StockHeader.tsx      # Dashboard header with sync controls
│   │   │   ├── StockSignalCard.tsx  # Individual stock signal card
│   │   │   ├── StockTable.tsx       # Stock signals table view
│   │   │   ├── ThemeToggle.tsx      # Dark/light theme switcher
│   │   │   └── ViewToggle.tsx       # Card/table view switcher
│   │   ├── hooks/
│   │   │   ├── use-mobile.tsx       # Mobile device detection hook
│   │   │   └── use-toast.ts         # Toast notification hook
│   │   ├── lib/
│   │   │   ├── queryClient.ts       # TanStack Query configuration
│   │   │   └── utils.ts             # Utility functions (cn, etc.)
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx        # Main crossover signals dashboard
│   │   │   ├── InvestmentCandidates.tsx  # Investment candidates page
│   │   │   └── not-found.tsx        # 404 page
│   │   ├── App.tsx                  # Root app component with routing
│   │   ├── index.css                # Global styles and Tailwind imports
│   │   └── main.tsx                 # React app entry point
│   └── index.html                   # HTML template
│
├── server/                          # Backend Express application
│   ├── services/
│   │   ├── dataSync.ts              # Data synchronization orchestration
│   │   ├── movingAverage.ts         # MA calculation and crossover detection
│   │   ├── scheduler.ts             # Cron job scheduler
│   │   └── twseApi.ts               # TWSE OpenAPI integration
│   ├── db.ts                        # Drizzle database connection
│   ├── dbStorage.ts                 # PostgreSQL storage implementation
│   ├── index.ts                     # Express server entry point
│   ├── routes.ts                    # API route definitions
│   ├── storage.ts                   # In-memory storage implementation
│   └── vite.ts                      # Vite dev server integration
│
├── shared/
│   └── schema.ts                    # Shared TypeScript types and Zod schemas
│
├── db/
│   └── index.ts                     # Drizzle schema definitions
│
├── .gitignore                       # Git ignore rules
├── .replit                          # Replit configuration
├── components.json                  # shadcn/ui configuration
├── design_guidelines.md             # Design system documentation
├── drizzle.config.ts                # Drizzle ORM configuration
├── package.json                     # Node.js dependencies
├── postcss.config.js                # PostCSS configuration
├── replit.md                        # Project documentation (this file)
├── tailwind.config.ts               # Tailwind CSS configuration
├── tsconfig.json                    # TypeScript configuration
└── vite.config.ts                   # Vite build configuration
```