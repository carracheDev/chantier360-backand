import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateWorkerDto } from './dto/create-worker.dto.js';
export declare class WorkersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(companyId: string, userId: string, chantierId?: string): Prisma.PrismaPromise<{
        function: string;
        companyId: string;
        name: string;
        id: string;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        chantierId: string;
        dailyRate: Prisma.Decimal | null;
    }[]>;
    create(companyId: string, userId: string, input: CreateWorkerDto): Promise<{
        function: string;
        companyId: string;
        name: string;
        id: string;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        chantierId: string;
        dailyRate: Prisma.Decimal | null;
    }>;
    private assertMembership;
}
