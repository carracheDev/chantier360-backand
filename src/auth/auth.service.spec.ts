import * as argon2 from 'argon2';
import { UnauthorizedException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthService } from './auth.service.js';

const companyId = '11111111-1111-4111-8111-111111111111';
const userId = '22222222-2222-4222-8222-222222222222';

const user = {
  id: userId,
  companyId,
  name: 'Awa Directeur',
  email: 'directeur.demo@chantier360.local',
  phone: null,
  passwordHash: '',
  active: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('AuthService', () => {
  const findFirst = vi.fn();
  let service: AuthService;

  beforeEach(async () => {
    vi.clearAllMocks();
    process.env.JWT_SECRET = 'unit-test-secret';
    user.passwordHash = await argon2.hash('correct-password');
    service = new AuthService({ user: { findFirst } } as never);
  });

  it('authenticates an active user in the requested company', async () => {
    findFirst.mockResolvedValue(user);

    const result = await service.login({
      companyId,
      email: user.email,
      password: 'correct-password',
    });

    expect(findFirst).toHaveBeenCalledWith({
      where: { companyId, email: user.email, active: true },
    });
    expect(result.user).toEqual({
      id: user.id,
      companyId: user.companyId,
      name: user.name,
      email: user.email,
    });
    expect(result).not.toHaveProperty('user.passwordHash');
    expect(result.accessToken.split('.')).toHaveLength(3);
  });

  it('rejects an invalid password', async () => {
    findFirst.mockResolvedValue(user);

    await expect(service.login({ companyId, email: user.email, password: 'wrong-password' }))
      .rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rejects users that are not active or outside the company', async () => {
    findFirst.mockResolvedValue(null);

    await expect(service.login({
      companyId: '33333333-3333-4333-8333-333333333333',
      email: user.email,
      password: 'correct-password',
    })).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
