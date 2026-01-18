import { z } from "zod";

export const ApiSuccessResponseSchema = z.object({
  statusCode: z.number(),
  message: z.string(),
  data: z.unknown().optional(),
  timestamp: z.string().or(z.date()),
});

export type ApiSuccessResponse<T = unknown> = z.infer<
  typeof ApiSuccessResponseSchema
> & {
  data?: T;
};
