import { AskChatBotRequestValidation } from "@/validations/chatbot";
import z from "zod";

export interface ChatBotResponse {
  answer: string;
}

export type AskChatBotRequest = z.infer<typeof AskChatBotRequestValidation>;
