import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import StockHeader from "@/components/StockHeader";
import FilterTabs from "@/components/FilterTabs";
import StockSignalCard, { type StockSignal } from "@/components/StockSignalCard";
import StockTable from "@/components/StockTable";
import CandidatesTable, { type Candidate } from "@/components/CandidatesTable";
import EmptyState from "@/components/EmptyState";
import DataSourceInfo from "@/components/DataSourceInfo";
import ThemeToggle from "@/components/ThemeToggle";
import ViewToggle from "@/components/ViewToggle";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MarketStatus {
  status: "open" | "closed";
  lastUpdate: string;
  latestDataDate: string;
}

const mockStocks: StockSignal[] = [
  {
    id: "1",
    code: "2330",
    name: "台積電",
    price: 585.00,
    priceChange: 12.50,
    priceChangePercent: 2.18,
    volumeRank: 1,
    signalType: "golden",
    crossDate: "2025-10-08",
    ma10: 578.30,
    ma50: 562.80,
    volume: 45678000
  },
  {
    id: "2",
    code: "2454",
    name: "聯發科",
    price: 1025.00,
    priceChange: 25.00,
    priceChangePercent: 2.50,
    volumeRank: 2,
    signalType: "golden",
    crossDate: "2025-10-08",
    ma10: 1015.30,
    ma50: 995.60,
    volume: 28934000
  },
  {
    id: "3",
    code: "2317",
    name: "鴻海",
    price: 112.50,
    priceChange: -2.30,
    priceChangePercent: -2.00,
    volumeRank: 3,
    signalType: "death",
    crossDate: "2025-10-07",
    ma10: 114.20,
    ma50: 115.80,
    volume: 32456000
  },
  {
    id: "4",
    code: "2412",
    name: "中華電",
    price: 128.50,
    priceChange: 1.50,
    priceChangePercent: 1.18,
    volumeRank: 5,
    signalType: "golden",
    crossDate: "2025-10-08",
    ma10: 127.80,
    ma50: 126.30,
    volume: 18234000
  },
  {
    id: "5",
    code: "2882",
    name: "國泰金",
    price: 65.80,
    priceChange: -1.20,
    priceChangePercent: -1.79,
    volumeRank: 7,
    signalType: "death",
    crossDate: "2025-10-07",
    ma10: 66.50,
    ma50: 67.20,
    volume: 25678000
  },
  {
    id: "6",
    code: "2308",
    name: "台達電",
    price: 298.50,
    priceChange: 8.50,
    priceChangePercent: 2.93,
    volumeRank: 9,
    signalType: "golden",
    crossDate: "2025-10-08",
    ma10: 295.60,
    ma50: 288.30,
    volume: 15234000
  },
  {
    id: "7",
    code: "2886",
    name: "兆豐金",
    price: 38.95,
    priceChange: -0.75,
    priceChangePercent: -1.89,
    volumeRank: 11,
    signalType: "death",
    crossDate: "2025-10-06",
    ma10: 39.40,
    ma50: 39.90,
    volume: 22145000
  },
  {
    id: "8",
    code: "2603",
    name: "長榮",
    price: 185.50,
    priceChange: 12.00,
    priceChangePercent: 6.92,
    volumeRank: 4,
    signalType: "golden",
    crossDate: "2025-10-08",
    ma10: 178.30,
    ma50: 165.80,
    volume: 28934000
  },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"all" | "golden" | "death">("golden");
  const [view, setView] = useState<"cards" | "table">("cards");
  const [candidateCount, setCandidateCount] = useState<number>(100);

  const { data: marketStatus } = useQuery<MarketStatus>({
    queryKey: ['/api/market-status'],
    refetchInterval: 60000,
  });

  const { data: crossovers = [], isLoading } = useQuery<StockSignal[]>({
    queryKey: marketStatus?.latestDataDate 
      ? [`/api/crossovers?date=${marketStatus.latestDataDate}`]
      : ['/api/crossovers'],
    enabled: !!marketStatus?.latestDataDate,
  });

  const { data: candidates = [], isLoading: candidatesLoading } = useQuery<Candidate[]>({
    queryKey: ['/api/candidates', candidateCount],
    refetchInterval: 300000, // Refresh every 5 minutes
  });

  const stocks = crossovers;

  const filteredStocks = stocks.filter(stock => {
    if (activeTab === "all") return true;
    return stock.signalType === activeTab;
  });

  const goldenCount = crossovers.filter(s => s.signalType === "golden").length;
  const deathCount = crossovers.filter(s => s.signalType === "death").length;

  const handleStockClick = (stock: StockSignal) => {
    console.log('Stock clicked:', stock.code, stock.name);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 border-b bg-card">
        <div className="flex-1 flex items-center gap-2">
          <a 
            href="/candidates" 
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md hover-elevate active-elevate-2"
            data-testid="link-candidates"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            前一日重心股
          </a>
        </div>
        <ThemeToggle />
      </div>
      
      <StockHeader 
        marketStatus={marketStatus?.status || "closed"} 
        lastUpdate={marketStatus?.lastUpdate || "載入中..."}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Investment Candidates Section */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">成交重心股潛力標的</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  依前日成交金額排序的潛力標的
                </p>
              </div>
              
              <Select 
                value={candidateCount.toString()} 
                onValueChange={(value) => setCandidateCount(parseInt(value))}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="選擇顯示數量" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="20">前 20 檔</SelectItem>
                  <SelectItem value="50">前 50 檔</SelectItem>
                  <SelectItem value="100">前 100 檔</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {candidatesLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="mt-4 text-sm text-muted-foreground">載入候選資料中...</p>
              </div>
            ) : (
              <CandidatesTable candidates={candidates} />
            )}
          </div>

          {/* Crossover Signals Section */}
          <div className="space-y-4 border-t pt-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <FilterTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                goldenCount={goldenCount}
                deathCount={deathCount}
                totalCount={crossovers.length}
              />
              
              <ViewToggle view={view} onViewChange={setView} />
            </div>
            
            <DataSourceInfo />
            
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="mt-4 text-sm text-muted-foreground">載入資料中...</p>
              </div>
            ) : filteredStocks.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                {view === "cards" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredStocks.map((stock) => (
                      <StockSignalCard 
                        key={stock.id} 
                        stock={stock}
                        onClick={() => handleStockClick(stock)}
                      />
                    ))}
                  </div>
                ) : (
                  <StockTable 
                    stocks={filteredStocks}
                    onRowClick={handleStockClick}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
