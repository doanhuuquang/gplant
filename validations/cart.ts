import z from "zod";

export const AddItemToCartRequestValidation = (quantityAvailable: number) =>
  z.object({
    plantVariantId: z.string().min(1, "Biến thể cây là bắt buộc"),
    quantity: z
      .number()
      .int()
      .positive("Số lượng phải lớn hơn 0")
      .max(
        quantityAvailable,
        `Số lượng tối đa hiện có là ${quantityAvailable}`,
      ),
  });

export const UpdateCartItemRequestValidation = (quantityAvailable: number) =>
  z.object({
    quantity: z
      .number()
      .int()
      .positive("Số lượng phải lớn hơn 0")
      .max(
        quantityAvailable,
        `Số lượng tối đa hiện có là ${quantityAvailable}`,
      ),
  });
