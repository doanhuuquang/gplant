import { formatPrice } from "@/utils/helpers";

interface OrderSummaryProps {
  subTotal: number;
  discountAmount: number;
  shippingFee: number;
  total: number;
}

export function OrderSummary({
  subTotal,
  discountAmount,
  shippingFee,
  total,
}: OrderSummaryProps) {
  return (
    <div className="lg:col-span-2 space-y-3">
      <p className="font-semibold">Order Summary</p>

      <div className="space-y-1">
        <div className="w-full flex items-center justify-between gap-4">
          <p className="text-muted-foreground text-xs">Sub total</p>
          <p className="text-muted-foreground text-xs font-semibold">
            {formatPrice(subTotal)}
          </p>
        </div>

        <div className="w-full flex items-center justify-between gap-4">
          <p className="text-muted-foreground text-xs">Discount</p>
          <p className="text-muted-foreground text-xs font-semibold">
            -{formatPrice(discountAmount)}
          </p>
        </div>

        <div className="w-full flex items-center justify-between gap-4">
          <p className="text-muted-foreground text-xs">Shipping</p>
          <p className="text-muted-foreground text-xs font-semibold">
            {shippingFee > 0 ? formatPrice(shippingFee) : "Free"}
          </p>
        </div>

        <div className="w-full h-[0.2px] bg-border my-4"></div>

        <div className="w-full flex items-center justify-between gap-4">
          <div className="space-x-1">
            <span className="text-lg font-semibold">TOTAL</span>
            <span className="text-muted-foreground text-xs">Inc.vat</span>
          </div>
          <p className="text-lg font-semibold">{formatPrice(total)}</p>
        </div>
      </div>
    </div>
  );
}
