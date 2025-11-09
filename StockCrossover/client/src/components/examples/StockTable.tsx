import StockTable from '../StockTable';

export default function StockTableExample() {
  const mockStocks = [
    {
      id: "1",
      code: "2330",
      name: "台積電",
      price: 585.00,
      priceChange: 12.50,
      priceChangePercent: 2.18,
      volumeRank: 1,
      signalType: "golden" as const,
      crossDate: "2025-10-08",
      ma10: 578.30,
      ma50: 562.80,
      volume: 45678000
    },
    {
      id: "2",
      code: "2317",
      name: "鴻海",
      price: 112.50,
      priceChange: -2.30,
      priceChangePercent: -2.00,
      volumeRank: 3,
      signalType: "death" as const,
      crossDate: "2025-10-07",
      ma10: 114.20,
      ma50: 115.80,
      volume: 32456000
    }
  ];

  return (
    <div className="p-6">
      <StockTable 
        stocks={mockStocks} 
        onRowClick={(stock) => console.log('Stock clicked:', stock.code)}
      />
    </div>
  );
}
