"use client";

import { Button } from "@/components/ui/button";
import { CancelOrderRequest, OrderResponse } from "@/types/order";
import { CancelOrderRequestValidation } from "@/validations/order";
import { OrderItemList } from "./order-item-list";
import { OrderPaymentMethod } from "./order-payment-method";
import { OrderSummary } from "./order-summary";
import { PaymentStatus } from "@/lib/enums/payment-status";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  formatVietnameseDateTime,
  getPaymentExpiryDate,
} from "@/utils/order-helpers";
import {
  useCancelOrder,
  useQRPaymentByOrderId,
  useVNPayUrlByOrderId,
} from "@/lib/hooks/use-order";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { isCancel } from "axios";

interface OrderCardProps {
  order: OrderResponse;
}

const CANCEL_REASONS = [
  { value: "change_mind", label: "Tôi đổi ý, không muốn mua nữa" },
  { value: "wrong_address", label: "Tôi nhập sai địa chỉ nhận hàng" },
  { value: "wrong_product", label: "Tôi đặt nhầm sản phẩm / số lượng" },
  { value: "delivery_time", label: "Thời gian giao hàng chưa phù hợp" },
  { value: "payment_issue", label: "Tôi gặp vấn đề khi thanh toán" },
  { value: "other", label: "Lý do khác" },
];

function CancelOrderButton({ order }: { order: OrderResponse }) {
  const [otherReason, setOtherReason] = useState("");

  const { mutate: cancelOrder, isPending } = useCancelOrder(order.id);

  const form = useForm<CancelOrderRequest>({
    resolver: zodResolver(CancelOrderRequestValidation),
    defaultValues: {
      reason: "",
    },
  });

  async function onSubmit(values: CancelOrderRequest) {
    const selectedReason = values.reason;
    const reasonText =
      selectedReason === "other"
        ? otherReason.trim()
        : (CANCEL_REASONS.find((reason) => reason.value === selectedReason)
            ?.label ?? selectedReason);

    if (!reasonText) {
      form.setError("reason", {
        message: "Vui lòng nhập lý do hủy đơn",
      });
      return;
    }

    const request: CancelOrderRequest = {
      reason: reasonText,
    };

    cancelOrder(request, {
      onSuccess: () => {
        form.reset();
        setOtherReason("");
      },
    });
  }

  return (
    <div className="w-full flex justify-end p-4 border-t">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            disabled={!order.canCancel}
            variant={"outline"}
            className="rounded-none"
          >
            Hủy đơn hàng
          </Button>
        </DialogTrigger>
        <DialogContent className="space-y-5">
          <DialogHeader>
            <DialogTitle>Bạn có chắc chắn muốn hủy đơn hàng?</DialogTitle>
            <DialogDescription>
              Sau khi hủy, đơn hàng sẽ không thể khôi phục lại. Vui lòng xác
              nhận chỉ khi bạn thực sự muốn hủy đơn này.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="reason"
                disabled={isPending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lý do hủy đơn</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          if (value !== "other") {
                            setOtherReason("");
                          }
                        }}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full h-12!">
                          <SelectValue placeholder="Lý do hủy đơn" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Chọn lý do</SelectLabel>
                            {CANCEL_REASONS.map((reason) => (
                              <SelectItem
                                key={reason.value}
                                value={reason.value}
                              >
                                {reason.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>

                    {field.value === "other" && (
                      <Textarea
                        placeholder="Nhập lý do hủy đơn của bạn..."
                        value={otherReason}
                        onChange={(e) => setOtherReason(e.target.value)}
                        className="min-h-24"
                        disabled={isPending}
                      />
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant={"outline"} type="button">
                    Hủy
                  </Button>
                </DialogClose>
                <Button
                  variant={"destructive"}
                  type="submit"
                  disabled={isPending}
                >
                  Xác nhận hủy đơn
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function OrderCard({ order }: OrderCardProps) {
  const { data: qrPayment } = useQRPaymentByOrderId(order.id);
  const { data: vnpayUrl } = useVNPayUrlByOrderId(order.id);

  const formattedDate = formatVietnameseDateTime(new Date(order.createdAtUtc));
  const expiryDate = getPaymentExpiryDate(
    order.createdAtUtc,
    order.paymentMethod,
  );
  const formattedExpiry = formatVietnameseDateTime(expiryDate);
  const isPendingPayment =
    order.paymentStatus === PaymentStatus.AwaitingPayment ||
    order.paymentStatus === PaymentStatus.Pending;

  return (
    <Accordion type="single" collapsible defaultValue="">
      <AccordionItem value={order.id}>
        <div className="w-full rounded-sm border bg-background dark:bg-muted shadow-2xl shadow-muted dark:shadow-black/30">
          <div
            className={cn(
              "w-full flex items-end justify-between gap-4 p-4 border-b bg-muted",
            )}
          >
            <div>
              <p className="font-medium">{order.orderNumber}</p>
              <p className="text-xs text-muted-foreground">{formattedDate}</p>
            </div>
            <AccordionTrigger className="p-0 [&[data-state=open]>span.open]:inline [&[data-state=open]>span.closed]:hidden [&[data-state=closed]>span.open]:hidden [&[data-state=closed]>span.closed]:inline font-normal cursor-pointer gap-1">
              <span className="open">Ẩn chi tiết</span>
              <span className="closed">Xem chi tiết</span>
            </AccordionTrigger>
          </div>

          <AccordionContent className="p-4 grid lg:grid-cols-4 grid-cols-1 gap-4 border-b">
            {/* Shipping Address */}
            <div className="space-y-3">
              <p className="font-semibold">Địa chỉ giao hàng</p>
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
              orderStatus={order.status}
              paymentStatus={order.paymentStatus}
              formattedExpiry={formattedExpiry}
              qrPayment={qrPayment?.data}
              vnpayUrl={vnpayUrl?.data}
            />

            {/* Order Status */}
            <div className="space-y-3">
              <p className="font-semibold">Trạng thái đơn hàng</p>
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

          <CancelOrderButton order={order} />
        </div>
      </AccordionItem>
    </Accordion>
  );
}
