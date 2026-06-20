import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DB_QUERY_TIMEOUT_MS, withTimeout } from '@eduai/shared';
import { PrismaService } from '../prisma/prisma.service';
import { Public } from '../common/decorators';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Public()
  @Get()
  async liveness() {
    return { status: 'ok', service: 'learning-service' };
  }

  @Public()
  @Get('ready')
  async readiness() {
    await withTimeout(
      this.prisma.$queryRaw`SELECT 1`,
      DB_QUERY_TIMEOUT_MS,
      'database readiness check',
    );
    return { status: 'ready', database: 'connected' };
  }
}
