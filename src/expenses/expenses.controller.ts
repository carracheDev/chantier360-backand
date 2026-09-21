import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ChantierAccessGuard } from '../auth/chantier-access.guard.js';
import { CurrentUser } from '../auth/current-user.decorator.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { PermissionsGuard } from '../auth/permissions.guard.js';
import { RequirePermissions } from '../auth/permissions.decorator.js';
import type { AuthenticatedRequestUser } from '../auth/auth.types.js';
import { CreateExpenseDto } from './dto/create-expense.dto.js';
import { UpdateExpenseDto } from './dto/update-expense.dto.js';
import { ValidateExpenseDto } from './dto/validate-expense.dto.js';
import { ExpensesService } from './expenses.service.js';

@Controller('expenses')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Get()
  @RequirePermissions('expense.read')
  findAll(@CurrentUser() user: AuthenticatedRequestUser, @Query('chantierId') chantierId?: string) {
    return this.expensesService.findAll(user.companyId, user.id, chantierId);
  }

  @Get('budget/:chantierId')
  @UseGuards(ChantierAccessGuard)
  @RequirePermissions('expense.read')
  getBudget(@CurrentUser() user: AuthenticatedRequestUser, @Param('chantierId') chantierId: string) {
    return this.expensesService.getBudget(user.companyId, user.id, chantierId);
  }

  @Post()
  @UseGuards(ChantierAccessGuard)
  @RequirePermissions('expense.create')
  create(@CurrentUser() user: AuthenticatedRequestUser, @Body() input: CreateExpenseDto) {
    return this.expensesService.create(user.companyId, user.id, input);
  }

  @Patch(':id')
  @RequirePermissions('expense.update')
  update(@CurrentUser() user: AuthenticatedRequestUser, @Param('id') expenseId: string, @Body() input: UpdateExpenseDto) {
    return this.expensesService.update(user.companyId, user.id, expenseId, input);
  }

  @Post(':id/submit')
  @RequirePermissions('expense.update')
  submit(@CurrentUser() user: AuthenticatedRequestUser, @Param('id') expenseId: string) {
    return this.expensesService.submit(user.companyId, user.id, expenseId);
  }

  @Post(':id/validate')
  @RequirePermissions('expense.validate')
  validate(@CurrentUser() user: AuthenticatedRequestUser, @Param('id') expenseId: string, @Body() input: ValidateExpenseDto) {
    return this.expensesService.validate(user.companyId, user.id, expenseId, input);
  }
}
