import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { SignJWT } from 'jose';
import { beforeEach, describe, expect, it } from 'vitest';
import { JwtAuthGuard } from './jwt-auth.guard.js';

const secret = 'unit-test-secret';

function contextFor(authorization?: string) {
  const request: { headers: { authorization?: string }; user?: unknown } = {
    headers: { authorization },
  };
  const context = {
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;
  return { context, request };
}

describe('JwtAuthGuard', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = secret;
  });

  it('accepts a valid bearer token and exposes its tenant context', async () => {
    const token = await new SignJWT({
      companyId: '11111111-1111-4111-8111-111111111111',
      email: 'user@example.test',
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject('22222222-2222-4222-8222-222222222222')
      .setIssuedAt()
      .setExpirationTime('5m')
      .sign(new TextEncoder().encode(secret));
    const { context, request } = contextFor(`Bearer ${token}`);

    await expect(new JwtAuthGuard().canActivate(context)).resolves.toBe(true);
    expect(request.user).toMatchObject({
      id: '22222222-2222-4222-8222-222222222222',
      companyId: '11111111-1111-4111-8111-111111111111',
      email: 'user@example.test',
    });
  });

  it('rejects a missing or malformed bearer token', async () => {
    const { context } = contextFor();

    await expect(new JwtAuthGuard().canActivate(context))
      .rejects.toBeInstanceOf(UnauthorizedException);
  });
});
