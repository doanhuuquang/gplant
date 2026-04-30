import z from "zod";

export const UpdateUserRequestValidation = z.object({
  firstName: z
    .string()
    .min(1, "Tên là bắt buộc")
    .max(30, "Tên quá dài"),
  lastName: z
    .string()
    .min(1, "Họ là bắt buộc")
    .max(30, "Họ quá dài"),
  phoneNumber: z
    .string()
    .max(10, "Số điện thoại giao hàng không hợp lệ")
    .regex(/^0\d{9}$/, "Số điện thoại giao hàng không hợp lệ")
    .optional(),
  profilePictureUrl: z.string(),
});
