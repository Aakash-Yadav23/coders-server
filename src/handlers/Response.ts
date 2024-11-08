import { Response } from 'express';
import { ApiResponse } from '../interfaces/response.types';

export class ResponseUtil {
  static send<T>(res: Response, statusCode: number, data: T, message?: string): void {
    const response: ApiResponse<T> = {
      status: 'success',
      statusCode,
      message,
      data,
      metadata: {
        timestamp: new Date().toISOString(),
        path: res.req.path,
        version: '1.0'
      }
    };

    res.status(statusCode).json(response);
  }
}
