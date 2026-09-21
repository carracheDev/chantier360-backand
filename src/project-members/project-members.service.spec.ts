import { NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProjectMembersService } from './project-members.service.js';

const companyId = '11111111-1111-4111-8111-111111111111';
const userId = '22222222-2222-4222-8222-222222222222';
const chantierId = '33333333-3333-4333-8333-333333333333';

describe('ProjectMembersService', () => {
  const userFindFirst = vi.fn();
  const userFindMany = vi.fn();
  const chantierFindFirst = vi.fn();
  const chantierFindMany = vi.fn();
  const projectMemberUpsert = vi.fn();
  const projectMemberFindMany = vi.fn();
  const projectMemberDeleteMany = vi.fn();
  let service: ProjectMembersService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new ProjectMembersService({
      user: { findFirst: userFindFirst, findMany: userFindMany },
      chantier: { findFirst: chantierFindFirst, findMany: chantierFindMany },
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

  it('lists only active users and scope candidates to the calling company', async () => {
    userFindMany.mockResolvedValue([
      {
        id: userId,
        name: 'Admin Démo',
        email: 'admin@exemple.test',
        userRoles: [{ role: { id: 'role-1', name: 'ADMIN' } }],
      },
      { id: 'user-2', name: 'Sans rôle', email: 'sans.role@exemple.test', userRoles: [] },
    ]);
    chantierFindMany.mockResolvedValue([{ id: chantierId, name: 'École Tokpa', status: 'EN_COURS' }]);

    const result = await service.findCandidates(companyId);

    expect(userFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { companyId, active: true } }),
    );
    expect(chantierFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { companyId } }),
    );
    // Les rôles sont aplatis : l'interface n'a pas à connaître la table de jointure Prisma.
    expect(result).toEqual({
      users: [
        { id: userId, name: 'Admin Démo', email: 'admin@exemple.test', roles: [{ id: 'role-1', name: 'ADMIN' }] },
        { id: 'user-2', name: 'Sans rôle', email: 'sans.role@exemple.test', roles: [] },
      ],
      chantiers: [{ id: chantierId, name: 'École Tokpa', status: 'EN_COURS' }],
    });
  });
});
