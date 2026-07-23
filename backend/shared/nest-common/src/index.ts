export { AllExceptionsFilter, type ErrorEnvelope } from './filters/all-exceptions.filter.js';
export { RedisThrottlerStorage } from './throttler/redis-throttler.storage.js';
export {
  buildThrottlerModule,
  DEFAULT_THROTTLER_PRESETS,
  type ThrottlerPreset,
} from './throttler/throttler-config.js';
export { configureNestApp, type ConfigureAppOptions, type SwaggerConfig } from './bootstrap/configure-app.js';
export { rootConfigModuleOptions, rootEnvFilePaths } from './config/root-env.js';
export {
  TraceIdMiddleware,
  resolveTraceId,
  TRACE_HEADER,
  REQUEST_ID_HEADER,
  type RequestWithTrace,
} from './middleware/trace-id.middleware.js';
export { IdempotencyInterceptor } from './interceptors/idempotency.interceptor.js';
export {
  PaginationQueryDto,
  normalizePagination,
  buildPaginationMeta,
  type PaginationMeta,
} from './dto/pagination.dto.js';
export { assertSameTenant, tenantWhere } from './utils/tenant.js';
export {
  AccessTokenRevocation,
  getAccessTokenRevocation,
} from './auth/access-token-revocation.js';
export {
  JsonCache,
  MemoryJsonKvStore,
  RedisJsonKvStore,
  type JsonKvStore,
  type RedisJsonClient,
} from './cache/json-cache.js';
export {
  CurriculumCacheKeys,
  CURRICULUM_CACHE_TTL_SEC,
  QUIZ_CACHE_TTL_SEC,
  type CurriculumInvalidationTarget,
} from './cache/curriculum-keys.js';
export {
  getCurriculumCache,
  invalidateCurriculumCache,
  resetCurriculumCacheForTests,
} from './cache/curriculum-cache.js';
export { initObservability } from './observability/init-observability.js';
export {
  StructuredLogger,
  getStructuredLogger,
  type StructuredLogFields,
  type LogLevel,
} from './observability/structured-logger.js';
export {
  PrometheusRegistry,
  getPrometheusRegistry,
  recordHttpRequest,
} from './observability/prometheus-metrics.js';
export {
  parseTraceparent,
  mintTraceContext,
  initOpenTelemetry,
  TRACEPARENT_HEADER,
  type ActiveTraceContext,
} from './observability/otel.js';
export { initSentry, captureException } from './observability/sentry.js';
export {
  loadFeatureFlags,
  isFeatureEnabled,
  listFeatureFlags,
  resetFeatureFlagsForTests,
  type FeatureFlagMap,
} from './feature-flags/feature-flags.js';
