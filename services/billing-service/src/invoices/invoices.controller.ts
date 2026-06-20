import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { InvoicesService } from './invoices.service';
import { CurrentUser, RequireAnyPermission } from '../common/decorators';
import type { UserContext } from '../common/decorators';
import { apiResponse } from '../common/response.util';

@ApiTags('invoices')
@ApiBearerAuth()
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get('me')
  @RequireAnyPermission('billing:manage:tenant', 'billing:manage:own')
  async mine(@CurrentUser() user: UserContext) {
    return apiResponse(await this.invoicesService.listTenantInvoices(user));
  }

  @Get()
  @RequireAnyPermission('billing:manage:tenant', 'tenants:manage:global')
  async list() {
    return apiResponse(await this.invoicesService.listAllInvoices());
  }
}
