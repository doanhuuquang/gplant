import z from "zod";

export const CreateBannerRequestValidation = z.object({
  title: z.string().min(1, "Tiêu đề là bắt buộc"),
  description: z.string().min(1, "Mô tả là bắt buộc"),
  imageUrl: z.string().min(1, "URL hình ảnh là bắt buộc"),
  redirectUrl: z.string().min(1, "URL chuyển hướng là bắt buộc"),
  group: z.string().min(1, "Nhóm là bắt buộc"),
  orderIndex: z.number().int().positive().optional(),
  mediaId: z.string().optional(),
  isActive: z.boolean(),
});

export const UpdateBannerRequestValidation = z.object({
  title: z.string().min(1, "Tiêu đề là bắt buộc"),
  description: z.string().min(1, "Mô tả là bắt buộc"),
  imageUrl: z.string().min(1, "URL hình ảnh là bắt buộc"),
  redirectUrl: z.string().min(1, "URL chuyển hướng là bắt buộc"),
  group: z.string().min(1, "Nhóm là bắt buộc"),
  orderIndex: z.number().int().positive().optional(),
  mediaId: z.string().optional(),
  isActive: z.boolean(),
});
