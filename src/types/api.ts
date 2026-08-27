// Common API response type definitions (to be expanded in domain feature tasks)
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}
