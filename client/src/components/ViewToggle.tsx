import { LayoutGrid, Table } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ViewToggleProps {
  view: "cards" | "table";
  onViewChange: (view: "cards" | "table") => void;
}

export default function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-1 rounded-md border p-1">
      <Button
        variant={view === "cards" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => onViewChange("cards")}
        data-testid="button-view-cards"
        className="gap-2"
      >
        <LayoutGrid className="w-4 h-4" />
        <span className="hidden sm:inline">卡片</span>
      </Button>
      <Button
        variant={view === "table" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => onViewChange("table")}
        data-testid="button-view-table"
        className="gap-2"
      >
        <Table className="w-4 h-4" />
        <span className="hidden sm:inline">表格</span>
      </Button>
    </div>
  );
}
