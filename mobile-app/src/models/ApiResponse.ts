export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  correlationId: string;
  timestamp: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errorCode: string;
  correlationId: string;
  timestamp: string;
}
