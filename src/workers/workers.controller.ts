import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ChantierAccessGuard } from '../auth/chantier-access.guard.js';
import { CurrentUser } from '../auth/current-user.decorator.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { PermissionsGuard } from '../auth/permissions.guard.js';
import { RequirePermissions } from '../auth/permissions.decorator.js';
import type { AuthenticatedRequestUser } from '../auth/auth.types.js';
import { CreateWorkerDto } from './dto/create-worker.dto.js';
import { WorkersService } from './workers.service.js';

@Controller('workers')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class WorkersController {
  constructor(private readonly workersService: WorkersService) {}

  @Get()
  @RequirePermissions('chantier.read')
  findAll(@CurrentUser() user: AuthenticatedRequestUser, @Query('chantierId') chantierId?: string) {
    return this.workersService.findAll(user.companyId, user.id, chantierId);
  }

  @Post()
  @UseGuards(ChantierAccessGuard)
  @RequirePermissions('chantier.update')
  create(@CurrentUser() user: AuthenticatedRequestUser, @Body() input: CreateWorkerDto) {
    return this.workersService.create(user.companyId, user.id, input);
  }
}
