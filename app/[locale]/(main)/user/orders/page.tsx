"use client";
import { useGetMyOrders } from "@/hooks/order/use-get-my-orders";
import { OrderCard } from "@/components/shared/order-card";

export default function Page() {
  const { myOrders, isLoadingMyOrders } = useGetMyOrders();

  return (
    <main className="space-y-10">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      {isLoadingMyOrders ? (
        <p>Loading posts...</p>
      ) : (
        myOrders.map((order) => <OrderCard key={order.id} order={order} />)
      )}
    </main>
  );
}
