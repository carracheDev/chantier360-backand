import type { AuthenticatedRequestUser } from '../auth/auth.types.js';
import { CreateWorkerDto } from './dto/create-worker.dto.js';
import { WorkersService } from './workers.service.js';
export declare class WorkersController {
    private readonly workersService;
    constructor(workersService: WorkersService);
    findAll(user: AuthenticatedRequestUser, chantierId?: string): import("@prisma/client").Prisma.PrismaPromise<{
        function: string;
        companyId: string;
        name: string;
        id: string;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        chantierId: string;
        dailyRate: import("@prisma/client/runtime/library").Decimal | null;
    }[]>;
    create(user: AuthenticatedRequestUser, input: CreateWorkerDto): Promise<{
        function: string;
        companyId: string;
        name: string;
        id: string;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        chantierId: string;
        dailyRate: import("@prisma/client/runtime/library").Decimal | null;
    }>;
}
