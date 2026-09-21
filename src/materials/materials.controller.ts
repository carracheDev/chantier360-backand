import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { PermissionsGuard } from '../auth/permissions.guard.js';
import { RequirePermissions } from '../auth/permissions.decorator.js';
import type { AuthenticatedRequestUser } from '../auth/auth.types.js';
import { CreateMaterialDto } from './dto/create-material.dto.js';
import { MaterialsService } from './materials.service.js';

@Controller('materials')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class MaterialsController {
  constructor(private readonly materialsService: MaterialsService) {}

  @Get()
  @RequirePermissions('material.read')
  findAll(@CurrentUser() user: AuthenticatedRequestUser) {
    return this.materialsService.findAll(user.companyId);
  }

  @Post()
  @RequirePermissions('material.create')
  create(@CurrentUser() user: AuthenticatedRequestUser, @Body() input: CreateMaterialDto) {
    return this.materialsService.create(user.companyId, input);
  }
}
