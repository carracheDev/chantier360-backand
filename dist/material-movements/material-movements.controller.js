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
import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ChantierAccessGuard } from '../auth/chantier-access.guard.js';
import { CurrentUser } from '../auth/current-user.decorator.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { PermissionsGuard } from '../auth/permissions.guard.js';
import { RequirePermissions } from '../auth/permissions.decorator.js';
import { CreateMaterialMovementDto } from './dto/create-material-movement.dto.js';
import { MaterialMovementsService } from './material-movements.service.js';
let MaterialMovementsController = class MaterialMovementsController {
    movementsService;
    constructor(movementsService) {
        this.movementsService = movementsService;
    }
    findAll(user, chantierId, materialId) {
        return this.movementsService.findAll(user.companyId, user.id, chantierId, materialId);
    }
    getStock(user, chantierId, materialId) {
        return this.movementsService.getStock(user.companyId, chantierId, materialId);
    }
    create(user, input) {
        return this.movementsService.create(user.companyId, user.id, input);
    }
};
__decorate([
    Get(),
    RequirePermissions('material.read'),
    __param(0, CurrentUser()),
    __param(1, Query('chantierId')),
    __param(2, Query('materialId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], MaterialMovementsController.prototype, "findAll", null);
__decorate([
    Get('stock/:chantierId/:materialId'),
    UseGuards(ChantierAccessGuard),
    RequirePermissions('material.read'),
    __param(0, CurrentUser()),
    __param(1, Param('chantierId')),
    __param(2, Param('materialId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], MaterialMovementsController.prototype, "getStock", null);
__decorate([
    Post(),
    UseGuards(ChantierAccessGuard),
    RequirePermissions('material.create'),
    __param(0, CurrentUser()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateMaterialMovementDto]),
    __metadata("design:returntype", void 0)
], MaterialMovementsController.prototype, "create", null);
MaterialMovementsController = __decorate([
    Controller('material-movements'),
    UseGuards(JwtAuthGuard, PermissionsGuard),
    __metadata("design:paramtypes", [MaterialMovementsService])
], MaterialMovementsController);
export { MaterialMovementsController };
//# sourceMappingURL=material-movements.controller.js.map