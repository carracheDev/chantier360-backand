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
import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator.js';
import { ChantierAccessGuard } from '../auth/chantier-access.guard.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { PermissionsGuard } from '../auth/permissions.guard.js';
import { RequirePermissions } from '../auth/permissions.decorator.js';
import { CreateChantierDto } from './dto/create-chantier.dto.js';
import { UpdateChantierDto } from './dto/update-chantier.dto.js';
import { ChantiersService } from './chantiers.service.js';
let ChantiersController = class ChantiersController {
    chantiersService;
    constructor(chantiersService) {
        this.chantiersService = chantiersService;
    }
    findAll(user) {
        return this.chantiersService.findAllForUser(user.companyId, user.id);
    }
    findOne(user, chantierId) {
        return this.chantiersService.findOne(user.companyId, chantierId);
    }
    create(user, input) {
        return this.chantiersService.create(user.companyId, user.id, input);
    }
    update(user, chantierId, input) {
        return this.chantiersService.update(user.companyId, chantierId, input);
    }
};
__decorate([
    Get(),
    RequirePermissions('chantier.read'),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ChantiersController.prototype, "findAll", null);
__decorate([
    Get(':id'),
    UseGuards(ChantierAccessGuard),
    RequirePermissions('chantier.read'),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ChantiersController.prototype, "findOne", null);
__decorate([
    Post(),
    RequirePermissions('chantier.create'),
    __param(0, CurrentUser()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateChantierDto]),
    __metadata("design:returntype", void 0)
], ChantiersController.prototype, "create", null);
__decorate([
    Patch(':id'),
    UseGuards(ChantierAccessGuard),
    RequirePermissions('chantier.update'),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, UpdateChantierDto]),
    __metadata("design:returntype", void 0)
], ChantiersController.prototype, "update", null);
ChantiersController = __decorate([
    Controller('chantiers'),
    UseGuards(JwtAuthGuard, PermissionsGuard),
    __metadata("design:paramtypes", [ChantiersService])
], ChantiersController);
export { ChantiersController };
//# sourceMappingURL=chantiers.controller.js.map