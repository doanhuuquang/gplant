import z from "zod";

export const CreateCareInstructionRequestValidation = z.object({
  lightRequirement: z.string().min(1, "Nhu cầu ánh sáng là bắt buộc"),
  wateringFrequency: z.string().min(1, "Tần suất tưới là bắt buộc"),
  temperature: z.string().min(1, "Nhiệt độ là bắt buộc"),
  soil: z.string().min(1, "Thông tin đất là bắt buộc"),
  notes: z.string().min(1, "Ghi chú là bắt buộc"),
});

export const UpdateCareInstructionRequestValidation = z.object({
  lightRequirement: z.string().min(1, "Nhu cầu ánh sáng là bắt buộc"),
  wateringFrequency: z.string().min(1, "Tần suất tưới là bắt buộc"),
  temperature: z.string().min(1, "Nhiệt độ là bắt buộc"),
  soil: z.string().min(1, "Thông tin đất là bắt buộc"),
  notes: z.string().min(1, "Ghi chú là bắt buộc"),
});
