import { createRequestId, wrapResponse } from '@eduai/shared';

export function apiResponse<T>(data: T, requestId?: string) {
  return wrapResponse(data, requestId ?? createRequestId());
}
