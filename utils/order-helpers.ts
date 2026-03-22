import { PaymentMethod } from "@/lib/enums/payment-method";

export const getPaymentExpiryDate = (createdAtUtc: string | Date, paymentMethod: PaymentMethod) => {
  const date = new Date(createdAtUtc);
  const expiryDate = new Date(createdAtUtc);

  if (paymentMethod === PaymentMethod.BankTransfer) {
    expiryDate.setHours(date.getHours() + 24);
  } else if (paymentMethod === PaymentMethod.VNPay) {
    expiryDate.setMinutes(date.getMinutes() + 15);
  }

  return expiryDate;
};

export const formatVietnameseDateTime = (date: Date) => {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(date);
};
