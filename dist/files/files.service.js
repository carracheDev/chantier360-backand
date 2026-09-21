var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AuditService } from '../audit/audit.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
let FilesService = class FilesService {
    prisma;
    auditService;
    constructor(prisma, auditService) {
        this.prisma = prisma;
        this.auditService = auditService;
    }
    async register(companyId, userId, input) {
        this.validateStorageKey(input.storageKey);
        if (input.chantierId) {
            const membership = await this.prisma.projectMember.findFirst({ where: { companyId, userId, chantierId: input.chantierId }, select: { userId: true } });
            if (!membership)
                throw new NotFoundException('Chantier ou affectation introuvable.');
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
    async findAll(companyId, userId, chantierId) {
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
    validateStorageKey(storageKey) {
        if (!storageKey || storageKey.startsWith('/') || storageKey.includes('..') || storageKey.includes('\\')) {
            throw new BadRequestException('Clé de stockage invalide.');
        }
    }
    publicAsset(asset) {
        return { ...asset, sizeBytes: asset.sizeBytes.toString() };
    }
};
FilesService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        AuditService])
], FilesService);
export { FilesService };
//# sourceMappingURL=files.service.js.map