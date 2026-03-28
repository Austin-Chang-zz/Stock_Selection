# Design Guidelines: Taiwan Stock Moving Average Crossover Monitor

## Design Approach

**System-Based Approach with Fintech Enhancement**
- Primary framework: Material Design principles for data visualization and card-based layouts
- Visual inspiration: Modern fintech platforms (Robinhood, Trading212) for clean data presentation
- Focus: Information clarity, rapid scanning, and trust-building through professional polish

**Core Design Principles**
1. Data-first hierarchy: Critical information (crossover signals, stock codes) prominently displayed
2. Signal clarity: Instant visual recognition of bullish (golden cross) vs bearish (death cross) events
3. Scanability: Table and card layouts optimized for quick pattern recognition
4. Professional restraint: Minimal decorative elements, maximum information density

---

## Color Palette

**Dark Mode (Primary)**
- Background: 220 15% 8% (深色海軍藍底)
- Surface cards: 220 15% 12%
- Borders: 220 10% 20%

**Light Mode**
- Background: 0 0% 98%
- Surface cards: 0 0% 100%
- Borders: 220 10% 90%

**Semantic Signal Colors**
- Golden Cross (bullish): 0 72% 55% (alert red - Taiwan convention)
- Death Cross (bearish): 142 76% 45% (vibrant green - Taiwan convention)
- Neutral/No signal: 220 10% 50% (muted gray)
- Accent (interactive): 217 91% 60% (professional blue)

**Data Visualization**
- Price up: 142 76% 45%
- Price down: 0 72% 55%
- Volume bars: 220 15% 40%
- Moving average lines: 217 91% 60% (10MA), 280 65% 60% (50MA)

---

## Typography

**Font Stack**
- Primary (UI): 'Inter', 'Noto Sans TC', sans-serif (優先顯示Inter，中文回退到Noto Sans TC)
- Monospace (數據): 'JetBrains Mono', 'Courier New', monospace

**Type Scale**
- Hero numbers (價格/排名): text-4xl font-bold (36px)
- Section headers: text-2xl font-semibold (24px)
- Stock codes: text-lg font-mono font-medium (18px, monospace)
- Stock names: text-base font-normal (16px)
- Data labels: text-sm font-medium (14px)
- Timestamps: text-xs text-muted (12px)

---

## Layout System

**Spacing Primitives**
Core spacing scale: 2, 4, 6, 8, 12, 16 units
- Micro spacing (內部元件): p-2, p-4, gap-2
- Component spacing: p-6, p-8, gap-6
- Section spacing: py-12, py-16
- Page margins: px-4 (mobile), px-8 (tablet), px-12 (desktop)

**Grid & Container**
- Max width: max-w-7xl mx-auto
- Dashboard columns: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Stock table: Full-width responsive table with horizontal scroll on mobile

---

## Component Library

**Dashboard Header**
- Market status indicator (開盤/收盤)
- Last update timestamp
- Quick filter tabs (全部/黃金交叉/死亡交叉)
- Date range selector (subtle, secondary position)

**Signal Cards (Main Display)**
- Card structure: Stock code (large, mono) + Stock name + Signal badge + Price + Volume rank
- Badge design: Rounded pill with icon (↗ golden cross, ↘ death cross)
- Hover state: Subtle elevation increase (shadow-md to shadow-lg)
- Grid layout: 3 columns desktop, 2 tablet, 1 mobile

**Data Table (Alternative View)**
Columns: 排名 | 股票代碼 | 股票名稱 | 收盤價 | 10MA | 50MA | 交叉類型 | 交叉日期
- Sticky header on scroll
- Alternating row backgrounds (subtle zebra striping)
- Sortable columns with arrow indicators
- Monospace for numerical columns

**Empty State**
- Centered icon (📊 chart icon)
- Message: "今日無黃金交叉或死亡交叉訊號"
- Suggestion: "請選擇其他日期或稍後再查詢"

**Loading States**
- Skeleton cards matching signal card dimensions
- Pulsing animation (subtle, professional)
- Progress indicator for data fetch status

**Chart Visualization (Optional Enhancement)**
- Mini candlestick charts embedded in cards
- MA lines overlaid (10MA blue, 50MA purple)
- Crossover point highlighted with marker

---

## Navigation & Interaction

**Tab Navigation**
- Three tabs: 黃金交叉 | 死亡交叉 | 全部股票
- Active tab: Underline indicator in signal color
- Count badges showing number of signals

**Filters**
- Date picker (calendar icon trigger)
- Volume rank range slider (顯示前50/100/200名)
- Industry sector filter (optional)

**Responsive Behavior**
- Mobile: Stacked cards, simplified table (key columns only)
- Tablet: 2-column grid
- Desktop: 3-column grid + full table view toggle

---

## Animations

**Strategic Use Only**
- Card entrance: Stagger fade-in on data load (50ms delay between cards)
- Signal badge: Gentle pulse on new crossover detection (once)
- Hover states: Smooth 200ms transition for shadows and transforms
- NO: Unnecessary scroll animations, parallax, or continuous motion

---

## Accessibility & Performance

**Critical Requirements**
- WCAG AA contrast ratios (4.5:1 minimum for text)
- Color-blind safe: Use icons + text, not color alone for signals
- Keyboard navigation: Full tab order, focus indicators
- Screen reader labels: Announce signal type, stock details
- Chinese character spacing: letter-spacing: 0.02em for readability

**Dark Mode Implementation**
- Consistent across all form inputs, dropdowns, modals
- Input fields: bg-slate-800 border-slate-600
- Sufficient contrast for colored text on dark backgrounds

---

## Images & Visual Assets

**No Hero Image Required**
This is a utility dashboard - focus on data, not imagery.

**Icon Library**
Use Heroicons via CDN for:
- Signal indicators (arrow-trending-up, arrow-trending-down)
- UI controls (calendar, funnel, chart-bar)
- Status icons (check-circle, x-circle, clock)

**Charts**
Use Chart.js or Recharts for:
- Line charts showing MA crossovers
- Volume bar charts
- Performance graphs

---

## Key Differentiators

**Trust Signals**
- Data source attribution (顯示 "資料來源：臺灣證券交易所 OpenAPI")
- Last update timestamp prominently displayed
- Error handling with clear messages

**Professional Polish**
- Subtle shadows for depth (shadow-sm to shadow-lg scale)
- Consistent border radius (rounded-lg for cards, rounded-md for inputs)
- Refined hover states that enhance, not distract
- Attention to Chinese typography: proper line-height (1.8), adequate spacing

This design creates a professional, trustworthy financial monitoring tool that prioritizes data clarity and rapid information access over decorative elements.