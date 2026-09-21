import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ChantierAccessGuard } from '../auth/chantier-access.guard.js';
import { CurrentUser } from '../auth/current-user.decorator.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { PermissionsGuard } from '../auth/permissions.guard.js';
import { RequirePermissions } from '../auth/permissions.decorator.js';
import type { AuthenticatedRequestUser } from '../auth/auth.types.js';
import { CreateReportDto } from './dto/create-report.dto.js';
import { ReportsService } from './reports.service.js';

@Controller('reports')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  @RequirePermissions('report.read')
  findAll(@CurrentUser() user: AuthenticatedRequestUser, @Query('chantierId') chantierId?: string) {
    return this.reportsService.findAll(user.companyId, user.id, chantierId);
  }

  /**
   * Détail d'un rapport : relit la période enregistrée et reconstruit la même synthèse
   * que lors de la génération, sans créer de nouvelle ligne de rapport.
   */
  @Get(':id')
  @RequirePermissions('report.read')
  findOne(@CurrentUser() user: AuthenticatedRequestUser, @Param('id') reportId: string) {
    return this.reportsService.findOne(user.companyId, user.id, reportId);
  }

  @Post()
  @UseGuards(ChantierAccessGuard)
  @RequirePermissions('report.create')
  generate(@CurrentUser() user: AuthenticatedRequestUser, @Body() input: CreateReportDto) {
    return this.reportsService.generate(user.companyId, user.id, input);
  }
}
