import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response as ExpressResponse } from 'express';
import { Response } from '../utils/response.util';
import { DefaultMessages } from '../constants/message.constants';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<ExpressResponse>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string = DefaultMessages.COMMON.ERROR;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse() as
        | string
        | { message?: string | string[]; error?: string; [key: string]: any };

      if (typeof res === 'string') {
        message = res;
      } else if (Array.isArray(res?.message)) {
        // Validation errors often come as string[]
        message = res.message.join(', ');
      } else if (typeof res?.message === 'string' && res.message.length > 0) {
        message = res.message;
      } else if (typeof exception.message === 'string' && exception.message) {
        message = exception.message;
      }
    } else if (exception instanceof Error) {
      message = exception.message || DefaultMessages.COMMON.ERROR;
    }

    return response.status(status).json(Response.error(message, null));
  }
}


