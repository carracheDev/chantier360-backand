import { BadRequestException, NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ChantiersService } from './chantiers.service.js';

const companyId = '11111111-1111-4111-8111-111111111111';
const userId = '22222222-2222-4222-8222-222222222222';
const chantierId = '33333333-3333-4333-8333-333333333333';
const input = {
  name: 'École Tokpa',
  budget: 125000000,
  progress: 15,
  startDate: '2026-09-18',
  endDate: '2026-12-31',
};

describe('ChantiersService', () => {
  const chantierFindMany = vi.fn();
  const chantierFindFirst = vi.fn();
  const chantierCreate = vi.fn();
  const chantierUpdate = vi.fn();
  const projectMemberCreate = vi.fn();
  const transaction = vi.fn();
  let service: ChantiersService;

  beforeEach(() => {
    vi.clearAllMocks();
    transaction.mockImplementation(async (callback: (client: unknown) => unknown) => callback({
      chantier: { create: chantierCreate },
      projectMember: { create: projectMemberCreate },
    }));
    service = new ChantiersService({
      chantier: { findMany: chantierFindMany, findFirst: chantierFindFirst, create: chantierCreate, update: chantierUpdate },
      $transaction: transaction,
    } as never);
  });

  it('lists only chantiers assigned to the current user and company', async () => {
    chantierFindMany.mockResolvedValue([]);

    await service.findAllForUser(companyId, userId);

    expect(chantierFindMany).toHaveBeenCalledWith(expect.objectContaining({
      where: { companyId, projectMembers: { some: { userId, companyId } } },
    }));
  });

  it('rejects a date range where the end precedes the start', async () => {
    await expect(service.create(companyId, userId, {
      ...input,
      endDate: '2026-09-01',
    })).rejects.toBeInstanceOf(BadRequestException);
    expect(transaction).not.toHaveBeenCalled();
  });

  it('creates a chantier and assigns its creator atomically', async () => {
    chantierCreate.mockResolvedValue({ id: chantierId, ...input });
    projectMemberCreate.mockResolvedValue({ userId, chantierId });

    await service.create(companyId, userId, input);

    expect(transaction).toHaveBeenCalledOnce();
    expect(chantierCreate).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ companyId, name: 'École Tokpa', budget: '125000000' }),
    }));
    expect(projectMemberCreate).toHaveBeenCalledWith({
      data: { companyId, userId, chantierId },
    });
  });

  it('does not update a chantier from another company', async () => {
    chantierFindFirst.mockResolvedValue(null);

    await expect(service.update(companyId, chantierId, { name: 'Autre nom' }))
      .rejects.toBeInstanceOf(NotFoundException);
    expect(chantierUpdate).not.toHaveBeenCalled();
  });
});
