import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CrmService } from './crm.service';
import { CurrentUser, RequireAnyPermission } from '../common/decorators';
import type { UserContext } from '../common/decorators';
import { apiResponse } from '../common/response.util';

@ApiTags('crm')
@ApiBearerAuth()
@Controller('crm')
export class CrmController {
  constructor(private readonly crmService: CrmService) {}

  @Get('leads')
  @RequireAnyPermission('tenants:manage:global', 'billing:manage:tenant')
  async leads() {
    return apiResponse(await this.crmService.listLeads());
  }

  @Get('tickets')
  @RequireAnyPermission('billing:manage:tenant', 'audit:read:tenant')
  async tickets(@CurrentUser() user: UserContext) {
    return apiResponse(await this.crmService.listTickets(user));
  }

  @Get('campaigns')
  @RequireAnyPermission('tenants:manage:global', 'billing:manage:tenant')
  async campaigns() {
    return apiResponse(await this.crmService.listCampaigns());
  }

  @Get('activity-logs')
  @RequireAnyPermission('audit:read:tenant')
  async activityLogs(@CurrentUser() user: UserContext) {
    return apiResponse(await this.crmService.listActivityLogs(user));
  }

  @Get('audit-logs')
  @RequireAnyPermission('audit:read:tenant', 'audit:read:global')
  async auditLogs(@CurrentUser() user: UserContext) {
    return apiResponse(await this.crmService.listAuditLogs(user));
  }
}
