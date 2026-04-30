import z from "zod";

export const CreateInventoryRequestValidation = z.object({
  plantVariantId: z.string().min(1, "Vui lòng chọn biến thể cây"),
  quantityAvailable: z.number().int().min(0, "Số lượng không được âm"),
});

export const UpdateInventoryRequestValidation = z.object({
  quantityAvailable: z.number().int().min(0, "Số lượng không được âm"),
});

export const AdjustInventoryRequestValidation = z.object({
  quantity: z
    .number()
    .int()
    .refine((v) => v !== 0, "Số lượng không được bằng 0"),
  reason: z.string().optional(),
});
