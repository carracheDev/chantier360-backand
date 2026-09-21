import { IncidentSeverity, IncidentStatus } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { IncidentsService } from './incidents.service.js';

const companyId = '11111111-1111-4111-8111-111111111111';
const userId = '22222222-2222-4222-8222-222222222222';
const chantierId = '33333333-3333-4333-8333-333333333333';
const incidentId = '44444444-4444-4444-8444-444444444444';

describe('IncidentsService', () => {
  const membershipFindFirst = vi.fn();
  const incidentFindMany = vi.fn();
  const incidentFindFirst = vi.fn();
  const incidentCreate = vi.fn();
  const incidentUpdate = vi.fn();
  let service: IncidentsService;

  beforeEach(() => {
    vi.clearAllMocks();
    membershipFindFirst.mockResolvedValue({ userId });
    incidentFindFirst.mockResolvedValue({ id: incidentId });
    incidentCreate.mockResolvedValue({ id: incidentId });
    incidentUpdate.mockResolvedValue({ id: incidentId });
    service = new IncidentsService({
      projectMember: { findFirst: membershipFindFirst },
      incident: { findMany: incidentFindMany, findFirst: incidentFindFirst, create: incidentCreate, update: incidentUpdate },
    } as never);
  });

  it('creates an incident for an assigned chantier', async () => {
    await service.create(companyId, userId, {
      chantierId,
      title: 'Retard livraison',
      description: 'Livraison décalée',
      severity: IncidentSeverity.MOYENNE,
    });

    expect(incidentCreate).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ companyId, chantierId, userId, severity: IncidentSeverity.MOYENNE }),
    }));
  });

  it('updates severity and status only for an accessible incident', async () => {
    await service.update(companyId, userId, incidentId, {
      severity: IncidentSeverity.CRITIQUE,
      status: IncidentStatus.EN_COURS,
    });

    expect(incidentUpdate).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: incidentId },
      data: expect.objectContaining({ severity: IncidentSeverity.CRITIQUE, status: IncidentStatus.EN_COURS }),
    }));
  });

  it('rejects an incident from another company or chantier', async () => {
    incidentFindFirst.mockResolvedValue(null);

    await expect(service.update(companyId, userId, incidentId, { status: IncidentStatus.RESOLU }))
      .rejects.toBeInstanceOf(NotFoundException);
  });
});
