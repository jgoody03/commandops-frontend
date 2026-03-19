export default function LowStockPanel({ data, loading }: any) {
  if (loading) return <div>Loading low stock...</div>;
  if (!data?.items?.length) return <div>No low stock items 🎉</div>;

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h2 className="text-lg font-semibold mb-3">Low Stock</h2>

      <div className="space-y-2">
        {data.items.map((item: any) => (
          <div key={item.productId} className="flex justify-between">
            <span>{item.name}</span>
            <span className="text-red-500">{item.onHand}</span>
          </div>
        ))}
      </div>
    </div>
  );
}