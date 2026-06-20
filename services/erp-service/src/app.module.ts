import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { buildThrottlerModule, rootConfigModuleOptions } from '@eduai/nest-common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { ClassesModule } from './classes/classes.module';
import { AttendanceModule } from './attendance/attendance.module';
import { TimetableModule } from './timetable/timetable.module';
import { FeesModule } from './fees/fees.module';
import { ExamsModule } from './exams/exams.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { TeacherModule } from './teacher/teacher.module';
import { ParentErpModule } from './parent-erp/parent-erp.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { ScaffoldModule } from './scaffold/scaffold.module';
import { SchoolsModule } from './schools/schools.module';

@Module({
  imports: [
    ConfigModule.forRoot(rootConfigModuleOptions),
    buildThrottlerModule([], process.env.REDIS_URL),
    PrismaModule,
    AuthModule,
    HealthModule,
    ClassesModule,
    AttendanceModule,
    TimetableModule,
    FeesModule,
    ExamsModule,
    AssignmentsModule,
    TeacherModule,
    ParentErpModule,
    NotificationsModule,
    AnalyticsModule,
    ScaffoldModule,
    SchoolsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
