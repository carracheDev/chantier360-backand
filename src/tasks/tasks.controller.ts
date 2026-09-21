import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ChantierAccessGuard } from '../auth/chantier-access.guard.js';
import { CurrentUser } from '../auth/current-user.decorator.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { PermissionsGuard } from '../auth/permissions.guard.js';
import { RequirePermissions } from '../auth/permissions.decorator.js';
import type { AuthenticatedRequestUser } from '../auth/auth.types.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { TasksService } from './tasks.service.js';

@Controller('tasks')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @RequirePermissions('chantier.read')
  findAll(@CurrentUser() user: AuthenticatedRequestUser, @Query('chantierId') chantierId?: string) {
    return this.tasksService.findAll(user.companyId, user.id, chantierId);
  }

  @Get('overdue')
  @RequirePermissions('chantier.read')
  findOverdue(@CurrentUser() user: AuthenticatedRequestUser) {
    return this.tasksService.findOverdue(user.companyId, user.id);
  }

  @Post()
  @UseGuards(ChantierAccessGuard)
  @RequirePermissions('chantier.update')
  create(@CurrentUser() user: AuthenticatedRequestUser, @Body() input: CreateTaskDto) {
    return this.tasksService.create(user.companyId, user.id, input);
  }

  @Patch(':id')
  @RequirePermissions('chantier.update')
  update(@CurrentUser() user: AuthenticatedRequestUser, @Param('id') taskId: string, @Body() input: UpdateTaskDto) {
    return this.tasksService.update(user.companyId, user.id, taskId, input);
  }
}
