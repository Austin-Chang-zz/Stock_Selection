// 啟動引導檔
// 目的：以 ESM-safe 方式在任何其它模組執行前先載入 dotenv，確保 process.env 在模組初始化時可用。
// 使用方式：透過 tsx 執行此檔案（或用 node -r dotenv/config 在編譯後的檔案上啟動）。
import 'dotenv/config';
import './index';
