import { ResponseStatus } from '../constants/status.constants';

export type ApiResponse<T> = {
  status: ResponseStatus;
  message: string;
  data: T | T[] | null;
};


