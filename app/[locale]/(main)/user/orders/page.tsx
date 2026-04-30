"use client";

import { OrderCard } from "@/components/feature/order/order-card";
import { useMyOrders } from "@/lib/hooks/use-order";

export default function Page() {
  const { data } = useMyOrders({});

  return (
    <main className="space-y-10">
      <h1 className="text-2xl font-bold mb-4">Đơn hàng của tôi</h1>
      {data?.data.items.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </main>
  );
}
