import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowUpCircle, ArrowDownCircle, LayoutGrid } from "lucide-react";

interface FilterTabsProps {
  activeTab: "all" | "golden" | "death";
  onTabChange: (value: "all" | "golden" | "death") => void;
  goldenCount: number;
  deathCount: number;
  totalCount: number;
}

export default function FilterTabs({ 
  activeTab, 
  onTabChange, 
  goldenCount, 
  deathCount, 
  totalCount 
}: FilterTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as "all" | "golden" | "death")} className="w-full">
      <TabsList className="grid w-full max-w-md grid-cols-3 gap-2" data-testid="tabs-filter">
        <TabsTrigger value="golden" className="gap-2" data-testid="tab-golden-cross">
          <ArrowUpCircle className="w-4 h-4 text-danger" />
          <span>黃金交叉</span>
          <Badge variant="secondary" className="ml-1 font-mono text-xs">{goldenCount}</Badge>
        </TabsTrigger>
        
        <TabsTrigger value="death" className="gap-2" data-testid="tab-death-cross">
          <ArrowDownCircle className="w-4 h-4 text-success" />
          <span>死亡交叉</span>
          <Badge variant="secondary" className="ml-1 font-mono text-xs">{deathCount}</Badge>
        </TabsTrigger>
        
        <TabsTrigger value="all" className="gap-2" data-testid="tab-all">
          <LayoutGrid className="w-4 h-4" />
          <span>全部</span>
          <Badge variant="secondary" className="ml-1 font-mono text-xs">{totalCount}</Badge>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
