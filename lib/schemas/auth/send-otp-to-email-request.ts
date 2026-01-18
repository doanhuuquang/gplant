import { z } from "zod";

export const SendOTPToEmailRequestSchema = z.object({
  email: z.string().email("Email is not valid"),
});

export type SendOTPToEmailRequest = z.infer<typeof SendOTPToEmailRequestSchema>;
