import { formatPrice } from "@/utils/helpers";

interface OrderSummaryProps {
  subTotal: number;
  discountAmount: number;
  shippingFee: number;
  total: number;
  className?: string;
}

export function OrderSummary({
  subTotal,
  discountAmount,
  shippingFee,
  total,
  className,
}: OrderSummaryProps) {
  return (
    <div className={className}>
      <p className="font-semibold">Tóm tắt đơn hàng</p>

      <div className="space-y-1">
        <div className="w-full flex items-center justify-between gap-4">
          <p className="text-muted-foreground text-xs">Tạm tính</p>
          <p className="text-muted-foreground text-xs font-semibold">
            {formatPrice(subTotal)}
          </p>
        </div>

        <div className="w-full flex items-center justify-between gap-4">
          <p className="text-muted-foreground text-xs">Giảm giá</p>
          <p className="text-muted-foreground text-xs font-semibold">
            -{formatPrice(discountAmount)}
          </p>
        </div>

        <div className="w-full flex items-center justify-between gap-4">
          <p className="text-muted-foreground text-xs">Phí giao hàng</p>
          <p className="text-muted-foreground text-xs font-semibold">
            {shippingFee > 0 ? formatPrice(shippingFee) : "Miễn phí"}
          </p>
        </div>

        <div className="w-full h-[0.2px] bg-border my-4"></div>

        <div className="w-full flex items-center justify-between gap-4">
          <div className="space-x-1">
            <span className="text-lg font-semibold">TỔNG CỘNG</span>
            <span className="text-muted-foreground text-xs">Đã gồm VAT</span>
          </div>
          <p className="text-lg font-semibold">{formatPrice(total)}</p>
        </div>
      </div>
    </div>
  );
}
