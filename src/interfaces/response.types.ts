export interface ApiResponse<T> {
    status: 'success' | 'fail' | 'error';
    statusCode: number;
    message?: string;
    data?: T;
    error?: {
      type: string;
      details?: unknown;
    };
    metadata?: {
      timestamp: string;
      path: string;
      version: string;
    };
  }