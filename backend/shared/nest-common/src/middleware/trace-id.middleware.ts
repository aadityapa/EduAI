import { Injectable, NestMiddleware } from '@nestjs/common';
import { createRequestId } from '@eduai/shared';
import type { NextFunction, Request, Response } from 'express';
import {
  TRACEPARENT_HEADER,
  mintTraceContext,
  parseTraceparent,
} from '../observability/otel.js';

export const TRACE_HEADER = 'x-trace-id';
export const REQUEST_ID_HEADER = 'x-request-id';

export type RequestWithTrace = Request & {
  traceId?: string;
  requestId?: string;
  spanId?: string;
  traceparent?: string;
};

function readHeader(req: Request, name: string): string | undefined {
  const raw = req.headers[name];
  if (typeof raw === 'string' && raw.trim()) return raw.trim();
  if (Array.isArray(raw) && raw[0]) return String(raw[0]).trim();
  return undefined;
}

/**
 * Propagate W3C `traceparent` + EduAI `x-trace-id` / `x-request-id`.
 * Prefer incoming OTel context; fall back to minting a 32-hex trace id.
 */
@Injectable()
export class TraceIdMiddleware implements NestMiddleware {
  use(req: RequestWithTrace, res: Response, next: NextFunction) {
    const fromParent = parseTraceparent(readHeader(req, TRACEPARENT_HEADER));
    const legacy =
      readHeader(req, TRACE_HEADER) ?? readHeader(req, REQUEST_ID_HEADER);

    const ctx =
      fromParent ??
      mintTraceContext(
        legacy && /^[0-9a-f-]{32,36}$/i.test(legacy) ? legacy : undefined,
      );

    // Keep legacy clients happy: if they sent a non-hex UUID-like id and no traceparent, preserve it
    const publicTraceId =
      !fromParent && legacy && !/^[0-9a-f]{32}$/i.test(legacy.replace(/-/g, ''))
        ? legacy
        : ctx.traceId;

    req.traceId = publicTraceId;
    req.requestId = publicTraceId;
    req.spanId = ctx.spanId;
    req.traceparent = ctx.traceparent;

    res.setHeader(TRACE_HEADER, publicTraceId);
    res.setHeader(REQUEST_ID_HEADER, publicTraceId);
    res.setHeader(TRACEPARENT_HEADER, ctx.traceparent);
    next();
  }
}

export function resolveTraceId(req: {
  traceId?: string;
  requestId?: string;
  headers?: Record<string, string | string[] | undefined>;
}): string {
  if (req.traceId) return req.traceId;
  if (req.requestId) return req.requestId;
  const fromHeader =
    (typeof req.headers?.[TRACE_HEADER] === 'string'
      ? req.headers[TRACE_HEADER]
      : undefined) ??
    (typeof req.headers?.[REQUEST_ID_HEADER] === 'string'
      ? req.headers[REQUEST_ID_HEADER]
      : undefined);
  return fromHeader && String(fromHeader).trim()
    ? String(fromHeader).trim()
    : createRequestId();
}
