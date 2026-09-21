import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateChantierDto } from './dto/create-chantier.dto.js';
import { UpdateChantierDto } from './dto/update-chantier.dto.js';
export declare class ChantiersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAllForUser(companyId: string, userId: string): Prisma.PrismaPromise<{
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
        budget: Prisma.Decimal;
        progress: Prisma.Decimal;
        startDate: Date;
        endDate: Date | null;
        status: import("@prisma/client").$Enums.ChantierStatus;
    }[]>;
    findOne(companyId: string, chantierId: string): Promise<{
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
        budget: Prisma.Decimal;
        progress: Prisma.Decimal;
        startDate: Date;
        endDate: Date | null;
        status: import("@prisma/client").$Enums.ChantierStatus;
    }>;
    create(companyId: string, userId: string, input: CreateChantierDto): Promise<{
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
        budget: Prisma.Decimal;
        progress: Prisma.Decimal;
        startDate: Date;
        endDate: Date | null;
        status: import("@prisma/client").$Enums.ChantierStatus;
    }>;
    update(companyId: string, chantierId: string, input: UpdateChantierDto): Promise<{
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
        budget: Prisma.Decimal;
        progress: Prisma.Decimal;
        startDate: Date;
        endDate: Date | null;
        status: import("@prisma/client").$Enums.ChantierStatus;
    }>;
    private validateDates;
}
