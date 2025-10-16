import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowUpCircle, ArrowDownCircle, TrendingUp, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StockSignal } from "./StockSignalCard";

interface StockTableProps {
  stocks: StockSignal[];
  onRowClick?: (stock: StockSignal) => void;
}

export default function StockTable({ stocks, onRowClick }: StockTableProps) {
  if (stocks.length === 0) {
    return (
      <div className="text-center py-12" data-testid="empty-state">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
          <ArrowUpDown className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">無交叉訊號</h3>
        <p className="text-sm text-muted-foreground">
          今日無黃金交叉或死亡交叉訊號
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">排名</TableHead>
            <TableHead>股票代碼</TableHead>
            <TableHead>股票名稱</TableHead>
            <TableHead className="text-right">收盤價</TableHead>
            <TableHead className="text-right">漲跌</TableHead>
            <TableHead className="text-right">10MA</TableHead>
            <TableHead className="text-right">50MA</TableHead>
            <TableHead>交叉類型</TableHead>
            <TableHead>交叉日期</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stocks.map((stock) => {
            const isGolden = stock.signalType === "golden";
            const SignalIcon = isGolden ? ArrowUpCircle : ArrowDownCircle;
            
            return (
              <TableRow
                key={stock.id}
                className="hover-elevate cursor-pointer"
                onClick={() => onRowClick?.(stock)}
                data-testid={`row-stock-${stock.code}`}
              >
                <TableCell className="font-mono font-medium">
                  #{stock.volumeRank}
                </TableCell>
                <TableCell className="font-mono font-semibold">
                  {stock.code}
                </TableCell>
                <TableCell>{stock.name}</TableCell>
                <TableCell className="text-right font-mono">
                  ${stock.price.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  <span 
                    className={cn(
                      "font-medium font-mono flex items-center justify-end gap-1",
                      stock.priceChange >= 0 ? "text-success" : "text-danger"
                    )}
                  >
                    <TrendingUp className={cn("w-3 h-3", stock.priceChange < 0 && "rotate-180")} />
                    {stock.priceChange >= 0 ? "+" : ""}{stock.priceChangePercent.toFixed(2)}%
                  </span>
                </TableCell>
                <TableCell className="text-right font-mono">
                  ${stock.ma10.toFixed(2)}
                </TableCell>
                <TableCell className="text-right font-mono">
                  ${stock.ma50.toFixed(2)}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={isGolden ? "default" : "secondary"}
                    className={cn(
                      "gap-1",
                      isGolden && "bg-danger hover:bg-danger text-danger-foreground"
                    )}
                  >
                    <SignalIcon className="w-3 h-3" />
                    {isGolden ? "黃金交叉" : "死亡交叉"}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {stock.crossDate}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
