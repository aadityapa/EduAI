import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { createRequestId } from '@eduai/shared';
import { resolveTraceId } from '../middleware/trace-id.middleware.js';
import { captureException } from '../observability/sentry.js';
import { getStructuredLogger } from '../observability/structured-logger.js';

export interface ErrorEnvelope {
  code: string;
  message: string;
  details?: Array<{ field?: string; code: string; message: string }>;
  traceId: string;
  /** @deprecated Prefer `traceId`; retained for existing clients */
  request_id: string;
  documentation_url?: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger;

  constructor(serviceName = 'eduai') {
    this.logger = getStructuredLogger(serviceName);
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<{
      status: (code: number) => { json: (body: unknown) => void };
      setHeader?: (k: string, v: string) => void;
    }>();
    const request = ctx.getRequest<{
      url?: string;
      method?: string;
      traceId?: string;
      requestId?: string;
      headers?: Record<string, string | string[] | undefined>;
    }>();

    const traceId = resolveTraceId(request);
    response.setHeader?.('x-trace-id', traceId);
    response.setHeader?.('x-request-id', traceId);

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
        message = typeof obj.message === 'string' ? obj.message : message;
        code =
          (typeof obj.code === 'string' ? obj.code : undefined) ??
          (typeof obj.error === 'string' ? obj.error : undefined) ??
          HttpStatus[status] ??
          'HTTP_ERROR';
        if (Array.isArray(obj.message)) {
          details = obj.message.map((m) => {
            if (typeof m === 'string') {
              return { code: 'VALIDATION_ERROR', message: m };
            }
            const item = m as { property?: string; constraints?: Record<string, string> };
            const constraintMsg = item.constraints
              ? Object.values(item.constraints)[0]
              : undefined;
            return {
              field: item.property,
              code: 'VALIDATION_ERROR',
              message: constraintMsg ?? String(m),
            };
          });
          message = 'Validation failed';
          code = 'VALIDATION_ERROR';
        }
      }
    } else if (exception instanceof Error) {
      message =
        process.env.NODE_ENV === 'production'
          ? 'An unexpected error occurred'
          : exception.message;
      this.logger.error('unhandled_exception', {
        method: request.method,
        path: request.url,
        traceId,
        err: {
          name: exception.name,
          message: exception.message,
          stack: process.env.NODE_ENV === 'production' ? undefined : exception.stack,
        },
      });
      void captureException(exception, { traceId, path: request.url });
    }

    const envelope: ErrorEnvelope = {
      code,
      message,
      details,
      traceId,
      request_id: traceId || createRequestId(),
      documentation_url: 'https://docs.eduai.in/api/errors',
    };

    // Nested under `error` for existing clients; flat fields mirror Phase 6 contract.
    response.status(status).json({
      code: envelope.code,
      message: envelope.message,
      details: envelope.details,
      traceId: envelope.traceId,
      error: envelope,
    });
  }
}
