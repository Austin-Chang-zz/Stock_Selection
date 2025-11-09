import axios from 'axios';

// TWSE API 回傳的個股簡要資料型別
// 注意：TWSE 回傳的很多欄位都是字串 (string)，例如成交量或價格常帶有千分位逗號，因此此介面使用 string 儲存原始值。
export interface TWSEStockData {
  // 股票代碼，如 '2330'
  Code: string;
  // 股票名稱，如 '台積電'
  Name: string;
  // 成交股數（字串，可能包含千分位逗號）
  TradeVolume: string;
  // 成交金額（字串，可能包含千分位逗號）
  TradeValue: string;
  // 開盤價（字串）
  OpeningPrice: string;
  // 最高價（字串）
  HighestPrice: string;
  // 最低價（字串）
  LowestPrice: string;
  // 收盤價（字串）
  ClosingPrice: string;
  // 漲跌（字串，可能包含 + / - / 空白 / 特殊符號）
  Change: string;
  // 成交筆數（字串）
  Transaction: string;
}

// TWSE 每日逐筆或每日明細的資料型別（含日期欄位）
export interface TWSEDailyData {
  // 日期：此處以 ROC（民國年）格式字串表示，範例：'1130102' 表示民國 113 年 01 月 02 日
  Date: string;
  Code: string;
  Name: string;
  TradeVolume: string;
  TradeValue: string;
  OpeningPrice: string;
  HighestPrice: string;
  LowestPrice: string;
  ClosingPrice: string;
  Change: string;
}

// TWSE 開放資料的 base URL
const TWSE_BASE_URL = 'https://openapi.twse.com.tw/v1';

/**
 * TWSEApiService
 * - 封裝對台灣證交所（TWSE）開放 API 的請求邏輯
 * - 注意 TWSE 部分 API 請求的日期格式為民國年 (ROC)，且某些 endpoint 會以整個月為單位回傳資料，
 *   因此我們常以 YYYY-MM-01 之類的方式發 request，再在回傳結果中過濾目標日期。
 */
export class TWSEApiService {
  /**
   * 取得依成交金額排序的前 200 檔清單（API: MI_INDEX20）
   * @param date - 傳入格式: 'YYYY-MM-DD'（會在內部把 '-' 移除）
   * @returns 回傳原始的 TWSEStockData 數組（每筆為字串型態），若錯誤則回空陣列
   *
   * 實作細節：
   * - 目前直接把傳入的日期字串去除 '-' 後送到 API；TWSE 此 endpoint 預期的日期格式通常為 'YYYYMMDD'。
   * - 因為 API 回傳可能不是陣列或格式異常，因此先檢查 response.data 是否為陣列。
   */
  async getTop200StocksByAmount(date: string): Promise<TWSEStockData[]> {
    try {
      // 將 'YYYY-MM-DD' 轉為 'YYYYMMDD'
      const formattedDate = date.replace(/-/g, '');
      
      // 取得依成交金額排序的前 200 檔清單（API: MI_INDEX20）
      const response = await axios.get(`${TWSE_BASE_URL}/exchangeReport/MI_INDEX20`, {
        params: {
          date: formattedDate,
          response: 'json'
        },
        // 加上 User-Agent 以避免某些 API 對無 UA 的請求拒絕
        headers: {
          'User-Agent': 'Mozilla/5.0'
        },
        // 30 秒 timeout，避免長時間等待
        timeout: 30000
      });

      // 若回傳為陣列則取前 200 筆，否則回空陣列
      if (response.data && Array.isArray(response.data)) {
        return response.data.slice(0, 200);
      }

      return [];
    } catch (error) {
      // 只在 server 端 log 錯誤，回傳方以空陣列表示沒有資料或發生錯誤
      console.error('Error fetching top 200 stocks by trading amount:', error);
      return [];
    }
  }

