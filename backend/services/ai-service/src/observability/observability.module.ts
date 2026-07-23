import { Controller, Get, Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { MetricsService } from './metrics.service';
import { TracingService } from './tracing.service';

/**
 * Nest metrics controller retained for AI-specific series.
 * Prefer nest-common Express `/api/v1/metrics` (registered in configureNestApp) for scrapes —
 * both render the shared `ai-service` Prometheus registry.
 */
@Controller('metrics')
export class MetricsController {
  constructor(private readonly metrics: MetricsService) {}

  @Get()
  getMetrics(): string {
    return this.metrics.getPrometheusMetrics();
  }
}

@Module({
  controllers: [MetricsController],
  providers: [LoggerService, MetricsService, TracingService],
  exports: [LoggerService, MetricsService, TracingService],
})
export class ObservabilityModule {}
