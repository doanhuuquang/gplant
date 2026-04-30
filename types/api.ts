export interface SuccessResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  timestamp: string | Date;
}

export interface ErrorResponse {
  statusCode: number;
  error: string;
  message: string;
  timestamp: string | Date;
}
