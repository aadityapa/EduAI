import { Module } from '@nestjs/common';
import { ParentErpController } from './parent-erp.controller';
import { ParentErpService } from './parent-erp.service';
import { AttendanceModule } from '../attendance/attendance.module';
import { FeesModule } from '../fees/fees.module';
import { ExamsModule } from '../exams/exams.module';
import { AssignmentsModule } from '../assignments/assignments.module';

@Module({
  imports: [AttendanceModule, FeesModule, ExamsModule, AssignmentsModule],
  controllers: [ParentErpController],
  providers: [ParentErpService],
})
export class ParentErpModule {}
