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
import { CreateExpenseDto } from './dto/create-expense.dto.js';
import { UpdateExpenseDto } from './dto/update-expense.dto.js';
import { ValidateExpenseDto } from './dto/validate-expense.dto.js';
import { ExpensesService } from './expenses.service.js';
let ExpensesController = class ExpensesController {
    expensesService;
    constructor(expensesService) {
        this.expensesService = expensesService;
    }
    findAll(user, chantierId) {
        return this.expensesService.findAll(user.companyId, user.id, chantierId);
    }
    getBudget(user, chantierId) {
        return this.expensesService.getBudget(user.companyId, user.id, chantierId);
    }
    create(user, input) {
        return this.expensesService.create(user.companyId, user.id, input);
    }
    update(user, expenseId, input) {
        return this.expensesService.update(user.companyId, user.id, expenseId, input);
    }
    submit(user, expenseId) {
        return this.expensesService.submit(user.companyId, user.id, expenseId);
    }
    validate(user, expenseId, input) {
        return this.expensesService.validate(user.companyId, user.id, expenseId, input);
    }
};
__decorate([
    Get(),
    RequirePermissions('expense.read'),
    __param(0, CurrentUser()),
    __param(1, Query('chantierId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ExpensesController.prototype, "findAll", null);
__decorate([
    Get('budget/:chantierId'),
    UseGuards(ChantierAccessGuard),
    RequirePermissions('expense.read'),
    __param(0, CurrentUser()),
    __param(1, Param('chantierId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ExpensesController.prototype, "getBudget", null);
__decorate([
    Post(),
    UseGuards(ChantierAccessGuard),
    RequirePermissions('expense.create'),
    __param(0, CurrentUser()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateExpenseDto]),
    __metadata("design:returntype", void 0)
], ExpensesController.prototype, "create", null);
__decorate([
    Patch(':id'),
    RequirePermissions('expense.update'),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, UpdateExpenseDto]),
    __metadata("design:returntype", void 0)
], ExpensesController.prototype, "update", null);
__decorate([
    Post(':id/submit'),
    RequirePermissions('expense.update'),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ExpensesController.prototype, "submit", null);
__decorate([
    Post(':id/validate'),
    RequirePermissions('expense.validate'),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, ValidateExpenseDto]),
    __metadata("design:returntype", void 0)
], ExpensesController.prototype, "validate", null);
ExpensesController = __decorate([
    Controller('expenses'),
    UseGuards(JwtAuthGuard, PermissionsGuard),
    __metadata("design:paramtypes", [ExpensesService])
], ExpensesController);
export { ExpensesController };
//# sourceMappingURL=expenses.controller.js.map