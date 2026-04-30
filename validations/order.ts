import z from "zod";

export const UpdateOrderStatusRequestValidation = z.object({
  status: z.string().min(1, "Vui lòng chọn trạng thái đơn hàng"),
  note: z.string().optional(),
});

export const CancelOrderRequestValidation = z.object({
  reason: z.string().min(1, "Vui lòng cho chúng tôi biết lý do hủy đơn hàng"),
});
