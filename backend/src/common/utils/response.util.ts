import { ResponseStatus } from '../constants/status.constants';
import type { ApiResponse } from '../types/response.type';

export function makeResponse<T>(
  status: ResponseStatus,
  message: string,
  data?: T | T[] | null,
): ApiResponse<T> {
  return {
    status,
    message,
    data: data ?? null,
  };
}

export const Response = {
  success<T>(message: string, data?: T | T[] | null): ApiResponse<T> {
    return makeResponse<T>(ResponseStatus.SUCCESS, message, data ?? null);
  },
  error<T>(message: string, data?: T | T[] | null): ApiResponse<T> {
    return makeResponse<T>(ResponseStatus.ERROR, message, data ?? null);
  },
  forbidden<T>(message: string, data?: T | T[] | null): ApiResponse<T> {
    return makeResponse<T>(ResponseStatus.FORBIDDEN, message, data ?? null);
  },
};


