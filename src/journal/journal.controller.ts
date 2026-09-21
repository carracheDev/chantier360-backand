import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ChantierAccessGuard } from '../auth/chantier-access.guard.js';
import { CurrentUser } from '../auth/current-user.decorator.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { PermissionsGuard } from '../auth/permissions.guard.js';
import { RequirePermissions } from '../auth/permissions.decorator.js';
import type { AuthenticatedRequestUser } from '../auth/auth.types.js';
import { CreateJournalEntryDto } from './dto/create-journal-entry.dto.js';
import { CreatePhotoDto } from './dto/create-photo.dto.js';
import { UpdateJournalEntryDto } from './dto/update-journal-entry.dto.js';
import { JournalService } from './journal.service.js';

@Controller('journal')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class JournalController {
  constructor(private readonly journalService: JournalService) {}

  @Get()
  @RequirePermissions('journal.read')
  findAll(@CurrentUser() user: AuthenticatedRequestUser, @Query('chantierId') chantierId?: string) {
    return this.journalService.findAll(user.companyId, user.id, chantierId);
  }

  @Get(':id')
  @RequirePermissions('journal.read')
  findOne(@CurrentUser() user: AuthenticatedRequestUser, @Param('id') journalId: string) {
    return this.journalService.findOne(user.companyId, user.id, journalId);
  }

  @Get(':id/photos')
  @RequirePermissions('journal.read')
  findPhotos(@CurrentUser() user: AuthenticatedRequestUser, @Param('id') journalId: string) {
    return this.journalService.findPhotos(user.companyId, user.id, journalId);
  }

  @Post()
  @UseGuards(ChantierAccessGuard)
  @RequirePermissions('journal.create')
  create(@CurrentUser() user: AuthenticatedRequestUser, @Body() input: CreateJournalEntryDto) {
    return this.journalService.create(user.companyId, user.id, input);
  }

  @Patch(':id')
  @RequirePermissions('journal.update')
  update(@CurrentUser() user: AuthenticatedRequestUser, @Param('id') journalId: string, @Body() input: UpdateJournalEntryDto) {
    return this.journalService.update(user.companyId, user.id, journalId, input);
  }

  @Post(':id/submit')
  @RequirePermissions('journal.update')
  submit(@CurrentUser() user: AuthenticatedRequestUser, @Param('id') journalId: string) {
    return this.journalService.submit(user.companyId, user.id, journalId);
  }

  @Post(':id/validate')
  @RequirePermissions('journal.validate')
  validate(@CurrentUser() user: AuthenticatedRequestUser, @Param('id') journalId: string) {
    return this.journalService.validate(user.companyId, user.id, journalId);
  }

  @Post(':id/photos')
  @RequirePermissions('journal.update')
  addPhoto(@CurrentUser() user: AuthenticatedRequestUser, @Param('id') journalId: string, @Body() input: CreatePhotoDto) {
    return this.journalService.addPhoto(user.companyId, user.id, journalId, input);
  }
}
