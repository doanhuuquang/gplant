import z from "zod";

export const CreateShippingAddressRequestValidation = z.object({
  shippingName: z
    .string()
    .min(1, "Tên người nhận là bắt buộc")
    .max(30, "Tên người nhận quá dài"),
  shippingPhone: z
    .string()
    .min(1, "Số điện thoại giao hàng là bắt buộc")
    .max(10, "Số điện thoại giao hàng không hợp lệ")
    .regex(/^0\d{9}$/, "Số điện thoại giao hàng không hợp lệ"),
  address: z
    .string()
    .min(1, "Tên địa chỉ là bắt buộc")
    .max(200, "Tên địa chỉ quá dài"),
  buildingName: z
    .string()
    .min(1, "Tên tòa nhà là bắt buộc")
    .max(100, "Tên tòa nhà quá dài"),
  isPrimary: z.boolean().optional(),
  longitude: z.string().min(1, "Kinh độ là bắt buộc"),
  latitude: z.string().min(1, "Vĩ độ là bắt buộc"),
});

export const UpdateShippingAddressRequestValidation = z.object({
  shippingName: z
    .string()
    .min(1, "Tên người nhận là bắt buộc")
    .max(30, "Tên người nhận quá dài"),
  shippingPhone: z
    .string()
    .min(1, "Số điện thoại giao hàng là bắt buộc")
    .max(10, "Số điện thoại giao hàng không hợp lệ")
    .regex(/^0\d{9}$/, "Số điện thoại giao hàng không hợp lệ"),
  address: z
    .string()
    .min(1, "Tên địa chỉ là bắt buộc")
    .max(200, "Tên địa chỉ quá dài"),
  buildingName: z
    .string()
    .min(1, "Tên tòa nhà là bắt buộc")
    .max(100, "Tên tòa nhà quá dài"),
  isPrimary: z.boolean().optional(),
  longitude: z.string().min(1, "Kinh độ là bắt buộc"),
  latitude: z.string().min(1, "Vĩ độ là bắt buộc"),
});
