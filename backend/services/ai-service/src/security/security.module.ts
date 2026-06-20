import { Module } from '@nestjs/common';
import { SecurityService } from './security.service';
import { AuditService } from './audit.service';

@Module({
  providers: [SecurityService, AuditService],
  exports: [SecurityService, AuditService],
})
export class SecurityModule {}
