import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator.js';
import { ChantierAccessGuard } from '../auth/chantier-access.guard.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { PermissionsGuard } from '../auth/permissions.guard.js';
import { RequirePermissions } from '../auth/permissions.decorator.js';
import type { AuthenticatedRequestUser } from '../auth/auth.types.js';
import { CreateChantierDto } from './dto/create-chantier.dto.js';
import { UpdateChantierDto } from './dto/update-chantier.dto.js';
import { ChantiersService } from './chantiers.service.js';

@Controller('chantiers')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ChantiersController {
  constructor(private readonly chantiersService: ChantiersService) {}

  @Get()
  @RequirePermissions('chantier.read')
  findAll(@CurrentUser() user: AuthenticatedRequestUser) {
    return this.chantiersService.findAllForUser(user.companyId, user.id);
  }

  @Get(':id')
  @UseGuards(ChantierAccessGuard)
  @RequirePermissions('chantier.read')
  findOne(@CurrentUser() user: AuthenticatedRequestUser, @Param('id') chantierId: string) {
    return this.chantiersService.findOne(user.companyId, chantierId);
  }

  @Post()
  @RequirePermissions('chantier.create')
  create(@CurrentUser() user: AuthenticatedRequestUser, @Body() input: CreateChantierDto) {
    return this.chantiersService.create(user.companyId, user.id, input);
  }

  @Patch(':id')
  @UseGuards(ChantierAccessGuard)
  @RequirePermissions('chantier.update')
  update(
    @CurrentUser() user: AuthenticatedRequestUser,
    @Param('id') chantierId: string,
    @Body() input: UpdateChantierDto,
  ) {
    return this.chantiersService.update(user.companyId, chantierId, input);
  }
}
