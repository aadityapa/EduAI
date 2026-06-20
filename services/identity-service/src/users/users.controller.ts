import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto, ListUsersQuery, UpdateProfileDto } from './dto/users.dto';
import { CurrentUser, RequirePermission } from '../common/decorators';
import type { UserContext } from '../common/decorators';
import { apiResponse } from '../common/response.util';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@CurrentUser() user: UserContext) {
    const data = await this.usersService.getMe(user.sub);
    return apiResponse(data);
  }

  @Patch('me')
  @RequirePermission('users:update:own')
  async updateMe(@CurrentUser() user: UserContext, @Body() dto: UpdateProfileDto) {
    const data = await this.usersService.updateMe(user.sub, dto);
    return apiResponse(data);
  }

  @Get()
  @RequirePermission('users:read:tenant')
  async list(@CurrentUser() user: UserContext, @Query() query: ListUsersQuery) {
    const result = await this.usersService.listUsers(user, query);
    return {
      data: result.items,
      meta: {
        request_id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        pagination: result.pagination,
      },
    };
  }

  @Get(':id')
  async getById(@CurrentUser() user: UserContext, @Param('id') id: string) {
    const data = await this.usersService.getUser(user, id);
    return apiResponse(data);
  }

  @Post()
  @RequirePermission('users:create:tenant')
  async create(@CurrentUser() user: UserContext, @Body() dto: CreateUserDto) {
    const data = await this.usersService.createUser(user, dto);
    return apiResponse(data);
  }

  @Delete(':id')
  @RequirePermission('users:delete:tenant')
  async remove(@CurrentUser() user: UserContext, @Param('id') id: string) {
    const data = await this.usersService.softDelete(user, id);
    return apiResponse(data);
  }
}
