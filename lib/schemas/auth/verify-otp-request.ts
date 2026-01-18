import { z } from "zod";

export const VerifyOTPRequestSchema = z.object({
  email: z.string().email("Email is not valid"),
  code: z.string().length(6, "OTP must be 6 digits"),
});

export type VerifyOTPRequest = z.infer<typeof VerifyOTPRequestSchema>;
