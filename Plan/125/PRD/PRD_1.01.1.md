
# 🥚 Product Requirement Document (PRD)

## Project Title

**Kostolany Egg Web Application (12.5 Theory Trading System)**

### Change Log

| Date       | Version | Description                                                                                  | Author  |
| ---------- | ------- | -------------------------------------------------------------------------------------------- | ------- |
| 2025-11-7 | 1.01.0  | Initial version                                                                              | Austin |
| 2025-11-7 | 1.01.1  | Add K-bar chart & Instant Messaging | Austin    |


---

## 1. Product Overview

### 1.1 Purpose

This web application assists traders in managing long-term trading strategies based on **Kostolany’s Egg Theory** by using weekly MA10 (10) and MA2 (2) and MA26 (.5 as half year) combination to be the 12.5 theory trading system. It integrates **technical indicators**, **weekly/daily charting**, and **automated data flow** to identify entry and exit points for long-term investment decisions.

### 1.2 Objectives

* Automate data updates from TWSE (Taiwan Stock Exchange) API.
* Evaluate trading signals using multi-timeframe technical indicators.
* Visualize and manage “Main 100” stocks and custom “Target Lists” in a Notion-like interface.
* Judge the **Egg Phase** (Y, A1–A3, X, B1–B3) automatically based on weekly data.
* Plot **weekly and daily K-bar charts** for each stock.
* Provide **instant messaging** for real-time discussion between users.
* Enable **alert notifications** when trading conditions meet user-defined criteria.
* Integrate chatbot-assisted interaction and data querying.

---

## 2. Core Features

### 2.1 Kostolany Egg Theory Engine

* Implements **Kostolany Egg (12.5) Phases**:

  * **Bullish cycle:** Y → A1 → A2 → A3
  * **Bearish cycle:** X → B1 → B2 → B3
* Determined using **weekly technical indicators**.
* Outputs **phase judgment results** and phase transition logs.

---

### 2.2 Technical Indicator Modules

| Timeframe       | Indicators                                | Description                    |
| --------------- | ----------------------------------------- | ------------------------------ |
| **Daily**       | MA2, MA10, MA50, MA132                    | Simple Moving Averages (SMA)   |
| **Weekly**      | MA2, MA10, MA26                           | Weekly trend reference         |
| **SAR**         | High/Low dots & count                     | Indicates momentum reversal    |
| **MA Cross**    | 2-MA crossover or crossunder detection    | Triggers entry/exit points     |
| **MA Slope**    | Positive/negative slope                   | Indicates uptrend or downtrend |
| **Cross Count** | Counts number of bars since last MA cross | Used to assess signal age      |

**Outputs:**

* XO/XU (cross over / cross under) signals
* Slope sign (+ or −)
* Cross count since last event

---

### 2.3 Daily Flow Automation (Dev Flow)

| Time                  | Task                     | Description                                                                         |
| --------------------- | ------------------------ | ----------------------------------------------------------------------------------- |
| **8:40 AM**           | Clear previous VV100     | Move yesterday’s “Volume Value 100” list to archive; reset today’s list             |
| **9:00 AM**           | Start trading            | TWSE API fetch begins                                                               |
| **9:03 AM**           | Initialize VV100 display | Show top 100 stocks ordered by volume value                                         |
| **Every 30 min**      | Update VV100 order       | Refresh ranking automatically (default 30 min; 5 min optional for higher frequency) |
| **1:30 PM**           | End trading              | Freeze live updates                                                                 |
| **2:30 PM (Mon–Fri)** | Auto-sync trading data   | Automatically triggers sync task regardless of user activity                        |

**Implementation:**

* `scheduler.ts` automates all above time-triggered processes using `node-cron`.
* Backend updates stored in SQL or NoSQL DB for later analytics.
* Add a retry mechanism inside dataSyncService.fullSync() (in case TWSE API times out).

* Log sync results (success/failure timestamps) to a DB or a log file for monitoring.

* Optionally add a manual catch-up script to re-sync data for missed days (e.g., holidays or downtime).

---

### 2.4 Display Matrix (Notion-like UI)

#### 2.4.1 Main Matrix

* Displays **Main 100 (VV100)** in grid format.
* Each record includes TWSE stock data and computed indicators.

#### 2.4.2 Target Lists

* Up to **6 target lists** for categorized monitoring.
* Each list can be edited or updated via right-click or drag/drop.

#### 2.4.3 Fields

* Default TWSE fields (e.g., stock name, price, volume, change, % change).
* Additional computed fields (e.g., MA slope, SAR count, phase result).

---

### 2.5 Notion-like Field Interaction

| Interaction               | Description                                                 |
| ------------------------- | ----------------------------------------------------------- |
| **Insert**                | Add new technical objects (from right-click pull-down menu) |
| **Delete**                | Remove selected field or record                             |
| **Move Forward/Backward** | Reorder fields or lists                                     |
| **Right-Click on Field**  | Context menu for advanced actions                           |
| **Target List Actions**   | Copy stock to target list from pull-down menu               |
| **Other Field Actions**   | Mark Ascent/Descent state via pull-down menu                |

---

### 2.6 K-Bar Chart Visualization

**Purpose:**
Allow traders to visualize historical and real-time price action directly within the app.

**Details:**

