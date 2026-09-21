import { ChantierStatus, ExpenseStatus, MaterialMovementType, Prisma } from '@prisma/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DashboardService } from './dashboard.service.js';

const companyId = '11111111-1111-4111-8111-111111111111';
const userId = '22222222-2222-4222-8222-222222222222';
const chantierId = '33333333-3333-4333-8333-333333333333';
const materialId = '44444444-4444-4444-8444-444444444444';

describe('DashboardService', () => {
  const chantierFindMany = vi.fn();
  const expenseFindMany = vi.fn();
  const movementFindMany = vi.fn();
  let service: DashboardService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new DashboardService({
      chantier: { findMany: chantierFindMany },
      expense: { findMany: expenseFindMany },
      materialMovement: { findMany: movementFindMany },
    } as never);
  });

  it('returns an empty tenant dashboard when no chantier is assigned', async () => {
    chantierFindMany.mockResolvedValue([]);

    const result = await service.getOverview(companyId, userId);

    expect(result.summary.totalChantiers).toBe(0);
    expect(result.alerts).toEqual([]);
    expect(expenseFindMany).not.toHaveBeenCalled();
  });

  it('computes budget, delay and stock alerts for assigned chantiers', async () => {
    chantierFindMany.mockResolvedValue([{
      id: chantierId,
      name: 'École Tokpa',
      budget: new Prisma.Decimal(1000),
      progress: new Prisma.Decimal(40),
      status: ChantierStatus.EN_COURS,
      endDate: new Date('2020-01-01'),
    }]);
    expenseFindMany.mockResolvedValue([{ chantierId, amount: new Prisma.Decimal(600) }]);
    movementFindMany.mockResolvedValue([
      {
        chantierId,
        materialId,
        type: MaterialMovementType.ENTREE,
        quantity: new Prisma.Decimal(5),
        material: { id: materialId, name: 'Ciment', unit: 'sac', minimumStock: new Prisma.Decimal(20) },
      },
    ]);

    const result = await service.getOverview(companyId, userId);

    expect(result.summary.totalChantiers).toBe(1);
    expect(result.summary.validatedExpenses.equals(600)).toBe(true);
    expect(result.summary.averageProgress.equals(40)).toBe(true);
    expect(result.summary.alertCount).toBe(3);
    expect(result.alerts.map((alert) => alert.type)).toEqual(['BUDGET', 'RETARD', 'STOCK']);
    expect(result.projects[0].remainingBudget.equals(400)).toBe(true);
    expect(expenseFindMany).toHaveBeenCalledWith(expect.objectContaining({
      where: { companyId, chantierId: { in: [chantierId] }, status: ExpenseStatus.VALIDEE },
    }));
  });
});
