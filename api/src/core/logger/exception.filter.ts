 
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { AppLogger } from './logger';

const logger = AppLogger.for('AllExceptionsFilter');

// Helper function to safely serialize objects with circular references
function safeStringify(obj: any): string {
  const seen = new WeakSet();
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return '[Circular]';
      }
      seen.add(value);
    }
    return value;
  });
}

// Decorator to mark this class as a catcher for all types of exceptions
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  // Method to handle the exception
  catch(exception: unknown, host: ArgumentsHost) {
    // Get HTTP-specific arguments
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    // Determine the HTTP status code: use the exception's status if it's an HTTPException, otherwise 500
    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    // Default error message, changes if the exception is an instance of Error
    let message = exception instanceof Error ? exception.message : 'Unexpected error occurred';

    let stack = null; // Initialize stack trace variable

    // If exception is an Error, parse its stack trace
    if (exception instanceof Error) {
      stack = exception;
      // newrelic.noticeError(exception);
    }

    // Extract the request ID from the request headers, if available
    const requestId = request?.headers['request-id'];

    // Use the BadRequestException response since it's more specific than our
    // default response.
    let additionalParams: any = {};
    if (exception instanceof BadRequestException) {
      additionalParams = { ...(exception.getResponse() as any) };
      if (additionalParams.message) message = `${message}: ${additionalParams.message}`;
      // newrelic.addCustomAttributes({ extraErrorDetail: message });
      // newrelic.noticeError(exception, true);
    }

    // Create a safe error response object
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request?.url,
      message,
      requestId,
      ...(process.env.NODE_ENV !== 'production' ? { stack: stack?.stack } : {}),
    };

    // // Log the error safely
    // newrelic?.recordLogEvent({
    //   message: safeStringify({
    //     message,
    //     statusCode: status,
    //     path: request?.url,
    //     requestId,
    //   }),
    //   level: 'error',
    //   error: stack,
    // });

    logger.error(message, exception);

    // Send the safe response
    response.status(status).send(errorResponse);
  }
}
