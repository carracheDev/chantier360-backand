import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ChantierAccessGuard } from '../auth/chantier-access.guard.js';
import { CurrentUser } from '../auth/current-user.decorator.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { PermissionsGuard } from '../auth/permissions.guard.js';
import { RequirePermissions } from '../auth/permissions.decorator.js';
import type { AuthenticatedRequestUser } from '../auth/auth.types.js';
import { RegisterFileDto } from './dto/register-file.dto.js';
import { FilesService } from './files.service.js';

@Controller('files')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get()
  @RequirePermissions('journal.read')
  findAll(@CurrentUser() user: AuthenticatedRequestUser, @Query('chantierId') chantierId?: string) {
    return this.filesService.findAll(user.companyId, user.id, chantierId);
  }

  @Post()
  @UseGuards(ChantierAccessGuard)
  @RequirePermissions('journal.update')
  register(@CurrentUser() user: AuthenticatedRequestUser, @Body() input: RegisterFileDto) {
    return this.filesService.register(user.companyId, user.id, input);
  }
}
