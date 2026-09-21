var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { PermissionsGuard } from '../auth/permissions.guard.js';
import { RequirePermissions } from '../auth/permissions.decorator.js';
import { AssignProjectMemberDto } from './dto/assign-project-member.dto.js';
import { ProjectMembersService } from './project-members.service.js';
let ProjectMembersController = class ProjectMembersController {
    projectMembersService;
    constructor(projectMembersService) {
        this.projectMembersService = projectMembersService;
    }
    findAll(user) {
        return this.projectMembersService.findAll(user.companyId);
    }
    assign(user, input) {
        return this.projectMembersService.assign(user.companyId, input);
    }
    remove(user, userId, chantierId) {
        return this.projectMembersService.remove(user.companyId, userId, chantierId);
    }
};
__decorate([
    Get(),
    RequirePermissions('project_member.manage'),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProjectMembersController.prototype, "findAll", null);
__decorate([
    Post(),
    RequirePermissions('project_member.manage'),
    __param(0, CurrentUser()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, AssignProjectMemberDto]),
    __metadata("design:returntype", void 0)
], ProjectMembersController.prototype, "assign", null);
__decorate([
    Delete(':userId/:chantierId'),
    RequirePermissions('project_member.manage'),
    __param(0, CurrentUser()),
    __param(1, Param('userId')),
    __param(2, Param('chantierId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], ProjectMembersController.prototype, "remove", null);
ProjectMembersController = __decorate([
    Controller('project-members'),
    UseGuards(JwtAuthGuard, PermissionsGuard),
    __metadata("design:paramtypes", [ProjectMembersService])
], ProjectMembersController);
export { ProjectMembersController };
//# sourceMappingURL=project-members.controller.js.map