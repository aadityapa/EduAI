import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { buildThrottlerModule, rootConfigModuleOptions } from '@eduai/nest-common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { TutorModule } from './tutor/tutor.module';
import { HomeworkModule } from './homework/homework.module';
import { PlannerModule } from './planner/planner.module';
import { GeneratorsModule } from './generators/generators.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { SecurityModule } from './security/security.module';
import { ObservabilityModule } from './observability/observability.module';
import { CostModule } from './cost/cost.module';

@Module({
  imports: [
    ConfigModule.forRoot(rootConfigModuleOptions),
    buildThrottlerModule([{ name: 'ai', ttl: 60000, limit: 30 }], process.env.REDIS_URL),
    PrismaModule,
    AuthModule,
    HealthModule,
    SecurityModule,
    ObservabilityModule,
    CostModule,
    TutorModule,
    HomeworkModule,
    PlannerModule,
    GeneratorsModule,
    AnalyticsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
