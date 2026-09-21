import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuditService } from './audit.service.js';

const companyId = '11111111-1111-4111-8111-111111111111';
const userId = '22222222-2222-4222-8222-222222222222';

describe('AuditService', () => {
  const auditCreate = vi.fn();
  const auditFindMany = vi.fn();
  let service: AuditService;

  beforeEach(() => {
    vi.clearAllMocks();
    auditCreate.mockResolvedValue({ id: 'audit-id' });
    auditFindMany.mockResolvedValue([]);
    service = new AuditService({ auditLog: { create: auditCreate, findMany: auditFindMany } } as never);
  });

  it('records an event with tenant and actor context', async () => {
    await service.record({ companyId, userId, action: 'EXPENSE_VALIDATED', entityType: 'Expense', entityId: '33333333-3333-4333-8333-333333333333', metadata: { status: 'VALIDEE' } });

    expect(auditCreate).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ companyId, userId, action: 'EXPENSE_VALIDATED' }) }));
  });

  it('limits audit listing to the requested company', async () => {
    await service.findAll(companyId, 20);

    expect(auditFindMany).toHaveBeenCalledWith(expect.objectContaining({ where: { companyId }, take: 20 }));
  });
});
