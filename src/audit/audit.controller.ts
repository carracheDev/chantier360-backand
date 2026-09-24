import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { PermissionsGuard } from '../auth/permissions.guard.js';
import { RequirePermissions } from '../auth/permissions.decorator.js';
import type { AuthenticatedRequestUser } from '../auth/auth.types.js';
import { AuditService } from './audit.service.js';

@Controller('audit')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @RequirePermissions('user.manage')
  findAll(@CurrentUser() user: AuthenticatedRequestUser, @Query('limit') limit?: string) {
    return this.auditService.findAll(user.companyId, limit ? Number(limit) : undefined);
  }

  @Get('entity/:entityType/:entityId')
  @RequirePermissions('expense.read')
  findByEntity(
    @CurrentUser() user: AuthenticatedRequestUser,
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
    @Query('limit') limit?: string,
  ) {
    if (entityType !== 'Expense') return [];
    return this.auditService.findByEntity(user.companyId, entityType, entityId, limit ? Number(limit) : 20);
  }
}
