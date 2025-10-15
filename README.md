# StockCrossover

簡短說明

StockCrossover 是一個示範型的股票分析 / 篩選應用，前端使用 React + Vite，後端以 Node/Express + TypeScript 實作，並使用 TWSE 開放資料取得股票資訊。

快速開始

1. 下載相依套件

Windows / macOS / Linux:

```bash
npm install
```

2. 設定環境變數（開發）

此專案需要 `DATABASE_URL`（資料庫連線字串）才能完整運行。你可以用下列任一方式提供：

- 臨時在 PowerShell 設定並啟動（只在當前終端生效）：

```powershell
$env:DATABASE_URL='your-database-url-here'; npm run dev
```

- 臨時在 cmd.exe 設定並啟動：

```cmd
set DATABASE_URL=your-database-url-here && npm run dev
```

- 使用 `.env` 檔案（推薦開發用）：

1. 將專案根目錄下的 `.env.example` 複製為 `.env`：

```bash
cp .env.example .env
```

（在 Windows PowerShell 可用： `Copy-Item .env.example .env`）

2. 編輯 `.env`，填入真實的 `DATABASE_URL` 與其他設定。

3. 執行：

```bash
npm run dev
```

注意：`.env` 已加入 `.gitignore`，請勿將真實密鑰推到版本控制。

啟動（開發）

- 舊版 UNIX-style（保留為參考）：

```bash
npm run dev:legacy
# 相當於: NODE_ENV=development tsx server/index.ts
```

- 跨平台（預設，建議使用）：

```bash
npm run dev
# 實際執行: cross-env NODE_ENV=development tsx server/start.ts
```

實作細節（最近變更）

- 新增 `dotenv` 支援：專案會在啟動時自動載入 `.env`（由 `server/start.ts` 的 `import 'dotenv/config'` 實作），確保在任何模組初始化前環境變數已經設定。
- 新增 `server/start.ts`：作為啟動引導檔，會先載入 dotenv，再 import `server/index.ts`。
- `package.json` 已新增 `dev:legacy`（保留舊語法）並把 `dev` 改為使用 `cross-env`（跨平台），並更新為 `tsx server/start.ts` 以確保 dotenv 先被載入。
- 已新增 `.env.example`（範本）與將 `.env` 加入 `.gitignore`（以避免意外提交秘密）。

安全與環境管理建議

- 永遠不要把 `.env` 推到遠端版本庫。已經把 `.env` 加入 `.gitignore`。
- 若需要在 CI / 部署環境使用，請在平台（Vercel / Heroku / Docker / Kubernetes）上以該平台的方式設定 `DATABASE_URL` 等機密。

常見錯誤與排查

- `Error: DATABASE_URL environment variable is not set`：代表 `.env` 未設定或系統環境變數缺失。請參考上方 `.env` 設定步驟。
- `NODE_ENV' 不是內部或外部命令`：表示 `NODE_ENV=...` 這種 UNIX-style 的語法在 Windows shell 不是有效寫法。已替換 `dev` 為使用 `cross-env`，可跨平台使用。

進階（選做）

- 如需我替你：
	- 自動在程式裡加入更完整的 dotenv 與錯誤訊息提示，或
	- 建立 `.env.example` 的更多欄位（例如 API_KEY、REDIS_URL 等），或
	- 清理專案中的臨時 `.env`（我已在專案中放了一個測試用 `.env`，若需要我會移除），

請告訴我你要哪一項，我會幫你實作。

---

## Changelog

- Date: 2025-10-14
	- Version: 1.01.1
	- Description: 本次更新完成開發環境的開箱與跨平台啟動支援：
		- 新增 dotenv 支援與 `.env.example` 範本，並將 `.env` 加入 `.gitignore`，以避免機密資訊誤上傳。
		- 新增 `server/start.ts` 啟動引導檔，確保 `.env` 在模組初始化前被載入，提高啟動穩定性。
		- 將 `dev` 指令改為使用 `cross-env` 並指向 `server/start.ts`（同時保留 `dev:legacy` 作為 UNIX-style 參考）。
		- 處理 Windows 平台上的監聽選項（conditional reusePort）來避免 ENOTSUP 問題，改善跨平台相容性。
		- 更新 `README.md`、新增 `.env.example` 與調整 `.gitignore`。

