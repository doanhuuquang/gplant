import z from "zod";

export const CreateLightningSaleRequestValidation = z
  .object({
    name: z.string().min(1, "Tên là bắt buộc"),
    description: z.string().min(1, "Mô tả là bắt buộc"),
    startDateUtc: z.string().min(1, "Ngày bắt đầu là bắt buộc"),
    endDateUtc: z.string().min(1, "Ngày kết thúc là bắt buộc"),
  })
  .refine((data) => new Date(data.endDateUtc) > new Date(data.startDateUtc), {
    message: "Ngày kết thúc phải sau ngày bắt đầu",
    path: ["endDateUtc"],
  })
  .refine((data) => new Date(data.endDateUtc) > new Date(), {
    message: "Ngày kết thúc phải ở tương lai",
    path: ["endDateUtc"],
  });

export const UpdateLightningSaleRequestValidation = z
  .object({
    name: z.string().min(1, "Tên là bắt buộc"),
    description: z.string().min(1, "Mô tả là bắt buộc"),
    startDateUtc: z.string().min(1, "Ngày bắt đầu là bắt buộc"),
    endDateUtc: z.string().min(1, "Ngày kết thúc là bắt buộc"),
    isActive: z.boolean(),
  })
  .refine((data) => new Date(data.endDateUtc) > new Date(data.startDateUtc), {
    message: "Ngày kết thúc phải sau ngày bắt đầu",
    path: ["endDateUtc"],
  });

export const CreateLightningSaleItemRequestValidation = z.object({
  plantVariantId: z.string().min(1, "Vui lòng chọn biến thể cây"),
  salePrice: z.number().positive("Giá khuyến mãi phải lớn hơn 0"),
  quantityLimit: z
    .number()
    .int()
    .positive("Giới hạn số lượng phải lớn hơn 0"),
});

export const UpdateLightningSaleItemRequestValidation = z.object({
  salePrice: z.number().positive("Giá khuyến mãi phải lớn hơn 0"),
  quantityLimit: z
    .number()
    .int()
    .positive("Giới hạn số lượng phải lớn hơn 0"),
  isActive: z.boolean(),
});
