
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
}

interface CandidatesTableProps {
  candidates: Candidate[];
}

export default function CandidatesTable({ candidates }: CandidatesTableProps) {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

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
            <TableHead className="w-[100px]">股票代碼</TableHead>
            <TableHead>股票名稱</TableHead>
            <TableHead className="text-right">收盤價</TableHead>
            <TableHead>最近交叉</TableHead>
            <TableHead className="text-right">
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
            
            return (
              <TableRow key={candidate.code} className="cursor-pointer hover:bg-muted/50">
                <TableCell className="font-mono font-semibold">
                  {candidate.code}
                </TableCell>
                <TableCell>{candidate.name}</TableCell>
                <TableCell className="text-right font-mono">
                  ${candidate.price.toFixed(2)}
                </TableCell>
                <TableCell>
                  {candidate.lastCrossType ? (
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={isGolden ? "default" : "secondary"}
                        className={cn(
                          "text-xs",
                          isGolden && "bg-danger hover:bg-danger text-danger-foreground"
                        )}
                      >
                        {isGolden ? "黃金交叉" : "死亡交叉"}
                      </Badge>
                      <span className="text-sm text-muted-foreground font-mono">
                        {candidate.lastCrossDate}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">無交叉記錄</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
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
