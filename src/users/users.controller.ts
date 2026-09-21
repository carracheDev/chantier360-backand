import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { PermissionsGuard } from '../auth/permissions.guard.js';
import { RequirePermissions } from '../auth/permissions.decorator.js';
import type { AuthenticatedRequestUser } from '../auth/auth.types.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserStatusDto } from './dto/update-user-status.dto.js';
import { UsersService } from './users.service.js';

@Controller('users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @RequirePermissions('user.manage')
  findAll(@CurrentUser() user: AuthenticatedRequestUser) {
    return this.usersService.findAll(user.companyId);
  }

  @Post()
  @RequirePermissions('user.manage')
  create(@CurrentUser() user: AuthenticatedRequestUser, @Body() input: CreateUserDto) {
    return this.usersService.create(user.companyId, input);
  }

  @Patch(':id/active')
  @RequirePermissions('user.manage')
  setActive(
    @CurrentUser() user: AuthenticatedRequestUser,
    @Param('id') userId: string,
    @Body() input: UpdateUserStatusDto,
  ) {
    return this.usersService.setActive(user.companyId, userId, input.active);
  }
}
