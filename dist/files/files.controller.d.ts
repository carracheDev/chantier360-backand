import type { AuthenticatedRequestUser } from '../auth/auth.types.js';
import { RegisterFileDto } from './dto/register-file.dto.js';
import { FilesService } from './files.service.js';
export declare class FilesController {
    private readonly filesService;
    constructor(filesService: FilesService);
    findAll(user: AuthenticatedRequestUser, chantierId?: string): Promise<{
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
    register(user: AuthenticatedRequestUser, input: RegisterFileDto): Promise<{
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
}
