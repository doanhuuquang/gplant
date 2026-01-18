import { z } from "zod";

export const RecoverUsernameRequestSchema = z.object({
  email: z.string().email("Email is not valid"),
});

export type RecoverUsernameRequest = z.infer<
  typeof RecoverUsernameRequestSchema
>;
