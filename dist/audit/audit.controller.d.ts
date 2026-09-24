import type { AuthenticatedRequestUser } from '../auth/auth.types.js';
import { AuditService } from './audit.service.js';
export declare class AuditController {
    private readonly auditService;
    constructor(auditService: AuditService);
    findAll(user: AuthenticatedRequestUser, limit?: string): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        action: string;
        entityType: string;
        entityId: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue;
        createdAt: Date;
        user: {
            id: string;
            name: string;
            email: string;
        } | null;
        userId: string | null;
    }[]>;
    findByEntity(user: AuthenticatedRequestUser, entityType: string, entityId: string, limit?: string): never[] | import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        action: string;
        entityType: string;
        entityId: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue;
        createdAt: Date;
        user: {
            id: string;
            name: string;
            email: string;
        } | null;
        userId: string | null;
    }[]>;
}
