import { z } from "zod";

export const VerifyOTPResponseSchema = z.object({
  resetToken: z.string(),
});

export type VerifyOTPResponse = z.infer<typeof VerifyOTPResponseSchema>;
