import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { PermissionsGuard } from '../auth/permissions.guard.js';
import { RequirePermissions } from '../auth/permissions.decorator.js';
import type { AuthenticatedRequestUser } from '../auth/auth.types.js';
import { CreateRoleDto } from './dto/create-role.dto.js';
import { RolesService } from './roles.service.js';

@Controller('roles')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @RequirePermissions('role.manage')
  findAll(@CurrentUser() user: AuthenticatedRequestUser) {
    return this.rolesService.findAll(user.companyId);
  }

  @Post()
  @RequirePermissions('role.manage')
  create(@CurrentUser() user: AuthenticatedRequestUser, @Body() input: CreateRoleDto) {
    return this.rolesService.create(user.companyId, input);
  }
}
