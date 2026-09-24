import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';

export type AuditRecord = {
  companyId: string;
  userId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: Prisma.InputJsonValue;
};

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  record(input: AuditRecord) {
    return this.prisma.auditLog.create({
      data: {
        companyId: input.companyId,
        userId: input.userId,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId,
        metadata: input.metadata,
      },
      select: { id: true, action: true, entityType: true, entityId: true, createdAt: true },
    });
  }

  findAll(companyId: string, limit = 100) {
    return this.prisma.auditLog.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
      take: Math.min(Math.max(limit, 1), 500),
      select: {
        id: true,
        userId: true,
        action: true,
        entityType: true,
        entityId: true,
        metadata: true,
        createdAt: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });
  }

  findByEntity(companyId: string, entityType: string, entityId: string, limit = 20) {
    return this.prisma.auditLog.findMany({
      where: { companyId, entityType, entityId },
      orderBy: { createdAt: 'desc' },
      take: Math.min(Math.max(limit, 1), 500),
      select: {
        id: true,
        userId: true,
        action: true,
        entityType: true,
        entityId: true,
        metadata: true,
        createdAt: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });
  }
}
