import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpDown, ArrowUp, ArrowDown, ArrowLeft } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Candidate {
  code: string;
  name: string;
  dateIdx: string;
  price: number;
  highPrice: number;
  lowPrice: number;
  volume: number;
  volumeValue: number;
  lastCrossDate: string | null;
  lastCrossType: "golden" | "death" | null;
  crossingDays: number | null;
}

type SortOrder = "asc" | "desc" | null;

export default function InvestmentCandidates() {
  const [stockCount, setStockCount] = useState<string>("100");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const { data: candidates = [], isLoading } = useQuery<Candidate[]>({
    queryKey: ['/api/candidates', stockCount],
    queryFn: async () => {
      const response = await fetch(`/api/candidates?count=${stockCount}`);
      if (!response.ok) throw new Error('Failed to fetch candidates');
      return response.json();
    },
  });

  const sortedCandidates = [...candidates].sort((a, b) => {
    if (sortOrder === null) return 0;
    
    const aValue = a.crossingDays ?? -9999;
    const bValue = b.crossingDays ?? -9999;
    
    return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
  });

  const handleSortToggle = () => {
    if (sortOrder === null) {
      setSortOrder("desc");
    } else if (sortOrder === "desc") {
      setSortOrder("asc");
    } else {
      setSortOrder(null);
    }
  };

  const getSortIcon = () => {
    if (sortOrder === "asc") return <ArrowUp className="h-4 w-4" />;
    if (sortOrder === "desc") return <ArrowDown className="h-4 w-4" />;
    return <ArrowUpDown className="h-4 w-4" />;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 border-b bg-card">
        <div className="flex-1 flex items-center gap-2">
          <a 
            href="/" 
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md hover-elevate active-elevate-2"
            data-testid="link-dashboard"
          >
            <ArrowLeft className="h-4 w-4" />
            返回監控面板
          </a>
        </div>
        <ThemeToggle />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold" data-testid="text-page-title">前一日重心股</h1>
              <p className="text-sm text-muted-foreground mt-1" data-testid="text-page-subtitle">
                依前一交易日成交金額排序的候選股票
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">顯示股票數：</span>
              <Select value={stockCount} onValueChange={setStockCount}>
                <SelectTrigger className="w-24" data-testid="select-stock-count">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="20" data-testid="option-count-20">20</SelectItem>
                  <SelectItem value="50" data-testid="option-count-50">50</SelectItem>
                  <SelectItem value="100" data-testid="option-count-100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-4 text-sm text-muted-foreground">載入資料中...</p>
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24" data-testid="header-code">股票代碼</TableHead>
                    <TableHead data-testid="header-name">股票名稱</TableHead>
                    <TableHead className="text-right" data-testid="header-price">收盤價</TableHead>
                    <TableHead className="text-right" data-testid="header-high-price">最高價</TableHead>
                    <TableHead className="text-right" data-testid="header-low-price">最低價</TableHead>
                    <TableHead className="text-right" data-testid="header-volume">成交量</TableHead>
                    <TableHead className="text-right" data-testid="header-volume-value">成交金額(億)</TableHead>
                    <TableHead className="text-center" data-testid="header-date">日期</TableHead>
                    <TableHead className="text-center" data-testid="header-cross-type">最後交叉類型</TableHead>
                    <TableHead className="text-center" data-testid="header-cross-date">最後交叉日期</TableHead>
                    <TableHead className="text-center" data-testid="header-crossing-days">
                      <button
                        onClick={handleSortToggle}
                        className="flex items-center justify-center gap-1 w-full hover-elevate active-elevate-2"
                        data-testid="button-sort-crossing-days"
                      >
                        交叉天數
                        {getSortIcon()}
                      </button>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedCandidates.map((candidate, index) => (
                    <TableRow key={candidate.code} data-testid={`row-candidate-${index}`}>
                      <TableCell className="font-mono" data-testid={`text-code-${candidate.code}`}>
                        {candidate.code}
                      </TableCell>
                      <TableCell data-testid={`text-name-${candidate.code}`}>
                        {candidate.name}
                      </TableCell>
                      <TableCell className="text-right font-mono" data-testid={`text-price-${candidate.code}`}>
                        {candidate.price.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right font-mono" data-testid={`text-high-price-${candidate.code}`}>
                        {candidate.highPrice.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right font-mono" data-testid={`text-low-price-${candidate.code}`}>
                        {candidate.lowPrice.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right font-mono" data-testid={`text-volume-${candidate.code}`}>
                        {candidate.volume.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-mono" data-testid={`text-volume-value-${candidate.code}`}>
                        {candidate.volumeValue.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-center text-sm" data-testid={`text-date-${candidate.code}`}>
                        {candidate.dateIdx}
                      </TableCell>
                      <TableCell className="text-center" data-testid={`badge-cross-type-${candidate.code}`}>
                        {candidate.lastCrossType ? (
                          <Badge 
                            variant={candidate.lastCrossType === "golden" ? "destructive" : "default"}
                            className="text-xs"
                          >
                            {candidate.lastCrossType === "golden" ? "黃金交叉" : "死亡交叉"}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">無</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center text-sm" data-testid={`text-cross-date-${candidate.code}`}>
                        {candidate.lastCrossDate || "-"}
                      </TableCell>
                      <TableCell className="text-center font-mono" data-testid={`text-crossing-days-${candidate.code}`}>
                        {candidate.crossingDays !== null ? (
                          <span className={candidate.crossingDays === 0 ? "font-bold text-primary" : ""}>
                            {candidate.crossingDays}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          
          <div className="text-sm text-muted-foreground space-y-1">
            <p>• 交叉天數為負值表示距今天數（例如 -5 表示 5 天前發生交叉）</p>
            <p>• 交叉天數為 0 表示今天發生交叉</p>
            <p>• 點擊「交叉天數」欄位標題可切換排序順序</p>
          </div>
        </div>
      </div>
    </div>
  );
}
