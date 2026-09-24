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
export declare class AuditService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    record(input: AuditRecord): Prisma.Prisma__AuditLogClient<{
        id: string;
        action: string;
        entityType: string;
        entityId: string | null;
        createdAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    findAll(companyId: string, limit?: number): Prisma.PrismaPromise<{
        id: string;
        action: string;
        entityType: string;
        entityId: string | null;
        metadata: Prisma.JsonValue;
        createdAt: Date;
        user: {
            id: string;
            name: string;
            email: string;
        } | null;
        userId: string | null;
    }[]>;
    findByEntity(companyId: string, entityType: string, entityId: string, limit?: number): Prisma.PrismaPromise<{
        id: string;
        action: string;
        entityType: string;
        entityId: string | null;
        metadata: Prisma.JsonValue;
        createdAt: Date;
        user: {
            id: string;
            name: string;
            email: string;
        } | null;
        userId: string | null;
    }[]>;
}
