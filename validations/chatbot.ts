import z from "zod";

export const AskChatBotRequestValidation = z.object({
  question: z.string().min(1, "Vui lòng nhập câu hỏi"),
});
