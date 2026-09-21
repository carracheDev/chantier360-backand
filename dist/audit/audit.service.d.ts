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
        createdAt: Date;
        action: string;
        entityType: string;
        entityId: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    findAll(companyId: string, limit?: number): Prisma.PrismaPromise<{
        user: {
            email: string;
            name: string;
            id: string;
        } | null;
        id: string;
        createdAt: Date;
        userId: string | null;
        action: string;
        entityType: string;
        entityId: string | null;
        metadata: Prisma.JsonValue;
    }[]>;
}
