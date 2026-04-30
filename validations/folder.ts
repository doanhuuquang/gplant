import z from "zod";

export const CreateFolderRequestValidation = z.object({
  name: z.string().min(1, "Tên là bắt buộc"),
});
