import { Clock, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StockHeaderProps {
  marketStatus: "open" | "closed";
  lastUpdate: string;
  onThemeToggle?: () => void;
}

export default function StockHeader({ marketStatus, lastUpdate }: StockHeaderProps) {
  return (
    <div className="border-b bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary/10">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">台股MA交叉監控</h1>
              <p className="text-sm text-muted-foreground">Taiwan Stock MA Monitor</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Badge 
                variant={marketStatus === "open" ? "default" : "secondary"}
                className="font-medium"
                data-testid="badge-market-status"
              >
                {marketStatus === "open" ? "開盤中" : "已收盤"}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground" data-testid="text-last-update">
              <Clock className="w-4 h-4" />
              <span className="hidden sm:inline">更新時間：</span>
              <span className="font-mono">{lastUpdate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
