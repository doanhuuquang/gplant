import z from "zod";

export const CreatePlantRequestValidation = z.object({
  name: z.string().min(1, "Tên cây là bắt buộc"),
  shortDescription: z.string().min(1, "Mô tả ngắn là bắt buộc"),
  description: z.string().min(1, "Mô tả là bắt buộc"),
  categoryId: z.string().min(1, "Danh mục là bắt buộc"),
  careInstructionId: z.string().min(1, "Hướng dẫn chăm sóc là bắt buộc"),
  isActive: z.boolean(),
});

export const UpdatePlantRequestValidation = z.object({
  name: z.string().min(1, "Tên cây là bắt buộc"),
  shortDescription: z.string().min(1, "Mô tả ngắn là bắt buộc"),
  description: z.string().min(1, "Mô tả là bắt buộc"),
  categoryId: z.string().min(1, "Danh mục là bắt buộc"),
  careInstructionId: z.string().min(1, "Hướng dẫn chăm sóc là bắt buộc"),
  isActive: z.boolean(),
});

export const CreatePlantVariantRequestValidation = z.object({
  plantId: z.string().min(1, "Mã cây là bắt buộc"),
  sku: z.string().min(1, "SKU là bắt buộc"),
  price: z.number().positive("Giá phải lớn hơn 0"),
  size: z.number().positive("Kích thước phải lớn hơn 0"),
  isActive: z.boolean(),
});

export const UpdatePlantVariantRequestValidation = z.object({
  sku: z.string().min(1, "SKU là bắt buộc"),
  price: z.number().positive("Giá phải lớn hơn 0"),
  size: z.number().positive("Kích thước phải lớn hơn 0"),
  isActive: z.boolean(),
});
