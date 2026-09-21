import { BadRequestException, NotFoundException } from '@nestjs/common';
import { JournalStatus, Prisma } from '@prisma/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { JournalService } from './journal.service.js';

const companyId = '11111111-1111-4111-8111-111111111111';
const userId = '22222222-2222-4222-8222-222222222222';
const chantierId = '33333333-3333-4333-8333-333333333333';
const journalId = '44444444-4444-4444-8444-444444444444';

const draftJournal = {
  id: journalId,
  companyId,
  chantierId,
  userId,
  date: new Date('2026-09-18'),
  progress: new Prisma.Decimal(58),
  description: 'Travaux réalisés',
  weather: 'Ensoleillé',
  observations: null,
  status: JournalStatus.BROUILLON,
  createdAt: new Date(),
  updatedAt: new Date(),
  user: { id: userId, name: 'Chef', email: 'chef@example.test' },
  photos: [],
};

describe('JournalService', () => {
  const membershipFindFirst = vi.fn();
  const journalFindMany = vi.fn();
  const journalFindFirst = vi.fn();
  const journalCreate = vi.fn();
  const journalUpdate = vi.fn();
  const journalUpdateMany = vi.fn();
  const photoCreate = vi.fn();
  const photoFindMany = vi.fn();
  let service: JournalService;

  beforeEach(() => {
    vi.clearAllMocks();
    membershipFindFirst.mockResolvedValue({ userId });
    journalFindFirst.mockResolvedValue(draftJournal);
    journalCreate.mockResolvedValue(draftJournal);
    journalUpdate.mockResolvedValue(draftJournal);
    journalUpdateMany.mockResolvedValue({ count: 1 });
    photoCreate.mockResolvedValue({ id: 'photo-id' });
    service = new JournalService({
      projectMember: { findFirst: membershipFindFirst },
      journalEntry: {
        findMany: journalFindMany,
        findFirst: journalFindFirst,
        create: journalCreate,
        update: journalUpdate,
        updateMany: journalUpdateMany,
      },
      photo: { create: photoCreate, findMany: photoFindMany },
    } as never);
  });

  it('creates a journal entry for an assigned chantier', async () => {
    await service.create(companyId, userId, {
      chantierId,
      date: '2026-09-18',
      progress: 58,
      description: ' Travaux réalisés ',
    });

    expect(journalCreate).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ companyId, chantierId, userId, progress: '58', description: 'Travaux réalisés' }),
    }));
  });

  it('rejects creation for an inaccessible chantier', async () => {
    membershipFindFirst.mockResolvedValue(null);

    await expect(service.create(companyId, userId, {
      chantierId,
      date: '2026-09-18',
      progress: 58,
      description: 'Travaux',
    })).rejects.toBeInstanceOf(NotFoundException);
    expect(journalCreate).not.toHaveBeenCalled();
  });

  it('prevents editing a submitted journal', async () => {
    journalFindFirst.mockResolvedValue({ ...draftJournal, status: JournalStatus.SOUMIS });

    await expect(service.update(companyId, userId, journalId, { description: 'Modification' }))
      .rejects.toBeInstanceOf(BadRequestException);
    expect(journalUpdate).not.toHaveBeenCalled();
  });

  it('submits and validates the journal in order', async () => {
    await service.submit(companyId, userId, journalId);
    expect(journalUpdateMany).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: journalId, companyId, status: JournalStatus.BROUILLON },
      data: { status: JournalStatus.SOUMIS },
    }));

    journalFindFirst.mockResolvedValue({ ...draftJournal, status: JournalStatus.SOUMIS });
    await service.validate(companyId, userId, journalId);
    expect(journalUpdateMany).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: journalId, companyId, status: JournalStatus.SOUMIS },
      data: { status: JournalStatus.VALIDE },
    }));
  });

  it('does not add photos to a validated journal', async () => {
    journalFindFirst.mockResolvedValue({ ...draftJournal, status: JournalStatus.VALIDE });

    await expect(service.addPhoto(companyId, userId, journalId, {
      url: 'https://example.test/photo.jpg',
      caption: 'Dalle',
    })).rejects.toBeInstanceOf(BadRequestException);
    expect(photoCreate).not.toHaveBeenCalled();
  });
});
