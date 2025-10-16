import { Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function DataSourceInfo() {
  return (
    <Alert className="border-primary/20 bg-primary/5" data-testid="alert-data-source">
      <Info className="h-4 w-4 text-primary" />
      <AlertDescription className="text-sm">
        <span className="font-medium">資料來源：</span>
        臺灣證券交易所 OpenAPI (TWSE) | 
        資料更新時間以交易所公布為準
      </AlertDescription>
    </Alert>
  );
}
