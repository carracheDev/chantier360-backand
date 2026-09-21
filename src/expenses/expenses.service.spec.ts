import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ExpenseStatus, Prisma } from '@prisma/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ExpensesService } from './expenses.service.js';

const companyId = '11111111-1111-4111-8111-111111111111';
const userId = '22222222-2222-4222-8222-222222222222';
const otherUserId = '55555555-5555-4555-8555-555555555555';
const chantierId = '33333333-3333-4333-8333-333333333333';
const expenseId = '44444444-4444-4444-8444-444444444444';
const createInput = {
  chantierId,
  category: 'Matériaux',
  amount: 350000,
  description: 'Achat de ciment',
  date: '2026-09-18',
};

describe('ExpensesService', () => {
  const projectMemberFindFirst = vi.fn();
  const userRoleFindMany = vi.fn();
  const expenseFindMany = vi.fn();
  const expenseFindFirst = vi.fn();
  const expenseCreate = vi.fn();
  const expenseUpdate = vi.fn();
  const expenseUpdateMany = vi.fn();
  const expenseAggregate = vi.fn();
  const chantierFindFirst = vi.fn();
  const auditRecord = vi.fn();
  let service: ExpensesService;

  beforeEach(() => {
    vi.clearAllMocks();
    projectMemberFindFirst.mockResolvedValue({ userId });
    // Par défaut : aucun rôle particulier (pas d'exemption d'auto-validation).
    userRoleFindMany.mockResolvedValue([]);
    expenseCreate.mockResolvedValue({ id: expenseId, status: ExpenseStatus.BROUILLON });
    expenseUpdate.mockResolvedValue({ id: expenseId });
    expenseUpdateMany.mockResolvedValue({ count: 1 });
    // Dépense saisie par un autre utilisateur : l'arbitrage est donc autorisé.
    expenseFindFirst.mockResolvedValue({
      id: expenseId,
      status: ExpenseStatus.BROUILLON,
      userId: otherUserId,
      amount: new Prisma.Decimal(350000),
      chantierId,
    });
    chantierFindFirst.mockResolvedValue({ id: chantierId, budget: new Prisma.Decimal(1000), progress: new Prisma.Decimal(40) });
    expenseAggregate.mockResolvedValue({ _sum: { amount: new Prisma.Decimal(250) } });
    auditRecord.mockResolvedValue({ id: 'audit-id' });
    service = new ExpensesService({
      projectMember: { findFirst: projectMemberFindFirst },
      userRole: { findMany: userRoleFindMany },
      expense: {
        findMany: expenseFindMany,
        findFirst: expenseFindFirst,
        create: expenseCreate,
        update: expenseUpdate,
        updateMany: expenseUpdateMany,
        aggregate: expenseAggregate,
      },
      chantier: { findFirst: chantierFindFirst },
    } as never, { record: auditRecord } as never);
  });

  it('creates a draft expense only for an assigned chantier', async () => {
    await service.create(companyId, userId, createInput);

    expect(expenseCreate).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ companyId, chantierId, userId, amount: '350000' }),
    }));
  });

  it('rejects an expense for an inaccessible chantier', async () => {
    projectMemberFindFirst.mockResolvedValue(null);

    await expect(service.create(companyId, userId, createInput)).rejects.toBeInstanceOf(NotFoundException);
    expect(expenseCreate).not.toHaveBeenCalled();
  });

  it('prevents editing a submitted expense', async () => {
    expenseFindFirst.mockResolvedValue({ id: expenseId, status: ExpenseStatus.SOUMISE });

    await expect(service.update(companyId, userId, expenseId, { amount: 400000 }))
      .rejects.toBeInstanceOf(BadRequestException);
    expect(expenseUpdate).not.toHaveBeenCalled();
  });

  it('submits a draft and validates only submitted expenses', async () => {
    await service.submit(companyId, userId, expenseId);
    expect(expenseUpdateMany).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: expenseId, companyId, status: ExpenseStatus.BROUILLON },
      data: { status: ExpenseStatus.SOUMISE },
    }));
    expect(auditRecord).toHaveBeenCalledWith(expect.objectContaining({ action: 'EXPENSE_SUBMITTED', userId, entityId: expenseId }));

    expenseFindFirst.mockResolvedValue({
      id: expenseId,
      status: ExpenseStatus.SOUMISE,
      userId: otherUserId,
      amount: new Prisma.Decimal(350000),
      chantierId,
    });
    await service.validate(companyId, userId, expenseId, { status: ExpenseStatus.VALIDEE });
    expect(expenseUpdateMany).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: expenseId, companyId, status: ExpenseStatus.SOUMISE },
      data: { status: ExpenseStatus.VALIDEE },
    }));
  });

  it('rejects invalid validation statuses', async () => {
    expenseFindFirst.mockResolvedValue({ id: expenseId, status: ExpenseStatus.SOUMISE });

    await expect(service.validate(companyId, userId, expenseId, { status: ExpenseStatus.BROUILLON }))
      .rejects.toBeInstanceOf(BadRequestException);
  });

  it('interdit à l’auteur de valider sa propre dépense (séparation des tâches)', async () => {
    expenseFindFirst.mockResolvedValue({
      id: expenseId,
      status: ExpenseStatus.SOUMISE,
      userId,
      amount: new Prisma.Decimal(350000),
      chantierId,
    });

    await expect(service.validate(companyId, userId, expenseId, { status: ExpenseStatus.VALIDEE }))
      .rejects.toThrow('Séparation des tâches');
    expect(expenseUpdateMany).not.toHaveBeenCalled();
    expect(auditRecord).not.toHaveBeenCalled();
  });

  it('autorise l’auteur à retirer sa propre saisie en la rejetant', async () => {
    expenseFindFirst.mockResolvedValue({
      id: expenseId,
      status: ExpenseStatus.SOUMISE,
      userId,
      amount: new Prisma.Decimal(350000),
      chantierId,
    });

    await service.validate(companyId, userId, expenseId, { status: ExpenseStatus.REJETEE });

    expect(expenseUpdateMany).toHaveBeenCalledWith(expect.objectContaining({ data: { status: ExpenseStatus.REJETEE } }));
    expect(auditRecord).toHaveBeenCalledWith(expect.objectContaining({ action: 'EXPENSE_REJECTED', userId, entityId: expenseId }));
    expect(userRoleFindMany).not.toHaveBeenCalled();
  });

  it('autorise le rôle d’arbitrage final à valider sa propre dépense et le trace', async () => {
    expenseFindFirst.mockResolvedValue({
      id: expenseId,
      status: ExpenseStatus.SOUMISE,
      userId,
      amount: new Prisma.Decimal(10000000),
      chantierId,
    });
    userRoleFindMany.mockResolvedValue([{ role: { name: 'DIRECTEUR' } }]);

    await service.validate(companyId, userId, expenseId, { status: ExpenseStatus.VALIDEE });

    expect(expenseUpdateMany).toHaveBeenCalledWith(expect.objectContaining({ data: { status: ExpenseStatus.VALIDEE } }));
    expect(auditRecord).toHaveBeenCalledWith(expect.objectContaining({
      action: 'EXPENSE_SELF_VALIDATED',
      userId,
      entityType: 'Expense',
      entityId: expenseId,
      metadata: expect.objectContaining({ selfValidated: true, to: ExpenseStatus.VALIDEE }),
    }));
  });

  it('journalise le validateur d’une dépense saisie par un autre', async () => {
    expenseFindFirst.mockResolvedValue({
      id: expenseId,
      status: ExpenseStatus.SOUMISE,
      userId: otherUserId,
      amount: new Prisma.Decimal(350000),
      chantierId,
    });

    await service.validate(companyId, userId, expenseId, { status: ExpenseStatus.VALIDEE });

    expect(auditRecord).toHaveBeenCalledWith(expect.objectContaining({
      action: 'EXPENSE_VALIDATED',
      userId,
      metadata: expect.objectContaining({ to: ExpenseStatus.VALIDEE, selfValidated: false }),
    }));
  });

  it('explique pourquoi une dépense déjà validée ne peut plus être arbitrée', async () => {
    expenseFindFirst.mockResolvedValue({
      id: expenseId,
      status: ExpenseStatus.VALIDEE,
      userId: otherUserId,
      amount: new Prisma.Decimal(350000),
      chantierId,
    });

    await expect(service.validate(companyId, userId, expenseId, { status: ExpenseStatus.VALIDEE }))
      .rejects.toThrow('déjà été validée');
    expect(expenseUpdateMany).not.toHaveBeenCalled();
  });

  it('calculates budget from validated expenses only', async () => {
    const result = await service.getBudget(companyId, userId, chantierId);

    expect(result.budget.equals(1000)).toBe(true);
    expect(result.validatedExpenses.equals(250)).toBe(true);
    expect(result.remainingBudget.equals(750)).toBe(true);
    expect(result.consumedPercent.equals(25)).toBe(true);
    expect(result.variance.equals(-15)).toBe(true);
    expect(expenseAggregate).toHaveBeenCalledWith({
      where: { companyId, chantierId, status: ExpenseStatus.VALIDEE },
      _sum: { amount: true },
    });
  });
});
