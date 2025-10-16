import StockSignalCard from '../StockSignalCard';

export default function StockSignalCardExample() {
  const mockStock = {
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
  };

  return (
    <div className="p-6 max-w-sm">
      <StockSignalCard stock={mockStock} onClick={() => console.log('Stock card clicked')} />
    </div>
  );
}
