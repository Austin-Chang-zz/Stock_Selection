import { useState } from "react";
import { ArrowUpDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface Candidate {
  code: string;
  name: string;
  price: number;
  lastCrossDate: string | null;
  lastCrossType: "golden" | "death" | null;
  crossingDays: number | null;
  volumeValue: number;
  dateIdx: string; // Added dateIdx field
  highPrice: number; // Added highPrice field
  lowPrice: number; // Added lowPrice field
  volume: number; // Added volume field
}

interface CandidatesTableProps {
  candidates: Candidate[];
}

export default function CandidatesTable({ candidates }: CandidatesTableProps) {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Sorting logic remains the same for crossingDays
  const sortedCandidates = [...candidates].sort((a, b) => {
    if (a.crossingDays === null) return 1;
    if (b.crossingDays === null) return -1;
    return sortOrder === "asc"
      ? a.crossingDays - b.crossingDays
      : b.crossingDays - a.crossingDays;
  });

  const toggleSort = () => {
    setSortOrder(prev => prev === "asc" ? "desc" : "asc");
  };

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-24">股票代碼</TableHead>
            <TableHead>股票名稱</TableHead>
            <TableHead className="text-right">收盤價</TableHead>
            <TableHead className="text-right">最高價</TableHead>
            <TableHead className="text-right">最低價</TableHead>
            <TableHead className="text-right">成交量</TableHead>
            <TableHead className="text-right">成交金額(億)</TableHead>
            <TableHead className="text-center">日期</TableHead>
            <TableHead className="text-center">最後交叉類型</TableHead>
            <TableHead className="text-center">最後交叉日期</TableHead>
            <TableHead className="text-center">
              <button
                onClick={toggleSort}
                className="flex items-center gap-1 ml-auto hover:text-foreground transition-colors"
              >
                交叉天數
                <ArrowUpDown className="h-4 w-4" />
              </button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedCandidates.map((candidate) => {
            const isGolden = candidate.lastCrossType === "golden";
            // Divide volumeValue by 10,000,000 to represent in billions (億)
            const volumeInBillions = candidate.volumeValue / 10_000_000;

            return (
              <TableRow key={candidate.code} className="cursor-pointer hover:bg-muted/50">
                <TableCell className="font-mono font-semibold">
                  {candidate.code}
                </TableCell>
                <TableCell>{candidate.name}</TableCell>
                <TableCell className="text-right font-mono">
                  ${candidate.price.toFixed(2)}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {candidate.highPrice.toFixed(2)}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {candidate.lowPrice.toFixed(2)}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {candidate.volume.toLocaleString()}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {volumeInBillions.toFixed(2)}
                </TableCell>
                <TableCell className="text-center text-sm">{candidate.dateIdx}</TableCell>
                <TableCell className="text-center">
                  {candidate.lastCrossType ? (
                    <Badge
                      variant={isGolden ? "default" : "secondary"}
                      className={cn(
                        "text-xs",
                        isGolden && "bg-danger hover:bg-danger text-danger-foreground"
                      )}
                    >
                      {isGolden ? "黃金交叉" : "死亡交叉"}
                    </Badge>
                  ) : (
                    <span className="text-sm text-muted-foreground">無交叉記錄</span>
                  )}
                </TableCell>
                <TableCell className="text-center text-sm">
                  {candidate.lastCrossDate}
                </TableCell>
                <TableCell className="text-center font-mono">
                  {candidate.crossingDays !== null ? (
                    <span className={cn(
                      "font-mono font-semibold",
                      candidate.crossingDays === 0 && "text-primary",
                      candidate.crossingDays < 0 && "text-muted-foreground"
                    )}>
                      {candidate.crossingDays}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}