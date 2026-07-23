export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface StructuredLogFields {
  service?: string;
  traceId?: string;
  requestId?: string;
  tenantId?: string;
  userId?: string;
  method?: string;
  path?: string;
  statusCode?: number;
  durationMs?: number;
  err?: { name?: string; message?: string; stack?: string };
  [key: string]: unknown;
}

/**
 * Minimal structured JSON logger for Nest services.
 * Writes one JSON object per line to stdout/stderr (CloudWatch / Loki friendly).
 */
export class StructuredLogger {
  constructor(private readonly serviceName: string) {}

  child(extra: StructuredLogFields): StructuredLogger {
    const logger = new StructuredLogger(this.serviceName);
    const baseWrite = this.write.bind(this);
    const wrap =
      (level: LogLevel) => (message: string, fields?: StructuredLogFields) => {
        baseWrite(level, message, { ...extra, ...fields });
      };
    logger.debug = wrap('debug');
    logger.info = wrap('info');
    logger.warn = wrap('warn');
    logger.error = wrap('error');
    return logger;
  }

  debug(message: string, fields?: StructuredLogFields): void {
    this.write('debug', message, fields);
  }

  info(message: string, fields?: StructuredLogFields): void {
    this.write('info', message, fields);
  }

  warn(message: string, fields?: StructuredLogFields): void {
    this.write('warn', message, fields);
  }

  error(message: string, fields?: StructuredLogFields): void {
    this.write('error', message, fields);
  }

  private write(level: LogLevel, message: string, fields?: StructuredLogFields): void {
    const minLevel = (process.env.LOG_LEVEL ?? 'info').toLowerCase();
    const order: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    if (order.indexOf(level) < order.indexOf(minLevel as LogLevel)) {
      return;
    }

    const entry = {
      level,
      message,
      service: this.serviceName,
      timestamp: new Date().toISOString(),
      ...fields,
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

let defaultLogger: StructuredLogger | undefined;

export function getStructuredLogger(serviceName?: string): StructuredLogger {
  if (serviceName) {
    defaultLogger = new StructuredLogger(serviceName);
    return defaultLogger;
  }
  return defaultLogger ?? new StructuredLogger(process.env.OTEL_SERVICE_NAME ?? 'eduai');
}
