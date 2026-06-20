import { Module } from '@nestjs/common';
import { BillingAnalyticsController } from './analytics.controller';
import { BillingAnalyticsService } from './analytics.service';

@Module({
  controllers: [BillingAnalyticsController],
  providers: [BillingAnalyticsService],
})
export class AnalyticsModule {}
