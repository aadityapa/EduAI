import { Injectable } from '@nestjs/common';

export interface StructuredLog {
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  service: string;
  tenantId?: string;
  userId?: string;
  feature?: string;
  durationMs?: number;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

@Injectable()
export class LoggerService {
  private readonly serviceName = 'ai-service';

  info(message: string, context?: Partial<StructuredLog>): void {
    this.emit('info', message, context);
  }

  warn(message: string, context?: Partial<StructuredLog>): void {
    this.emit('warn', message, context);
  }

  error(message: string, context?: Partial<StructuredLog>): void {
    this.emit('error', message, context);
  }

  private emit(level: StructuredLog['level'], message: string, context?: Partial<StructuredLog>): void {
    const entry: StructuredLog = {
      level,
      message,
      service: this.serviceName,
      timestamp: new Date().toISOString(),
      ...context,
    };
    const line = JSON.stringify(entry);
    if (level === 'error') {
      console.error(line);
    } else if (level === 'warn') {
      console.warn(line);
    } else {
      console.log(line);
    }
  }
}
