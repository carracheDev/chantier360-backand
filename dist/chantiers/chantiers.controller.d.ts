import type { AuthenticatedRequestUser } from '../auth/auth.types.js';
import { CreateChantierDto } from './dto/create-chantier.dto.js';
import { UpdateChantierDto } from './dto/update-chantier.dto.js';
import { ChantiersService } from './chantiers.service.js';
export declare class ChantiersController {
    private readonly chantiersService;
    constructor(chantiersService: ChantiersService);
    findAll(user: AuthenticatedRequestUser): import("@prisma/client").Prisma.PrismaPromise<{
        companyId: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        _count: {
            projectMembers: number;
            expenses: number;
            incidents: number;
            workers: number;
        };
        description: string | null;
        location: string | null;
        budget: import("@prisma/client/runtime/library").Decimal;
        progress: import("@prisma/client/runtime/library").Decimal;
        startDate: Date;
        endDate: Date | null;
        status: import("@prisma/client").$Enums.ChantierStatus;
    }[]>;
    findOne(user: AuthenticatedRequestUser, chantierId: string): Promise<{
        companyId: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        _count: {
            projectMembers: number;
            expenses: number;
            incidents: number;
            workers: number;
        };
        description: string | null;
        location: string | null;
        budget: import("@prisma/client/runtime/library").Decimal;
        progress: import("@prisma/client/runtime/library").Decimal;
        startDate: Date;
        endDate: Date | null;
        status: import("@prisma/client").$Enums.ChantierStatus;
    }>;
    create(user: AuthenticatedRequestUser, input: CreateChantierDto): Promise<{
        companyId: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        _count: {
            projectMembers: number;
            expenses: number;
            incidents: number;
            workers: number;
        };
        description: string | null;
        location: string | null;
        budget: import("@prisma/client/runtime/library").Decimal;
        progress: import("@prisma/client/runtime/library").Decimal;
        startDate: Date;
        endDate: Date | null;
        status: import("@prisma/client").$Enums.ChantierStatus;
    }>;
    update(user: AuthenticatedRequestUser, chantierId: string, input: UpdateChantierDto): Promise<{
        companyId: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        _count: {
            projectMembers: number;
            expenses: number;
            incidents: number;
            workers: number;
        };
        description: string | null;
        location: string | null;
        budget: import("@prisma/client/runtime/library").Decimal;
        progress: import("@prisma/client/runtime/library").Decimal;
        startDate: Date;
        endDate: Date | null;
        status: import("@prisma/client").$Enums.ChantierStatus;
    }>;
}
