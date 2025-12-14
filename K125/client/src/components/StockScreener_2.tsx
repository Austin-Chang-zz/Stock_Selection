//
// ***** Add comments by Deepseek ***** 2025/12/01
//
import React, { useState } from 'react';
import { X, Minimize2, Maximize2, PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';
import MatrixTable from '@/components/MatrixTable';
import AnalysisPlatform from '@/components/AnalysisPlatform';

/**
 * PROPS INTERFACES
 * Defines the contract for component data flow
 */
interface StockScreenerProps {
  listName: string;        // Name of the stock list being screened
  stocks: any[];          // Array of stock objects to display and analyze
  onClose: () => void;    // Callback when screener is closed
}

interface FloatingWindowProps {
  title: string;          // Window title for display and test IDs
  children: React.ReactNode; // Content to render inside the window
  defaultX: number;       // Initial x position on screen
  defaultY: number;       // Initial y position on screen
  defaultWidth: number;   // Initial width of window
  defaultHeight: number;  // Initial height of window
  onMinimize: () => void; // Callback when window is minimized
  isMinimized: boolean;   // Current minimized state
  onRestore: () => void;  // Callback when window is restored from minimized
  minWidth?: number;      // Minimum allowed width (default: 400)
  minHeight?: number;     // Minimum allowed height (default: 300)
  zIndex?: number;        // Z-index for layering (default: 40)
}

/**
 * FLOATING WINDOW COMPONENT
 * Reusable draggable, resizable window with minimize/restore functionality
 * Handles complex mouse interactions for window management
 */
function FloatingWindow({
  title,
  children,
  defaultX,
  defaultY,
  defaultWidth,
  defaultHeight,
  onMinimize,
  isMinimized,
  onRestore,
  minWidth = 400,
  minHeight = 300,
  zIndex = 40,
}: FloatingWindowProps) {
  // Window position and size state management
  const [position, setPosition] = useState({ x: defaultX, y: defaultY });
  const [size, setSize] = useState({ width: defaultWidth, height: defaultHeight });

  // Interaction state tracking
  const [isDragging, setIsDragging] = useState(false);    // Track drag operations
  const [isResizing, setIsResizing] = useState(false);    // Track resize operations
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 }); // Mouse offset for smooth dragging
  const [resizeEdge, setResizeEdge] = useState<string>(''); // Which edge is being resized

  // Special handling for MatrixTable window (limited resize capabilities)
  const isMatrixTable = title === "MatrixTableWindow";

  /**
   * Handle mouse down on window header for dragging
   * Only triggers if clicking directly on header or its children
   */
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.window-header')) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  /**
   * Handle mouse down on resize handles
   * Prevents event bubbling to avoid triggering drag
   */
  const handleResizeMouseDown = (e: React.MouseEvent, edge: string) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeEdge(edge);
  };

  /**
   * Global mouse event listeners for drag and resize operations
   * Attached to document to handle mouse movements outside component
   */
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        // Calculate new position with boundary constraints
        const newX = Math.max(0, Math.min(e.clientX - dragOffset.x, window.innerWidth - size.width));
        const newY = Math.max(60, Math.min(e.clientY - dragOffset.y, window.innerHeight - size.height));
        setPosition({ x: newX, y: newY });
      } else if (isResizing) {
        // Resize logic based on which edge is being dragged
        let newWidth = size.width;
        let newHeight = size.height;
        let newX = position.x;
        let newY = position.y;

        // East edge resize (right side)
        if (resizeEdge.includes('e')) {
          newWidth = Math.max(minWidth, e.clientX - position.x);
        }
        // South edge resize (bottom side)
        if (resizeEdge.includes('s')) {
          newHeight = Math.max(minHeight, e.clientY - position.y);
        }
        // West edge resize (left side) - also moves window
        if (resizeEdge.includes('w')) {
          const delta = e.clientX - position.x;
          if (size.width - delta >= minWidth) {
            newWidth = size.width - delta;
            newX = position.x + delta;
          }
        }
        // North edge resize (top side) - also moves window
        if (resizeEdge.includes('n')) {
          const delta = e.clientY - position.y;
          if (size.height - delta >= minHeight) {
            newHeight = size.height - delta;
            newY = position.y + delta;
          }
        }

        setSize({ width: newWidth, height: newHeight });
        setPosition({ x: newX, y: newY });
      }
    };

    // Stop dragging or resizing when mouse up
    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setResizeEdge('');
    };

    // Only attach listeners when actively dragging or resizing
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, position, size, resizeEdge, minWidth, minHeight]);

  /**
   * MINIMIZED STATE RENDER
   * Shows compact bar at bottom of screen that can be clicked to restore
   */
  if (isMinimized) {
    return (
      <div
        className="fixed bg-background border rounded-lg shadow-lg p-2 cursor-pointer"
        style={{ left: position.x, bottom: 20, zIndex }}
        onClick={onRestore}
        data-testid={`button-restore-${title.toLowerCase().replace(/\s+/g, '-')}`}
      >
        <div className="flex items-center gap-2">
          <Maximize2 className="w-4 h-4" />
          <span className="text-sm font-medium">{title}</span>
        </div>
      </div>
    );
  }

  /**
   * FULL WINDOW RENDER
   * Complete window with header, content area, and resize handles
   */
  return (
    <div
      className="fixed bg-background border border-border rounded-lg shadow-lg flex flex-col"
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        zIndex,
      }}
      onMouseDown={handleMouseDown}
      data-testid={`window-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      {/* Window Header - Draggable area with title and minimize button */}
      <div className="window-header flex items-center justify-between p-2 border-b cursor-move bg-muted/30">
        <span className="text-sm font-medium" data-testid={`text-window-title-${title.toLowerCase().replace(/\s+/g, '-')}`}>{title}</span>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={onMinimize}
          data-testid={`button-minimize-${title.toLowerCase().replace(/\s+/g, '-')}`}
        >
          <Minimize2 className="w-3 h-3" />
        </Button>
      </div>

      {/* Content Area - Flex container for window content */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>

      {/* RESIZE HANDLES */}
      {/* MatrixTable has simplified resize (only right edge) */}
      {isMatrixTable && (
        <div className="absolute right-0 top-0 bottom-0 w-2 cursor-e-resize hover:bg-primary/20" onMouseDown={(e) => handleResizeMouseDown(e, 'e')} />
      )}

      {/* AnalysisPlatform has full 8-direction resize handles */}
      {!isMatrixTable && (
        <>
          {/* Corner handles */}
          <div className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize" onMouseDown={(e) => handleResizeMouseDown(e, 'ne')} />
          <div className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize" onMouseDown={(e) => handleResizeMouseDown(e, 'nw')} />
          <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize" onMouseDown={(e) => handleResizeMouseDown(e, 'se')} />
          <div className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize" onMouseDown={(e) => handleResizeMouseDown(e, 'sw')} />

          {/* Edge handles */}
          <div className="absolute top-0 left-1/2 w-4 h-2 -translate-x-1/2 cursor-n-resize" onMouseDown={(e) => handleResizeMouseDown(e, 'n')} />
          <div className="absolute bottom-0 left-1/2 w-4 h-2 -translate-x-1/2 cursor-s-resize" onMouseDown={(e) => handleResizeMouseDown(e, 's')} />
          <div className="absolute left-0 top-1/2 w-2 h-4 -translate-y-1/2 cursor-w-resize" onMouseDown={(e) => handleResizeMouseDown(e, 'w')} />
          <div className="absolute right-0 top-1/2 w-2 h-4 -translate-y-1/2 cursor-e-resize" onMouseDown={(e) => handleResizeMouseDown(e, 'e')} />
        </>
      )}
    </div>
  );
}

/**
 * MAIN STOCK SCREENER COMPONENT
 * Primary container that orchestrates the stock screening interface
 * Manages window states, stock selection, and sidebar integration
 */
export default function StockScreener({ listName, stocks, onClose }: StockScreenerProps) {
  // State Management
  const [selectedStock, setSelectedStock] = useState(stocks[0] || null); // Currently selected stock for analysis
  const [isMatrixMinimized, setIsMatrixMinimized] = useState(false);     // Matrix table window state
  const [isAnalysisMinimized, setIsAnalysisMinimized] = useState(false); // Analysis platform window state

  // Sidebar integration for responsive layout
  const { toggleSidebar, state, isMobile } = useSidebar();

  /**
   * Handle stock selection from MatrixTable
   * Updates the selected stock which triggers AnalysisPlatform re-render
   */
  const handleStockClick = (stock: any) => {
    setSelectedStock(stock);
  };

  // Calculate dynamic left offset based on sidebar state
  // Uses CSS custom properties for consistent spacing
  const sidebarWidth = state === 'expanded' ? 'var(--sidebar-width, 16rem)' : 'var(--sidebar-width-icon, 3rem)';
  const leftOffset = isMobile ? '0' : sidebarWidth;

  return (
    <div
      className="fixed inset-y-0 right-0 bg-background flex flex-col overflow-hidden transition-[left] duration-200 ease-linear"
      style={{
        left: leftOffset, // Dynamic positioning based on sidebar
        zIndex: 5 // Below sidebar (z-10) so sidebar remains interactive
      }}
      data-testid="stock-screener-container"
    >
      {/* HEADER SECTION */}
      {/* Compact header with navigation and controls */}
      <div className="h-10 border-b flex items-center justify-between px-3 py-0.5">
        <div className="flex items-center gap-2">
          {/* Sidebar Toggle - Controls main navigation sidebar */}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 flex-shrink-0"
            onClick={toggleSidebar}
            data-testid="button-toggle-sidebar"
          >
            <PanelLeft className="h-4 w-4" />
          </Button>
          {/* Screen Title - Displays current stock list name */}
          <h1 className="text-lg font-semibold" data-testid="text-screener-title">{listName} Stock Screener</h1>
        </div>
        {/* Close Button - Exits the stock screener view */}
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose} data-testid="button-close-screener">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* MAIN CANVAS AREA */}
      {/* Container for floating windows with muted background */}
      <div className="flex-1 relative bg-muted/10 overflow-hidden">
        {/* MATRIX TABLE WINDOW */}
        {/* Left-side window displaying stock list in table format */}
        <FloatingWindow
          title="MatrixTableWindow"
          defaultX={20}
          defaultY={80}
          defaultWidth={600}
          defaultHeight={600}
          onMinimize={() => setIsMatrixMinimized(true)}
          isMinimized={isMatrixMinimized}
          onRestore={() => setIsMatrixMinimized(false)}
          zIndex={40}
        >
          <div className="h-full overflow-auto">
            <MatrixTable
              title={listName}
              data={stocks}
              onStockClick={handleStockClick}
              onAddToTargetList={(stock, listName) => console.log('Add to target list:', stock.code, listName)}
              targetListNames={['Target List 1', 'Target List 2', 'Target List 3', 'Target List 4', 'Target List 5', 'Target List 6']}
              onClearAll={() => console.log('Clear all')}
              initialHiddenColumns={['price', 'volume', 'volumeValue', 'phase', 'd2Pvcnt', 'w2Pvcnt', 'w2', 'w10', 'w26', 'indicators']}
            />
          </div>
        </FloatingWindow>

        {/* ANALYSIS PLATFORM WINDOW */}
        {/* Right-side window displaying detailed stock analysis */}
        <FloatingWindow
          title="AnalysisPlatformWindow"
          defaultX={640}
          defaultY={80}
          defaultWidth={700}
          defaultHeight={600}
          onMinimize={() => setIsAnalysisMinimized(true)}
          isMinimized={isAnalysisMinimized}
          onRestore={() => setIsAnalysisMinimized(false)}
          minWidth={600}
          minHeight={400}
          zIndex={41} // Slightly higher than MatrixTable for proper layering
        >
          {/* Conditional rendering based on stock selection */}
          {selectedStock ? (
            <div className="h-full w-full">
              <AnalysisPlatform
                isOpen={true}
                onClose={() => { }} // No-op since close is handled by parent
                stockSymbol={selectedStock.code}
                stockName={selectedStock.name}
                embedded={true} // Special mode for embedded usage
              />
            </div>
          ) : (
            // Placeholder when no stock is selected
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">Select a stock to view analysis</p>
            </div>
          )}
        </FloatingWindow>
      </div>
    </div>
  );
}