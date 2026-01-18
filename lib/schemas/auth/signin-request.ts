import { z } from "zod";

export const SignInRequestSchema = z.object({
  email: z.string().email("Email is not valid"),
  password: z.string().min(1, "Password is required"),
});

export type SignInRequest = z.infer<typeof SignInRequestSchema>;
