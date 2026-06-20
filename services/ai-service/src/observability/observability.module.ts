import { Controller, Get, Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { MetricsService } from './metrics.service';
import { TracingService } from './tracing.service';
import { Public } from '../common/decorators';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metrics: MetricsService) {}

  @Public()
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
