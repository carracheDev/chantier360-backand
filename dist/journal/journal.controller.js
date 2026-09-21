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
import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ChantierAccessGuard } from '../auth/chantier-access.guard.js';
import { CurrentUser } from '../auth/current-user.decorator.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { PermissionsGuard } from '../auth/permissions.guard.js';
import { RequirePermissions } from '../auth/permissions.decorator.js';
import { CreateJournalEntryDto } from './dto/create-journal-entry.dto.js';
import { CreatePhotoDto } from './dto/create-photo.dto.js';
import { UpdateJournalEntryDto } from './dto/update-journal-entry.dto.js';
import { JournalService } from './journal.service.js';
let JournalController = class JournalController {
    journalService;
    constructor(journalService) {
        this.journalService = journalService;
    }
    findAll(user, chantierId) {
        return this.journalService.findAll(user.companyId, user.id, chantierId);
    }
    findOne(user, journalId) {
        return this.journalService.findOne(user.companyId, user.id, journalId);
    }
    findPhotos(user, journalId) {
        return this.journalService.findPhotos(user.companyId, user.id, journalId);
    }
    create(user, input) {
        return this.journalService.create(user.companyId, user.id, input);
    }
    update(user, journalId, input) {
        return this.journalService.update(user.companyId, user.id, journalId, input);
    }
    submit(user, journalId) {
        return this.journalService.submit(user.companyId, user.id, journalId);
    }
    validate(user, journalId) {
        return this.journalService.validate(user.companyId, user.id, journalId);
    }
    addPhoto(user, journalId, input) {
        return this.journalService.addPhoto(user.companyId, user.id, journalId, input);
    }
};
__decorate([
    Get(),
    RequirePermissions('journal.read'),
    __param(0, CurrentUser()),
    __param(1, Query('chantierId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], JournalController.prototype, "findAll", null);
__decorate([
    Get(':id'),
    RequirePermissions('journal.read'),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], JournalController.prototype, "findOne", null);
__decorate([
    Get(':id/photos'),
    RequirePermissions('journal.read'),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], JournalController.prototype, "findPhotos", null);
__decorate([
    Post(),
    UseGuards(ChantierAccessGuard),
    RequirePermissions('journal.create'),
    __param(0, CurrentUser()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateJournalEntryDto]),
    __metadata("design:returntype", void 0)
], JournalController.prototype, "create", null);
__decorate([
    Patch(':id'),
    RequirePermissions('journal.update'),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, UpdateJournalEntryDto]),
    __metadata("design:returntype", void 0)
], JournalController.prototype, "update", null);
__decorate([
    Post(':id/submit'),
    RequirePermissions('journal.update'),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], JournalController.prototype, "submit", null);
__decorate([
    Post(':id/validate'),
    RequirePermissions('journal.validate'),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], JournalController.prototype, "validate", null);
__decorate([
    Post(':id/photos'),
    RequirePermissions('journal.update'),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, CreatePhotoDto]),
    __metadata("design:returntype", void 0)
], JournalController.prototype, "addPhoto", null);
JournalController = __decorate([
    Controller('journal'),
    UseGuards(JwtAuthGuard, PermissionsGuard),
    __metadata("design:paramtypes", [JournalService])
], JournalController);
export { JournalController };
//# sourceMappingURL=journal.controller.js.map