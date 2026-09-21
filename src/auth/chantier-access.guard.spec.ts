import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ChantierAccessGuard } from './chantier-access.guard.js';

const user = {
  id: '22222222-2222-4222-8222-222222222222',
  companyId: '11111111-1111-4111-8111-111111111111',
  name: 'Awa Directeur',
  email: 'directeur.demo@chantier360.local',
  sub: '22222222-2222-4222-8222-222222222222',
};

function contextFor(chantierId: string, inBody = false) {
  return {
    switchToHttp: () => ({
      getRequest: () => ({ params: inBody ? {} : { chantierId }, body: inBody ? { chantierId } : {}, user }),
    }),
  } as unknown as ExecutionContext;
}

describe('ChantierAccessGuard', () => {
  const findFirst = vi.fn();
  let guard: ChantierAccessGuard;

  beforeEach(() => {
    vi.clearAllMocks();
    guard = new ChantierAccessGuard({ projectMember: { findFirst } } as never);
  });

  it('allows a member of the requested company chantier', async () => {
    findFirst.mockResolvedValue({ userId: user.id });

    await expect(guard.canActivate(contextFor('33333333-3333-4333-8333-333333333333')))
      .resolves.toBe(true);
    expect(findFirst).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({ userId: user.id, companyId: user.companyId }),
    }));
  });

  it('rejects a chantier where the user is not assigned', async () => {
    findFirst.mockResolvedValue(null);

    await expect(guard.canActivate(contextFor('33333333-3333-4333-8333-333333333333')))
      .rejects.toBeInstanceOf(ForbiddenException);
  });

  it('accepts a chantier id from a request body', async () => {
    findFirst.mockResolvedValue({ userId: user.id });

    await expect(guard.canActivate(contextFor('33333333-3333-4333-8333-333333333333', true)))
      .resolves.toBe(true);
  });
});
