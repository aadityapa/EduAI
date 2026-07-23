import { randomBytes } from 'node:crypto';
import { createRequestId } from '@eduai/shared';
import { getStructuredLogger } from './structured-logger.js';

export const TRACEPARENT_HEADER = 'traceparent';

export interface ActiveTraceContext {
  traceId: string;
  spanId: string;
  traceparent: string;
}

/**
 * Parse W3C traceparent (version-traceId-spanId-flags).
 * @see https://www.w3.org/TR/trace-context/
 */
export function parseTraceparent(header: string | undefined): ActiveTraceContext | undefined {
  if (!header?.trim()) return undefined;
  const parts = header.trim().split('-');
  if (parts.length < 4) return undefined;
  const [version, traceId, parentSpanId, flags] = parts;
  if (version !== '00' || !traceId || traceId.length !== 32 || !parentSpanId || parentSpanId.length !== 16) {
    return undefined;
  }
  if (/^0+$/.test(traceId)) return undefined;
  const spanId = randomHex(16);
  const traceparent = `00-${traceId}-${spanId}-${flags ?? '01'}`;
  return { traceId, spanId, traceparent };
}

export function mintTraceContext(existingTraceId?: string): ActiveTraceContext {
  const traceId = (existingTraceId && normalizeTraceId(existingTraceId)) || randomHex(32);
  const spanId = randomHex(16);
  return {
    traceId,
    spanId,
    traceparent: `00-${traceId}-${spanId}-01`,
  };
}

function normalizeTraceId(raw: string): string | undefined {
  const cleaned = raw.replace(/-/g, '').toLowerCase();
  if (/^[0-9a-f]{32}$/.test(cleaned)) return cleaned;
  // UUID → 32 hex without dashes
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(raw)) {
    return cleaned;
  }
  return undefined;
}

function randomHex(len: number): string {
  try {
    return randomBytes(len / 2).toString('hex');
  } catch {
    return createRequestId().replace(/-/g, '').slice(0, len).padEnd(len, '0');
  }
}

export interface OtelInitOptions {
  serviceName: string;
  /** When true (default), no-op if OTEL_SDK_DISABLED=true or no endpoint */
  softFail?: boolean;
}

/**
 * Soft-init OpenTelemetry Node SDK when packages + endpoint are available.
 * Does not hard-depend on @opentelemetry/sdk-node so local/CI installs stay lean.
 *
 * Enable with:
 *   OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
 *   and optional `@opentelemetry/sdk-node` + exporter packages installed.
 */
export async function initOpenTelemetry(options: OtelInitOptions): Promise<void> {
  const log = getStructuredLogger(options.serviceName);
  if (process.env.OTEL_SDK_DISABLED === 'true') {
    log.info('OpenTelemetry SDK disabled via OTEL_SDK_DISABLED');
    return;
  }

  const endpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT;
  if (!endpoint) {
    log.debug('OpenTelemetry: no OTEL_EXPORTER_OTLP_ENDPOINT — W3C propagation only');
    return;
  }

  try {
    // Dynamic import keeps nest-common buildable without OTel packages installed.
    const dynImport = new Function('s', 'return import(s)') as (
      s: string,
    ) => Promise<Record<string, unknown>>;
    const sdkMod = await dynImport('@opentelemetry/sdk-node').catch(() => null);
    const exporterMod = await dynImport('@opentelemetry/exporter-trace-otlp-http').catch(
      () => null,
    );
    const resourcesMod = await dynImport('@opentelemetry/resources').catch(() => null);

    if (!sdkMod || !exporterMod) {
      log.warn(
        'OpenTelemetry packages not installed — using W3C header propagation only. Install @opentelemetry/sdk-node and @opentelemetry/exporter-trace-otlp-http for full export.',
      );
      return;
    }

    const { NodeSDK } = sdkMod as {
      NodeSDK: new (cfg: Record<string, unknown>) => { start: () => void; shutdown: () => Promise<void> };
    };
    const { OTLPTraceExporter } = exporterMod as {
      OTLPTraceExporter: new (cfg: { url: string }) => unknown;
    };

    const resourceAttrs: Record<string, string> = {
      'service.name': options.serviceName,
      'service.namespace': process.env.OTEL_SERVICE_NAMESPACE ?? 'eduai',
    };

    let resource: unknown;
    if (resourcesMod) {
      const { Resource } = resourcesMod as {
        Resource: {
          default: () => { merge: (r: unknown) => unknown };
          new (a: Record<string, string>): unknown;
        };
      };
      resource = Resource.default().merge(new Resource(resourceAttrs));
    }

    const url = endpoint.replace(/\/$/, '') + '/v1/traces';
    const sdk = new NodeSDK({
      ...(resource ? { resource } : {}),
      traceExporter: new OTLPTraceExporter({ url }),
      serviceName: options.serviceName,
    });

    sdk.start();
    const shutdown = () => {
      void sdk.shutdown().catch(() => undefined);
    };
    process.once('SIGTERM', shutdown);
    process.once('SIGINT', shutdown);

    log.info('OpenTelemetry NodeSDK started', { otlpEndpoint: endpoint });
  } catch (err) {
    const soft = options.softFail !== false;
    const message = err instanceof Error ? err.message : String(err);
    if (soft) {
      log.warn('OpenTelemetry init failed (soft)', { err: { message } });
    } else {
      throw err;
    }
  }
}
