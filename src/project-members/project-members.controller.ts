import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { PermissionsGuard } from '../auth/permissions.guard.js';
import { RequirePermissions } from '../auth/permissions.decorator.js';
import type { AuthenticatedRequestUser } from '../auth/auth.types.js';
import { AssignProjectMemberDto } from './dto/assign-project-member.dto.js';
import { ProjectMembersService } from './project-members.service.js';

@Controller('project-members')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProjectMembersController {
  constructor(private readonly projectMembersService: ProjectMembersService) {}

  @Get()
  @RequirePermissions('project_member.manage')
  findAll(@CurrentUser() user: AuthenticatedRequestUser) {
    return this.projectMembersService.findAll(user.companyId);
  }

  @Post()
  @RequirePermissions('project_member.manage')
  assign(@CurrentUser() user: AuthenticatedRequestUser, @Body() input: AssignProjectMemberDto) {
    return this.projectMembersService.assign(user.companyId, input);
  }

  @Delete(':userId/:chantierId')
  @RequirePermissions('project_member.manage')
  remove(
    @CurrentUser() user: AuthenticatedRequestUser,
    @Param('userId') userId: string,
    @Param('chantierId') chantierId: string,
  ) {
    return this.projectMembersService.remove(user.companyId, userId, chantierId);
  }
}
