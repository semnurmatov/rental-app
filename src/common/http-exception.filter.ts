import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const req = context.getRequest<Request>();
    const res = context.getResponse<Response>();
    const status = exception.getStatus();
    const message = exception.message;

    res.status(status).json({
      statusCode: status,
      message: message,
      timestamp: new Date().toISOString(),
      path: req.url,
    });
  }
}
