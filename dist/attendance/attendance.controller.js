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
import { CreateAttendanceDto } from './dto/create-attendance.dto.js';
import { AttendanceService } from './attendance.service.js';
let AttendanceController = class AttendanceController {
    attendanceService;
    constructor(attendanceService) {
        this.attendanceService = attendanceService;
    }
    findAll(user, chantierId) {
        return this.attendanceService.findAll(user.companyId, user.id, chantierId);
    }
    summary(user, chantierId, from, to) {
        return this.attendanceService.summary(user.companyId, user.id, chantierId, from, to);
    }
    record(user, input) {
        return this.attendanceService.record(user.companyId, user.id, input);
    }
};
__decorate([
    Get(),
    RequirePermissions('chantier.read'),
    __param(0, CurrentUser()),
    __param(1, Query('chantierId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "findAll", null);
__decorate([
    Get('summary/:chantierId'),
    UseGuards(ChantierAccessGuard),
    RequirePermissions('chantier.read'),
    __param(0, CurrentUser()),
    __param(1, Param('chantierId')),
    __param(2, Query('from')),
    __param(3, Query('to')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "summary", null);
__decorate([
    Post(),
    UseGuards(ChantierAccessGuard),
    RequirePermissions('journal.create'),
    __param(0, CurrentUser()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateAttendanceDto]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "record", null);
AttendanceController = __decorate([
    Controller('attendance'),
    UseGuards(JwtAuthGuard, PermissionsGuard),
    __metadata("design:paramtypes", [AttendanceService])
], AttendanceController);
export { AttendanceController };
//# sourceMappingURL=attendance.controller.js.map