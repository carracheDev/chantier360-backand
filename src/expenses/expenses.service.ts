import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ExpenseStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateExpenseDto } from './dto/create-expense.dto.js';
import { UpdateExpenseDto } from './dto/update-expense.dto.js';
import { ValidateExpenseDto } from './dto/validate-expense.dto.js';

const expenseSelect = {
  id: true,
  companyId: true,
  chantierId: true,
  userId: true,
  category: true,
  amount: true,
  description: true,
  status: true,
  date: true,
  receiptUrl: true,
  createdAt: true,
  updatedAt: true,
  user: { select: { id: true, name: true, email: true } },
} satisfies Prisma.ExpenseSelect;

@Injectable()
export class ExpensesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(companyId: string, userId: string, chantierId?: string) {
    return this.prisma.expense.findMany({
      where: {
        companyId,
        chantierId,
        chantier: { projectMembers: { some: { companyId, userId } } },
      },
      orderBy: { date: 'desc' },
      select: expenseSelect,
    });
  }

  async create(companyId: string, userId: string, input: CreateExpenseDto) {
    await this.assertChantierMembership(companyId, userId, input.chantierId);

    return this.prisma.expense.create({
      data: {
        companyId,
        chantierId: input.chantierId,
        userId,
        category: input.category.trim(),
        amount: input.amount.toString(),
        description: input.description?.trim(),
        date: new Date(input.date),
        receiptUrl: input.receiptUrl?.trim(),
      },
      select: expenseSelect,
    });
  }

  async update(companyId: string, userId: string, expenseId: string, input: UpdateExpenseDto) {
    const expense = await this.findAccessibleExpense(companyId, userId, expenseId);
    if (expense.status !== ExpenseStatus.BROUILLON) {
      throw new BadRequestException('Seule une dépense brouillon peut être modifiée.');
    }

    return this.prisma.expense.update({
      where: { id: expenseId },
      data: {
        category: input.category?.trim(),
        amount: input.amount === undefined ? undefined : input.amount.toString(),
        description: input.description?.trim(),
        date: input.date ? new Date(input.date) : undefined,
        receiptUrl: input.receiptUrl?.trim(),
      },
      select: expenseSelect,
    });
  }

  async submit(companyId: string, userId: string, expenseId: string) {
    await this.findAccessibleExpense(companyId, userId, expenseId);
    const updated = await this.prisma.expense.updateMany({
      where: { id: expenseId, companyId, status: ExpenseStatus.BROUILLON },
      data: { status: ExpenseStatus.SOUMISE },
    });
    if (updated.count === 0) throw new BadRequestException('La dépense ne peut pas être soumise dans son état actuel.');
    return this.prisma.expense.findFirst({ where: { id: expenseId, companyId }, select: expenseSelect });
  }

  async validate(companyId: string, userId: string, expenseId: string, input: ValidateExpenseDto) {
    await this.findAccessibleExpense(companyId, userId, expenseId);
    if (input.status !== ExpenseStatus.VALIDEE && input.status !== ExpenseStatus.REJETEE) {
      throw new BadRequestException('Le statut de validation doit être VALIDEE ou REJETEE.');
    }

    const updated = await this.prisma.expense.updateMany({
      where: { id: expenseId, companyId, status: ExpenseStatus.SOUMISE },
      data: { status: input.status },
    });
    if (updated.count === 0) throw new BadRequestException('La dépense ne peut pas être validée dans son état actuel.');
    return this.prisma.expense.findFirst({ where: { id: expenseId, companyId }, select: expenseSelect });
  }

  async getBudget(companyId: string, userId: string, chantierId: string) {
    await this.assertChantierMembership(companyId, userId, chantierId);
    const [chantier, validated] = await Promise.all([
      this.prisma.chantier.findFirst({ where: { id: chantierId, companyId }, select: { id: true, budget: true, progress: true } }),
      this.prisma.expense.aggregate({ where: { companyId, chantierId, status: ExpenseStatus.VALIDEE }, _sum: { amount: true } }),
    ]);
    if (!chantier) throw new NotFoundException('Chantier introuvable.');

    const budget = new Prisma.Decimal(chantier.budget);
    const spent = new Prisma.Decimal(validated._sum.amount ?? 0);
    const consumedPercent = budget.isZero() ? new Prisma.Decimal(0) : spent.div(budget).mul(100);
    return {
      budget,
      validatedExpenses: spent,
      remainingBudget: budget.minus(spent),
      consumedPercent,
      progress: chantier.progress,
      variance: consumedPercent.minus(chantier.progress),
    };
  }

  private async assertChantierMembership(companyId: string, userId: string, chantierId: string) {
    const membership = await this.prisma.projectMember.findFirst({
      where: { companyId, userId, chantierId, chantier: { companyId } },
      select: { userId: true },
    });
    if (!membership) throw new NotFoundException('Chantier ou affectation introuvable.');
  }

  private async findAccessibleExpense(companyId: string, userId: string, expenseId: string) {
    const expense = await this.prisma.expense.findFirst({
      where: {
        id: expenseId,
        companyId,
        chantier: { companyId, projectMembers: { some: { companyId, userId } } },
      },
      select: { id: true, status: true },
    });
    if (!expense) throw new NotFoundException('Dépense introuvable ou inaccessible.');
    return expense;
  }
}
