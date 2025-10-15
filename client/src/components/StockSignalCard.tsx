import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpCircle, ArrowDownCircle, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StockSignal {
  id: string;
  code: string;
  name: string;
  price: number;
  priceChange: number;
  priceChangePercent: number;
  volumeRank: number;
  signalType: "golden" | "death";
  crossDate: string;
  ma10: number;
  ma50: number;
  volume: number;
}

interface StockSignalCardProps {
  stock: StockSignal;
  onClick?: () => void;
}

export default function StockSignalCard({ stock, onClick }: StockSignalCardProps) {
  const isGolden = stock.signalType === "golden";
  const SignalIcon = isGolden ? ArrowUpCircle : ArrowDownCircle;
  
  return (
    <Card 
      className="hover-elevate active-elevate-2 cursor-pointer transition-shadow"
      onClick={onClick}
      data-testid={`card-stock-${stock.code}`}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <SignalIcon 
              className={cn(
                "w-6 h-6",
                isGolden ? "text-danger" : "text-success"
              )} 
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-mono font-semibold" data-testid={`text-stock-code-${stock.code}`}>
                  {stock.code}
                </span>
                <Badge variant="outline" className="text-xs font-mono">
                  #{stock.volumeRank}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5" data-testid={`text-stock-name-${stock.code}`}>
                {stock.name}
              </p>
            </div>
          </div>
          
          <Badge 
            variant={isGolden ? "default" : "secondary"}
            className={cn(
              "font-medium",
              isGolden && "bg-danger hover:bg-danger text-danger-foreground"
            )}
            data-testid={`badge-signal-${stock.code}`}
          >
            {isGolden ? "黃金交叉" : "死亡交叉"}
          </Badge>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono" data-testid={`text-price-${stock.code}`}>
              ${stock.price.toFixed(2)}
            </span>
            <span 
              className={cn(
                "text-sm font-medium flex items-center gap-1",
                stock.priceChange >= 0 ? "text-success" : "text-danger"
              )}
            >
              <TrendingUp className={cn("w-3 h-3", stock.priceChange < 0 && "rotate-180")} />
              {stock.priceChange >= 0 ? "+" : ""}{stock.priceChange.toFixed(2)} 
              ({stock.priceChangePercent >= 0 ? "+" : ""}{stock.priceChangePercent.toFixed(2)}%)
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-3 pt-3 border-t">
            <div>
              <p className="text-xs text-muted-foreground">10日均線</p>
              <p className="text-sm font-mono font-medium mt-1" data-testid={`text-ma10-${stock.code}`}>
                ${stock.ma10.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">50日均線</p>
              <p className="text-sm font-mono font-medium mt-1" data-testid={`text-ma50-${stock.code}`}>
                ${stock.ma50.toFixed(2)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
            <span>交叉日期: {stock.crossDate}</span>
            <span className="font-mono">成交量: {(stock.volume / 1000).toFixed(0)}K</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
