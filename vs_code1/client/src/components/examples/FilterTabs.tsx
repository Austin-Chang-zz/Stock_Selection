import { useState } from 'react';
import FilterTabs from '../FilterTabs';

export default function FilterTabsExample() {
  const [activeTab, setActiveTab] = useState<"all" | "golden" | "death">("golden");
  
  return (
    <div className="p-6">
      <FilterTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        goldenCount={12}
        deathCount={8}
        totalCount={200}
      />
    </div>
  );
}
