import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { PermissionsGuard } from '../auth/permissions.guard.js';
import { RequirePermissions } from '../auth/permissions.decorator.js';
import type { AuthenticatedRequestUser } from '../auth/auth.types.js';
import { DashboardService } from '../dashboard/dashboard.service.js';

@Controller('alerts')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AlertsController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @RequirePermissions('chantier.read')
  async findAll(@CurrentUser() user: AuthenticatedRequestUser) {
    const overview = await this.dashboardService.getOverview(user.companyId, user.id);
    return { alerts: overview.alerts, count: overview.alerts.length };
  }
}
