import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ChantierAccessGuard } from '../auth/chantier-access.guard.js';
import { CurrentUser } from '../auth/current-user.decorator.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { PermissionsGuard } from '../auth/permissions.guard.js';
import { RequirePermissions } from '../auth/permissions.decorator.js';
import type { AuthenticatedRequestUser } from '../auth/auth.types.js';
import { CreateIncidentDto } from './dto/create-incident.dto.js';
import { UpdateIncidentDto } from './dto/update-incident.dto.js';
import { IncidentsService } from './incidents.service.js';

@Controller('incidents')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @Get()
  @RequirePermissions('journal.read')
  findAll(@CurrentUser() user: AuthenticatedRequestUser, @Query('chantierId') chantierId?: string) {
    return this.incidentsService.findAll(user.companyId, user.id, chantierId);
  }

  @Post()
  @UseGuards(ChantierAccessGuard)
  @RequirePermissions('journal.create')
  create(@CurrentUser() user: AuthenticatedRequestUser, @Body() input: CreateIncidentDto) {
    return this.incidentsService.create(user.companyId, user.id, input);
  }

  @Patch(':id')
  @RequirePermissions('journal.update')
  update(@CurrentUser() user: AuthenticatedRequestUser, @Param('id') incidentId: string, @Body() input: UpdateIncidentDto) {
    return this.incidentsService.update(user.companyId, user.id, incidentId, input);
  }
}
