import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PermissionsGuard } from './permissions.guard.js';

const user = {
  id: '22222222-2222-4222-8222-222222222222',
  companyId: '11111111-1111-4111-8111-111111111111',
  name: 'Awa Directeur',
  email: 'directeur.demo@chantier360.local',
  sub: '22222222-2222-4222-8222-222222222222',
};

function contextFor() {
  return {
    getHandler: () => 'handler',
    getClass: () => 'class',
    switchToHttp: () => ({ getRequest: () => ({ user }) }),
  } as unknown as ExecutionContext;
}

describe('PermissionsGuard', () => {
  const getAllAndOverride = vi.fn();
  const findFirst = vi.fn();
  let guard: PermissionsGuard;

  beforeEach(() => {
    vi.clearAllMocks();
    guard = new PermissionsGuard(
      { getAllAndOverride } as unknown as Reflector,
      { user: { findFirst } } as never,
    );
  });

  it('allows a user with every required permission', async () => {
    getAllAndOverride.mockReturnValue(['expense.read', 'expense.validate']);
    findFirst.mockResolvedValue({
      userRoles: [{ role: { rolePermissions: [
        { permission: { code: 'expense.read' } },
        { permission: { code: 'expense.validate' } },
      ] } }],
    });

    await expect(guard.canActivate(contextFor())).resolves.toBe(true);
    expect(findFirst).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: user.id, companyId: user.companyId, active: true },
    }));
  });

  it('rejects a user missing one required permission', async () => {
    getAllAndOverride.mockReturnValue(['expense.read', 'expense.validate']);
    findFirst.mockResolvedValue({
      userRoles: [{ role: { rolePermissions: [{ permission: { code: 'expense.read' } }] } }],
    });

    await expect(guard.canActivate(contextFor())).rejects.toBeInstanceOf(ForbiddenException);
  });
});
