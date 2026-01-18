import { type ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import axios from "axios";

export const handleError = (error: unknown): ApiErrorResponse => {
  if (axios.isAxiosError(error)) throw error.response?.data as ApiErrorResponse;
  throw {
    statusCode: 5000,
    error: "UnknownError",
    message: "An unknown error occurred",
    timestamp: new Date(),
  } as ApiErrorResponse;
};