* Supports **weekly** and **daily** K-bar (candlestick) charts.
* Integrates with **TradingView Widget**, **Recharts**, or **Plotly.js**.
* Each chart overlays MAs and SAR indicators for visual confirmation.
* Optional: enable “compare mode” (view multiple stocks side-by-side).

---

### 2.7 Instant Messaging System

**Purpose:**
Enable users to discuss trading ideas in real time — similar to LINE group chats.

**Features:**

* Group and private chat channels (e.g., “VV100 Discussion,” “Weekly Signals”).
* Message tagging (e.g., @stock2330, #phaseA2).
* Inline preview for chart or signal when stock code is mentioned.
* Server push via WebSocket for live updates.
* Message logs stored in database for audit or review.

**Implementation:**

* WebSocket or Socket.io for real-time messaging.
* Message schema includes `user_id`, `group_id`, `timestamp`, and `content`.
* Optional: integrate **LINE Notify API** for external push alerts.

---

### 2.8 User Alert System

**Purpose:**
Notify users immediately when a trading condition (e.g., MA crossover, Egg phase shift, volume spike) is met.

**Features:**

* Custom **alert editor** (GUI):

  * Choose conditions such as MA cross, slope sign, or volume threshold.
  * Set timeframe (daily/weekly).
  * Enable/disable sound or pop-up alert.
* **Alert channels:**

  * In-app pop-up notifications
  * Optional LINE or email alert
* **Condition triggers:**

  * Detected by backend `technicalEngine.ts`
  * Trigger events emitted to frontend WebSocket

---

### 2.9 Chatbot Features (Low Priority)

| Feature             | Description                                                                  |
| ------------------- | ---------------------------------------------------------------------------- |
| **Group Chatbot**   | Supports multiple channels (analyst, data bot, etc.)                         |
| **Service Chatbot** | Responds to user queries like “Show today’s VV100” or “Which phase is 2330?” |
| **Integration**     | Connects to matrix data, trading logs, and indicators for AI-based answers   |

---

## 3. System Architecture Overview

### 3.1 Frontend

* **Framework:** React (Next.js or Vite)
* **UI Library:** TailwindCSS + shadcn/ui
* **Features:**

  * Real-time matrix dashboard
  * Notion-style drag-and-drop
  * K-bar chart plotting
  * Alert pop-ups
  * Instant messaging interface
  * Chatbot widget

### 3.2 Backend

* **Runtime:** Node.js (Express or NestJS)
* **Modules:**

  * `scheduler.ts` → automation tasks
  * `twseService.ts` → TWSE data retrieval
  * `technicalEngine.ts` → compute indicators
  * `eggJudge.ts` → Egg phase logic
  * `alertEngine.ts` → user-defined condition monitoring
  * `chatService.ts` → real-time chat and group management

### 3.3 Database

* **SQL Server** (already connected in VS Code)
* Tables:

  * `VV100_Daily`
  * `VV100_History`
  * `Technical_Indicators`
  * `Egg_Phase_Judge`
  * `Target_Lists`
  * `Chat_Messages`
  * `Alert_Settings`
  * `Alert_Logs`

### 3.4 Integration

* **TWSE API:** For live and historical data
* **Chatbot Engine:** RAG + LLM (e.g., GPT-5 API or local model)
* **Notification API:** LINE Notify / Email / In-app WebSocket push
* **Cloud/Server:** AWS, Azure, or Railway deployment

---

## 4. Key Algorithms

1. **Moving Average Crossover Detection**

   * `XO = MA_short(t) crosses above MA_long(t)`
   * `XU = MA_short(t) crosses below MA_long(t)`
   * Records date/time and cross count since event

2. **Slope Calculation**

   * `slope = MA(t) - MA(t-1)`
   * slope > 0 → Uptrend; slope < 0 → Downtrend

3. **SAR Dot Counting**

   * Count consecutive SAR high or low dots to assess momentum persistence

4. **Egg Phase Judgment**

   * Y → when long-term MA crosses up with positive slope
   * A1–A3 → progressive bullish stages
   * X → long-term MA flattens and reverses
   * B1–B3 → bearish decline stages

5. **User Alert Trigger**

   * On each data refresh, compare computed signals with user-defined conditions
   * If condition met → emit notification event

---

## 5. User Roles

| Role        | Description                                            |
| ----------- | ------------------------------------------------------ |
| **Admin**   | Manages system parameters, scheduler, and user roles   |
| **Trader**  | Uses technical indicators, K-bar charts, and matrix UI |
| **Analyst** | Discusses signals via chat and reviews Egg phase data  |
| **Viewer**  | Read-only access to data, charts, and alerts           |

---

## 6. Future Enhancements (Low Priority)

* Brokerage API integration for simulated or real trading
* Mobile app with push notifications
* AI predictive module (TensorFlow / PyTorch)
* Performance dashboard for yield & ROI tracking

---

## 7. Milestones

| Phase  | Deliverable                                          | Target Date |
| ------ | ---------------------------------------------------- | ----------- |
| **M1** | Backend architecture + TWSE data sync (scheduler.ts) | Dec 2025    |
| **M2** | Technical indicator engine + database schema         | Jan 2026    |
| **M3** | Frontend matrix UI + chart plotting + alerts         | Feb 2026    |
| **M4** | Chat system + Egg phase logic + chatbot integration  | Mar 2026    |
| **M5** | Beta testing + dashboard enhancements                | Apr 2026    |

---

