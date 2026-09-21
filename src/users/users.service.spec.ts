import { NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UsersService } from './users.service.js';

const companyId = '11111111-1111-4111-8111-111111111111';
const roleId = '22222222-2222-4222-8222-222222222222';

describe('UsersService', () => {
  const roleFindFirst = vi.fn();
  const userCreate = vi.fn();
  const userFindMany = vi.fn();
  let service: UsersService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new UsersService({
      role: { findFirst: roleFindFirst },
      user: { create: userCreate, findMany: userFindMany },
    } as never);
  });

  it('lists only users from the requested company', async () => {
    userFindMany.mockResolvedValue([]);

    await service.findAll(companyId);

    expect(userFindMany).toHaveBeenCalledWith(expect.objectContaining({ where: { companyId } }));
  });

  it('rejects a role belonging to another company', async () => {
    roleFindFirst.mockResolvedValue(null);

    await expect(service.create(companyId, {
      name: 'Utilisateur',
      email: 'user@example.test',
      password: 'password123',
      roleId,
    })).rejects.toBeInstanceOf(NotFoundException);
    expect(userCreate).not.toHaveBeenCalled();
  });

  it('hashes the password and creates the user with the company role', async () => {
    roleFindFirst.mockResolvedValue({ id: roleId });
    userCreate.mockResolvedValue({ id: 'user-id', email: 'user@example.test' });

    await service.create(companyId, {
      name: 'Utilisateur',
      email: 'USER@example.test',
      password: 'password123',
      roleId,
    });

    const call = userCreate.mock.calls[0][0];
    expect(call.data.companyId).toBe(companyId);
    expect(call.data.email).toBe('user@example.test');
    expect(call.data.userRoles).toEqual({ create: { roleId } });
    expect(call.data.passwordHash).not.toBe('password123');
  });
});
