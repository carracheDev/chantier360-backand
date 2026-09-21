import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RolesService } from './roles.service.js';

const companyId = '11111111-1111-4111-8111-111111111111';

describe('RolesService', () => {
  const roleFindMany = vi.fn();
  const roleCreate = vi.fn();
  let service: RolesService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new RolesService({
      role: { findMany: roleFindMany, create: roleCreate },
    } as never);
  });

  it('lists roles within the current company only', async () => {
    roleFindMany.mockResolvedValue([]);

    await service.findAll(companyId);

    expect(roleFindMany).toHaveBeenCalledWith(expect.objectContaining({ where: { companyId } }));
  });

  it('normalizes a new role name and assigns the tenant', async () => {
    roleCreate.mockResolvedValue({ id: 'role-id', name: 'CHEF', description: null });

    await service.create(companyId, { name: ' chef ', description: 'Terrain' });

    expect(roleCreate).toHaveBeenCalledWith(expect.objectContaining({
      data: { companyId, name: 'CHEF', description: 'Terrain' },
    }));
  });
});
