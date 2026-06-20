import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { TutorModule } from './tutor/tutor.module';
import { HomeworkModule } from './homework/homework.module';
import { PlannerModule } from './planner/planner.module';
import { GeneratorsModule } from './generators/generators.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      { name: 'default', ttl: 60000, limit: 120 },
      { name: 'auth', ttl: 900000, limit: 20 },
    ]),
    PrismaModule,
    AuthModule,
    HealthModule,
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
