import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * https://docs.nestjs.com/exception-filters#exception-filters-1
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url
        });
    }
}