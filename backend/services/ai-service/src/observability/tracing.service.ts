import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

export interface Span {
  traceId: string;
  spanId: string;
  name: string;
  startTime: number;
  endTime?: number;
  attributes: Record<string, string>;
}

@Injectable()
export class TracingService {
  private readonly spans: Span[] = [];

  startSpan(name: string, attributes: Record<string, string> = {}): Span {
    const span: Span = {
      traceId: randomUUID(),
      spanId: randomUUID().slice(0, 16),
      name,
      startTime: Date.now(),
      attributes,
    };
    this.spans.push(span);
    return span;
  }

  endSpan(span: Span): void {
    span.endTime = Date.now();
  }

  getRecentSpans(limit = 100): Span[] {
    return this.spans.slice(-limit);
  }
}
