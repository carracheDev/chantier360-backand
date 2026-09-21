var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
let AuditService = class AuditService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    record(input) {
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
    findAll(companyId, limit = 100) {
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
};
AuditService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], AuditService);
export { AuditService };
//# sourceMappingURL=audit.service.js.map