import { z } from "zod";

export const ApiErrorResponseSchema = z.object({
  statusCode: z.number(),
  error: z.string(),
  message: z.string(),
  timestamp: z.string().or(z.date()),
});

export type ApiErrorResponse = z.infer<typeof ApiErrorResponseSchema>;
