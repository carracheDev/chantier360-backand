import { BadRequestException, NotFoundException } from '@nestjs/common';
import { MaterialMovementType, Prisma } from '@prisma/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MaterialMovementsService } from './material-movements.service.js';

const companyId = '11111111-1111-4111-8111-111111111111';
const userId = '22222222-2222-4222-8222-222222222222';
const chantierId = '33333333-3333-4333-8333-333333333333';
const materialId = '44444444-4444-4444-8444-444444444444';

const movementInput = {
  companyId,
  userId,
  chantierId,
  materialId,
  type: MaterialMovementType.ENTREE,
  quantity: 100,
};

describe('MaterialMovementsService', () => {
  const materialFindFirst = vi.fn();
  const chantierFindFirst = vi.fn();
  const membershipFindFirst = vi.fn();
  const movementAggregate = vi.fn();
  const movementCreate = vi.fn();
  const transaction = vi.fn();
  let service: MaterialMovementsService;

  beforeEach(() => {
    vi.clearAllMocks();
    transaction.mockImplementation(async (callback: (client: unknown) => unknown) => callback({
      material: { findFirst: materialFindFirst },
      chantier: { findFirst: chantierFindFirst },
      projectMember: { findFirst: membershipFindFirst },
      materialMovement: { aggregate: movementAggregate, create: movementCreate },
    }));
    materialFindFirst.mockResolvedValue({ id: materialId });
    chantierFindFirst.mockResolvedValue({ id: chantierId });
    membershipFindFirst.mockResolvedValue({ userId });
    movementCreate.mockResolvedValue({ id: 'movement-id' });
    service = new MaterialMovementsService({ $transaction: transaction } as never);
  });

  it('creates an incoming movement for an assigned chantier', async () => {
    await service.create(companyId, userId, movementInput);

    expect(movementCreate).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ companyId, userId, quantity: '100', type: MaterialMovementType.ENTREE }),
    }));
  });

  it('rejects movement creation when the resource is outside the company or assignment', async () => {
    membershipFindFirst.mockResolvedValue(null);

    await expect(service.create(companyId, userId, movementInput)).rejects.toBeInstanceOf(NotFoundException);
    expect(movementCreate).not.toHaveBeenCalled();
  });

  it('rejects a stock exit larger than the available stock', async () => {
    movementAggregate
      .mockResolvedValueOnce({ _sum: { quantity: new Prisma.Decimal(10) } })
      .mockResolvedValueOnce({ _sum: { quantity: new Prisma.Decimal(3) } });

    await expect(service.create(companyId, userId, {
      ...movementInput,
      type: MaterialMovementType.SORTIE,
      quantity: 8,
    })).rejects.toBeInstanceOf(BadRequestException);
    expect(movementCreate).not.toHaveBeenCalled();
  });
});
