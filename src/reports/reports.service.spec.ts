import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ExpenseStatus, ReportType, Prisma } from '@prisma/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ReportsService } from './reports.service.js';

const companyId = '11111111-1111-4111-8111-111111111111';
const userId = '22222222-2222-4222-8222-222222222222';
const chantierId = '33333333-3333-4333-8333-333333333333';

const input = {
  chantierId,
  type: ReportType.HEBDOMADAIRE,
  periodStart: '2026-09-14',
  periodEnd: '2026-09-20',
};

describe('ReportsService', () => {
  const membershipFindFirst = vi.fn();
  const chantierFindFirst = vi.fn();
  const expenseFindMany = vi.fn();
  const movementFindMany = vi.fn();
  const journalFindMany = vi.fn();
  const attendanceFindMany = vi.fn();
  const incidentFindMany = vi.fn();
  const reportCreate = vi.fn();
  let service: ReportsService;

  beforeEach(() => {
    vi.clearAllMocks();
    membershipFindFirst.mockResolvedValue({ userId });
    chantierFindFirst.mockResolvedValue({ id: chantierId, name: 'École Tokpa', budget: new Prisma.Decimal(1000), progress: new Prisma.Decimal(50), status: 'EN_COURS' });
    expenseFindMany.mockResolvedValue([{ id: 'expense-id', amount: new Prisma.Decimal(250) }]);
    movementFindMany.mockResolvedValue([]);
    journalFindMany.mockResolvedValue([]);
    attendanceFindMany.mockResolvedValue([]);
    incidentFindMany.mockResolvedValue([]);
    reportCreate.mockResolvedValue({ id: 'report-id', type: input.type, fileUrl: null });
    service = new ReportsService({
      projectMember: { findFirst: membershipFindFirst },
      chantier: { findFirst: chantierFindFirst },
      expense: { findMany: expenseFindMany },
      materialMovement: { findMany: movementFindMany },
      journalEntry: { findMany: journalFindMany },
      attendance: { findMany: attendanceFindMany },
      incident: { findMany: incidentFindMany },
      report: { create: reportCreate },
    } as never);
  });

  it('rejects an inverted report period', async () => {
    await expect(service.generate(companyId, userId, { ...input, periodEnd: '2026-09-01' }))
      .rejects.toBeInstanceOf(BadRequestException);
    expect(reportCreate).not.toHaveBeenCalled();
  });

  it('rejects reports for a chantier not assigned to the user', async () => {
    membershipFindFirst.mockResolvedValue(null);

    await expect(service.generate(companyId, userId, input)).rejects.toBeInstanceOf(NotFoundException);
    expect(reportCreate).not.toHaveBeenCalled();
  });

  it('collects period data and persists report metadata', async () => {
    const result = await service.generate(companyId, userId, input);

    expect(reportCreate).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ companyId, chantierId, userId, type: ReportType.HEBDOMADAIRE }),
    }));
    expect(result.data.totalValidatedExpenses.equals(250)).toBe(true);
    expect(result.data.export).toEqual({ format: 'PDF', status: 'PENDING', fileUrl: null });
    expect(expenseFindMany).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({ companyId, chantierId, status: ExpenseStatus.VALIDEE }),
    }));
  });
});
