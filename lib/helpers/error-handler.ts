import axios from 'axios';
import { ErrorResponse } from '@/types/api';

export const handleError = (error: unknown): ErrorResponse => {
  if (axios.isAxiosError(error)) throw error.response?.data as ErrorResponse;
  throw {
    statusCode: 5000,
    error: "UnknownError",
    message: "An unknown error occurred",
    timestamp: new Date(),
  } as ErrorResponse;
};
