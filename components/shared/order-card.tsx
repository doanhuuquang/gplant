import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CircleAlert } from "lucide-react";
import { PaymentStatus } from "@/lib/enums/payment-status";
import { OrderResponse } from "@/lib/schemas/order/order-response";
import { useGetQrPaymentByOrderId } from "@/hooks/order/use-get-qr-payment-by-order-id";
import { useGetVNPayUrlByOrderId } from "@/hooks/order/use-get-vnpay-url-by-order-id";
import {
  formatVietnameseDateTime,
  getPaymentExpiryDate,
} from "@/utils/order-helpers";
import { OrderItemList } from "./order-item-list";
import { OrderSummary } from "./order-summary";
import { OrderPaymentMethod } from "./order-payment-method";

interface OrderCardProps {
  order: OrderResponse;
}

export function OrderCard({ order }: OrderCardProps) {
  const { qrPayment } = useGetQrPaymentByOrderId(order.id);
  const { vnpayUrl } = useGetVNPayUrlByOrderId(order.id);

  const formattedDate = formatVietnameseDateTime(new Date(order.createdAtUtc));
  const expiryDate = getPaymentExpiryDate(order.createdAtUtc, order.paymentMethod as any);
  const formattedExpiry = formatVietnameseDateTime(expiryDate);

  const isPendingPayment =
    order.paymentStatus === PaymentStatus.AwaitingPayment ||
    order.paymentStatus === PaymentStatus.Pending;

  return (
    <Accordion type="single" collapsible defaultValue="">
      <AccordionItem value={order.id}>
        <div className="w-full rounded-sm border bg-background dark:bg-muted">
          <div className="w-full flex items-center justify-between gap-4 p-4 border-b bg-muted">
            <div className="flex items-start gap-1">
              {isPendingPayment && (
                <CircleAlert
                  size={25}
                  className="fill-amber-400 text-background"
                />
              )}
              <div>
                <p className="font-medium">{order.orderNumber}</p>
                <p className="text-xs text-muted-foreground">{formattedDate}</p>
              </div>
            </div>
            <AccordionTrigger className="[&[data-state=open]>span.open]:inline [&[data-state=open]>span.closed]:hidden [&[data-state=closed]>span.open]:hidden [&[data-state=closed]>span.closed]:inline font-normal cursor-pointer gap-1">
              <span className="open">Hide details</span>
              <span className="closed">See details</span>
            </AccordionTrigger>
          </div>

          <AccordionContent className="p-4 grid lg:grid-cols-5 grid-cols-1 gap-4 border-b">
            {/* Shipping Address */}
            <div className="space-y-3">
              <p className="font-semibold">Shipping Address</p>
              <p className="text-xs text-muted-foreground">
                {`${order?.shippingName} - ${order?.shippingPhone}`}
              </p>
              <p className="text-xs text-muted-foreground">
                {`${order?.buildingName}, ${order?.address}`}
              </p>
            </div>

            {/* Payment method */}
            <OrderPaymentMethod
              paymentMethod={order.paymentMethod}
              paymentStatus={order.paymentStatus}
              formattedExpiry={formattedExpiry}
              qrPayment={qrPayment}
              vnpayUrl={vnpayUrl}
            />

            {/* Order Status */}
            <div className="space-y-3">
              <p className="font-semibold">Order Status</p>
              <p className="text-xs text-muted-foreground">{order?.status}</p>
            </div>

            {/* Order Summary */}
            <OrderSummary
              subTotal={order.subTotal}
              discountAmount={order.discountAmount}
              shippingFee={order.shippingFee}
              total={order.total}
            />
          </AccordionContent>

          <OrderItemList items={order.items} />
        </div>
      </AccordionItem>
    </Accordion>
  );
}
