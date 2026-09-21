import { NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProjectMembersService } from './project-members.service.js';

const companyId = '11111111-1111-4111-8111-111111111111';
const userId = '22222222-2222-4222-8222-222222222222';
const chantierId = '33333333-3333-4333-8333-333333333333';

describe('ProjectMembersService', () => {
  const userFindFirst = vi.fn();
  const chantierFindFirst = vi.fn();
  const projectMemberUpsert = vi.fn();
  const projectMemberFindMany = vi.fn();
  const projectMemberDeleteMany = vi.fn();
  let service: ProjectMembersService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new ProjectMembersService({
      user: { findFirst: userFindFirst },
      chantier: { findFirst: chantierFindFirst },
      projectMember: {
        upsert: projectMemberUpsert,
        findMany: projectMemberFindMany,
        deleteMany: projectMemberDeleteMany,
      },
    } as never);
  });

  it('requires active user and chantier from the same company', async () => {
    userFindFirst.mockResolvedValue({ id: userId });
    chantierFindFirst.mockResolvedValue({ id: chantierId });
    projectMemberUpsert.mockResolvedValue({ userId, chantierId });

    await service.assign(companyId, { userId, chantierId });

    expect(userFindFirst).toHaveBeenCalledWith({
      where: { id: userId, companyId, active: true },
      select: { id: true },
    });
    expect(chantierFindFirst).toHaveBeenCalledWith({
      where: { id: chantierId, companyId },
      select: { id: true },
    });
  });

  it('rejects cross-company or unknown assignments', async () => {
    userFindFirst.mockResolvedValue(null);
    chantierFindFirst.mockResolvedValue({ id: chantierId });

    await expect(service.assign(companyId, { userId, chantierId }))
      .rejects.toBeInstanceOf(NotFoundException);
    expect(projectMemberUpsert).not.toHaveBeenCalled();
  });

  it('removes only the requested company assignment', async () => {
    projectMemberDeleteMany.mockResolvedValue({ count: 1 });

    await expect(service.remove(companyId, userId, chantierId)).resolves.toEqual({ removed: true });
    expect(projectMemberDeleteMany).toHaveBeenCalledWith({ where: { companyId, userId, chantierId } });
  });
});
