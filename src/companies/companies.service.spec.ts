import { NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CompaniesService } from './companies.service.js';

const companyId = '11111111-1111-4111-8111-111111111111';

describe('CompaniesService', () => {
  const companyFindUnique = vi.fn();
  let service: CompaniesService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new CompaniesService({ company: { findUnique: companyFindUnique } } as never);
  });

  it('returns only the current company', async () => {
    companyFindUnique.mockResolvedValue({ id: companyId, name: 'Demo' });

    await service.findCurrent(companyId);

    expect(companyFindUnique).toHaveBeenCalledWith(expect.objectContaining({ where: { id: companyId } }));
  });

  it('reports an unknown company', async () => {
    companyFindUnique.mockResolvedValue(null);

    await expect(service.findCurrent(companyId)).rejects.toBeInstanceOf(NotFoundException);
  });
});
