export interface ApiOptions {
  shouldFail?: boolean;
  minLatencyMs?: number;
  maxLatencyMs?: number;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}
