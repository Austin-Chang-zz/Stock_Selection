import { ArrowUpDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export default function EmptyState({ 
  title = "無交叉訊號", 
  description = "今日無黃金交叉或死亡交叉訊號，請選擇其他日期或稍後再查詢" 
}: EmptyStateProps) {
  return (
    <Card data-testid="card-empty-state">
      <CardContent className="py-16">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
            <ArrowUpDown className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
