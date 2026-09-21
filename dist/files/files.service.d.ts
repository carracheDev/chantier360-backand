import { AuditService } from '../audit/audit.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { RegisterFileDto } from './dto/register-file.dto.js';
export declare class FilesService {
    private readonly prisma;
    private readonly auditService;
    constructor(prisma: PrismaService, auditService: AuditService);
    register(companyId: string, userId: string, input: RegisterFileDto): Promise<{
        sizeBytes: string;
        id: string;
        companyId: string;
        chantierId: string | null;
        kind: string;
        storageKey: string;
        originalName: string;
        mimeType: string;
        targetType: string | null;
        targetId: string | null;
        createdAt: Date;
    }>;
    findAll(companyId: string, userId: string, chantierId?: string): Promise<{
        sizeBytes: string;
        id: string;
        companyId: string;
        chantierId: string | null;
        kind: string;
        storageKey: string;
        originalName: string;
        mimeType: string;
        targetType: string | null;
        targetId: string | null;
        createdAt: Date;
    }[]>;
    private validateStorageKey;
    private publicAsset;
}
