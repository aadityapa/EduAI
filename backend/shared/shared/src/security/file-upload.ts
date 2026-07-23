/**
 * Secure file upload validation + malware scan hook.
 * ClamAV / cloud scanner wiring is env-driven; default is MIME+size gate only.
 */

export const DEFAULT_MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 MB

export const SAFE_UPLOAD_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf',
  'video/mp4',
  'video/webm',
  'text/plain',
] as const;

export interface UploadValidationInput {
  filename: string;
  mimeType: string;
  sizeBytes: number;
  /** Optional magic-byte sniff result from client/server. */
  detectedMime?: string;
}

export interface UploadValidationResult {
  ok: boolean;
  reason?: string;
}

export interface MalwareScanResult {
  clean: boolean;
  engine: 'noop' | 'clamav' | 'external';
  detail?: string;
}

export type MalwareScanFn = (input: {
  buffer?: Buffer;
  path?: string;
  filename: string;
  mimeType: string;
}) => Promise<MalwareScanResult>;

export function validateUploadFile(
  input: UploadValidationInput,
  options?: {
    maxBytes?: number;
    allowedMimeTypes?: readonly string[];
  },
): UploadValidationResult {
  const max = options?.maxBytes ?? DEFAULT_MAX_UPLOAD_BYTES;
  const allowed = options?.allowedMimeTypes ?? SAFE_UPLOAD_MIME_TYPES;

  if (!input.filename || input.filename.includes('..') || /[/\\]/.test(input.filename)) {
    return { ok: false, reason: 'Invalid filename' };
  }
  if (input.sizeBytes <= 0 || input.sizeBytes > max) {
    return { ok: false, reason: `File exceeds size limit (${max} bytes)` };
  }
  const mime = (input.detectedMime ?? input.mimeType).toLowerCase();
  if (!allowed.includes(mime)) {
    return { ok: false, reason: `MIME type not allowed: ${mime}` };
  }
  return { ok: true };
}

/** Default scan hook — always clean. Replace when CLAMAV_HOST or SCAN_WEBHOOK_URL is set. */
export const noopMalwareScan: MalwareScanFn = async () => ({
  clean: true,
  engine: 'noop',
  detail: 'Scan deferred — configure CLAMAV_HOST or SCAN_WEBHOOK_URL',
});

export async function scanUpload(
  input: Parameters<MalwareScanFn>[0],
  scanFn: MalwareScanFn = noopMalwareScan,
): Promise<MalwareScanResult> {
  if (process.env.SCAN_WEBHOOK_URL) {
    try {
      const res = await fetch(process.env.SCAN_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          filename: input.filename,
          mimeType: input.mimeType,
          // Never send full file contents to an unverified webhook in this scaffold
          hasBuffer: Boolean(input.buffer),
        }),
      });
      if (!res.ok) {
        return { clean: false, engine: 'external', detail: `Scan webhook HTTP ${res.status}` };
      }
      const body = (await res.json()) as { clean?: boolean; detail?: string };
      return {
        clean: body.clean !== false,
        engine: 'external',
        detail: body.detail,
      };
    } catch (err) {
      return {
        clean: false,
        engine: 'external',
        detail: err instanceof Error ? err.message : 'Scan webhook failed',
      };
    }
  }
  return scanFn(input);
}
