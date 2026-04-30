import { OrderCard } from "@/components/feature/order/order-card";
import { parseMessageParts } from "@/lib/helpers/message-parser";

export function MessageRenderer({ content }: { content: string }) {
  const parts = parseMessageParts(content);

  return (
    <div className="space-y-2">
      {parts.map((part, i) => {
        switch (part.type) {
          case "text":
            return (
              <p key={i} className="text-sm whitespace-pre-wrap">
                {part.content}
              </p>
            );
          //   case "plant_list":
          //     return <PlantListCard key={i} plants={part.data.plants} />;
          //   case "order_list":
          //     return <OrderListCard key={i} orders={part.data.orders} />;
          case "order_card":
            return <OrderCard key={i} order={part.data.order} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