  /**
   * 取得單一股票在特定日期的當日資料（若有）
   * @param stockCode - 股票代碼（如 '2330'）
   * @param date - 傳入格式: 'YYYY-MM-DD'
   * @returns 若找到該日資料回傳 TWSEDailyData，否則回傳 null
   *
   * 注意：TWSE 的 STOCK_DAY_ALL endpoint 通常以「民國年+月份的第一天」作為查詢鍵來回傳整個月份的資料，
   * 因此這裡會把西元年轉換為民國年（year - 1911），將日部分固定為 '01' 發送請求，
   * 再在回傳的整個月資料中搜尋目標日（例如：輸入 '2024-02-15' 會轉為民國 '1130201' 發請求，然後在回傳的陣列裡找 '1130215'）。
   */
  async getStockDailyData(stockCode: string, date: string): Promise<TWSEDailyData | null> {
    try {
      const year = parseInt(date.substring(0, 4));
      const month = parseInt(date.substring(5, 7));
      const day = parseInt(date.substring(8, 10));

      // 將西元年轉為民國年（ROC），API 使用 YYYMMDD 的格式，其中 YYY = year - 1911
      const rocYear = year - 1911;
      // 注意：這裡把日固定為 '01'，表示向 API 要整個該月的資料，再自行搜尋目標日
      const formattedDate = `${rocYear}${month.toString().padStart(2, '0')}01`;

      const response = await axios.get(`${TWSE_BASE_URL}/exchangeReport/STOCK_DAY_ALL`, {
        params: {
          date: formattedDate,
          stockNo: stockCode,
          response: 'json'
        },
        headers: {
          'User-Agent': 'Mozilla/5.0'
        },
        timeout: 30000
      });

      if (response.data && Array.isArray(response.data)) {
        // 目標日期在回傳資料中的格式（民國），例：'1130203'
        const targetDateROC = `${rocYear}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`;

        // 在整個月份的回傳資料中尋找符合 targetDateROC 的那一筆
        const targetData = response.data.find((item: TWSEDailyData) =>
          item.Date === targetDateROC
        );
        return targetData || null;
      }

      return null;
    } catch (error) {
      console.error(`Error fetching stock data for ${stockCode}:`, error);
      return null;
    }
  }

  /**
   * 取得所有股票於特定日期的資料（以陣列回傳）
   * - 與 getStockDailyData 相同，此方法會先以民國年月的第一天向 API 要整個月份資料，
   *   再過濾出目標日的紀錄集合並回傳。
   * @param date - 傳入格式: 'YYYY-MM-DD'
   * @returns 若成功回傳該日所有股票資料（陣列），失敗或無資料則回空陣列
   */
  async getAllStocksDailyData(date: string): Promise<TWSEStockData[]> {
    try {
      const year = parseInt(date.substring(0, 4));
      const month = parseInt(date.substring(5, 7));
      const day = parseInt(date.substring(8, 10));

      // 民國年
      const rocYear = year - 1911;
      const formattedDate = `${rocYear}${month.toString().padStart(2, '0')}01`;

      console.log(`[TWSE] Requesting data with ROC date: ${formattedDate} for target date: ${date}`);

      const response = await axios.get(`${TWSE_BASE_URL}/exchangeReport/STOCK_DAY_ALL`, {
        params: {
          date: formattedDate,
          response: 'json'
        },
        headers: {
          'User-Agent': 'Mozilla/5.0'
        },
        timeout: 30000
      });

      if (response.data && Array.isArray(response.data)) {
        // 目標日期的 ROC 表示法
        const targetDateROC = `${rocYear}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`;

        console.log(`[TWSE] Looking for date ${date} as ROC format: ${targetDateROC}, got ${response.data.length} records`);

        // 過濾出 Date 欄位等於目標 ROC 日期的紀錄
        const filtered = response.data.filter((item: any) => {
          if (item.Date === targetDateROC) {
            return true;
          }
          return false;
        });

        console.log(`[TWSE] Found ${filtered.length} matching records for ${targetDateROC}`);
        return filtered;
      }

      return [];
    } catch (error) {
      console.error('Error fetching all stocks data:', error);
      return [];
    }
  }

  /**
   * 將 TWSE API 回傳的價格字串（可能包含千分位逗號或特別符號）解析為數字
   * - 若傳入為 '--' 或 'N/A' 或空值，回傳 0
   */
  parsePrice(priceStr: string): number {
    if (!priceStr || priceStr === '--' || priceStr === 'N/A') return 0;
    return parseFloat(priceStr.replace(/,/g, ''));
  }

  /**
   * 將成交量（字串，可能有千分位逗號）轉為純數字字串
   * - 若輸入為 '--' / 'N/A' / 空值，回傳 '0'
   */
  parseVolume(volumeStr: string): string {
    if (!volumeStr || volumeStr === '--' || volumeStr === 'N/A') return '0';
    return volumeStr.replace(/,/g, '');
  }
}

// 匯出預設實例，方便其它模組直接 import 使用
export const twseApi = new TWSEApiService();
