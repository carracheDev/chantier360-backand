import { FileAssetKind } from '@prisma/client';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FilesService } from './files.service.js';

const companyId = '11111111-1111-4111-8111-111111111111';
const userId = '22222222-2222-4222-8222-222222222222';
const chantierId = '33333333-3333-4333-8333-333333333333';

const input = {
  kind: FileAssetKind.PHOTO,
  storageKey: 'companies/company-1/chantiers/chantier-1/photo.jpg',
  originalName: 'photo.jpg',
  mimeType: 'image/jpeg',
  sizeBytes: 2048,
  chantierId,
  targetType: 'JournalEntry',
};

describe('FilesService', () => {
  const membershipFindFirst = vi.fn();
  const fileAssetCreate = vi.fn();
  const auditRecord = vi.fn();
  let service: FilesService;

  beforeEach(() => {
    vi.clearAllMocks();
    membershipFindFirst.mockResolvedValue({ userId });
    fileAssetCreate.mockResolvedValue({ id: 'file-id', companyId, chantierId, kind: FileAssetKind.PHOTO, storageKey: input.storageKey, originalName: input.originalName, mimeType: input.mimeType, sizeBytes: BigInt(2048), targetType: input.targetType, targetId: null, createdAt: new Date() });
    auditRecord.mockResolvedValue({ id: 'audit-id' });
    service = new FilesService(
      { projectMember: { findFirst: membershipFindFirst }, fileAsset: { create: fileAssetCreate } } as never,
      { record: auditRecord } as never,
    );
  });

  it('registers a tenant file and writes an audit event', async () => {
    const result = await service.register(companyId, userId, input);

    expect(result.sizeBytes).toBe('2048');
    expect(fileAssetCreate).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ companyId, uploadedById: userId, sizeBytes: BigInt(2048) }) }));
    expect(auditRecord).toHaveBeenCalledWith(expect.objectContaining({ action: 'FILE_REGISTERED', entityType: 'FileAsset' }));
  });

  it('rejects unsafe storage keys', async () => {
    await expect(service.register(companyId, userId, { ...input, storageKey: '../secret.txt' })).rejects.toBeInstanceOf(BadRequestException);
    expect(fileAssetCreate).not.toHaveBeenCalled();
  });

  it('rejects files attached to inaccessible chantiers', async () => {
    membershipFindFirst.mockResolvedValue(null);

    await expect(service.register(companyId, userId, input)).rejects.toBeInstanceOf(NotFoundException);
    expect(fileAssetCreate).not.toHaveBeenCalled();
  });
});
