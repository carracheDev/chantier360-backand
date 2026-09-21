import { NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { WorkersService } from './workers.service.js';

const companyId = '11111111-1111-4111-8111-111111111111';
const userId = '22222222-2222-4222-8222-222222222222';
const chantierId = '33333333-3333-4333-8333-333333333333';

describe('WorkersService', () => {
  const membershipFindFirst = vi.fn();
  const workerFindMany = vi.fn();
  const workerCreate = vi.fn();
  let service: WorkersService;

  beforeEach(() => {
    vi.clearAllMocks();
    membershipFindFirst.mockResolvedValue({ userId });
    workerCreate.mockResolvedValue({ id: 'worker-id' });
    service = new WorkersService({
      projectMember: { findFirst: membershipFindFirst },
      worker: { findMany: workerFindMany, create: workerCreate },
    } as never);
  });

  it('lists workers only from assigned chantiers', async () => {
    workerFindMany.mockResolvedValue([]);

    await service.findAll(companyId, userId, chantierId);

    expect(workerFindMany).toHaveBeenCalledWith(expect.objectContaining({
      where: { companyId, chantierId, chantier: { projectMembers: { some: { companyId, userId } } } },
    }));
  });

  it('creates a worker with a decimal daily rate', async () => {
    await service.create(companyId, userId, {
      chantierId,
      name: 'Jean',
      function: 'Maçon',
      dailyRate: 12000.5,
    });

    expect(workerCreate).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ companyId, chantierId, dailyRate: '12000.5' }),
    }));
  });

  it('rejects workers on unassigned chantiers', async () => {
    membershipFindFirst.mockResolvedValue(null);

    await expect(service.create(companyId, userId, {
      chantierId,
      name: 'Jean',
      function: 'Maçon',
    })).rejects.toBeInstanceOf(NotFoundException);
    expect(workerCreate).not.toHaveBeenCalled();
  });
});
