import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ChantierAccessGuard } from '../auth/chantier-access.guard.js';
import { CurrentUser } from '../auth/current-user.decorator.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { PermissionsGuard } from '../auth/permissions.guard.js';
import { RequirePermissions } from '../auth/permissions.decorator.js';
import type { AuthenticatedRequestUser } from '../auth/auth.types.js';
import { CreateMaterialMovementDto } from './dto/create-material-movement.dto.js';
import { MaterialMovementsService } from './material-movements.service.js';

@Controller('material-movements')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class MaterialMovementsController {
  constructor(private readonly movementsService: MaterialMovementsService) {}

  @Get()
  @RequirePermissions('material.read')
  findAll(
    @CurrentUser() user: AuthenticatedRequestUser,
    @Query('chantierId') chantierId?: string,
    @Query('materialId') materialId?: string,
  ) {
    return this.movementsService.findAll(user.companyId, user.id, chantierId, materialId);
  }

  @Get('stock/:chantierId/:materialId')
  @UseGuards(ChantierAccessGuard)
  @RequirePermissions('material.read')
  getStock(
    @CurrentUser() user: AuthenticatedRequestUser,
    @Param('chantierId') chantierId: string,
    @Param('materialId') materialId: string,
  ) {
    return this.movementsService.getStock(user.companyId, chantierId, materialId);
  }

  @Post()
  @UseGuards(ChantierAccessGuard)
  @RequirePermissions('material.create')
  create(@CurrentUser() user: AuthenticatedRequestUser, @Body() input: CreateMaterialMovementDto) {
    return this.movementsService.create(user.companyId, user.id, input);
  }
}
