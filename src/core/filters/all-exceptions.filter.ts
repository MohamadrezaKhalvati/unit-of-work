// src/core/filters/all-exceptions.filter.ts
import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
} from '@nestjs/common'
import { Request, Response } from 'express'

/**
 * Global exception filter to catch all exceptions and format the response.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse<Response>()
        const request = ctx.getRequest<Request>()

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR

        const message =
            exception instanceof HttpException
                ? (exception.getResponse() as any)?.message || exception.message
                : 'Internal server error'

        // Log the error for debugging purposes (in a real app, use a logger)
        console.error(
            `[${request.method}] ${request.url} - ${status} - ${message}`,
        )
        if (exception instanceof Error) {
            console.error(exception.stack)
        }

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: message,
        })
    }
}
