import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AuditService } from '../audit/audit.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { RegisterFileDto } from './dto/register-file.dto.js';

@Injectable()
export class FilesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async register(companyId: string, userId: string, input: RegisterFileDto) {
    this.validateStorageKey(input.storageKey);
    if (input.chantierId) {
      const membership = await this.prisma.projectMember.findFirst({ where: { companyId, userId, chantierId: input.chantierId }, select: { userId: true } });
      if (!membership) throw new NotFoundException('Chantier ou affectation introuvable.');
    }

    const asset = await this.prisma.fileAsset.create({
      data: {
        companyId,
        chantierId: input.chantierId,
        uploadedById: userId,
        kind: input.kind,
        storageKey: input.storageKey,
        originalName: input.originalName,
        mimeType: input.mimeType,
        sizeBytes: BigInt(input.sizeBytes),
        targetType: input.targetType,
        targetId: input.targetId,
      },
      select: { id: true, companyId: true, chantierId: true, kind: true, storageKey: true, originalName: true, mimeType: true, sizeBytes: true, targetType: true, targetId: true, createdAt: true },
    });
    await this.auditService.record({ companyId, userId, action: 'FILE_REGISTERED', entityType: 'FileAsset', entityId: asset.id, metadata: { kind: input.kind, targetType: input.targetType } });
    return this.publicAsset(asset);
  }

  async findAll(companyId: string, userId: string, chantierId?: string) {
    const assets = await this.prisma.fileAsset.findMany({
      where: {
        companyId,
        chantierId,
        OR: [
          { chantierId: null },
          { chantier: { projectMembers: { some: { companyId, userId } } } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      select: { id: true, companyId: true, chantierId: true, kind: true, storageKey: true, originalName: true, mimeType: true, sizeBytes: true, targetType: true, targetId: true, createdAt: true },
    });
    return assets.map((asset) => this.publicAsset(asset));
  }

  private validateStorageKey(storageKey: string) {
    if (!storageKey || storageKey.startsWith('/') || storageKey.includes('..') || storageKey.includes('\\')) {
      throw new BadRequestException('Clé de stockage invalide.');
    }
  }

  private publicAsset(asset: { id: string; companyId: string; chantierId: string | null; kind: string; storageKey: string; originalName: string; mimeType: string; sizeBytes: bigint; targetType: string | null; targetId: string | null; createdAt: Date }) {
    return { ...asset, sizeBytes: asset.sizeBytes.toString() };
  }
}
