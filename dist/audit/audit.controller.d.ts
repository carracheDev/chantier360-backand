import type { AuthenticatedRequestUser } from '../auth/auth.types.js';
import { AuditService } from './audit.service.js';
export declare class AuditController {
    private readonly auditService;
    constructor(auditService: AuditService);
    findAll(user: AuthenticatedRequestUser, limit?: string): import("@prisma/client").Prisma.PrismaPromise<{
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
        metadata: import("@prisma/client/runtime/library").JsonValue;
    }[]>;
}
