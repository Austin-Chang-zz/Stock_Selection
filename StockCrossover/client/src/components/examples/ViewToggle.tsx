import { useState } from 'react';
import ViewToggle from '../ViewToggle';

export default function ViewToggleExample() {
  const [view, setView] = useState<"cards" | "table">("cards");
  
  return (
    <div className="p-6">
      <ViewToggle 
        view={view} 
        onViewChange={setView}
      />
    </div>
  );
}
