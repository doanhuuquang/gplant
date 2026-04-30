import z from "zod";

export const CreateCategoryRequestValidation = z.object({
  name: z.string().min(1, "Tên danh mục là bắt buộc"),
  description: z.string().min(1, "Mô tả là bắt buộc"),
  parentId: z.string().optional(),
  mediaId: z.string().optional(),
});

export const UpdateCategoryRequestValidation = z.object({
  name: z.string().min(1, "Tên danh mục là bắt buộc"),
  description: z.string().min(1, "Mô tả là bắt buộc"),
  parentId: z.string().optional(),
  mediaId: z.string().optional(),
  isActive: z.boolean(),
});
