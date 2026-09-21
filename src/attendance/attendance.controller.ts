import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ChantierAccessGuard } from '../auth/chantier-access.guard.js';
import { CurrentUser } from '../auth/current-user.decorator.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { PermissionsGuard } from '../auth/permissions.guard.js';
import { RequirePermissions } from '../auth/permissions.decorator.js';
import type { AuthenticatedRequestUser } from '../auth/auth.types.js';
import { CreateAttendanceDto } from './dto/create-attendance.dto.js';
import { AttendanceService } from './attendance.service.js';

@Controller('attendance')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get()
  @RequirePermissions('chantier.read')
  findAll(@CurrentUser() user: AuthenticatedRequestUser, @Query('chantierId') chantierId?: string) {
    return this.attendanceService.findAll(user.companyId, user.id, chantierId);
  }

  @Get('summary/:chantierId')
  @UseGuards(ChantierAccessGuard)
  @RequirePermissions('chantier.read')
  summary(@CurrentUser() user: AuthenticatedRequestUser, @Param('chantierId') chantierId: string, @Query('from') from?: string, @Query('to') to?: string) {
    return this.attendanceService.summary(user.companyId, user.id, chantierId, from, to);
  }

  @Post()
  @UseGuards(ChantierAccessGuard)
  @RequirePermissions('journal.create')
  record(@CurrentUser() user: AuthenticatedRequestUser, @Body() input: CreateAttendanceDto) {
    return this.attendanceService.record(user.companyId, user.id, input);
  }
}
