import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { createRequestId } from '@eduai/shared';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<{ status: (code: number) => { json: (body: unknown) => void } }>();
    const request = ctx.getRequest<{ url?: string; method?: string }>();

    const requestId = createRequestId();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 'INTERNAL_ERROR';
    let message = 'An unexpected error occurred';
    let details: Array<{ field?: string; code: string; message: string }> | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const body = exception.getResponse();
      if (typeof body === 'string') {
        message = body;
        code = HttpStatus[status] ?? 'HTTP_ERROR';
      } else if (typeof body === 'object' && body !== null) {
        const obj = body as Record<string, unknown>;
        message = (obj.message as string) ?? message;
        code = (obj.error as string) ?? HttpStatus[status] ?? 'HTTP_ERROR';
        if (Array.isArray(obj.message)) {
          details = obj.message.map((m) => ({
            code: 'VALIDATION_ERROR',
            message: String(m),
          }));
          message = 'Validation failed';
          code = 'VALIDATION_ERROR';
        }
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(
        `${request.method ?? 'UNKNOWN'} ${request.url ?? ''} [${requestId}]: ${exception.message}`,
        exception.stack,
      );
    }

    response.status(status).json({
      error: {
        code,
        message,
        details,
        request_id: requestId,
        documentation_url: 'https://docs.eduai.in/api/errors',
      },
    });
  }
}
